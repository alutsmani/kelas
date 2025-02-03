let isEditMode = false;

function toggleEditMode() {
    isEditMode = !isEditMode;
    const inputs = document.querySelectorAll('.profile-content input');
    const selects = document.querySelectorAll('.profile-content select');
    const editBtn = document.getElementById('Edit');

    document.querySelectorAll('.gelar').forEach(gelar => gelar.style.display = 'block');

    inputs.forEach(input => {
        input.disabled = !isEditMode;
    });

    selects.forEach(select => {
      select.disabled = !isEditMode;
    });

    editBtn.innerHTML = isEditMode ? '<i class="fas fa-save"></i>' : '<i class="fas fa-pen"></i>';
    
    if (isEditMode) {
      editBtn.addEventListener('click', function() {
        simpanData('Asatidz');
      });
    } else {
      document.querySelectorAll('.gelar').forEach(gelar => gelar.style.display = 'none');
    }
}



var modeSwitch = document.querySelector('.mode-switch');
modeSwitch.addEventListener('click', function () {
  document.documentElement.classList.toggle('light');
  modeSwitch.classList.toggle('active');
  localStorage.setItem('theme', document.documentElement.classList.contains('light') ? 'light' : 'dark');
});

window.addEventListener('load', function() {
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    document.documentElement.classList.add(storedTheme);
    modeSwitch.classList.toggle('active', storedTheme === 'light');
  }
});


window.addEventListener('load', function() {
    if (localStorage.getItem('IDS') === null || localStorage.getItem('IDS') === '') {
      window.location.href = './login.html';
      } else {
      
      selectUserProfil().then(() => {
        HitungSemua();
        HitungDataKelas();
      });

    }
    
  });
  
async function selectUserProfil() {
    const id = localStorage.getItem('IDS');
    if (!id) {
        console.log("ID tidak ditemukan di localStorage");
        return;
    }
  
    console.log("IDS pengguna: ", id);
  
    const dbName = 'Santri';
    const storeName = 'Asatidz';
  
    try {
        const db = await openIndexedDB(dbName);
        const userData = await getDataFromStore(db, storeName, id);
  
        if (!userData) {
            console.log("Data pengguna tidak ditemukan");
            return;
        }

        // ---------- Menampilkan akses ke asatidz ----------
        if (userData.Gender.startsWith('P')) {
          document.querySelector('img').src = './gambar/iconpr.webp';
        }

        // ---------- Menampilkan akses ke Super Admin ----------
      if (userData.Status.includes("Super Admin")) {
        console.log("Super Admin");
        document.getElementById('filterDiniyah').addEventListener('change', SelectFilterDiniyah);

      } else {
        let select = document.getElementById('filterDiniyah');
        select.innerHTML = ""; // Kosongkan isi sebelumnya

        // Jika userData.Diniyah kosong, tampilkan pesan "Anda belum punya Akses"
        if (!userData.Diniyah || userData.Diniyah.length === 0) {
          let option = document.createElement('option');
          option.textContent = "Anda belum punya Akses";
          option.disabled = true;
          option.selected = true;
          select.appendChild(option);
        } else {
          populateSelect('filterDiniyah', userData.Diniyah);
        }

        // Pastikan data lain juga diproses dengan cara yang sama
        if (userData.KelasMD && userData.KelasMD.length > 0) {
          populateSelect('filterKelas', userData.KelasMD);
        }
        
        if (userData.KelMD && userData.KelMD.length > 0) {
          populateSelect('filterKel', userData.KelMD);
        }

        console.log("Bukan Super Admin");
      }

       document.querySelectorAll('#profile-form input, #profile-form select, #akses-form input').forEach(input => {
          input.value = userData[input.id] || '-';
      });

        ubahNama();
        updateAccordionButton();

    } catch (error) {
        console.error("Terjadi kesalahan:", error);
    }
  }


  function openIndexedDB(dbName) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName);
  
        request.onsuccess = event => resolve(event.target.result);
        request.onerror = () => reject(request.error);
    });
  }
  
  function getDataFromStore(db, storeName, key) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);
  
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
  }
    
  function populateSelect(selectId, data = "") {
    const selectElement = document.getElementById(selectId);
    if (!selectElement) {
        console.warn(`Elemen dengan ID "${selectId}" tidak ditemukan`);
        return;
    }
  
    selectElement.innerHTML = ""; // Kosongkan elemen sebelumnya
    
    // Pisahkan string berdasarkan koma dan proses setiap item
    const items = data.split(',').map(item => item.trim());
    
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        selectElement.appendChild(option);
    });
  }
    
  
  



//------------------------- Tombol ---------------------------
async function simpanData(data) {
  ubahNama();

  const jsonData = BuatJson(data, 'profile-form');
  console.log(jsonData);
  const storeName = data; // Nama tabel (object store)

  try {
    const result = await saveOrUpdateData(storeName, jsonData, 'IDS');
    console.log(result);
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

function ubahNama() {
  const awal = document.getElementById('GelarAwal').value;
  const akhir = document.getElementById('GelarAkhir').value;

  const nama = document.getElementById('Nama').value;
  const ids = document.getElementById('IDS').value;

  document.querySelector('h1').textContent = `${awal}  ${nama}, ${akhir}`;
  document.querySelector('p').textContent = "ID : " + ids;
}

function updateAccordionButton() {
  const accordionButton = document.querySelector("#accordionFlushExample .accordion-button");
  const inputFields = document.querySelectorAll("#flush-collapseOne input");

  let addressParts = [];
  inputFields.forEach(input => {
    if (input.value.trim() !== "") {
      if (input.id === "Dusun") {
        addressParts.push(`${input.value} RT ${document.getElementById('RT').value}/RW ${document.getElementById('RW').value}`);
      } else if (input.id === "RT" || input.id === "RW") {
        return;
      } else {
        addressParts.push(input.value);
      }
    }
  });

  accordionButton.textContent = addressParts.length > 0 ? addressParts.join(', ') : "Alamat";
}

document.addEventListener("DOMContentLoaded", function () {
  const inputFields = document.querySelectorAll("#flush-collapseOne input");

  inputFields.forEach(input => {
    input.addEventListener("input", updateAccordionButton);
  });

  updateAccordionButton();
});



//------------------- Download Multiple -------------------
async function DownloadSantriProfil() {
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

      // Naik cepat ke milestone berikutnya
      await updateProgress(finalTarget);
    }

    await DownloadKelas();

    HitungSemua();

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

let isEdifilter = false;

function toggleEditFilter() {
  isEdifilter = !isEdifilter;
    const editBtn = document.getElementById('editFilter');

    document.querySelectorAll('.form-filter').forEach(form => form.disabled = !isEdifilter);
    editBtn.innerHTML = isEdifilter ? '<i class="fas fa-save"></i>' : '<i class="fas fa-pen"></i>';
    
    if (isEdifilter) {
      editBtn.addEventListener('click', function() {
        //simpanData('Asatidz');
      });
    }
}