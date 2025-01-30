

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
    if (localStorage.getItem('IDS') === null || localStorage.getItem('IDS') === '') {
      window.location.href = 'login.html';
      } else {
      moveHtmlContent('./halaman/halaman.html', 'formData', 'formData');
      moveHtmlContent('./halaman/halaman.html', 'ofcanvassCari', 'ofcanvassCari');
      moveHtmlContent('./halaman/halaman.html', 'formDataModal', 'formDataModal');

      selectUser();
      tampilkanData();
      disableBackButton();
    }
    
  });
  
  async function selectUser() {
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
        if (userData.Status.includes("Admin")) {
          document.getElementById('listAsatidz').style.display = 'block';
          console.log ("Admin");
        } else {
          document.getElementById('listAsatidz').style.display = 'none';
          console.log ("Bukan Admin");
        }

        // ---------- Menampilkan akses ke Super Admin ----------
        if (userData.Status.includes("Super Admin")) {
          console.log("Super Admin");
          document.getElementById('filterDiniyah').addEventListener('change', SelectDiniyah);

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
  
  