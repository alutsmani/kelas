async function simpan() {
    const jsonData = BuatJson('db', 'formData');
    console.log(jsonData);
    const dbName = 'Santri'; // Nama database
    const storeName = 'db'; // Nama tabel (object store)
  
    try {
      const result = await saveOrUpdateData(dbName, storeName, jsonData);
      console.log(result);
      tampilkanData();
      document.getElementById('offcanvasBottom').classList.remove('show'); document.getElementById('offcanvasBottom').dispatchEvent(new Event('hide.bs.offcanvas'));
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

function SelectFilter() {
  const Diniyah = document.getElementById('filterDiniyah');
  const Kelas = document.getElementById('filterKelas');
  const Kel = document.getElementById('filterKel');

  ComboDiniyah(Diniyah, Kelas, Kel);
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

document.getElementById('filterCariNama').addEventListener('input', tampilkanData);
document.getElementById('filterDiniyah').addEventListener('click', tampilkanData);


function reload() {
  DownloadDiniyahIkhtibar();
}
