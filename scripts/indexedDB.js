
//Pertama, buat fungsi untuk membuka atau membuat database IndexedDB.
function openDatabase(dbName, storeName) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);
  
      request.onupgradeneeded = function (event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'IDS' });
        }
      };
  
      request.onsuccess = function (event) {
        resolve(event.target.result);
      };
  
      request.onerror = function (event) {
        reject('Error opening database');
      };
    });
  }

  //Buat fungsi untuk menyimpan atau memperbarui data di IndexedDB berdasarkan IDS.
  async function saveOrUpdateData(dbName, storeName, jsonData) {
    const db = await openDatabase(dbName, storeName);
  
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
  
      // Loop melalui data yang diterima
      jsonData.db.forEach(item => {
        const request = store.get(item.IDS);
  
        request.onsuccess = function (event) {
          const existingData = event.target.result;
  
          if (existingData) {
            // Jika data dengan IDS sudah ada, update data
            store.put({ ...existingData, ...item });
          } else {
            // Jika data dengan IDS belum ada, tambahkan data baru
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
        const imageUrl = item.IDS.startsWith('1') ? '/gambar/iconlk.webp' : '/gambar/iconpr.webp';
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

