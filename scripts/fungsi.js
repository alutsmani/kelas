// Fungsi untuk menambah row baru
function addProductRow(ids, nama, kelas, status, ikhtibar, kamar, imageUrl) {
    // Ambil elemen container row
    const productsArea = document.querySelector('.products-area-wrapper');

    // Buat elemen row baru
    const newRow = document.createElement('div');
    newRow.classList.add('products-row');

    // Isi HTML untuk row baru
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
        <div class="product-cell price"><span class="cell-label">Nama:</span>${nama}</div>
        <div class="product-cell category"><span class="cell-label">Kelas:</span>${kelas}</div>
        <div class="product-cell status-cell">
          <span class="cell-label">Status:</span>
          <span class="status ${status === 'Lunas' ? 'active' : 'disabled'}">${status}</span>
        </div>
        <div class="product-cell sales"><span class="cell-label">Ikhtibar:</span>${ikhtibar}</div>
        <div class="product-cell stock"><span class="cell-label">Kamar:</span>${kamar}</div>
    `;

    // Tambahkan row baru ke dalam container
    productsArea.appendChild(newRow);
}

function Buat() {
    const ids = '1234567';
    const nama = '';
    const kelas = '';
    const status = '';
    const ikhtibar = '';
    const kamar ='';

    const imageUrl = ids.startsWith('1') ? '/gambar/iconlk.webp' : '/gambar/iconpr.webp';
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
