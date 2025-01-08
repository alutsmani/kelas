async function simpan() {
    const jsonData = BuatJson('db', 'formData');
    console.log(jsonData);
    const dbName = 'Santri'; // Nama database
    const storeName = 'db'; // Nama tabel (object store)
  
    try {
      const result = await saveOrUpdateData(dbName, storeName, jsonData);
      console.log(result);
      tampilkanData();
      document.getElementById('offcanvasBottom').classList.remove('show'); document.getElementById('offcanvasBottom').dispatchEvent(new Event('hide.bs.offcanvas'));
    } catch (error) {
      console.error(error);
    }

    try {
      const response = await sendPostWithGet(jsonData);
      console.log("Respons dari server:", response);
    } catch (error) {
        console.error("Kesalahan saat memproses data:", error);
    }
}

