let isEditMode = false;

function toggleEditMode() {
    isEditMode = !isEditMode;
    const inputs = document.querySelectorAll('.profile-content input');
    const editBtn = document.querySelector('.edit-btn');

    inputs.forEach(input => {
        input.disabled = !isEditMode;
    });

    editBtn.innerHTML = isEditMode ? '<i class="fas fa-save"></i>' : '<i class="fas fa-pen"></i>';
    if (isEditMode) {
      editBtn.addEventListener('click', function() {
        simpanData('Asatidz');
      });
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


//------------------------- Tombol ---------------------------
async function simpanData(data) {
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
  const nama = document.getElementById('Nama').value;
  const ids = document.getElementById('IDS').value;

  document.querySelector('h1').textContent = nama;
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