function countMukimSantri(storeName, header, menghitung) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("Santri");
        
        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(storeName, "readonly");
            const store = transaction.objectStore(storeName);
            const requestCursor = store.openCursor();
            
            let count = 0;
            requestCursor.onsuccess = function(event) {
                const cursor = event.target.result;
                if (cursor) {
                    if (cursor.value[header].includes(menghitung)) {
                        count++;
                    }
                    cursor.continue();
                } else {
                    resolve(count);
                }
            };
            
            requestCursor.onerror = function() {
                reject("Error accessing IndexedDB");
            };
        };
        
        request.onerror = function() {
            reject("Failed to open database");
        };
    });
}

function countSantri(storeName, filters) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("Santri");
        
        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(storeName, "readonly");
            const store = transaction.objectStore(storeName);
            const requestCursor = store.openCursor();
            
            let count = 0;
            requestCursor.onsuccess = function(event) {
                const cursor = event.target.result;
                if (cursor) {
                    let match = true;
                    for (const key in filters) {
                        if (!cursor.value[key] || !cursor.value[key].includes(filters[key])) {
                            match = false;
                            break;
                        }
                    }
                    if (match) count++;
                    cursor.continue();
                } else {
                    resolve(count);
                }
            };
            
            requestCursor.onerror = function() {
                reject("Error accessing IndexedDB");
            };
        };
        
        request.onerror = function() {
            reject("Failed to open database");
        };
    });
}



function HitungSemua() {
    countSantri('db', { StatusSantri: "" }).then(count => {
        console.log("Jumlah Santri Mukim:", count);
        document.getElementById('totalSantri').value = count
    }).catch(error => {
        console.error(error);
    });

    countSantri('db', { StatusSantri: "ukim" }).then(count => {
        console.log("Jumlah Santri Mukim:", count);
        document.getElementById('mukim').value = count
    }).catch(error => {
        console.error(error);
    });

    countSantri('db', { StatusSantri: "horiji" }).then(count => {
        console.log("Jumlah Santri Mukim:", count);
        document.getElementById('khoriji').value = count
    }).catch(error => {
        console.error(error);
    });

    countSantri('db', { StatusSantri: "oyong" }).then(count => {

        document.getElementById('boyong').value = count
    }).catch(error => {
        console.error(error);
    });

    countSantri('db', { StatusSantri: "uru" }).then(count => {
        document.getElementById('gurutugas').value = count
    }).catch(error => {
        console.error(error);
    });
}

document.getElementById('filterDiniyah').addEventListener('change', HitungDataKelas);
document.getElementById('filterKelas').addEventListener('change', HitungDataKelas);
document.getElementById('filterKel').addEventListener('change', HitungDataKelas);

function HitungDataKelas() {
    const diniyah = document.getElementById('filterDiniyah').value;
    const kelas = document.getElementById('filterKelas').value;
    const kel = document.getElementById('filterKel').value;

    countSantri('db', { Diniyah: diniyah, KelasMD: kelas, KelMD: kel }).then(count => {
        document.getElementById('jumlahmurid').value = count
    }).catch(error => {
        console.error(error);
    });
}