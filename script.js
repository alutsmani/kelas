document.querySelector(".jsFilter").addEventListener("click", function () {
  document.querySelector(".filter-menu").classList.toggle("active");
});

document.querySelector(".grid").addEventListener("click", function () {
  document.querySelector(".list").classList.remove("active");
  document.querySelector(".grid").classList.add("active");

  document.getElementById('SantriArea').classList.add("gridView");
  document.getElementById('SantriArea').classList.remove("tableView");


});

document.querySelector(".list").addEventListener("click", function () {
  document.querySelector(".list").classList.add("active");
  document.querySelector(".grid").classList.remove("active");

  document.getElementById('SantriArea').classList.remove("gridView");
  document.getElementById('SantriArea').classList.add("tableView");

});

var modeSwitch = document.querySelector('.mode-switch');
modeSwitch.addEventListener('click', function () {document.documentElement.classList.toggle('light');
 modeSwitch.classList.toggle('active');
});

// Fungsi untuk menghapus semua cache dari situs ini
function clearSiteCache() {
  // Hapus semua data dari localStorage
  localStorage.clear();

  // Hapus semua data dari sessionStorage jika Anda menggunakannya
  sessionStorage.clear();

  // Jika Anda menyimpan data di IndexedDB atau tempat lain, Anda perlu menghapusnya juga

  // Opsi tambahan: Hapus cookie jika diperlukan
  // JavaScript memiliki keterbatasan dalam menghapus cookie dengan domain dan path tertentu
  // Berikut adalah contoh untuk menghapus semua cookie yang dapat dijangkau oleh JavaScript
  document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "")
                         .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
  });

  // Tampilkan pesan konfirmasi atau reload halaman
  alert("Cache telah dihapus. Halaman akan dimuat ulang.");
  location.reload();
}


window.addEventListener('load', function() {
  if (localStorage.getItem('ID') === null || localStorage.getItem('ID') === '') {
    window.location.href = 'login.html';
    } else {
    tampilkanData();
  }
});
