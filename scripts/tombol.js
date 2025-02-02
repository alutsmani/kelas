document.getElementById('SimpanData').addEventListener('click', function () {
  const listItems = document.querySelectorAll('.sidebar-list-item');
  listItems.forEach(function (item) {
    if (item.classList.contains('active')) {
        const itemName = item.querySelector('span').textContent;
        if (itemName === 'Asatidz') {
          simpan('Asatidz', 'formData');
        } else if (itemName === 'Santri') {
          simpan('db', 'formData');
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
          simpan('Asatidz', 'formDataModal');
        } else if (itemName === 'Santri') {
          simpan('db', 'formDataModal');
        }
      }
    });
});

/*
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
*/



async function simpan(data, form) {
    const jsonData = BuatJson(data, form);
    console.log(jsonData);
    const storeName = data; // Nama tabel (object store)

    // -------- Jika yg disimpan adalah data Santri --------
    if (jsonData.db && jsonData.db.length > 0) {
      jsonData.Diniyah = JSON.parse(JSON.stringify(jsonData.db));

      jsonData.Diniyah[0].Nama = jsonData.db[0].Nama;
      jsonData.Diniyah[0].IDSantri = jsonData.db[0].IDS;
      jsonData.Diniyah[0].Diniyah = jsonData.db[0].Diniyah;
      jsonData.Diniyah[0].Kelas = jsonData.db[0].KelasMD;
      jsonData.Diniyah[0].Kel = jsonData.db[0].KelMD;

      jsonData.Diniyah[0].TanggalDibuat = new Date().toISOString().replace('T', '.').slice(0, 19).replace('Z', '').replace(/:/g, '.');
      
      jsonData.Diniyah[0].DariMasehi = new Date().toISOString().slice(0, 10);
      
      jsonData.Diniyah[0].KetDari = "Baru";
      jsonData.Diniyah[0].KetSampai = "Sekarang";
    
      const Lembaga = ['Isti\'dadiyah', 'Ula', 'Wustha', 'Ulya', 'Guru Tugas'].indexOf(jsonData.Diniyah[0].Diniyah);
      jsonData.Diniyah[0].ID = `${jsonData.Diniyah[0].IDS}-${Lembaga}-${jsonData.Diniyah[0].KelasMD}-${jsonData.Diniyah[0].KelMD}`;
      console.log(jsonData);

      jsonData.db[0].TanggalUpdate = new Date().toISOString().replace('T', '.').slice(0, 19).replace('Z', '').replace(/:/g, '.');
    
      try {
        const result = await saveOrUpdateData('Diniyah', jsonData, 'ID');
        console.log(result);
        PilihTampilanData();
        //document.getElementById('offcanvasBottom').classList.remove('show'); document.getElementById('offcanvasBottom').dispatchEvent(new Event('hide.bs.offcanvas'));
      } catch (error) {
        console.error(error);
      }
    
    }

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

async function naikkelas() {

  const jsonData = BuatJson('Diniyah', 'formData');
  console.log(jsonData);
  const storeName = 'Diniyah'; // Nama tabel (object store)

  jsonData.Diniyah[0].TanggalUpdate = new Date().toISOString().replace('T', '.').slice(0, 19).replace('Z', '').replace(/:/g, '.');
    
  jsonData.Diniyah[0].SampaiMasehi = new Date().toISOString().slice(0, 10);
  jsonData.Diniyah[0].KetSampai = "Lulus";
  jsonData.Diniyah[0].TahunHijriyah = "1445-1446";
  jsonData.Diniyah[0].TahunMasehi = "2024-2025";

  const Lembaga = ['Isti\'dadiyah', 'Ula', 'Wustha', 'Ulya', 'Guru Tugas'].indexOf(jsonData.Diniyah[0].Diniyah);
  jsonData.Diniyah[0].ID = `${jsonData.Diniyah[0].IDS}-${Lembaga}-${jsonData.Diniyah[0].KelasMD}-${jsonData.Diniyah[0].KelMD}`;

  jsonData.Diniyah[0].Admin = localStorage.getItem('IDS');

  try {
    const result = await saveOrUpdateData(storeName, jsonData, 'ID');
    console.log(result);
    HapusIDS(jsonData.Diniyah[0].IDS)
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

  jsonDB.db[0].KelasMD = "";
  jsonDB.db[0].KelMD = "";
  jsonDB.db[0].Admin = localStorage.getItem('IDS');

  try {
    const result = await saveOrUpdateData('db', jsonDB, 'IDS');
    console.log(result);
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