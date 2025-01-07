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
  
function GetContoh() {
    // Contoh penggunaan
   const filters = { db: { IDS: '1430235' } }; // Kriteria filter
    
    GetData(url, filters).then(data => {
        console.log(data); // Data JSON yang sudah difilter
        saveDataToIndexedDB(data);
    })
    
};


const url = 'https://script.google.com/macros/s/AKfycbx3y-MQIjhWvJN1t6qUdIjpQ6XhG-syYbI_pyI1TD85sgSFuQ5ghXu65nNLJW_0NaK8/exec';
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