DOKUMENTASI API BACKEND
Sistem Informasi Manajemen Laundry
1. Informasi Umum
Dokumentasi ini menjelaskan API (Application Programming Interface) yang digunakan dalam Sistem Informasi Manajemen Laundry.
Teknologi Backend:
Node.js
Express.js
SQLite
Base URL:
http://localhost:3000
Format data: JSON
Header untuk request yang mengirimkan data:
Content-Type: application/json
API memiliki dua modul utama:
API Pelanggan
API Pesanan
2. API Pelanggan
API pelanggan digunakan untuk mengelola data pelanggan laundry, mulai dari menambahkan, menampilkan, mengubah, hingga menghapus data pelanggan.
2.1 Menambahkan Pelanggan
Method: POST
Endpoint: /api/pelanggan
URL: http://localhost:3000/api/pelanggan
Request Body:
{
    "nama": "Budi",
    "no_hp": "082222222222",
    "alamat": "Medan"
}
Response berhasil (201 Created):
{
    "success": true,
    "message": "Pelanggan berhasil ditambahkan",
    "data": {
        "id": 2,
        "nama": "Budi",
        "no_hp": "082222222222",
        "alamat": "Medan"
    }
}
Validasi:
Nama wajib diisi.
Nomor HP wajib diisi.
Input nama dan nomor HP yang hanya berisi spasi akan ditolak.
Spasi di awal dan akhir input dibersihkan.
2.2 Menampilkan Semua Pelanggan
Method: GET
Endpoint: /api/pelanggan
URL: http://localhost:3000/api/pelanggan
Response berhasil (200 OK):
{
    "success": true,
    "message": "Data pelanggan berhasil ditampilkan",
    "data": [
        {
            "id": 2,
            "nama": "Budi",
            "no_hp": "082222222222",
            "alamat": "Medan"
        }
    ]
}
2.3 Menampilkan Pelanggan Berdasarkan ID
Method: GET
Endpoint: /api/pelanggan/:id
Contoh URL: http://localhost:3000/api/pelanggan/2
Response berhasil (200 OK):
{
    "success": true,
    "message": "Data pelanggan berhasil ditemukan",
    "data": {
        "id": 2,
        "nama": "Budi",
        "no_hp": "082222222222",
        "alamat": "Medan"
    }
}
Response jika pelanggan tidak ditemukan (404 Not Found):
{
    "success": false,
    "message": "Pelanggan tidak ditemukan"
}
2.4 Mengubah Data Pelanggan
Method: PUT
Endpoint: /api/pelanggan/:id
Contoh URL: http://localhost:3000/api/pelanggan/2
Request Body:
{
    "nama": "Budi Santoso",
    "no_hp": "082222222222",
    "alamat": "Medan Baru"
}
Response berhasil (200 OK):
{
    "success": true,
    "message": "Data pelanggan berhasil diubah"
}
Validasi:
Nama wajib diisi.
Nomor HP wajib diisi.
Nama dan nomor HP yang hanya berisi spasi akan ditolak.
Spasi di awal dan akhir input dibersihkan.
2.5 Menghapus Pelanggan
Method: DELETE
Endpoint: /api/pelanggan/:id
Contoh URL: http://localhost:3000/api/pelanggan/2
Response berhasil (200 OK):
{
    "success": true,
    "message": "Pelanggan berhasil dihapus"
}
Response jika pelanggan masih memiliki transaksi (409 Conflict):
{
    "success": false,
    "message": "Pelanggan tidak dapat dihapus karena masih memiliki transaksi"
}
Response jika pelanggan tidak ditemukan (404 Not Found):
{
    "success": false,
    "message": "Pelanggan tidak ditemukan"
}
Aturan:

Pelanggan yang masih memiliki transaksi pesanan tidak dapat dihapus agar riwayat transaksi tetap terjaga.
3. API Pesanan
API pesanan digunakan untuk mengelola transaksi laundry, mulai dari pembuatan pesanan, perubahan berat cucian, proses pengerjaan, hingga pembayaran.
Ketentuan harga:
Harga laundry yang digunakan pada backend saat ini adalah Rp7.000 per kilogram.
3.1 Menambahkan Pesanan
Method: POST
Endpoint: /api/pesanan
URL: http://localhost:3000/api/pesanan
Request Body:
{
    "pelanggan_id": 2,
    "berat": 5
}
Response berhasil (201 Created):
{
    "success": true,
    "message": "Transaksi berhasil ditambahkan",
    "data": {
        "id": 3,
        "pelanggan_id": 2,
        "berat": 5,
        "harga_per_kg": 7000,
        "total_harga": 35000,
        "status_pengerjaan": "Menunggu",
        "status_pembayaran": "Belum dibayar"
    }
}
Validasi:
ID pelanggan harus berupa bilangan bulat positif.
Pelanggan harus terdaftar.
Berat cucian harus berupa angka yang lebih dari 0.
Total harga dihitung secara otomatis oleh backend.
Status awal pengerjaan adalah Menunggu.
Status awal pembayaran adalah Belum dibayar.
3.2 Menampilkan Semua Pesanan
Method: GET
Endpoint: /api/pesanan
URL: http://localhost:3000/api/pesanan
Response berhasil (200 OK):
{
    "success": true,
    "message": "Data transaksi berhasil ditampilkan",
    "data": [
        {
            "id": 3,
            "pelanggan_id": 2,
            "berat": 5,
            "harga_per_kg": 7000,
            "total_harga": 35000,
            "status_pengerjaan": "Menunggu",
            "status_pembayaran": "Belum dibayar",
            "created_at": "2026-11-07 06:02:21",
            "nama_pelanggan": "Budi",
            "no_hp": "082222222222"
        }
    ]
}
API ini mengambil data pesanan sekaligus nama pelanggan dan nomor HP melalui JOIN antara tabel pesanan dan pelanggan.
3.3 Menampilkan Pesanan Berdasarkan ID
Method: GET
Endpoint: /api/pesanan/:id
Contoh URL: http://localhost:3000/api/pesanan/2
Response berhasil (200 OK):
{
    "success": true,
    "message": "Data transaksi berhasil ditemukan",
    "data": {
        "id": 2,
        "pelanggan_id": 2,
        "berat": 6,
        "harga_per_kg": 7000,
        "total_harga": 42000,
        "status_pengerjaan": "Selesai",
        "status_pembayaran": "Lunas",
        "created_at": "2026-11-07 04:07:47",
        "nama_pelanggan": "Budi",
        "no_hp": "082222222222"
    }
}
Response jika pesanan tidak ditemukan (404 Not Found):
{
    "success": false,
    "message": "Transaksi tidak ditemukan"
}
3.4 Mengubah Berat Pesanan
Method: PUT
Endpoint: /api/pesanan/:id
Contoh URL: http://localhost:3000/api/pesanan/2
Request Body:
{
    "berat": 6
}
Response berhasil (200 OK):
{
    "success": true,
    "message": "Berat cucian berhasil diubah",
    "data": {
        "id": 2,
        "berat": 6,
        "harga_per_kg": 7000,
        "total_harga": 42000
    }
}
Validasi dan aturan:
Berat harus berupa angka lebih dari 0.
Berat hanya dapat diubah ketika status pengerjaan masih Menunggu.
Total harga dihitung ulang setelah berat diubah.
Pesanan yang sudah Diproses atau Selesai tidak dapat diubah beratnya.
3.5 Memulai Pengerjaan Pesanan
Method: PUT
Endpoint: /api/pesanan/:id/mulai
Contoh URL: http://localhost:3000/api/pesanan/2/mulai
Endpoint ini digunakan untuk mengubah status pengerjaan dari Menunggu menjadi Diproses.
Response berhasil (200 OK):
{
    "success": true,
    "message": "Pesanan berhasil dimulai",
    "data": {
        "id": 2,
        "status_pengerjaan": "Diproses"
    }
}
Aturan:

Pesanan hanya dapat dimulai ketika status sebelumnya adalah Menunggu.
3.6 Menyelesaikan Pesanan
Method: PUT
Endpoint: /api/pesanan/:id/selesai
Contoh URL: http://localhost:3000/api/pesanan/2/selesai
Endpoint ini digunakan untuk mengubah status pengerjaan dari Diproses menjadi Selesai.
Response berhasil (200 OK):
{
    "success": true,
    "message": "Pesanan berhasil diselesaikan",
    "data": {
        "id": 2,
        "status_pengerjaan": "Selesai",
        "status_pembayaran": "Belum dibayar"
    }
}
Aturan:

Pesanan hanya dapat diselesaikan ketika status sebelumnya adalah Diproses.
3.7 Melakukan Pembayaran
Method: PUT
Endpoint: /api/pesanan/:id/bayar
Contoh URL: http://localhost:3000/api/pesanan/2/bayar
Endpoint ini digunakan untuk mengubah status pembayaran dari Belum dibayar menjadi Lunas.
Response berhasil (200 OK):
{
    "success": true,
    "message": "Pembayaran berhasil",
    "data": {
        "id": 2,
        "status_pengerjaan": "Selesai",
        "status_pembayaran": "Lunas"
    }
}
Aturan:
Pesanan harus sudah berstatus Selesai.
Pembayaran harus berstatus Belum dibayar.
Pembayaran tidak dapat dilakukan dua kali pada transaksi yang sama.
4. Alur Status Pesanan
Sistem menggunakan urutan status pengerjaan berikut:
Menunggu
    |
    v
Diproses
    |
    v
Selesai
Setelah pengerjaan selesai, pembayaran dapat dilakukan:
Belum dibayar
    |
    v
Lunas
Perubahan status dilakukan melalui endpoint khusus yang sudah dijelaskan pada bagian API Pesanan.
5. Ringkasan Endpoint API
No.	Method	Endpoint	Fungsi
1	POST	/api/pelanggan	Menambahkan pelanggan
2	GET	/api/pelanggan	Menampilkan semua pelanggan
3	GET	/api/pelanggan/:id	Menampilkan pelanggan berdasarkan ID
4	PUT	/api/pelanggan/:id	Mengubah pelanggan
5	DELETE	/api/pelanggan/:id	Menghapus pelanggan
6	POST	/api/pesanan	Menambahkan pesanan
7	GET	/api/pesanan	Menampilkan semua pesanan
8	GET	/api/pesanan/:id	Menampilkan pesanan berdasarkan ID
9	PUT	/api/pesanan/:id	Mengubah berat pesanan
10	PUT	/api/pesanan/:id/mulai	Memulai pengerjaan
11	PUT	/api/pesanan/:id/selesai	Menyelesaikan pengerjaan
12	PUT	/api/pesanan/:id/bayar	Melakukan pembayaran
6. Catatan Penggunaan
Pastikan server backend berjalan sebelum frontend mengirimkan permintaan API.
Server berjalan pada http://localhost:3000.
Request yang mengirimkan data menggunakan format JSON.
Nilai :id pada endpoint diganti dengan ID data yang ingin diakses.
Total harga pesanan dihitung otomatis oleh backend.
Database menggunakan SQLite dengan Foreign Key aktif.

7. Penanganan Kesalahan API
   7.1 Error API Pelanggan
   Status: 400 Bad Request


**Response Error:**
```json
{
    "success": false,
    "message": "Nama dan nomor HP wajib diisi dengan benar"
}
```
Status: 400 Bad Request.
   7.2 Error API Tambah Pesanan
   {
    "success": false,
    "message": "ID pelanggan harus berupa angka positif dan berat cucian harus lebih dari 0"
}
Status: 400 Bad Request.
Ketika pelanggan tidak terdaftar:
Plain Text
{
    "success": false,
    "message": "Pelanggan tidak ditemukan"
}
Status: 404 Not Found.
   7.3 Error API Edit Pesanan
   Ketika berat tidak valid:
{
    "success": false,
    "message": "Berat cucian harus lebih dari 0"
}
Status: 400 Bad Request.
Ketika pesanan sudah diproses:
{
    "success": false,
    "message": "Berat hanya dapat diubah saat status pengerjaan Menunggu"
}
Status: 400 Bad Request.
 
   7.4 Error API Pembayaran
Contoh:
Plain Text
{
    "success": false,
    "message": "Pembayaran hanya dapat dilakukan jika pesanan sudah Selesai dan belum dibayar"
}
Status: 400 Bad Request.
