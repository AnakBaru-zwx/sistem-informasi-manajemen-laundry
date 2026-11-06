const API_URL = "http://localhost:3000/api/pesanan";

async function tampilkanPesanan() {
    try {
        const response = await fetch(API_URL);
        const hasil = await response.json();

        const tabel = document.getElementById("tabelPesanan");

        tabel.innerHTML = "";

        hasil.data.forEach(function(item) {
            tabel.innerHTML += `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.nama_pelanggan}</td>
                    <td>${item.no_hp}</td>
                    <td>${item.berat}</td>
                    <td>Rp ${Number(item.harga_per_kg).toLocaleString("id-ID")}</td>
                    <td>Rp ${Number(item.total_harga).toLocaleString("id-ID")}</td>
                    <td>${item.status_pengerjaan}</td>
                    <td>${item.status_pembayaran}</td>
                    <td>${item.status_pengerjaan === "Menunggu"
                        ? `<button class="btn-mulai" data-id="${item.id}">
                            Mulai Proses
                            </button>`
                            : item.status_pengerjaan === "Diproses"
                            ? `<button class="btn-selesai" data-id="${item.id}">
                            Selesaikan Pesanan
                            </button>`
                            : item.status_pengerjaan === "Selesai" &&
                            item.status_pembayaran === "Belum dibayar"
                        ? `<button class="btn-bayar" data-id="${item.id}">
                            Bayar
                            </button>`
                            : "-"
                            }</td>
                            </tr>
                            `;
        });

    } catch (error) {
        console.error("Gagal menampilkan pesanan:", error);
    }
}
tampilkanPesanan();
const tabelPesanan = document.getElementById("tabelPesanan");

tabelPesanan.addEventListener("click", async function(event) {

    const tombolMulai = event.target.closest(".btn-mulai");
    const tombolSelesai = event.target.closest(".btn-selesai");
    const tombolBayar = event.target.closest(".btn-bayar");

    if (!tombolMulai && !tombolSelesai && !tombolBayar) {
        return;
    }

    const tombol = tombolMulai || tombolSelesai || tombolBayar;
    const id = tombol.dataset.id;

    let aksi;

    if (tombolMulai) {
        aksi = "mulai";
    } else if (tombolSelesai) {
        aksi = "selesai";
    } else {
        aksi = "bayar";
    }

    try {
        const response = await fetch(`${API_URL}/${id}/${aksi}`, {
            method: "PUT"
        });

        const hasil = await response.json();

        if (!response.ok) {
            throw new Error(hasil.message || "Gagal mengubah status");
        }

        alert(hasil.message);

        tampilkanPesanan();

    } catch (error) {
        console.error("Gagal mengubah status:", error);
        alert(error.message);
    }

});