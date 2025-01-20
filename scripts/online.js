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
    const data = await GetData(url, filters);
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


const url = 'https://script.google.com/macros/s/AKfycbx3y-MQIjhWvJN1t6qUdIjpQ6XhG-syYbI_pyI1TD85sgSFuQ5ghXu65nNLJW_0NaK8/exec';
const urlUWATA = 'https://script.google.com/macros/s/AKfycbwf3kFQ7rAgZf9g8gZDg6HpVE7lh8OKpeXtswAJ4nj-5rhublZbHwc5UJrf6v7fCSqbjA/exec';

// -------------------Post Data-------------------
/**
 * Mengirim data JSON menggunakan metode GET.
 * @param {Object} jsonData - Data JSON yang akan dikirim.
 * @returns {Promise<Object>} Respons JSON dari server.
 */
async function sendPostWithGet(jsonData) {
  try {
      // Cek koneksi internet
      if (!navigator.onLine) {
          throw new Error("Tidak ada koneksi internet.");
      }

      const encodedData = encodeData({
          action: "Post",
          json: JSON.stringify(jsonData)
      });

      const response = await fetch(`${url}?${encodedData}`, {
          method: "GET"
      });

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
