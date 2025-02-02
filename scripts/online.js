async function GetData(url, json) {
    try {
      // Tambahkan parameter ke URL
      const fullUrl = `${url}?action=Data&filters=${encodeURIComponent(JSON.stringify(json))}`;
  
      // Ambil data dari URL
      const response = await fetch(fullUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
}
  
async function DownloadDiniyah() {
  // Menampilkan indikator loading
  const LabelDownload = document.getElementById('LabelDownload');
  const LoadingDownload = document.getElementById('LoadingDownload');

  LabelDownload.style.display = 'none';
  LoadingDownload.style.display = 'block';

  const filterDiniyah = document.getElementById('filterDiniyah').value;
  const filterKelas = document.getElementById('filterKelas').value;
  const filterKel = document.getElementById('filterKel').value;

  const filters = { db: { Diniyah: filterDiniyah, KelasMD: filterKelas, KelMD: filterKel } }; // Kriteria filter
  
  try {
    // Menunggu data selesai didapat
    const data = await GetData(urlLogin, filters);
    console.log("Data received for saving:", data); // Log the data before saving

    // Menyimpan data ke IndexedDB dan menunggu hingga selesai
    await saveDataToIndexedDB("db", data, "IDS");

    // Menampilkan data setelah selesai disimpan
    await tampilkanData();

    // Mengubah tampilan indikator loading
    LabelDownload.style.display = 'block';
    LoadingDownload.style.display = 'none';

  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    
    // Menyembunyikan indikator loading jika terjadi error
    LabelDownload.style.display = 'block';
    LoadingDownload.style.display = 'none';
  }
}

async function DownloadIDS(IDSValue) {
  // Menampilkan indikator loading
  const LabelDownload = document.getElementById('LabelDownload');
  const LoadingDownload = document.getElementById('LoadingDownload');

  LabelDownload.style.display = 'none';
  LoadingDownload.style.display = 'block';

  const filters = { db: { IDS: IDSValue } }; // Kriteria filter
  
  try {
    // Menunggu data selesai didapat
    const data = await GetData(url, filters);
    console.log("Data received for saving:", data); // Log the data before saving

    // Menyimpan data ke IndexedDB dan menunggu hingga selesai
    await saveDataToIndexedDB("db", data, "IDS");

    // Menampilkan data setelah selesai disimpan
    await tampilkanData();

    MasukkanData('db', IDSValue, 'formData');

    // Mengubah tampilan indikator loading
    LabelDownload.style.display = 'block';
    LoadingDownload.style.display = 'none';

  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    
    // Menyembunyikan indikator loading jika terjadi error
    LabelDownload.style.display = 'block';
    LoadingDownload.style.display = 'none';
  }
}

async function DownloadIkhtibar() {
  // Menampilkan indikator loading
  const LabelDownload = document.getElementById('ReloadIcon');
  const LoadingDownload = document.getElementById('LoadingReload');

  LabelDownload.style.display = 'none';
  LoadingDownload.style.display = 'block';

  const filterDiniyah = document.getElementById('filterDiniyah').value;
  const filters = { Ikhtibar: { Diniyah: filterDiniyah } }; // Kriteria filter
  
  try {
    const data = await GetData(url, filters); // Menunggu data selesai didapat
    console.log("Data received for saving:", data); // Log the data before saving

    // Menyimpan data ke IndexedDB dan menunggu hingga selesai
    await saveDataToIndexedDB("Ikhtibar", data, "ID");

    // Menampilkan data setelah selesai disimpan
    await ambilDataIkhtibar();
    await tampilkanData();
    
    // Mengubah tampilan indikator loading
    LabelDownload.style.display = 'block';
    LoadingDownload.style.display = 'none';

  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    
    // Menyembunyikan indikator loading jika terjadi error
    LabelDownload.style.display = 'block';
    LoadingDownload.style.display = 'none';
  }
}

async function DownloadKelas() {
  // Menampilkan indikator loading
  const LabelDownload = document.getElementById('ReloadIconKelas');
  const LoadingDownload = document.getElementById('LoadingReloadKelas');

  LabelDownload.style.display = 'none';
  LoadingDownload.style.display = 'block';

  const filterDiniyah = document.getElementById('filterDiniyah').value;
  const filters = { Diniyah: { Diniyah: filterDiniyah, KetSampai: "Sekarang" } }; // Kriteria filter
  
  try {
    const data = await GetData(urlLogin, filters); // Menunggu data selesai didapat
    console.log("Data received for saving:", data); // Log the data before saving

    // Menyimpan data ke IndexedDB dan menunggu hingga selesai
    await saveDataToIndexedDB("Diniyah", data, "ID");

    // Menampilkan data setelah selesai disimpan
    await ambilDataKelas();
    await tampilkanData();
    
    // Mengubah tampilan indikator loading
    LabelDownload.style.display = 'block';
    LoadingDownload.style.display = 'none';

  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    
    // Menyembunyikan indikator loading jika terjadi error
    LabelDownload.style.display = 'block';
    LoadingDownload.style.display = 'none';
  }
}


const urlLogin = 'https://script.google.com/macros/s/AKfycbwj1K6lkk5qU6BNPgIU1svQn8aqFQpZS8TvdxuigmkR37CunuZ-ataXIjPv0VnXs9M0/exec';

const url = 'https://script.google.com/macros/s/AKfycbx3y-MQIjhWvJN1t6qUdIjpQ6XhG-syYbI_pyI1TD85sgSFuQ5ghXu65nNLJW_0NaK8/exec';
const urlUWATA = 'https://script.google.com/macros/s/AKfycbwf3kFQ7rAgZf9g8gZDg6HpVE7lh8OKpeXtswAJ4nj-5rhublZbHwc5UJrf6v7fCSqbjA/exec';

// -------------------Post Data-------------------
/**
 * Mengirim data JSON menggunakan metode GET.
 * @param {Object} jsonData - Data JSON yang akan dikirim.
 * @returns {Promise<Object>} Respons JSON dari server.
 */
async function sendPostWithGet(jsonData) {

  if (jsonData.db && jsonData.db[0] && jsonData.db[0].IDS) {
    localStorage.setItem(jsonData.db[0].IDS, JSON.stringify(jsonData));
  } else if (jsonData.Asatidz && jsonData.Asatidz[0] && jsonData.Asatidz[0].IDS) {
    localStorage.setItem(jsonData.Asatidz[0].IDS, JSON.stringify(jsonData));
  }
  updateBadgeCount();

  try {
      // Cek koneksi internet
      if (!navigator.onLine) {
          throw new Error("Tidak ada koneksi internet.");
      }

      const encodedData = encodeData({
          action: "Post",
          json: JSON.stringify(jsonData)
      });

      const response = await fetch(`${urlLogin}?${encodedData}`, {
          method: "GET"
      });

      if (!response.ok) {
          throw new Error(`Respons jaringan tidak OK: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (jsonData.db && jsonData.db[0] && jsonData.db[0].IDS) {
        localStorage.removeItem(jsonData.db[0].IDS);
      } else if (jsonData.Asatidz && jsonData.Asatidz[0] && jsonData.Asatidz[0].IDS) {
        localStorage.removeItem(jsonData.Asatidz[0].IDS);
      }

      updateBadgeCount();
      updateModalContent();

      return data;
  } catch (error) {
      console.error("Kesalahan saat mengirim data:", error);
      throw error;
  }
}

function updateBadgeCount() {
  let count = 0;
  
  // Loop melalui semua item di localStorage
  for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      
      // Lewati key yang bernama 'IDS'
      if (key !== 'IDS') {
          count++;
      }
  }
  
  // Update angka dalam badge
  const badge = document.querySelector(".app-content-headerButton .badge");
  if (badge) {
      badge.textContent = count;
  }
}

// Panggil fungsi saat halaman dimuat
document.addEventListener("DOMContentLoaded", updateBadgeCount);

function updateBadgeCount() {
  let count = 0;
  
  // Loop melalui semua item di localStorage
  for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      
      // Lewati key yang bernama 'IDS'
      if (key !== 'IDS') {
          count++;
      }
  }
  
  // Update angka dalam badge
  const badge = document.querySelector(".app-content-headerButton .badge");
  const simpan = document.getElementById('SimpanSemuaLocal')
  

    if (badge) {
      badge.textContent = count;
      if (simpan) {
        simpan.disabled = count === 0;
      }
    }
  }


// Panggil fungsi saat halaman dimuat
document.addEventListener("DOMContentLoaded", updateBadgeCount);

function updateModalContent() {
  const modalBody = document.querySelector("#ModalNotifikasi .modal-body");
  if (!modalBody) return;

  let list = document.createElement("ul");
  list.classList.add("list-group");
  
  for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      
      // Lewati key yang bernama 'IDS'
      if (key !== 'IDS') {
          let listItem = document.createElement("li");
          listItem.classList.add("list-group-item");
          listItem.style.width = "auto";
          listItem.textContent = `${key}`;
          list.appendChild(listItem);
      }
  }
  
  modalBody.innerHTML = ""; // Hapus konten lama
  if (list.children.length === 0) {
    const paragraph = document.createElement("p");
    paragraph.textContent = "Proses simpan akan tampil di sini.";
    paragraph.style.fontSize = "small";
    modalBody.appendChild(paragraph);
  } else {
    modalBody.appendChild(list);
  }
}

// Tambahkan event listener agar fungsi dipanggil saat modal dibuka
document.querySelector("#ModalNotifikasi").addEventListener("show.bs.modal", updateModalContent);



async function simpanSemua() {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key !== 'IDS') {
        const jsonData = JSON.parse(localStorage.getItem(key));
        await sendPostWithGet(jsonData);
      }
    }
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
  }
}















/**
 * Fungsi untuk encode data ke URL-encoded format.
 * @param {Object} data - Data yang akan di-encode.
 * @returns {string} - Data dalam format URL-encoded.
 */
function encodeData(data) {
  return Object.keys(data)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
      .join("&");
}



//--------------------------------------------Belum dipakai --------------------------------------------


//https://script.google.com/macros/s/AKfycbx3y-MQIjhWvJN1t6qUdIjpQ6XhG-syYbI_pyI1TD85sgSFuQ5ghXu65nNLJW_0NaK8/exec
// -------------------Post Data-------------------
/**
 * Mengirim data JSON menggunakan metode POST.
 * @param {Object} jsonData - Data JSON yang akan dikirim.
 * @returns {Promise<Object>} Respons JSON dari server.
 */
async function sendPost(jsonData) {
  try {
    // Cek koneksi internet
    if (!navigator.onLine) {
      throw new Error("Tidak ada koneksi internet.");
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json' // Menyatakan bahwa data dikirim dalam format JSON
      },
      body: JSON.stringify({
        action: "Post",  // Menambahkan parameter action jika diperlukan di server
        json: jsonData   // Mengirimkan data JSON yang diberikan
      })
    });

    // Jika response tidak berhasil (status bukan 2xx)
    if (!response.ok) {
      throw new Error(`Respons jaringan tidak OK: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Kesalahan saat mengirim data:", error);
    throw error;
  }
}




async function buatIDS() {
  try {
    console.log("Memulai proses pembuatan ID...");
    
    const button = document.querySelector("[name='buatIDSbtn']");
    const spinner = document.getElementById("spinIDS");
    const statusText = document.getElementById("kontenIDS");
    const inputIDS = document.getElementById("IDS");
    
    if (!button || !spinner || !statusText || !inputIDS) {
      console.error("Elemen yang dibutuhkan tidak ditemukan!");
      return;
    }

    // Tampilkan loading
    button.disabled = true;
    spinner.style.display = "inline-block";
    statusText.textContent = "Membuat ID...";
    console.log("Loading ditampilkan");

    const genderSelect = document.getElementById("Gender");
    if (!genderSelect) {
      console.error("Elemen Gender tidak ditemukan!");
      return;
    }

    const genderValue = genderSelect.value.toLowerCase();
    const genderCode = genderValue === "laki-laki" ? "3" : "4";
    const idPrefix = genderCode + "46";
    console.log(`Gender: ${genderValue}, ID Awal: ${idPrefix}`);

    const admin = localStorage.getItem("Admin") || "Unknown";
    console.log(`Admin: ${admin}`);

    
    const jsonData = JSON.stringify({
      Asatidz: {
        ID: idPrefix,
        Admin: admin,
        Gender: genderValue
      }
    });
    
    const url = `https://script.google.com/macros/s/AKfycbwj1K6lkk5qU6BNPgIU1svQn8aqFQpZS8TvdxuigmkR37CunuZ-ataXIjPv0VnXs9M0/exec?action=buatIDS&json=${encodeURIComponent(jsonData)}`;
    
    console.log(`Memanggil API: ${url}`);

    const response = await fetch(url, { method: "GET" });
    console.log("Respon diterima dari server");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Data diterima:", data);

    if (data.Asatidz && data.Asatidz.IDS) {
      inputIDS.value = data.Asatidz.IDS;
      button.style.display = "none";
      console.log(`ID berhasil dibuat: ${data.Asatidz.IDS}`);
    } else {
      console.error("Gagal mendapatkan ID dari server");
    }
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
  } finally {
    // Sembunyikan loading
    const button = document.querySelector("[name='buatIDSbtn']");
    if (button) button.disabled = false;
    const spinner = document.getElementById("spinIDS");
    if (spinner) spinner.style.display = "none";
    const statusText = document.getElementById("kontenIDS");
    if (statusText) statusText.textContent = "Buat ID";
    console.log("Proses selesai, loading disembunyikan");
  }
}