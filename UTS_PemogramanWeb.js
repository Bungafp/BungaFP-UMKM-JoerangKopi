const themeToggleBtn = document.getElementById('Theme-toggle');

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            themeToggleBtn.textContent = 'Mode Terang';
        } else {
            themeToggleBtn.textContent = 'Mode Gelap';
        }
    });
}


const filterKategori = document.getElementById('filterKategori');
const barisMenu = document.querySelectorAll('#tabelmenu tbody tr');

if (filterKategori) {
    filterKategori.addEventListener('change', () => {
        const pilih = filterKategori.value;

        barisMenu.forEach(baris => {
            const kategori = baris.getAttribute('data-kategori');
            
            if (pilih === 'semua' || kategori === pilih) {
                baris.style.display = '';
            } else {
                baris.style.display = 'none';
            }
        });
    });
}

let keranjang = [];

const btnTambah = document.getElementById('btnTambahItem');
const listPesanan = document.getElementById('ListPesanan');
const formOrder = document.getElementById('order-form');
const hasilOrder = document.getElementById('order-result');

if (btnTambah) {
    btnTambah.addEventListener('click', () => {
        
        const itemPilih = document.getElementById('pilihitem').value;
        const jumlah = parseInt(document.getElementById('JumlahPorsi').value);

        if (!itemPilih || jumlah < 1) {
            alert('Pilih menu dan masukkan jumlah porsi dengan benar!');
            return;
        }

        const dataItem = itemPilih.split('|');
        const harga = parseInt(dataItem[0]);
        const namaItem = dataItem[1];
        const subtotal = harga * jumlah;

        keranjang.push({ namaItem, harga, jumlah, subtotal });


        document.getElementById('pilihitem').value = '';
        document.getElementById('JumlahPorsi').value = 1;

        tampilkanKeranjang();
    });
}

function tampilkanKeranjang() {
    listPesanan.innerHTML = '';
    
    if (keranjang.length === 0) {
        listPesanan.innerHTML = '<li class="empty-list">Belum ada item yang ditambahkan</li>';
        return;
    }

    keranjang.forEach((item, i) => {
        listPesanan.innerHTML += `
            <li>
                ${item.namaItem} (${item.jumlah}x) - Rp ${item.subtotal.toLocaleString('id-ID')}
                <button type="button" onclick="hapusItem(${i})">Hapus</button>
            </li>
        `;
    });
}

function hapusItem(index) {
    keranjang.splice(index, 1);
    tampilkanKeranjang();
}

if (formOrder) {
    formOrder.addEventListener('submit', (e) => {
        e.preventDefault();

        const nama = document.getElementById('namaPemesan').value;

        if (keranjang.length === 0) {
            alert('Keranjang masih kosong!');
            return;
        }

        let totalDasar = 0;
        for (let i = 0; i < keranjang.length; i++) {
            totalDasar += keranjang[i].subtotal;
        }

        const pajak = totalDasar * 0.10;
        let orderFee = totalDasar < 25000 ? 5000 : 0;
        const totalBayar = totalDasar + pajak + orderFee;

        hasilOrder.style.display = 'block';
        hasilOrder.innerHTML = `
            <strong>Nama Pemesan:</strong> ${nama} <br>
            <strong>Total Harga:</strong> Rp ${totalDasar.toLocaleString('id-ID')} <br>
            <strong>Pajak (10%):</strong> Rp ${pajak.toLocaleString('id-ID')} <br>
            ${orderFee > 0 ? `<strong>Biaya Antar:</strong> Rp ${orderFee.toLocaleString('id-ID')} <br>` : ''}
            <hr>
            <strong>Total Bayar: Rp ${totalBayar.toLocaleString('id-ID')}</strong>
        `;

        keranjang = [];
        tampilkanKeranjang();
        formOrder.reset();
    });
}
