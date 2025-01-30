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

function updateDiniyah(formId) {
  const checkboxes = document.querySelectorAll(`${formId} .diniyah-checkbox`);
  const selectedValues = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.id)
    .join(', ');
  const inputDiniyah = document.querySelector(`${formId} #Diniyah`);
  if (inputDiniyah) {
    inputDiniyah.value = selectedValues;
  }
}

function updateKelasMD(formId) {
  const checkboxes = document.querySelectorAll(`${formId} .kelas-checkbox`);
  const selectedValues = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.id.replace('kelas', ''))
    .join(', ');
  const inputKelasMD = document.querySelector(`${formId} #KelasMD`);
  if (inputKelasMD) {
    inputKelasMD.value = selectedValues;
  }
}

function updateKelMD(formId) {
  const checkboxes = document.querySelectorAll(`${formId} .kel-checkbox`);
  const selectedValues = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.id)
    .join(', ');
  const inputKelMD = document.querySelector(`${formId} #KelMD`);
  if (inputKelMD) {
    inputKelMD.value = selectedValues;
  }
}
