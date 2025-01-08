function addProductRow(ids, nama, kelas, status, ikhtibar, kamar, imageUrl) {
    const productsArea = document.querySelector('.products-area-wrapper');
    const newRow = document.createElement('div');
    newRow.classList.add('products-row');

    newRow.innerHTML = `
        <button class="cell-more-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-vertical">
            <circle cx="12" cy="12" r="1"/>
            <circle cx="12" cy="5" r="1"/>
            <circle cx="12" cy="19" r="1"/>
          </svg>
        </button>
        <div class="product-cell image">
          <img src="${imageUrl}" alt="product">
          <span>${ids}</span>
        </div>
        <div class="product-cell price"><span class="cell-label">Nama:</span>${nama || '-'}</div>
        <div class="product-cell category"><span class="cell-label">Kelas:</span>${kelas || '-'}</div>
        <div class="product-cell status-cell">
          <span class="cell-label">Status:</span>
          <span class="status disabled">Belum</span>
        </div>
        <div class="product-cell sales"><span class="cell-label">Ikhtibar:</span>0</div>
        <div class="product-cell stock"><span class="cell-label">Kamar:</span>${kamar || '-'}</div>
    `;

    newRow.addEventListener('click', () => {
        SelectDiniyah();
        SelectFormal();
      
        MasukkanData('Santri', 'db', ids, 'formData');
        
        var offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasBottom'));
        offcanvas.show();
      
    });

    productsArea.appendChild(newRow);
}

function addHeader() {
    const productsArea = document.querySelector('.products-area-wrapper');
    const newRow = document.createElement('div');
    newRow.classList.add('products-header');

    newRow.innerHTML = `
        <div class="product-cell image">
          IDS
          <button class="sort-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512"><path fill="currentColor" d="M496.1 138.3L375.7 17.9c-7.9-7.9-20.6-7.9-28.5 0L226.9 138.3c-7.9 7.9-7.9 20.6 0 28.5 7.9 7.9 20.6 7.9 28.5 0l85.7-85.7v352.8c0 11.3 9.1 20.4 20.4 20.4 11.3 0 20.4-9.1 20.4-20.4V81.1l85.7 85.7c7.9 7.9 20.6 7.9 28.5 0 7.9-7.8 7.9-20.6 0-28.5zM287.1 347.2c-7.9-7.9-20.6-7.9-28.5 0l-85.7 85.7V80.1c0-11.3-9.1-20.4-20.4-20.4-11.3 0-20.4 9.1-20.4 20.4v352.8l-85.7-85.7c-7.9-7.9-20.6-7.9-28.5 0-7.9 7.9-7.9 20.6 0 28.5l120.4 120.4c7.9 7.9 20.6 7.9 28.5 0l120.4-120.4c7.8-7.9 7.8-20.7-.1-28.5z"/></svg>
          </button>
        </div>
        <div class="product-cell price">Nama<button class="sort-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512"><path fill="currentColor" d="M496.1 138.3L375.7 17.9c-7.9-7.9-20.6-7.9-28.5 0L226.9 138.3c-7.9 7.9-7.9 20.6 0 28.5 7.9 7.9 20.6 7.9 28.5 0l85.7-85.7v352.8c0 11.3 9.1 20.4 20.4 20.4 11.3 0 20.4-9.1 20.4-20.4V81.1l85.7 85.7c7.9 7.9 20.6 7.9 28.5 0 7.9-7.8 7.9-20.6 0-28.5zM287.1 347.2c-7.9-7.9-20.6-7.9-28.5 0l-85.7 85.7V80.1c0-11.3-9.1-20.4-20.4-20.4-11.3 0-20.4 9.1-20.4 20.4v352.8l-85.7-85.7c-7.9-7.9-20.6-7.9-28.5 0-7.9 7.9-7.9 20.6 0 28.5l120.4 120.4c7.9 7.9 20.6 7.9 28.5 0l120.4-120.4c7.8-7.9 7.8-20.7-.1-28.5z"/></svg>
        </button></div>
        <div class="product-cell category">Kelas<button class="sort-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512"><path fill="currentColor" d="M496.1 138.3L375.7 17.9c-7.9-7.9-20.6-7.9-28.5 0L226.9 138.3c-7.9 7.9-7.9 20.6 0 28.5 7.9 7.9 20.6 7.9 28.5 0l85.7-85.7v352.8c0 11.3 9.1 20.4 20.4 20.4 11.3 0 20.4-9.1 20.4-20.4V81.1l85.7 85.7c7.9 7.9 20.6 7.9 28.5 0 7.9-7.8 7.9-20.6 0-28.5zM287.1 347.2c-7.9-7.9-20.6-7.9-28.5 0l-85.7 85.7V80.1c0-11.3-9.1-20.4-20.4-20.4-11.3 0-20.4 9.1-20.4 20.4v352.8l-85.7-85.7c-7.9-7.9-20.6-7.9-28.5 0-7.9 7.9-7.9 20.6 0 28.5l120.4 120.4c7.9 7.9 20.6 7.9 28.5 0l120.4-120.4c7.8-7.9 7.8-20.7-.1-28.5z"/></svg>
          </button></div>
        <div class="product-cell status-cell">Status<button class="sort-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512"><path fill="currentColor" d="M496.1 138.3L375.7 17.9c-7.9-7.9-20.6-7.9-28.5 0L226.9 138.3c-7.9 7.9-7.9 20.6 0 28.5 7.9 7.9 20.6 7.9 28.5 0l85.7-85.7v352.8c0 11.3 9.1 20.4 20.4 20.4 11.3 0 20.4-9.1 20.4-20.4V81.1l85.7 85.7c7.9 7.9 20.6 7.9 28.5 0 7.9-7.8 7.9-20.6 0-28.5zM287.1 347.2c-7.9-7.9-20.6-7.9-28.5 0l-85.7 85.7V80.1c0-11.3-9.1-20.4-20.4-20.4-11.3 0-20.4 9.1-20.4 20.4v352.8l-85.7-85.7c-7.9-7.9-20.6-7.9-28.5 0-7.9 7.9-7.9 20.6 0 28.5l120.4 120.4c7.9 7.9 20.6 7.9 28.5 0l120.4-120.4c7.8-7.9 7.8-20.7-.1-28.5z"/></svg>
          </button></div>
        <div class="product-cell sales">Price<button class="sort-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512"><path fill="currentColor" d="M496.1 138.3L375.7 17.9c-7.9-7.9-20.6-7.9-28.5 0L226.9 138.3c-7.9 7.9-7.9 20.6 0 28.5 7.9 7.9 20.6 7.9 28.5 0l85.7-85.7v352.8c0 11.3 9.1 20.4 20.4 20.4 11.3 0 20.4-9.1 20.4-20.4V81.1l85.7 85.7c7.9 7.9 20.6 7.9 28.5 0 7.9-7.8 7.9-20.6 0-28.5zM287.1 347.2c-7.9-7.9-20.6-7.9-28.5 0l-85.7 85.7V80.1c0-11.3-9.1-20.4-20.4-20.4-11.3 0-20.4 9.1-20.4 20.4v352.8l-85.7-85.7c-7.9-7.9-20.6-7.9-28.5 0-7.9 7.9-7.9 20.6 0 28.5l120.4 120.4c7.9 7.9 20.6 7.9 28.5 0l120.4-120.4c7.8-7.9 7.8-20.7-.1-28.5z"/></svg>
          </button></div>
        <div class="product-cell stock">Kamar<button class="sort-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512"><path fill="currentColor" d="M496.1 138.3L375.7 17.9c-7.9-7.9-20.6-7.9-28.5 0L226.9 138.3c-7.9 7.9-7.9 20.6 0 28.5 7.9 7.9 20.6 7.9 28.5 0l85.7-85.7v352.8c0 11.3 9.1 20.4 20.4 20.4 11.3 0 20.4-9.1 20.4-20.4V81.1l85.7 85.7c7.9 7.9 20.6 7.9 28.5 0 7.9-7.8 7.9-20.6 0-28.5zM287.1 347.2c-7.9-7.9-20.6-7.9-28.5 0l-85.7 85.7V80.1c0-11.3-9.1-20.4-20.4-20.4-11.3 0-20.4 9.1-20.4 20.4v352.8l-85.7-85.7c-7.9-7.9-20.6-7.9-28.5 0-7.9 7.9-7.9 20.6 0 28.5l120.4 120.4c7.9 7.9 20.6 7.9 28.5 0l120.4-120.4c7.8-7.9 7.8-20.7-.1-28.5z"/></svg>
          </button></div>
      
    `;


    productsArea.appendChild(newRow);
}


function Buat() {

  moveHtmlContent('./form/biodata.html', 'offcanvasBottom', 'TempatEdit');

    const ids = '1234567';
    const nama = '';
    const kelas = '';
    const status = '';
    const ikhtibar = '';
    const kamar ='';

    const imageUrl = ids.startsWith('1') ? '.../gambar/iconlk.webp' : '.../gambar/iconpr.webp';
    addProductRow(
        ids, 
        nama, 
        kelas, 
        status, 
        ikhtibar, 
        kamar, 
        imageUrl
    )
};


function moveHtmlContent(sourceUrl, sourceDivId, targetDivId) {
  // Ambil elemen target di mana konten akan dipindahkan
  const targetDiv = document.getElementById(targetDivId);
  if (!targetDiv) {
      console.error(`Target div dengan ID ${targetDivId} tidak ditemukan.`);
      return;
  }

  // Fetch HTML dari URL yang diberikan
  fetch(sourceUrl)
      .then(response => {
          if (!response.ok) {
              throw new Error(`Gagal memuat halaman: ${response.statusText}`);
          }
          return response.text();
      })
      .then(htmlText => {
          // Buat elemen dummy untuk memparsing HTML yang diambil
          const parser = new DOMParser();
          const htmlDocument = parser.parseFromString(htmlText, 'text/html');
          const sourceDiv = htmlDocument.getElementById(sourceDivId);

          // Pastikan sourceDiv ditemukan
          if (!sourceDiv) {
              console.error(`Div dengan ID ${sourceDivId} tidak ditemukan di halaman sumber.`);
              return;
          }

          // Pindahkan isi dari sourceDiv (.modal-content) ke target modal di index.html
          const targetContent = targetDiv.querySelector('.modal-content');
          if (targetContent) {
              targetContent.innerHTML = sourceDiv.innerHTML;
          } else {
              console.error('Target modal tidak memiliki elemen .modal-content.');
          }
      })
      .catch(error => {
          console.error('Error saat memindahkan konten:', error);
      });
}

function BuatJson(header, idForm) {
    // Ambil elemen form berdasarkan ID
    const form = document.getElementById(idForm);
    if (!form) {
        console.error(`Form dengan ID "${idForm}" tidak ditemukan.`);
        return null;
    }

    // Inisialisasi objek JSON
    const jsonResult = {};
    jsonResult[header] = []; // Tambahkan array untuk menyimpan data objek

    // Buat objek untuk satu set data berdasarkan input form
    const formData = {};

    // Iterasi semua elemen input dan select dalam form
    const elements = form.querySelectorAll('input, select');
    elements.forEach((el) => {
        const key = el.id; // Gunakan ID sebagai header
        const value = el.value; // Ambil nilai dari input atau select

        if (key) {
            formData[key] = value || ""; // Jika nilai kosong, isi dengan string kosong
        }
    });

    // Tambahkan objek hasil form ke dalam array
    jsonResult[header].push(formData);

    return jsonResult;
}


function generateJSON(keyName) {
  // Validasi keyName harus diberikan
  if (!keyName || typeof keyName !== "string") {
      console.error("Key JSON harus berupa string yang valid!");
      return null;
  }

  // Ambil elemen-elemen dari div dengan id "cardEdit"
  const cardEdit = document.getElementById("offcanvasBottom");
  const inputs = cardEdit.querySelectorAll("input, select");
  
  // Objek yang akan menjadi hasil akhir
  let rowData = {};
  
  // Iterasi melalui semua input dan select
  inputs.forEach(input => {
      const key = input.id; // Menggunakan ID sebagai header
      const value = input.value; // Mengambil nilai dari input atau select
      rowData[key] = value; // Memasukkan ke objek
  });

  // Format JSON sesuai dengan keyName
  const jsonData = {
      [keyName]: [rowData]
  };

  console.log(jsonData); // Untuk debugging

  return JSON.stringify(jsonData); // Kembalikan JSON dalam bentuk string

}





//--------------------------------------- Fungsi Tampilkan / Sembunyikan dan tampilan teks header ----------------------------------------------
function Tampilkan(id) {
  const elem = document.getElementById(id);
  if (elem) {
      elem.classList.remove('fade-out');
      elem.classList.add('fade-in');
      elem.style.display = "block"; // Tampilkan elemen
  } else {
      console.error(`Elemen dengan id "${id}" tidak ditemukan.`);
  }
}

function Sembunyikan(id, callback) {
  const elem = document.getElementById(id);
  if (elem) {
      elem.classList.remove('fade-in');
      elem.classList.add('fade-out');
      setTimeout(() => {
          elem.style.display = "none"; // Sembunyikan elemen sepenuhnya setelah animasi selesai
          if (callback) {
              callback(); // Panggil callback setelah selesai disembunyikan
          }
      }, 800); // Sesuaikan waktu sesuai durasi animasi (800ms)
  } else {
      console.error(`Elemen dengan id "${id}" tidak ditemukan.`);
  }
}



function ComboDiniyah(diniyahElement, kelasElement, kelElement) {
  // Clear existing options

  kelasElement.innerHTML = "";
  kelElement.innerHTML = "";

  // Add "All" option for kelasElement
  const allOptionKelas = document.createElement("option");
  allOptionKelas.value = "";
  allOptionKelas.textContent = "-";
  kelasElement.appendChild(allOptionKelas);

  // Add "All" option for kelElement
  const allOptionKel = document.createElement("option");
  allOptionKel.value = "";
  allOptionKel.textContent = "-";
  kelElement.appendChild(allOptionKel);

  const diniyah = diniyahElement.value.toUpperCase();

  if (diniyah === "ISTI'DADIYAH") {
      // Add option 0 to kelasElement
      const option = document.createElement("option");
      option.value = 0;
      option.textContent = 0;
      kelasElement.appendChild(option);

      // Add custom options for kelElement
      const kelOptions = ["A", "B", "C1", "C2", "C3", "D", "E", "F1", "F2", "F3"];
      kelOptions.forEach(item => {
          const option = document.createElement("option");
          option.value = item;
          option.textContent = item;
          kelElement.appendChild(option);
      });
  } else if (diniyah === "ULA") {
      diniyahElement.value = "Ula";
      for (let i = 1; i <= 6; i++) {
          const option = document.createElement("option");
          option.value = i;
          option.textContent = i;
          kelasElement.appendChild(option);
      }
  } else if (diniyah === "WUSTHA") {
      diniyahElement.value = "Wustha";
      for (let i = 1; i <= 3; i++) {
          const option = document.createElement("option");
          option.value = i;
          option.textContent = i;
          kelasElement.appendChild(option);
      }
  } else if (diniyah === "ULYA") {
      diniyahElement.value = "Ulya";
      for (let i = 1; i <= 3; i++) {
          const option = document.createElement("option");
          option.value = i;
          option.textContent = i;
          kelasElement.appendChild(option);
      }
  } else if (diniyah === "GURU TUGAS") {
      diniyahElement.value = "Guru Tugas";
      ["Pertama", "Kedua"].forEach(item => {
          const option = document.createElement("option");
          option.value = item;
          option.textContent = item;
          kelasElement.appendChild(option);
      });
  } else if (diniyah === "TIDAK SEKOLAH") {
      diniyahElement.value = "Tidak Sekolah";
      kelasElement.innerHTML = ""; // Clear kelas
      kelElement.innerHTML = ""; // Clear kel
      // Add "All" options back for Tidak Sekolah
      kelasElement.appendChild(allOptionKelas.cloneNode(true));
      kelElement.appendChild(allOptionKel.cloneNode(true));
      return;
  }

  // Add default options A-U for "Kel" if not "ISTI'DADIYAH"
  if (diniyah !== "ISTI'DADIYAH") {
      for (let i = 65; i <= 85; i++) {
          const option = document.createElement("option");
          option.value = String.fromCharCode(i);
          option.textContent = String.fromCharCode(i);
          kelElement.appendChild(option);
      }
  }
}



function ComboFormal(Formal, Kelas, Kel) {
  // Jika parameter clear bernilai true, kosongkan Kelas dan Kel

  Kelas.innerHTML = "";
  Kel.innerHTML = "";


  // Menambahkan opsi "All" untuk Kelas jika kosong

  const allOptionKelas = document.createElement("option");
  allOptionKelas.value = "";
  allOptionKelas.textContent = "-";
  Kelas.appendChild(allOptionKelas);


  // Menentukan opsi berdasarkan nilai Formal
  if (Formal.toUpperCase() === "PAUD") {
    const option = document.createElement("option");
    option.value = 0;
    option.textContent = "0";
    Kelas.appendChild(option);
  } else if (Formal.toUpperCase() === "MTS") {
    Formal = "MTs";
    ["VII", "VIII", "IX"].forEach(level => {
      const option = document.createElement("option");
      option.value = level;
      option.textContent = level;
      Kelas.appendChild(option);
    });
  } else if (Formal.toUpperCase() === "SMP") {
    ["VII", "VIII", "IX"].forEach(level => {
      const option = document.createElement("option");
      option.value = level;
      option.textContent = level;
      Kelas.appendChild(option);
    });
  } else if (Formal.toUpperCase() === "SMAI") {
    ["X", "XI", "XII"].forEach(level => {
      const option = document.createElement("option");
      option.value = level;
      option.textContent = level;
      Kelas.appendChild(option);
    });
  } else if (Formal.toUpperCase() === "STAI") {
    ["MPI", "ES"].forEach(level => {
      const option = document.createElement("option");
      option.value = level;
      option.textContent = level;
      Kelas.appendChild(option);
    });
  } else if (Formal === "Tidak Sekolah") {
      Kelas.innerHTML = "";
      Kel.innerHTML = "";
    return;
  }

  // Menambahkan opsi "All" untuk Kel jika kosong

    const allOptionKel = document.createElement("option");
    allOptionKel.value = "";
    allOptionKel.textContent = "-";
    Kel.appendChild(allOptionKel);


  // Menentukan opsi untuk Kel berdasarkan nilai Formal
  if (Formal.toUpperCase() === "PAUD") {
    ["Besar", "Kecil"].forEach(group => {
      const option = document.createElement("option");
      option.value = group;
      option.textContent = group;
      Kel.appendChild(option);
    });
  } else if (Formal.toUpperCase() === "MTS" || Formal.toUpperCase() === "SMP") {
    for (let i = 65; i <= 75; i++) {
      const option = document.createElement("option");
      option.value = String.fromCharCode(i);
      option.textContent = String.fromCharCode(i);
      Kel.appendChild(option);
    }
  } else if (Formal.toUpperCase() === "SMAI") {
    for (let i = 1; i <= 10; i++) {
      ["IPS", "IPA"].forEach(group => {
        const option = document.createElement("option");
        option.value = `${group} ${i}`;
        option.textContent = `${group} ${i}`;
        Kel.appendChild(option);
      });
    }
  } else if (Formal.toUpperCase() === "STAI") {
    for (let i = 1; i <= 8; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = i;
      Kel.appendChild(option);
    }
  }
}

