function updateKelasMD() {
  // Ambil semua checkbox yang ada di dalam formDataModal
  const checkboxes = document.querySelectorAll('#formData .form-check-input');

  // Filter checkbox yang dicentang, ambil ID-nya, dan hanya ambil angka dari ID
  const selectedValues = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.id.replace('kelas', '')) // Menghapus kata 'kelas' dari ID
    .join(', ');

  // Tampilkan hasil ke textbox dengan id KelasMD
  const inputKelasMD = document.querySelector('#formData #KelasMD');
  if (inputKelasMD) {
    inputKelasMD.value = selectedValues;
  }
}

function updateKelMD() {
  // Ambil semua checkbox yang ada di dalam formDataModal untuk Kelompok
  const checkboxes = document.querySelectorAll('#formData .form-check-input');

  // Filter checkbox yang dicentang, ambil ID-nya, dan hanya ambil huruf dari ID
  const selectedValues = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.id) // Mengambil langsung ID checkbox (A, B, C, dst.)
    .join(', ');

  // Tampilkan hasil ke textbox dengan id KelMD
  const inputKelMD = document.querySelector('#formData #KelMD');
  if (inputKelMD) {
    inputKelMD.value = selectedValues;
  }
}
