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