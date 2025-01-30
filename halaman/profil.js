let isEditMode = false;

function toggleEditMode() {
    isEditMode = !isEditMode;
    const inputs = document.querySelectorAll('.profile-content input');
    const editBtn = document.querySelector('.edit-btn');

    inputs.forEach(input => {
        input.disabled = !isEditMode;
    });

    editBtn.innerHTML = isEditMode ? '<i class="fas fa-save"></i>' : '<i class="fas fa-edit"></i>';
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
      window.location.href = '../login.html';
      } else {
      
      selectUserProfil();
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

        document.querySelectorAll('#profile-form input').forEach(input => {
            input.value = userData[input.id] || '-';
        });

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