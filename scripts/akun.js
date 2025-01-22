

// Fungsi untuk menghapus semua cache dari situs ini
function clearSiteCache() {
    // Hapus semua data dari localStorage
    localStorage.clear();
  
    // Hapus semua data dari sessionStorage jika Anda menggunakannya
    sessionStorage.clear();
  
    // Jika Anda menyimpan data di IndexedDB atau tempat lain, Anda perlu menghapusnya juga
  
    // Opsi tambahan: Hapus cookie jika diperlukan
    // JavaScript memiliki keterbatasan dalam menghapus cookie dengan domain dan path tertentu
    // Berikut adalah contoh untuk menghapus semua cookie yang dapat dijangkau oleh JavaScript
    document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "")
                           .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
  
    // Tampilkan pesan konfirmasi atau reload halaman
    alert("Halaman akan dimuat ulang.");
    location.reload();
  }
  
  
  window.addEventListener('load', function() {
    if (localStorage.getItem('ID') === null || localStorage.getItem('ID') === '') {
      window.location.href = 'login.html';
      } else {
      selectUser()
      tampilkanData();
      disableBackButton();
    }
    
  });
  
  async function selectUser() {
    const id = localStorage.getItem('ID');
    if (!id) {
        console.log("ID tidak ditemukan di localStorage");
        return;
    }
  
    console.log("ID pengguna: ", id);
  
    const dbName = 'Santri';
    const storeName = 'Asatidz';
  
    try {
        const db = await openIndexedDB(dbName);
        const userData = await getDataFromStore(db, storeName, id);
  
        if (!userData) {
            console.log("Data pengguna tidak ditemukan");
            return;
        }
  
        console.log("Data pengguna:", userData);
  
        populateSelect('filterDiniyah', userData.Diniyah);
        populateSelect('filterKelas', userData.KelasMD);
        populateSelect('filterKel', userData.KelMD);
  
        document.getElementById('NamaAkun').innerHTML = userData.Nama;
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
  
  