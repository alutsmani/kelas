document.getElementById('SimpanData').addEventListener('click', function () {
  const listItems = document.querySelectorAll('.sidebar-list-item');
  listItems.forEach(function (item) {
    if (item.classList.contains('active')) {
        const itemName = item.querySelector('span').textContent;
        if (itemName === 'Asatidz') {
          simpan('Asatidz');
        } else if (itemName === 'Santri') {
          simpan('db');
        }
      }
    });
    
});

document.getElementById('TambahkanData').addEventListener('click', function () {
  const listItems = document.querySelectorAll('.sidebar-list-item');
  listItems.forEach(function (item) {
    if (item.classList.contains('active')) {
        const itemName = item.querySelector('span').textContent;
        if (itemName === 'Asatidz') {
          tambahkan('Asatidz');
        } else if (itemName === 'Santri') {
          tambahkan('db');
        }
      }
    });
});

async function tambahkan(data) {
  const jsonData = BuatJson(data, 'formDataModal');
  console.log(jsonData);
  const storeName = data; // Nama tabel (object store)

  try {
    const result = await saveOrUpdateData(storeName, jsonData, 'IDS');
    console.log(result);
    PilihTampilanData();
    
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


async function simpan(data) {
    const jsonData = BuatJson(data, 'formData');
    console.log(jsonData);
    const storeName = data; // Nama tabel (object store)
  
    try {
      const result = await saveOrUpdateData(storeName, jsonData, 'IDS');
      console.log(result);
      PilihTampilanData();
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

async function naikkelas() {
  const formData = document.getElementById('formData');
  const inputs = formData.querySelectorAll('input');

  inputs.forEach(function(input) {
    if (input.id === 'KelasMD' || input.id === 'KelMD') {
      input.value = '';
    }
  });

  const jsonData = BuatJson('db', 'formData');
  console.log(jsonData);
  const storeName = 'db'; // Nama tabel (object store)


  try {
    const result = await saveOrUpdateData(storeName, jsonData, 'IDS');
    console.log(result);
    tampilkanData();
    //document.getElementById('offcanvasBottom').classList.remove('show'); document.getElementById('offcanvasBottom').dispatchEvent(new Event('hide.bs.offcanvas'));
  } catch (error) {
    console.error(error);
  }

}






function SelectFilterDiniyah() {
  const Diniyah = document.getElementById('filterDiniyah');
  const Kelas = document.getElementById('filterKelas');
  const Kel = document.getElementById('filterKel');

  ComboDiniyah(Diniyah, Kelas, Kel);
}

function SelectFormal() {
  const Formal = document.getElementById('Formal').value;
  const Kelas = document.getElementById('KelasFormal');
  const Kel = document.getElementById('KelFormal');

  ComboFormal(Formal, Kelas, Kel);
}

document.getElementById('filterCariNama').addEventListener('input', PilihTampilanData);
document.getElementById('filterDiniyah').addEventListener('change', PilihTampilanData);



function reload() {
  DownloadDiniyahIkhtibar();
}


function Download() {
  const listItems = document.querySelectorAll('.sidebar-list-item');
  listItems.forEach(function (item) {
    if (item.classList.contains('active')) {
      const itemName = item.querySelector('span').textContent;
      if (itemName === 'Asatidz') {
        DownloadDiniyahAsatidz();
      } else if (itemName === 'Santri') {
        DownloadDiniyah();
      }
    }
  });
}