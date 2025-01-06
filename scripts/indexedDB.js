
//Pertama, buat fungsi untuk membuka atau membuat database IndexedDB.
function openDatabase(dbName, storeName) {
  return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName);

      request.onsuccess = function (event) {
          const db = event.target.result;

          // Cek apakah object store sudah ada
          if (!db.objectStoreNames.contains(storeName)) {
              // Jika belum ada, tutup database dan buka kembali dengan versi yang lebih tinggi
              db.close();
              const upgradeRequest = indexedDB.open(dbName, db.version + 1);

              upgradeRequest.onupgradeneeded = function (event) {
                  const db = event.target.result;
                  db.createObjectStore(storeName, { keyPath: 'IDS' });
                  console.log(`Object store '${storeName}' created.`);
              };

              upgradeRequest.onsuccess = function (event) {
                  const db = event.target.result;
                  console.log(`Database '${dbName}' upgraded successfully.`);
                  resolve(db);
              };

              upgradeRequest.onerror = function (event) {
                  console.error('Error upgrading database:', event.target.error);
                  reject('Error upgrading database');
              };
          } else {
              // Jika object store sudah ada, langsung resolve
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
    if (!Array.isArray(jsonData.db)) {
        throw new Error("Invalid jsonData: 'db' must be an array.");
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
  
    try {
      const result = await saveOrUpdateData(dbName, storeName, jsonData);
      console.log(result);
    } catch (error) {
      console.error(error);
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
//Buat fungsi untuk menampilkan data yang diambil dari IndexedDB menggunakan fungsi addProductRow.
async function tampilkanData() {
    const dbName = 'Santri'; // Nama database
    const storeName = 'db'; // Nama tabel (object store)
  
    try {
      // Ambil semua data dari IndexedDB
      const data = await getAllDataFromIndexedDB(dbName, storeName);
  
      // Loop melalui data dan tampilkan menggunakan addProductRow
      data.forEach(item => {
        const imageUrl = item.IDS.startsWith('1') ? './gambar/iconlk.webp' : './gambar/iconpr.webp';
        addProductRow(
          item.IDS, // IDS
          item.Nama, // Nama
          item.Kelas || '', // Kelas (jika ada)
          item.Status || '', // Status (jika ada)
          item.Ikhtibar || '', // Ikhtibar (jika ada)
          item.Kamar || '', // Kamar (jika ada)
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
