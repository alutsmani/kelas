function addProductRowAsatidz(nama, ids, akses, diniyah, formal, status, imageUrl) {
    const productsArea = document.getElementById('SantriArea');
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
        <span class="cell-label">Akses Ke:</span>${akses || '-'}</div>
      <div class="product-cell category">
        <span class="cell-label">Diniyah:</span>${diniyah || '-'}</div>
      <div class="product-cell sales">
        <span class="cell-label">Formal:</span>${formal || '-'}</div>
      <div class="product-cell status-cell">
        <span class="cell-label">Status:</span>
        <span class="status ${status.startsWith('Admin') ? 'kurang' : status === 'Guru' ? 'disabled' : 'active'}">${status || '-'}</span>
      </div>
    `;

    newRow.addEventListener('click', () => {
        MasukkanData('Asatidz', ids, 'formData');

        var offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasBottom'));
        offcanvas.show();

    });

    productsArea.appendChild(newRow);
}

function tampilkanAsatidz() {
    const productsArea = document.getElementById('SantriArea');
    productsArea.innerHTML = ''; // Bersihkan isi sebelum menampilkan data baru
    addHeader(); // Tambahkan header tabel
  
    const storeName = 'Asatidz'; // Nama tabel (object store)
  
    // Ambil semua data dari IndexedDB
    getFilteredFromIndexedDB(storeName)
      .then(function (data) {
        // Batasi jumlah data yang ditampilkan
        const limitedData = data.slice(0, 100);
  
        // Loop melalui data dan tampilkan menggunakan addProductRow
        limitedData.forEach(function (item) {
          const imageUrl = item.IDS.startsWith('3') ? './gambar/iconlk.webp' : './gambar/iconpr.webp';
          addProductRowAsatidz(
            item.Nama, // IDS
            item.IDS, // Nama
            item.KelasMD + ' ' + '.' + item.KelMD || '', // Diniyah (jika ada)
            item.Akses || '', // Akses (jika ada)
            item.KelasFormal + ' ' + '.' + item.KelFormal || '', // Ikhtibar (jika ada)
            item.Status || '', // Jabatan (jika ada)
            imageUrl // URL gambar berdasarkan IDS
          );
        });
      })
      .catch(function (error) {
        console.error('Error fetching data from IndexedDB:', error);
      });
  }


function PilihTampilanData() {
  const listItems = document.querySelectorAll('.sidebar-list-item');
  const naikkelas = document.getElementById('NaikKelas');
  const filterGrupInput = document.getElementById('filterGrupInput')
  const tambahManual = document.getElementById('tambahManual')

  listItems.forEach(function (item) {
    if (item.classList.contains('active')) {
      const itemName = item.querySelector('span').textContent;
      if (itemName === 'Asatidz') {
        moveHtmlContent('./halaman/halaman.html', 'formDataAsatidz', 'formData');
        moveHtmlContent('./halaman/halaman.html', 'ofcanvassCariAsatidz', 'ofcanvassCari');
        moveHtmlContent('./halaman/halaman.html', 'formDataModalAsatidz', 'formDataModal');
        
        naikkelas.style.display = 'none';
        filterGrupInput.style.display = 'none';
        tambahManual.style.display = 'block';

        tampilkanAsatidz();
        CariDataAsatidz();
        
      } else if (itemName === 'Santri') {
        moveHtmlContent('./halaman/halaman.html', 'formData', 'formData');
        moveHtmlContent('./halaman/halaman.html', 'ofcanvassCari', 'ofcanvassCari');
        moveHtmlContent('./halaman/halaman.html', 'formDataModal', 'formDataModal');
        
        naikkelas.style.display = 'block';
        filterGrupInput.style.display = 'flex';
        tambahManual.style.display = 'none';

        tampilkanData();
        CariData();
        
      }
    }
  });
}






// tambahkan event listener untuk menjalankan fungsi deteksiAktif saat list item di klik
const listItems = document.querySelectorAll('.sidebar-list-item');
listItems.forEach(function (item) {
  item.addEventListener('click', PilihTampilanData);
});



//------------------------------------- Pencarian ------------------------------------
function CariSemuaAsatidz(storeName) {
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
  
          const filterCariNama = document.getElementById('CariNamaAsatidz').value;
  
          const filteredData = data.filter(item => {
          return (filterCariNama === '' || item.Nama.toLowerCase().includes(filterCariNama.toLowerCase()));
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
 function CariDataAsatidz() {
    const productsArea = document.getElementById('CariArea');
    productsArea.innerHTML = ''; // Bersihkan isi sebelum menampilkan data baru
    addHeaderCari(); // Tambahkan header tabel
  
    const storeName = 'Asatidz'; // Nama tabel (object store)
  
    // Ambil semua data dari IndexedDB
    CariSemuaAsatidz(storeName)
      .then(function (data) {
        // Batasi jumlah data yang ditampilkan
        const limitedData = data.slice(0, 100);
  
        // Loop melalui data dan tampilkan menggunakan addProductRow
        limitedData.forEach(function (item) {
          
  
            const imageUrl = item.IDS.startsWith('3') ? './gambar/iconlk.webp' : './gambar/iconpr.webp';
            addCariRowAsatidz(
                item.Nama, // IDS
                item.IDS, // Nama
                item.KelasMD + ' ' + '.' + item.KelMD || '', // Diniyah (jika ada)
                item.Akses || '', // Akses (jika ada)
                item.KelasFormal + ' ' + '.' + item.KelFormal || '', // Ikhtibar (jika ada)
                item.Status || '', // Jabatan (jika ada)
                imageUrl // URL gambar berdasarkan IDS
                );
            
            
        });
      })
      .catch(function (error) {
        console.error('Error fetching data from IndexedDB:', error);
      });
}




function addCariRowAsatidz(nama, ids, akses, diniyah, formal, status, imageUrl) {
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
      <div class="product-cell price">
        <span class="cell-label">Akses Ke:</span>${status || '-'}</div>
      <div class="product-cell stock">
        <span class="cell-label">Diniyah:</span>${diniyah || '-'}</div>
      <div class="product-cell sales">
        <span class="cell-label">Formal:</span>${formal || '-'}</div>
      
    `;

    newRow.addEventListener('click', () => {
        
        MasukkanData('Asatidz', ids, 'formDataModal');
        
        var modal = new bootstrap.Modal(document.getElementById('ModalKonfirmasi'));
        modal.show();
    });

    productsArea.appendChild(newRow);
}






async function tambahkanAsatidz() {
  const jsonData = BuatJson('Asatidz', 'formDataModal');
  console.log(jsonData);
  const storeName = 'Asatidz'; // Nama tabel (object store)

  try {
    const result = await saveOrUpdateData(storeName, jsonData, 'IDS');
    console.log(result);
    tampilkanAsatidz();
    CariDataAsatidz();
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










//----------------------------------- Online -------------------------------------
async function DownloadDiniyahAsatidz() {
    // Menampilkan indikator loading
    const LabelDownload = document.getElementById('LabelDownload');
    const LoadingDownload = document.getElementById('LoadingDownload');
  
    LabelDownload.style.display = 'none';
    LoadingDownload.style.display = 'block';
  
    const filterDiniyah = document.getElementById('filterDiniyah').value;
    const filterKelas = document.getElementById('filterKelas').value;
    const filterKel = document.getElementById('filterKel').value;
  
    const filters = { Asatidz: {Diniyah: filterDiniyah} }; // Kriteria filter
    
    try {
      // Menunggu data selesai didapat
      const data = await GetData(urlLogin, filters);
      console.log("Data received for saving:", data); // Log the data before saving
  
      // Menyimpan data ke IndexedDB dan menunggu hingga selesai
      await saveDataToIndexedDB("Asatidz", data, "IDS");
  
      // Menampilkan data setelah selesai disimpan
      tampilkanAsatidz();
  
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

  async function DownloadAsatidz() {
    const loadingContainer = document.getElementById('loadingContainer');
    const progressBar = document.getElementById('progressBar');

    // Tampilkan progress bar dengan animasi turun ke 10px
    loadingContainer.style.top = '10px';

    try {
        const filters = { Asatidz: {} };

        // Progress naik perlahan saat proses berjalan
        let progressValue = 0;
        let progressInterval = setInterval(() => {
            if (progressValue < 80) { // Batasi agar tidak langsung ke 100%
                progressValue += 5;
                progressBar.style.width = `${progressValue}%`;
                progressBar.textContent = `${progressValue}%`;
            }
        }, 100); // Update setiap 100ms agar terlihat berjalan

        // Mengambil data
        const data = await GetData(urlLogin, filters);
        console.log("Data received for saving:", data);

        // Hentikan progress lambat
        clearInterval(progressInterval);

        // Simpan ke IndexedDB
        await saveDataToIndexedDB("Asatidz", data, "IDS");

        // Menampilkan data setelah selesai
        await CariDataAsatidz();

        // Progress langsung ke 100% dengan animasi cepat
        await updateProgress(100);

        // Sembunyikan progress bar setelah selesai
        setTimeout(() => {
            loadingContainer.style.top = '-50px';
        }, 500);
    } catch (error) {
        console.error("Terjadi kesalahan:", error);
        alert("Terjadi kesalahan saat mengunduh data. Silakan coba lagi.");

        // Sembunyikan progress bar jika terjadi error
        loadingContainer.style.top = '-50px';
    }
}

