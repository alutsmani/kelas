function CariSemuaSantri(storeName) {
    const dbName = 'Santri'; // Nama database tetap 'Santri'
  
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName);
  
      request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const getAllRequest = store.getAll();
  
        getAllRequest.onsuccess = function (event) {
          const data = event.target.result;
  
          const filterDiniyah = document.getElementById('CariDiniyah').value;
          const filterStatusSantri = document.getElementById('CariStatusSantri').value;
  
          const filterCariNama = document.getElementById('CariNama').value;
  
          const filteredData = data.filter(item => {
          return (filterDiniyah === '' || item.Diniyah.toLowerCase().includes(filterDiniyah.toLowerCase())) &&
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


  //2. Fungsi untuk Menampilkan Data
function CariData() {
    const productsArea = document.getElementById('CariArea');
    productsArea.innerHTML = ''; // Bersihkan isi sebelum menampilkan data baru
    addHeaderCari(); // Tambahkan header tabel
  
    const storeName = 'db'; // Nama tabel (object store)
    const ikhtibarStoreName = 'Ikhtibar'; // Nama tabel Ikhtibar
  
    // Ambil semua data dari IndexedDB
    CariSemuaSantri(storeName)
      .then(function (data) {
        // Batasi jumlah data yang ditampilkan
        const limitedData = data.slice(0, 100);
  
        // Loop melalui data dan tampilkan menggunakan addProductRow
        limitedData.forEach(function (item) {
          
  
            const imageUrl = item.IDS.startsWith('1') ? './gambar/iconlk.webp' : './gambar/iconpr.webp';
            addCariRow(
            item.IDS, // IDS
            item.Nama, // Nama
            item.Diniyah + ' ' + item.KelasMD + '.' + item.KelMD || '', // Kelas (jika ada)
            item.Status || '', // Status (jika ada)
            item.Ikhtibar || '', // Ikhtibar (jika ada)
            item.Daerah + '.' + item.NoKamar || '', // Kamar (jika ada)
            imageUrl // URL gambar berdasarkan IDS
            );
            
            
        });
      })
      .catch(function (error) {
        console.error('Error fetching data from IndexedDB:', error);
      });
}


async function tambahkan() {
  const jsonData = BuatJson('db', 'formDataModal');
  console.log(jsonData);
  const storeName = 'db'; // Nama tabel (object store)

  try {
    const result = await saveOrUpdateData(storeName, jsonData, 'IDS');
    console.log(result);
    tampilkanData();
    CariData();
    //document.getElementById('offcanvasBottom').classList.remove('show'); document.getElementById('offcanvasBottom').dispatchEvent(new Event('hide.bs.offcanvas'));
  } catch (error) {
    console.error(error);
  }

  try {
    const response = await sendPostWithGet(jsonData);
    console.log("Respons dari server:", response);
  } catch (error) {
      console.error("Kesalahan saat memproses data:", error);
  }
}

function addCariRow(ids, nama, kelas, status, ikhtibar, kamar, imageUrl) {
    const productsArea = document.getElementById('CariArea');
    const newRow = document.createElement('div');
    newRow.classList.add('products-row');

    newRow.innerHTML = `

        <button class="cell-more-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-vertical">
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="12" cy="5" r="1"></circle>
            <circle cx="12" cy="19" r="1"></circle>
        </svg>
        </button>

        <div class="product-cell image">
        <img src="${imageUrl || 'https://via.placeholder.com/150'}" alt="product">
        <span>${nama || ''}</span>
        </div>

        <div class="product-cell stock">
        <span class="cell-label">IDS:</span>${ids || '-'}</div>

        <div class="product-cell price">
        <span class="cell-label">Kamar:</span>${kamar || '-'}</div>

        <div class="product-cell category">
        <span class="cell-label">Kelas:</span>${kelas || '-'}</div>
        
    `;

    newRow.addEventListener('click', () => {
        
        MasukkanData('db', ids, 'formDataModal');
        
        var modal = new bootstrap.Modal(document.getElementById('ModalKonfirmasi'));
        modal.show();
    });

    productsArea.appendChild(newRow);
}


function addHeaderCari() {
    const productsArea = document.getElementById('CariArea');
    const existingHeader = productsArea.querySelector('.products-header');

    const listItems = document.querySelectorAll('.sidebar-list-item');

    let kelas = 'Kelas';
    let kamar = 'Kamar';

    const activeItem = document.querySelector('.sidebar-list-item.active');
    if (activeItem) {
      const itemName = activeItem.querySelector('span')?.textContent; // Safe navigation operator
      switch (itemName) {
        case 'Asatidz': {
          const listItems = document.querySelectorAll('.sidebar-list-item'); // Ensure listItems is defined
          if (listItems.length > 0) {
            kelas = activeItem === listItems[0] ? 'Akses' : 'Kelas';
            kamar = activeItem === listItems[0] ? 'Status' : 'Kamar';
          }
          break;
        }
        default:
          // Default case to handle other values
          break;
      }
    }

    if (!existingHeader) { // Prevent adding duplicate headers
        const newRow = document.createElement('div');
        newRow.classList.add('products-header');

        newRow.innerHTML = `
              <div class="product-cell image">
                &nbsp;&nbsp;&nbsp;&nbsp;Nama
                <button class="sort-button">
                  <i class="bi bi-sort-alpha-down"></i>
                </button>
              </div>

              <div class="product-cell stock">
                IDS
                <button class="sort-button">
                  <i class="bi bi-sort-alpha-down"></i>
                </button>
              </div>

              <div class="product-cell price">${kamar}<button class="sort-button">
                <i class="bi bi-sort-alpha-down"></i>
              </button></div>

              <div class="product-cell category">${kelas}<button class="sort-button">
                <i class="bi bi-sort-alpha-down"></i>
              </button></div>
 
        `;
        productsArea.appendChild(newRow);
    }
}



async function DownloadDiniyahCari() {
    // Menampilkan indikator loading
    const LabelDownload = document.getElementById('LabelDownloadCari');
    const LoadingDownload = document.getElementById('LoadingDownloadCari');
  
    LabelDownload.style.display = 'none';
    LoadingDownload.style.display = 'block';
  
    const filterDiniyah = document.getElementById('CariDiniyah').value;
    const filters = { db: { Diniyah: filterDiniyah } }; // Kriteria filter
    
    try {
      // Menunggu data selesai didapat
      const data = await GetData(url, filters);
      console.log("Data received for saving:", data); // Log the data before saving
  
      // Menyimpan data ke IndexedDB dan menunggu hingga selesai
      await saveDataToIndexedDB("db", data, "IDS");
  
      // Menampilkan data setelah selesai disimpan
      await CariData();
  
      // Mengubah tampilan indikator loading
      LabelDownload.style.display = 'block';
      LoadingDownload.style.display = 'none';
  
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      
      // Menyembunyikan indikator loading jika terjadi error
      LabelDownload.style.display = 'block';
      LoadingDownload.style.display = 'none';
    }
}