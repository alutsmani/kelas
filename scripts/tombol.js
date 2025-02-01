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

  const jsonData = BuatJson('Diniyah', 'formData');
  console.log(jsonData);
  const storeName = 'Diniyah'; // Nama tabel (object store)

  jsonData.Diniyah[0].SampaiMasehi = new Date().toISOString().slice(0, 10);
  jsonData.Diniyah[0].KetSampai = "Lulus";

  const Lembaga = ['Isti\'dadiyah', 'Ula', 'Wustha', 'Ulya', 'Guru Tugas'].indexOf(jsonData.Diniyah[0].Diniyah);
  jsonData.Diniyah[0].ID = `${jsonData.Diniyah[0].IDS}-${Lembaga}-${jsonData.Diniyah[0].KelasMD}-${jsonData.Diniyah[0].KelMD}`;

  try {
    const result = await saveOrUpdateData(storeName, jsonData, 'ID');
    console.log(result);
    tampilkanData();
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

  const jsonDB = BuatJson('db', 'formData');
  console.log(jsonDB);

  jsonData.db[0].KelasMD = "";
  jsonData.db[0].KelMD = "";

  try {
    const result = await saveOrUpdateData('db', jsonDB, 'IDS');
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