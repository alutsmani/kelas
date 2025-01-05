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
    const url = 'https://script.google.com/macros/s/AKfycbxf26iilWfyB7wXpjt_XKQPlmTcSupu1lkgXnLrgvciZDQ5UvBnLD27z5bcTJ7Dtewe/exec';
    const filters = { db: { StatusSantri: 'Tugas' } }; // Kriteria filter
    
    GetData(url, filters).then(data => {
        console.log(data); // Data JSON yang sudah difilter
        saveDataToIndexedDB(data);
    })
    
};