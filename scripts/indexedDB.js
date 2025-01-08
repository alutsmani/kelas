

function openDatabase(dbName, storeName) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName);
  
      request.onupgradeneeded = function (event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'IDS' });
          console.log(`Object store '${storeName}' created during upgrade.`);
        }
      };
  
      request.onsuccess = function (event) {
        const db = event.target.result;
  
        // Cek apakah object store ada
        if (!db.objectStoreNames.contains(storeName)) {
          db.close();
  
          // Buka dengan versi yang lebih tinggi untuk membuat object store baru
          const upgradeRequest = indexedDB.open(dbName, db.version + 1);
  
          upgradeRequest.onupgradeneeded = function (event) {
            const upgradedDb = event.target.result;
            upgradedDb.createObjectStore(storeName, { keyPath: 'IDS' });
            console.log(`Object store '${storeName}' created in version upgrade.`);
          };
  
          upgradeRequest.onsuccess = function (event) {
            const upgradedDb = event.target.result;
            console.log(`Database '${dbName}' upgraded successfully.`);
            resolve(upgradedDb);
          };
  
          upgradeRequest.onerror = function (event) {
            console.error('Error upgrading database:', event.target.error);
            reject('Error upgrading database');
          };
        } else {
          console.log(`Database '${dbName}' opened successfully.`);
          resolve(db);
        }
      };
  
      request.onerror = function (event) {
        console.error('Error opening database:', event.target.error);
        reject('Error opening database');
      };
    });
  }
  


  //Buat fungsi untuk menyimpan atau memperbarui data di IndexedDB berdasarkan IDS.
  async function saveOrUpdateData(dbName, storeName, jsonData) {
    // Pastikan `db` adalah array
    if (!Array.isArray(jsonData.db)) {
        console.warn("Property 'db' is not an array. Converting to array.");
        jsonData.db = [jsonData.db];
    }

    const db = await openDatabase(dbName, storeName);

    return new Promise((resolve, reject) => {
        if (!db.objectStoreNames.contains(storeName)) {
            reject(`Object store '${storeName}' not found in database '${dbName}'.`);
            return;
        }

        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);

        jsonData.db.forEach(item => {
            if (!item.IDS) {
                console.error("Missing 'IDS' property in item:", item);
                return;
            }

            const request = store.get(item.IDS);

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



  //4. Fungsi Utama untuk Menyimpan Data JSON
//Buat fungsi utama yang akan memanggil fungsi di atas untuk menyimpan data JSON ke IndexedDB.

async function saveDataToIndexedDB(jsonData) {
  const dbName = 'Santri'; // Nama database
  const storeName = 'db'; // Nama tabel (object store)

  if (!jsonData || !jsonData.db) {
      console.error("Invalid input: JSON data is required and must include 'db'.");
      return;
  }

  console.log("Data received for saving:", jsonData);

  try {
      const result = await saveOrUpdateData(dbName, storeName, jsonData);
      console.log(result);
  } catch (error) {
      console.error("Error saving data to IndexedDB:", error);
  }
}








  //1. Fungsi untuk Mengambil Data dari IndexedDB
//Buat fungsi untuk mengambil semua data dari tabel (object store) di IndexedDB.
function getAllDataFromIndexedDB(dbName, storeName) {
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
async function tampilkanData() {
    const productsArea = document.querySelector('.products-area-wrapper');
    productsArea.innerHTML = ''; // Bersihkan isi sebelum menampilkan data baru
    addHeader(); // Tambahkan header tabel
    
    const dbName = 'Santri'; // Nama database
    const storeName = 'db'; // Nama tabel (object store)
  
    try {
      // Ambil semua data dari IndexedDB
      const data = await getFilteredFromIndexedDB(dbName, storeName);
  
      // Batasi jumlah data yang ditampilkan
      const limitedData = data.slice(0, 100);
  
      // Loop melalui data dan tampilkan menggunakan addProductRow
      limitedData.forEach(item => {
        const imageUrl = item.IDS.startsWith('1') ? './gambar/iconlk.webp' : './gambar/iconpr.webp';
        addProductRow(
          item.IDS, // IDS
          item.Nama, // Nama
          item.Diniyah + ' ' + item.KelasMD + '.' + item.KelMD || '', // Kelas (jika ada)
          item.Status || '', // Status (jika ada)
          item.Ikhtibar || '', // Ikhtibar (jika ada)
          item.Daerah + '.' + item.NoKamar || '', // Kamar (jika ada)
          imageUrl // URL gambar berdasarkan IDS
        );
      });
    } catch (error) {
      console.error('Error displaying data:', error);
    }
  }

function Percobaan() {
  MasukkanData('Santri', 'db', '1430207', 'formData');
}


function getFilteredFromIndexedDB(dbName, storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);

    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = function (event) {
        const data = event.target.result;

        const filterDiniyah = document.getElementById('filterDiniyah').value;
        const filterKelas = document.getElementById('filterKelas').value;
        const filterKel = document.getElementById('filterKel').value;
        const filterStatusSantri = document.getElementById('filterStatusSantri').value;

        const filterCariNama = document.getElementById('filterCariNama').value;

        const filteredData = data.filter(item => {
        return (filterDiniyah === '' || item.Diniyah.toLowerCase().includes(filterDiniyah.toLowerCase())) &&
                (filterKelas === '' || item.KelasMD.toLowerCase().includes(filterKelas.toLowerCase())) &&
                (filterKel === '' || item.KelMD.toLowerCase().includes(filterKel.toLowerCase())) &&
                (filterStatusSantri === '' || item.StatusSantri.toLowerCase().includes(filterStatusSantri.toLowerCase())) &&
                
                (filterCariNama === '' || item.Nama.toLowerCase().includes(filterCariNama.toLowerCase()));
        });

        resolve(filteredData);
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




//-------------------------- uNTUK  EDIT DATA ------------------------------
function MasukkanData(dbName, storeName, IDS, formId) {
  return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName);

      request.onsuccess = function (event) {
          const db = event.target.result;
          const transaction = db.transaction(storeName, 'readonly');
          const store = transaction.objectStore(storeName);
          const getRequest = store.get(IDS);

          getRequest.onsuccess = function (event) {
              const data = event.target.result;

              if (data) {
                  const form = document.getElementById(formId);

                  if (!form) {
                      reject(`Form with ID '${formId}' not found`);
                      return;
                  }

                  // Iterate through the keys of the data object
                  Object.keys(data).forEach((key) => {
                      const inputElement = form.querySelector(`#${key}`);

                      if (inputElement) {
                          if (inputElement.tagName === 'INPUT' || inputElement.tagName === 'TEXTAREA') {
                              inputElement.value = data[key];
                          } else if (inputElement.tagName === 'SELECT') {
                              inputElement.value = data[key];
                          }
                      }
                  });

                  resolve(`Data successfully populated in form '${formId}'`);
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
