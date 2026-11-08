let idPelangganEdit = null;idPelangganEdit
async function tampilkanPelanggan() {

    const tabel = document.getElementById("tabelPelanggan");

    try {
        const response = await fetch("http://localhost:3000/api/pelanggan");

        const hasil = await response.json();

        tabel.innerHTML = "";

        hasil.data.forEach(function(pelanggan) {

            const baris = document.createElement("tr");

            baris.innerHTML = `
    <td>${pelanggan.id}</td>
    <td>${pelanggan.nama}</td>
    <td>${pelanggan.no_hp}</td>
    <td>${pelanggan.alamat}</td>
    <td>
    <button class="btn-edit" onclick="editPelanggan(${pelanggan.id})">
        Edit
    </button>

    <button class="btn-hapus" onclick="hapusPelanggan(${pelanggan.id})">
        Hapus
    </button>
</td>
`;

            tabel.appendChild(baris);

        });

    } catch (error) {

        console.error("Gagal mengambil data pelanggan:", error);

        tabel.innerHTML = `
            <tr>
                <td colspan="4">Gagal mengambil data pelanggan.</td>
            </tr>
        `;
    }
}
const form = document.getElementById("formPelanggan");

form.addEventListener("submit", async function(event) {

    event.preventDefault();

    const dataPelanggan = {
        nama: document.getElementById("nama").value,
        no_hp: document.getElementById("no_hp").value,
        alamat: document.getElementById("alamat").value
    };

    // Tentukan apakah tambah atau edit
    const sedangEdit = idPelangganEdit !== null;

    const url = sedangEdit
        ? `http://localhost:3000/api/pelanggan/${idPelangganEdit}`
        : "http://localhost:3000/api/pelanggan";

    const method = sedangEdit ? "PUT" : "POST";

    try {

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataPelanggan)
        });

        const hasil = await response.json();

        if (response.ok) {

            alert(sedangEdit
                ? "Pelanggan berhasil diperbarui!"
                : "Pelanggan berhasil ditambahkan!"
            );

            form.reset();

            // Kembali ke mode tambah
            idPelangganEdit = null;

            tampilkanPelanggan();

        } else {
            alert(hasil.message || "Gagal menyimpan pelanggan.");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Tidak dapat terhubung ke server.");
    }

});
tampilkanPelanggan();
async function editPelanggan(id) {

    try {
        const response = await fetch(
            `http://localhost:3000/api/pelanggan/${id}`
        );

        const hasil = await response.json();

        if (response.ok) {

            idPelangganEdit = id;

            document.getElementById("nama").value = hasil.data.nama;
            document.getElementById("no_hp").value = hasil.data.no_hp;
            document.getElementById("alamat").value = hasil.data.alamat;

        } else {
            alert(hasil.message || "Data pelanggan tidak ditemukan.");
        }

    } catch (error) {
        console.error(error);
        alert("Gagal mengambil data pelanggan.");
    }
}

async function hapusPelanggan(id) {

    const yakin = confirm("Apakah kamu yakin ingin menghapus pelanggan ini?");

    if (!yakin) {
        return;
    }

    try {
        const response = await fetch(
            `http://localhost:3000/api/pelanggan/${id}`,
            {
                method: "DELETE"
            }
        );

        const hasil = await response.json();

        if (!response.ok) {
            alert(hasil.message || "Gagal menghapus pelanggan.");
            return;
        }

        alert("Pelanggan berhasil dihapus!");

        tampilkanPelanggan();

    } catch (error) {
        console.error("Error:", error);
        alert("Tidak dapat terhubung ke server.");
    }
}
