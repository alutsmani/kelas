async function simpan() {
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

    try {
      const response = await sendPostWithGet(jsonData);
      console.log("Respons dari server:", response);
    } catch (error) {
        console.error("Kesalahan saat memproses data:", error);
    }
}

async function naikkelas() {
  const jsonData = BuatJson('db', 'formData');
  console.log(jsonData);
  const storeName = 'db'; // Nama tabel (object store)

  jsonData.KelasMD = "";
  jsonData.KelMD = "";

  try {
    const result = await saveOrUpdateData(storeName, jsonData, 'IDS');
    console.log(result);
    tampilkanData();
    //document.getElementById('offcanvasBottom').classList.remove('show'); document.getElementById('offcanvasBottom').dispatchEvent(new Event('hide.bs.offcanvas'));
  } catch (error) {
    console.error(error);
  }

}






function SelectDiniyah() {
  const Diniyah = document.getElementById('Diniyah');
  const Kelas = document.getElementById('KelasMD');
  const Kel = document.getElementById('KelMD');

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