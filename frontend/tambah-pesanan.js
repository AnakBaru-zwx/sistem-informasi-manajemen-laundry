const API_PELANGGAN = "http://localhost:3000/api/pelanggan";
const API_PESANAN = "http://localhost:3000/api/pesanan";

const HARGA_PER_KG = 7000;

const formPesanan = document.getElementById("formPesanan");
const pilihPelanggan = document.getElementById("pelanggan_id");
const inputBerat = document.getElementById("berat");
const totalHarga = document.getElementById("totalHarga");
const pesanStatus = document.getElementById("pesanStatus");

// Mengambil data pelanggan dari backend
async function muatPelanggan() {
    try {
        const response = await fetch(API_PELANGGAN);
        const hasil = await response.json();

        if (!response.ok || !Array.isArray(hasil.data)) {
            throw new Error(hasil.message || "Gagal mengambil data pelanggan");
        }

        pilihPelanggan.innerHTML =
            '<option value="">-- Pilih Pelanggan --</option>';

        hasil.data.forEach(function(item) {
            const option = document.createElement("option");

            option.value = item.id;
            option.textContent = item.nama + " - " + item.no_hp;

            pilihPelanggan.appendChild(option);
        });

    } catch (error) {
        pesanStatus.textContent = error.message;
    }
}

// Menghitung estimasi harga
inputBerat.addEventListener("input", function() {
    const berat = Number(inputBerat.value);
    const total = berat > 0 ? berat * HARGA_PER_KG : 0;

    totalHarga.textContent = total.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    });
});

// Mengirim pesanan ke backend
formPesanan.addEventListener("submit", async function(event) {
    event.preventDefault();

    const pelanggan_id = Number(pilihPelanggan.value);
    const berat = Number(inputBerat.value);

    if (!pelanggan_id || !Number.isFinite(berat) || berat <= 0) {
        pesanStatus.textContent = "Pilih pelanggan dan masukkan berat yang benar.";
        return;
    }

    try {
        const response = await fetch(API_PESANAN, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                pelanggan_id: pelanggan_id,
                berat: berat
            })
        });

        const hasil = await response.json();

        if (!response.ok) {
            throw new Error(hasil.message || "Gagal menyimpan pesanan");
        }

        pesanStatus.textContent = "Pesanan berhasil ditambahkan!";

        formPesanan.reset();
        totalHarga.textContent = "Rp0";

    } catch (error) {
        pesanStatus.textContent = error.message;
    }
});

// Jalankan saat halaman dibuka
muatPelanggan();