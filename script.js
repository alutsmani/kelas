document.querySelector(".jsFilter").addEventListener("click", function (e) {
  e.stopPropagation();
  document.querySelector(".filter-menu").classList.toggle("active");
});

document.addEventListener("click", function (e) {
  if (!e.target.closest(".filter-menu") && !e.target.classList.contains("jsFilter")) {
    document.querySelector(".filter-menu").classList.remove("active");
  }
});

document.querySelector(".grid").addEventListener("click", function () {
  document.querySelector(".list").classList.remove("active");
  document.querySelector(".grid").classList.add("active");

  document.getElementById('SantriArea').classList.add("gridView");
  document.getElementById('SantriArea').classList.remove("tableView");

  localStorage.setItem('viewMode', 'grid');
});

document.querySelector(".list").addEventListener("click", function () {
  document.querySelector(".list").classList.add("active");
  document.querySelector(".grid").classList.remove("active");

  document.getElementById('SantriArea').classList.remove("gridView");
  document.getElementById('SantriArea').classList.add("tableView");

  localStorage.setItem('viewMode', 'list');
});

window.addEventListener('load', function() {
  const storedViewMode = localStorage.getItem('viewMode');
  if (storedViewMode === 'grid') {
    document.querySelector(".grid").classList.add("active");
    document.querySelector(".list").classList.remove("active");
    document.getElementById('SantriArea').classList.add("gridView");
    document.getElementById('SantriArea').classList.remove("tableView");
  } else if (storedViewMode === 'list') {
    document.querySelector(".list").classList.add("active");
    document.querySelector(".grid").classList.remove("active");
    document.getElementById('SantriArea').classList.remove("gridView");
    document.getElementById('SantriArea').classList.add("tableView");
  }
});

// Ambil elemen tombol dan menu akun
const moreButton = document.querySelector('.account-info-more');
const menuAkun = document.querySelector('.menu-akun');

console.log('More button:', moreButton);
console.log('Menu:', menuAkun);
moreButton.addEventListener('click', () => {
  console.log('Button clicked'); // Ini harus muncul di konsol setiap kali tombol ditekan
  menuAkun.classList.toggle('hidden');
});


// Tutup menu jika pengguna mengklik di luar menu
document.addEventListener('click', (event) => {
  if (!moreButton.contains(event.target) && !menuAkun.contains(event.target)) {
    menuAkun.classList.add('hidden'); // Tambahkan kembali kelas 'hidden'
  }
});



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


// Ambil elemen yang relevan
const sidebar = document.querySelector('.sidebar');
const header = document.querySelector('.menu-sidebar');

// Tambahkan event listener pada header untuk membuka sidebar
header.addEventListener('click', () => {
  sidebar.classList.toggle('open'); // Toggle kelas 'open' pada sidebar
});

// Tambahkan event listener untuk menutup sidebar jika diklik di luar
document.addEventListener('click', (event) => {
  if (!header.contains(event.target) && !sidebar.contains(event.target)) {
    sidebar.classList.remove('open'); // Hapus kelas 'open' jika diklik di luar
  }
});


function disableBackButton() {
  //window.history.pushState(null, "", window.location.href);
  window.onpopstate = function () {
    window.location.reload();
  };
}