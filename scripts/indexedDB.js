/**
 * Fungsi untuk membuka database IndexedDB dan membuat tabel (object store) jika belum ada.
 * 
 * @param {string} storeName - Nama tabel (object store) yang ingin dibuka atau dibuat.
 * @param {string} [keyPath='IDS'] - Nama kolom yang digunakan sebagai key utama (default: 'IDS').
 * @returns {Promise} - Promise yang berisi objek database jika berhasil dibuka atau dibuat.
 */
function openDatabase(storeName, keyPath = 'IDS') {
  const dbName = 'Santri'; // Nama database tetap 'Santri'

  
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath });
        console.log(`Tabel '${storeName}' berhasil dibuat dengan keyPath '${keyPath}' saat upgrade.`);
      }
    };

    request.onsuccess = function (event) {
      const db = event.target.result;

      // Cek apakah tabel ada
      if (!db.objectStoreNames.contains(storeName)) {
        db.close();

        // Buka dengan versi yang lebih tinggi untuk membuat tabel baru
        const upgradeRequest = indexedDB.open(dbName, db.version + 1);

        upgradeRequest.onupgradeneeded = function (event) {
          const upgradedDb = event.target.result;
          upgradedDb.createObjectStore(storeName, { keyPath });
          console.log(`Tabel '${storeName}' berhasil dibuat dengan keyPath '${keyPath}' saat upgrade versi.`);
        };

        upgradeRequest.onsuccess = function (event) {
          const upgradedDb = event.target.result;
          console.log(`Database '${dbName}' berhasil diupgrade.`);
          resolve(upgradedDb);
        };

        upgradeRequest.onerror = function (event) {
          console.error('Error mengupgrade database:', event.target.error);
          reject('Error mengupgrade database');
        };
      } else {
        console.log(`Database '${dbName}' berhasil dibuka.`);
        resolve(db);
      }
    };

    request.onerror = function (event) {
      console.error('Error membuka database:', event.target.error);
      reject('Error membuka database');
    };
  });
}

// Buat fungsi untuk menyimpan atau memperbarui data di IndexedDB berdasarkan key utama (IDS atau ID).
async function saveOrUpdateData(storeName, jsonData, primaryKey = 'IDS') {
  const dbName = 'Santri'; // Nama database tetap 'Santri'

  // Pastikan data sesuai dengan storeName
  if (!jsonData[storeName]) {
      console.error(`Property '${storeName}' tidak ditemukan dalam jsonData.`);
      return;
  }

  if (!Array.isArray(jsonData[storeName])) {
      console.warn(`Property '${storeName}' is not an array. Converting to array.`);
      jsonData[storeName] = [jsonData[storeName]];
  }

  const db = await openDatabase(storeName, primaryKey);

  return new Promise((resolve, reject) => {
      if (!db.objectStoreNames.contains(storeName)) {
          reject(`Object store '${storeName}' not found in database '${dbName}'.`);
          return;
      }

      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);

      jsonData[storeName].forEach(item => {
          if (!item[primaryKey]) {
              console.error(`Missing '${primaryKey}' property in item:`, item);
              return;
          }

          const request = store.get(item[primaryKey]);

          request.onsuccess = function (event) {
              const existingData = event.target.result;

              if (existingData) {
                  store.put({ ...existingData, ...item });
              } else {
                  store.add(item);
              }
          };

          request.onerror = function (event) {
              console.error('Error checking data:', event.target.error);
          };
      });

      transaction.oncomplete = function () {
          resolve('Data saved or updated successfully');
      };

      transaction.onerror = function (event) {
          reject('Error saving or updating data');
      };
  });
}

async function saveDataToIndexedDB(storeName, jsonData, primaryKey = 'IDS') {
  const dbName = 'Santri'; // Nama database

  console.log(`Data received for saving to store: ${storeName}`, jsonData);

  try {
      const result = await saveOrUpdateData(storeName, jsonData, primaryKey);
      console.log(`Data successfully saved to store: ${storeName}`, result);
  } catch (error) {
      console.error(`Error saving data to store: ${storeName}`, error);
  }
}



  //1. Fungsi untuk Mengambil Data dari IndexedDB
//Buat fungsi untuk mengambil semua data dari tabel (object store) di IndexedDB.
function getAllDataFromIndexedDB(storeName) {
    const dbName = 'Santri'; // Nama database tetap 'Santri'

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName);
  
      request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const getAllRequest = store.getAll();
  
        getAllRequest.onsuccess = function (event) {
          resolve(event.target.result); // Mengembalikan semua data
        };
  
        getAllRequest.onerror = function (event) {
          reject('Error fetching data from IndexedDB');
        };
      };
  
      request.onerror = function (event) {
        reject('Error opening database');
      };
    });
}


//2. Fungsi untuk Menampilkan Data
function tampilkanData() {
  const productsArea = document.getElementById('SantriArea');
  productsArea.innerHTML = ''; // Bersihkan isi sebelum menampilkan data baru
  addHeader(); // Tambahkan header tabel

  const storeName = 'db'; // Nama tabel (object store)
  
  // Ambil semua data dari IndexedDB
  getFilteredFromIndexedDB(storeName)
    .then(function (data) {
      // Batasi jumlah data yang ditampilkan
      const limitedData = data.slice(0, 100);

      // Loop melalui data dan tampilkan menggunakan addProductRow
      limitedData.forEach(function (item, index) {
        const imageUrl = item.Gender.startsWith('L') ? './gambar/iconlk.webp' : './gambar/iconpr.webp';
        addProductRow(
          index + 1, // Nomor urut
          item.IDS, // IDS
          item.Nama, // Nama
          item.Diniyah ? item.Diniyah + ' ' + item.KelasMD + '.' + item.KelMD : '', // Kelas (jika ada)
          item.IkhtibarKet || 'Belum', // Status (jika ada)
          item.Ikhtibar || '-', // Ikhtibar (jika ada)
          item.Daerah ? item.Daerah + '.' + item.NoKamar : '', // Kamar (jika ada)
          imageUrl // URL gambar berdasarkan IDS
        );
      });
    })


    .catch(function (error) {
      console.error('Error fetching data from IndexedDB:', error);
    });
}


async function ambilDataIkhtibar() {

  const storeNameIkhtibar = 'Ikhtibar'; // Nama tabel (object store) Ikhtibar
  const storeNamedb = 'db'; // Nama tabel (object store) db

  try {
    // Pastikan OpenDatabase ada
    if (typeof openDatabase !== 'function') {
      throw new Error('OpenDatabase function is not defined');
    }

    // Memastikan database dibuka dengan store yang benar
    const db = await openDatabase(storeNameIkhtibar, 'ID');

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeNameIkhtibar, 'readonly');
      const store = transaction.objectStore(storeNameIkhtibar);
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = async function (event) {
        const dataIkhtibar = event.target.result;

        if (dataIkhtibar) {
          // Ambil data dari store db
          const dbData = await getAllDataFromIndexedDB(storeNamedb);

          // Loop melalui data Ikhtibar dan masukkan ke store db
          dataIkhtibar.forEach(item => {
            const existingData = dbData.find(data => data.IDS === item.IDSantri);

            if (existingData) {
              existingData.Ikhtibar = item.Ikhtibar;
              existingData.IkhtibarKet = item.Ket;
            }
          });

          // Simpan data ke store db
          await saveDataToIndexedDB(storeNamedb, { db: dbData });

          resolve('Data Ikhtibar berhasil diambil dan dimasukkan ke store db');
        } else {
          reject('No data found in store Ikhtibar');
        }
      };

      getAllRequest.onerror = function () {
        reject('Error fetching data from IndexedDB');
      };
    });
  } catch (error) {
    console.error('Error: ', error);  // Untuk debugging lebih lanjut
    throw new Error('Error opening or ensuring database: ' + error.message);
  }
}

async function ambilDataKelas() {

  const storeNameIkhtibar = 'Diniyah'; // Nama tabel (object store) Ikhtibar
  const storeNamedb = 'db'; // Nama tabel (object store) db

  try {
    // Pastikan OpenDatabase ada
    if (typeof openDatabase !== 'function') {
      throw new Error('OpenDatabase function is not defined');
    }

    // Memastikan database dibuka dengan store yang benar
    const db = await openDatabase(storeNameIkhtibar, 'ID');

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeNameIkhtibar, 'readonly');
      const store = transaction.objectStore(storeNameIkhtibar);
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = async function (event) {
        const dataIkhtibar = event.target.result;

        if (dataIkhtibar) {
          // Ambil data dari store db
          const dbData = await getAllDataFromIndexedDB(storeNamedb);

          // Loop melalui data Ikhtibar dan masukkan ke store db
          dataIkhtibar.forEach(item => {
            const existingData = dbData.find(data => data.IDS === item.IDSantri);

            if (existingData) {
              existingData.Diniyah = item.Diniyah;
              existingData.KelasMD = item.Kelas;
              existingData.KelMD = item.Kel;
            }
          });

          // Simpan data ke store db
          await saveDataToIndexedDB(storeNamedb, { db: dbData });

          resolve('Data Ikhtibar berhasil diambil dan dimasukkan ke store db');
        } else {
          reject('No data found in store Ikhtibar');
        }
      };

      getAllRequest.onerror = function () {
        reject('Error fetching data from IndexedDB');
      };
    });
  } catch (error) {
    console.error('Error: ', error);  // Untuk debugging lebih lanjut
    throw new Error('Error opening or ensuring database: ' + error.message);
  }
}




//storeName, jsonData, primaryKey = 'IDS'
async function getDataByIDSantri(IDSantri, storeName, primaryKey = 'IDS') {
  const dbName = 'Santri'; // Nama database tetap 'Santri'

  try {
    // Pastikan OpenDatabase ada
    if (typeof openDatabase !== 'function') {
      throw new Error('OpenDatabase function is not defined');
    }

    // Memastikan database dibuka dengan store yang benar
    const db = await openDatabase(storeName, primaryKey);

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      
      const cursorRequest = store.openCursor();

      cursorRequest.onsuccess = function (event) {
        const cursor = event.target.result;

        // Jika cursor ada, periksa apakah IDSantri cocok
        if (cursor) {
          if (cursor.value.IDSantri === IDSantri) {
            resolve(cursor.value); // Mengembalikan data jika ditemukan
          } else {
            cursor.continue(); // Lanjutkan ke data berikutnya
          }
        } else {
          resolve(null); // Tidak ada data yang ditemukan
        }
      };

      cursorRequest.onerror = function () {
        reject('Error fetching data from IndexedDB');
      };
    });
  } catch (error) {
    console.error('Error: ', error);  // Untuk debugging lebih lanjut
    throw new Error('Error opening or ensuring database: ' + error.message);
  }
}


function Percobaan() {
  MasukkanData('db', '1430207', 'formData');
}


function getFilteredFromIndexedDB(storeName) {
  const dbName = 'Santri'; // Nama database tetap 'Santri'

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);

    request.onsuccess = function (event) {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains(storeName)) {
        console.log(`Store "${storeName}" tidak ditemukan dalam IndexedDB.`);
        resolve([]); // Kembalikan array kosong jika store tidak ada
        return;
      }
      
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = function (event) {
        const data = event.target.result;

        const filterDiniyah = document.getElementById('filterDiniyah').value.toLowerCase();
        const filterKelas = document.getElementById('filterKelas').value.toLowerCase();
        const filterKel = document.getElementById('filterKel').value.toLowerCase();
        const filterStatusSantri = document.getElementById('filterStatusSantri').value.toLowerCase();
        const filterCariNama = document.getElementById('filterCariNama').value.toLowerCase();

        const filteredData = data.filter(item => {
          return (!filterDiniyah || (item.Diniyah && item.Diniyah.toLowerCase().includes(filterDiniyah))) &&
                 (!filterKelas || (item.KelasMD && item.KelasMD.toLowerCase().includes(filterKelas))) &&
                 (!filterKel || (item.KelMD && item.KelMD.toLowerCase().includes(filterKel))) &&
                 (!filterStatusSantri || (item.StatusSantri && item.StatusSantri.toLowerCase().includes(filterStatusSantri))) &&
                 (!filterCariNama || (item.Nama && item.Nama.toLowerCase().includes(filterCariNama)));
        });

        resolve(filteredData);
      };

      getAllRequest.onerror = function () {
        reject('Error fetching data from IndexedDB');
      };
    };

    request.onerror = function () {
      reject('Error opening database');
    };
  });
}





//-------------------------- uNTUK  EDIT DATA ------------------------------
function MasukkanData(storeName, IDS, formId) {
  const dbName = 'Santri'; // Nama database tetap 'Santri'

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);

    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const getRequest = store.get(IDS);

      getRequest.onsuccess = async function (event) {
        const data = event.target.result;

        if (data) {
          const form = document.getElementById(formId);

          if (!form) {
            reject(`Form with ID '${formId}' not found`);
            return;
          }

          // Iterate through the keys of the data object
          Object.keys(data).forEach((key) => {
            // Menggunakan escape character untuk ID yang mengandung spasi
            const escapedKey = key.replace(/ /g, '\\ ');
            const inputElement = form.querySelector(`#${escapedKey}`);
          
            if (inputElement) {
              // Jika elemen adalah input atau textarea
              if (inputElement.tagName === 'INPUT' || inputElement.tagName === 'TEXTAREA') {
                inputElement.value = data[key];
              }
              // Jika elemen adalah select
              else if (inputElement.tagName === 'SELECT') {
                inputElement.value = data[key];
              }
              // Jika elemen adalah dd
              else if (inputElement.tagName === 'DD') {
                inputElement.textContent = data[key]; // Ganti value dengan textContent
              }
            }
          });

          resolve(`Data successfully populated in form '${formId}'`);

          // Mengambil data Ikhtibar setelah data utama ditemukan
          const ikhtibarData = await getDataByIDSantri(IDS, "Ikhtibar", 'ID');
          const KetIkhtibar = document.getElementById('KeteranganIkhtibar');

          if (ikhtibarData && KetIkhtibar) {
            KetIkhtibar.textContent = ikhtibarData.Ikhtibar.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }) + " (" + ikhtibarData.Ket + ")";
          } else if (KetIkhtibar) {
            KetIkhtibar.textContent = 'Belum Bayar'; // Jika tidak ada data Ikhtibar
          }


        } else {
          reject(`No data found for IDS '${IDS}'`);
        }
      };

      getRequest.onerror = function () {
        reject('Error fetching data from IndexedDB');
      };
    };

    request.onerror = function () {
      reject('Error opening database');
    };
  });
}


