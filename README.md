
# Sistem Informasi Manajemen Laundry

Sistem Informasi Manajemen Laundry merupakan aplikasi berbasis web untuk membantu pengelolaan data pelanggan dan transaksi laundry.

Proyek ini dibuat sebagai tugas Ujian Tengah Semester (UTS) mata kuliah Pengembangan Aplikasi Berbasis Platform.

## 1. Fitur Aplikasi

### Data Pelanggan
- Menambahkan data pelanggan.
- Menampilkan daftar pelanggan.
- Mengubah data pelanggan.
- Menghapus data pelanggan.
- Validasi data pelanggan.

### Data Pesanan
- Menambahkan pesanan laundry.
- Memilih pelanggan dari database.
- Menghitung total harga secara otomatis.
- Menampilkan daftar transaksi.
- Mengubah berat pesanan selama status masih Menunggu.
- Mengubah status pengerjaan.
- Mengubah status pembayaran.

## 2. Teknologi yang Digunakan

- HTML: Struktur halaman aplikasi.
- CSS: Tampilan dan desain aplikasi.
- JavaScript: Interaksi frontend.
- Node.js: Lingkungan backend.
- Express.js: Framework API server.
- SQLite: Database aplikasi.

## 3. Struktur Folder


sistem-informasi-manajemen-laundry/
|
+-- backend/
|   +-- base_server/
|       +-- server.js
|       +-- package.json
|       +-- src/
|           +-- config/
|           +-- controllers/
|           +-- models/
|           +-- routes/
|           +-- sql_scripts/
|
+-- docs/
|   +-- DOKUMENTASI_API.md
|
+-- frontend/
|   +-- index.html
|   +-- script.js
|   +-- style.css
|   +-- pesanan.html
|   +-- pesanan.js
|   +-- tambah-pesanan.html
|   +-- tambah-pesanan.css
|   +-- tambah-pesanan.js
|
+-- .gitignore
+-- README.md


## 4. Cara Menjalankan Backend

Pastikan Node.js sudah terpasang.

Buka terminal pada folder proyek, kemudian masuk ke folder backend:

```bash
cd backend/base_server
```

Instal dependensi:

```bash
npm install
```

Jalankan server:

```bash
npm start
```

Jika berhasil, server berjalan pada:

```text
http://localhost:3000
```

## 5. Cara Menjalankan Frontend

1. Buka folder proyek menggunakan Visual Studio Code.
2. Buka folder frontend.
3. Jalankan file `index.html` menggunakan ekstensi Live Server.
4. Halaman aplikasi akan terbuka melalui browser.

Halaman aplikasi yang tersedia:

- `index.html`: Data Pelanggan.
- `pesanan.html`: Data Pesanan.
- `tambah-pesanan.html`: Form Tambah Pesanan.

Pastikan backend sudah berjalan sebelum menggunakan frontend.

## 6. Informasi API

Base URL:

```text
http://localhost:3000
```

### API Pelanggan

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | /api/pelanggan | Menampilkan semua pelanggan |
| GET | /api/pelanggan/:id | Menampilkan pelanggan berdasarkan ID |
| POST | /api/pelanggan | Menambahkan pelanggan |
| PUT | /api/pelanggan/:id | Mengubah data pelanggan |
| DELETE | /api/pelanggan/:id | Menghapus pelanggan |

### API Pesanan

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | /api/pesanan | Menampilkan semua pesanan |
| GET | /api/pesanan/:id | Menampilkan pesanan berdasarkan ID |
| POST | /api/pesanan | Menambahkan pesanan |
| PUT | /api/pesanan/:id | Mengubah berat pesanan |
| PUT | /api/pesanan/:id/mulai | Memulai pengerjaan |
| PUT | /api/pesanan/:id/selesai | Menyelesaikan pengerjaan |
| PUT | /api/pesanan/:id/bayar | Memproses pembayaran |

Dokumentasi API lebih lengkap tersedia pada:

`docs/DOKUMENTASI_API.md`

## 7. Ketentuan Transaksi

- Harga laundry ditetapkan sebesar Rp7.000 per kilogram.
- Total harga dihitung berdasarkan berat laundry dikalikan harga per kilogram.
- Status awal pengerjaan adalah Menunggu.
- Status awal pembayaran adalah Belum dibayar.
- Pembayaran dapat dilakukan setelah pesanan selesai dikerjakan.

## 8. Repository GitHub

Repository proyek:

https://github.com/AnakBaru-zwx/sistem-informasi-manajemen-laundry
