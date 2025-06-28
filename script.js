// ===================================================================
//              MASUKKAN URL SUPER FINAL ANDA DI SINI
// ===================================================================

const scriptURL = 'MASUKKAN_URL_HASIL_DEPLOYMENT_TERAKHIR_ANDA_DI_SINI';

// ===================================================================
//          DATA ANGGOTA (Sudah diisi sesuai data Anda)
// ===================================================================

const dataAnggota = {
    "Anisatul": ["Anisatul1.jpg", "Anisatul2.jpg"],
    "Dimas": ["Dimas1.jpg", "Dimas2.jpg", "Dimas3.jpg"],
    "Elhes": ["Elhes1.jpg", "Elhes2.jpg"],
    "Elsa": ["Elsa1.jpg", "Elsa2.jpg", "Elsa3.jpg"],
    "Fenny": ["Fenny1.jpg", "Fenny2.jpg"],
    "Haliza": ["Haliza1.jpg", "Haliza2.jpg", "Haliza3.jpg", "Haliza4.jpg"],
    "Hany": ["Hany1.jpg", "Hany2.jpg", "Hany3.jpg"],
    "Herdy": ["Herdy1.jpg", "Herdy2.jpg"],
    "Iid": ["iid1.jpg", "iid2.jpg"],
    "Ikhsan": ["Ikhsan1.jpg", "Ikhsan2.jpg"],
    "Intan": ["intan1.jpg", "Intan2.jpg", "Intan3.jpg"],
    "Muji": ["Muji1.jpg", "Muji2.jpg"],
    "Muthia": ["Muthia1.jpg", "Muthia2.jpg"],
    "Putri": ["Putri1.jpg", "Putri2.jpg"],
    "Risma": ["Risma1.jpg", "Risma2.jpg"],
    "Salam": ["Salam1.jpg", "Salam2.jpg"]
};

// ===================================================================
//             BAGIAN LOGIKA WEB (TIDAK PERLU DIEDIT)
// ===================================================================

document.addEventListener('DOMContentLoaded', function() {
    const halamanNama = document.getElementById('halaman-nama');
    const halamanFoto = document.getElementById('halaman-foto');
    const halamanTerimaKasih = document.getElementById('halaman-terima-kasih');
    const daftarNamaContainer = document.querySelector('.daftar-nama');
    const galeriPilihan = document.getElementById('galeri-pilihan');
    const namaTerpilihSpan = document.getElementById('nama-terpilih');
    const form = document.forms['submit-to-google-sheet'];
    const inputNama = document.getElementById('form-nama');
    const inputPilihanFoto = document.getElementById('form-pilihan-foto');
    const tombolKirim = document.getElementById('tombol-kirim');

    // (Kode dari baris 1-5 sama persis, tidak perlu ditampilkan ulang)
    for (const nama in dataAnggota) { if (Object.hasOwnProperty.call(dataAnggota, nama)) { const button = document.createElement('button'); button.textContent = nama; button.dataset.nama = nama; daftarNamaContainer.appendChild(button); } }
    daftarNamaContainer.addEventListener('click', function(e) { if (e.target.tagName === 'BUTTON') { const nama = e.target.dataset.nama; tampilkanHalamanFoto(nama); } });
    function tampilkanHalamanFoto(nama) { galeriPilihan.innerHTML = ''; inputPilihanFoto.value = ''; tombolKirim.disabled = true; namaTerpilihSpan.textContent = `Memilih untuk: ${nama}`; inputNama.value = nama; const fotoList = dataAnggota[nama]; fotoList.forEach(fileFoto => { const item = document.createElement('div'); item.className = 'item-foto'; item.dataset.filename = fileFoto; item.innerHTML = `<img src="images/${fileFoto}" alt="Pilihan foto untuk ${nama}">`; galeriPilihan.appendChild(item); }); halamanNama.classList.add('hidden'); halamanFoto.classList.remove('hidden'); }
    galeriPilihan.addEventListener('click', function(e) { const targetItem = e.target.closest('.item-foto'); if (!targetItem) return; const selectedItems = galeriPilihan.querySelectorAll('.item-foto.selected'); selectedItems.forEach(el => el.classList.remove('selected')); targetItem.classList.add('selected'); inputPilihanFoto.value = targetItem.dataset.filename; tombolKirim.disabled = false; });
    document.getElementById('tombol-kembali').addEventListener('click', function() { halamanFoto.classList.add('hidden'); halamanNama.classList.remove('hidden'); });

    // --- BAGIAN FETCH YANG DIPERBARUI ---
    form.addEventListener('submit', e => {
        e.preventDefault();
        tombolKirim.disabled = true;
        tombolKirim.textContent = 'Mengirim...';

        fetch(scriptURL, { method: 'POST', body: new FormData(form)})
            .then(response => {
                if (response.ok && !response.redirected) {
                    return response.text(); // Minta respons sebagai teks biasa
                } else {
                    // Jika masih redirect, lempar error
                    throw new Error(`Server merespons dengan status ${response.status}. Cek deployment Apps Script.`);
                }
            })
            .then(text => {
                console.log('Respon dari server:', text);
                if (text.trim() === "SUCCESS") {
                    // Jika server balas SUCCESS, tampilkan halaman terima kasih
                    halamanFoto.classList.add('hidden');
                    halamanTerimaKasih.classList.remove('hidden');
                } else {
                    // Jika server balas ERROR, lempar error
                    throw new Error('Server Apps Script melaporkan error: ' + text);
                }
            })
            .catch(error => {
                console.error('Error!', error.message);
                alert("Gagal mengirim data. Cek console untuk detail.");
                tombolKirim.disabled = false;
                tombolKirim.textContent = 'Kirim Pilihanku';
            });
    });
    // ------------------------------------

    document.getElementById('tombol-selesai').addEventListener('click', function() { tombolKirim.textContent = 'Kirim Pilihanku'; halamanTerimaKasih.classList.add('hidden'); halamanNama.classList.remove('hidden'); const namaYangSudahPilih = inputNama.value; const tombolNama = daftarNamaContainer.querySelector(`button[data-nama="${namaYangSudahPilih}"]`); if(tombolNama) tombolNama.style.display = 'none'; });
});