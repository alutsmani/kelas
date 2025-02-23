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
  
          //const filterDiniyah = document.getElementById('CariDiniyah').value;
          const filterStatusSantri = document.getElementById('CariStatusSantri').value;
  
          const filterCariNama = document.getElementById('CariNama').value;
  
          const filteredData = data.filter(item => {
          return (filterStatusSantri === '' || item.StatusSantri.toLowerCase().includes(filterStatusSantri.toLowerCase())) &&
                  
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
              item.Diniyah ? item.Diniyah + ' ' + item.KelasMD + '.' + item.KelMD : '',
              item.Status || '', // Status (jika ada)
              item.Ikhtibar || '', // Ikhtibar (jika ada)
              item.Daerah ? item.Daerah + '.' + item.NoKamar : '', // Kamar (jika ada)
              imageUrl // URL gambar berdasarkan IDS
            );
            
            
        });
      })
      .catch(function (error) {
        console.error('Error fetching data from IndexedDB:', error);
      });
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

    newRow.addEventListener('click', async () => {
        MasukkanData('db', ids, 'formDataModal');
    
        var modalElement = document.getElementById('ModalKonfirmasi');
    
        if (!modalElement) {
            console.error('ModalKonfirmasi tidak ditemukan di DOM');
            return;
        }
    
        var modal = new bootstrap.Modal(modalElement);
    
        // Tunggu modal muncul jika di-load async
        modalElement.addEventListener('shown.bs.modal', () => {
            setTimeout(() => {
                // Ambil ulang elemen karena bisa berubah
                const selectDiniyah = modalElement.querySelector('select[name="Diniyah"]');
                const inputKelas = modalElement.querySelector('input[name="Kelas"]');
                const inputKel = modalElement.querySelector('input[name="Kel"]');
    
                // Ambil nilai dari filter
                const diniyah = document.getElementById('filterDiniyah')?.value || '';
                const kelas = document.getElementById('filterKelas')?.value || '';
                const kel = document.getElementById('filterKel')?.value || '';
    
                console.log(diniyah + ' ' + kelas + '.' + kel);
    
                if (selectDiniyah) selectDiniyah.value = diniyah;
                if (inputKelas) inputKelas.value = kelas;
                if (inputKel) inputKel.value = kel;
            }, 10); // Delay untuk memastikan elemen telah dimuat
        });
    
        modal.show();
    });
  
  

    productsArea.appendChild(newRow);
}

function tambahManual() {
  var modalElement = document.getElementById('ModalKonfirmasi');
  
  if (!modalElement) {
    console.error("Modal tidak ditemukan!");
    return;
  }

  var modal = new bootstrap.Modal(modalElement);

  // Kosongkan semua input dan select dalam modal
  var inputs = modalElement.querySelectorAll('input');
  var selects = modalElement.querySelectorAll('select');
  var buatIDSbtn = modalElement.querySelector('[name="buatIDSbtn"]'); // Ambil berdasarkan name

  if (buatIDSbtn) {
    buatIDSbtn.style.display = 'block';
  } else {
    console.warn('Tombol dengan name="buatIDSbtn" tidak ditemukan dalam modal!');
  }

  inputs.forEach(input => input.value = '');
  selects.forEach(select => select.selectedIndex = 0);

  modal.show();
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
      const data = await GetDataCari(urlLogin, filters, "db", 2, 1000);
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

async function GetDataCari(url, json, sheetType = 'default', page = 1, pageSize = 1000) {
  try {
    // Tambahkan parameter ke URL untuk menentukan sheetType, page, pageSize, dan filters
    const fullUrl = `${url}?action=alldata&sheetType=${sheetType}&page=${page}&pageSize=${pageSize}&filters=${encodeURIComponent(JSON.stringify(json))}`;

    // Ambil data dari URL
    const response = await fetch(fullUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}


//------------------- Download Multiple -------------------
async function DownloadDiniyahCariMultiple() {
  const LabelDownload = document.getElementById('LabelDownloadCari');
  const LoadingDownload = document.getElementById('LoadingDownloadCari');

  LabelDownload.style.display = 'none';
  LoadingDownload.style.display = 'block';


  const loadingContainer = document.getElementById('loadingContainer');
  const progressBar = document.getElementById('progressBar');

  // Tampilkan loading dengan animasi turun ke 10px
  loadingContainer.style.top = '5px';

  try {
    for (let page = 1; page <= 6; page++) {
      let finalTarget = page * 16; // Milestone setelah fetch selesai (20%, 40%, 60%, dst.)
      
      // Progress bertambah 1% setiap ~333ms (3x per detik)
      let progressInterval = setInterval(() => {
        let currentValue = parseInt(progressBar.style.width, 10) || 0; // Pastikan nilai valid
        if (currentValue < finalTarget - 3) { // Batasi sebelum milestone
          progressBar.style.width = `${currentValue + 1}%`;
          progressBar.textContent = `${currentValue + 1}%`;
        }
      }, 333);

      // Ambil data
      const data = await GetDataCari(urlLogin, { db: { } }, "db", page, 600);
      
      clearInterval(progressInterval); // Hentikan pertumbuhan lambat

      if (!data || data.length === 0) {
        console.warn("Data tidak ditemukan untuk halaman:", page);
        continue; // Jika tidak ada data, lanjutkan ke halaman berikutnya
      }

      await saveDataToIndexedDB("db", data, "IDS");
      await CariData();
      await tampilkanData();

      // Naik cepat ke milestone berikutnya
      await updateProgress(finalTarget);
    }

    await DownloadKelas();
    await DownloadIkhtibar();

    await CariData();

    // Sembunyikan loading setelah selesai
    setTimeout(() => {
      loadingContainer.style.top = '-50px';

      // Menyembunyikan indikator loading jika terjadi error
      LabelDownload.style.display = 'block';
      LoadingDownload.style.display = 'none';

      setTimeout(() => {
        progressBar.style.width = '0%';
      }, 500);
    }, 500);
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    alert("Terjadi kesalahan saat mengunduh data. Silakan coba lagi.");
    loadingContainer.style.top = '-50px';

    // Menyembunyikan indikator loading jika terjadi error
    LabelDownload.style.display = 'block';
    LoadingDownload.style.display = 'none';
    
  }
}

async function updateProgress(target) {
  const progressBar = document.getElementById('progressBar');
  return new Promise((resolve) => {
    let currentValue = parseInt(progressBar.style.width, 10) || 0; // Pastikan nilai valid
    let step = (target - currentValue) / 10; // Naik lebih cepat setelah fetch selesai

    function animate() {
      currentValue += step;
      if (currentValue >= target) currentValue = target;
      progressBar.style.width = `${currentValue}%`;
      progressBar.textContent = `${Math.round(currentValue)}%`;

      if (currentValue < target) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    }
    animate();
  });
}