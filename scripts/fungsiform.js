async function selectDiniyah() {
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

      console.log("Data pengguna:", userData);

      populateSelect('Diniyah', userData.Diniyah);

      document.getElementById('NamaAkun').innerHTML = userData.Nama;
  } catch (error) {
      console.error("Terjadi kesalahan:", error);
  }
}

function updateKelasMD() {
  // Ambil checkbox khusus untuk kelas
  const checkboxes = document.querySelectorAll('#formData .kelas-checkbox');

  // Filter checkbox yang dicentang dan proses ID-nya
  const selectedValues = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.id.replace('kelas', '')) // Hapus kata 'kelas'
    .join(', ');

  // Tampilkan hasil ke textbox dengan id KelasMD
  const inputKelasMD = document.querySelector('#formData #KelasMD');
  if (inputKelasMD) {
    inputKelasMD.value = selectedValues;
  }
}

function updateKelMD() {
  // Ambil checkbox khusus untuk kelompok
  const checkboxes = document.querySelectorAll('#formData .kel-checkbox');

  // Filter checkbox yang dicentang dan proses ID-nya
  const selectedValues = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.id) // Ambil langsung ID
    .join(', ');

  // Tampilkan hasil ke textbox dengan id KelMD
  const inputKelMD = document.querySelector('#formData #KelMD');
  if (inputKelMD) {
    inputKelMD.value = selectedValues;
  }
}
