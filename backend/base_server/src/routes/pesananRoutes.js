const express = require('express');
const router = express.Router();

const { db } = require('../config/database');

// Harga laundry per kilogram
const HARGA_PER_KG = 7000;

// API untuk menambahkan transaksi
router.post('/', (req, res) => {

const pelanggan_id = Number(req.body.pelanggan_id);
const berat = Number(req.body.berat);

// Validasi data
if (
    !Number.isSafeInteger(pelanggan_id) ||
    pelanggan_id <= 0 ||
    !Number.isFinite(berat) ||
    berat <= 0
) {
    return res.status(400).json({
        success: false,
        message: 'ID pelanggan harus berupa angka positif dan berat cucian harus lebih dari 0'
    });
    }

    // Menghitung total harga
    const total_harga = berat * HARGA_PER_KG;

    // Perintah SQL
    const sql = `
        INSERT INTO pesanan (
            pelanggan_id,
            berat,
            harga_per_kg,
            total_harga
        )
        VALUES (?, ?, ?, ?)
    `;
// Memeriksa apakah pelanggan terdaftar
db.get(
    'SELECT id FROM pelanggan WHERE id = ?',
    [pelanggan_id],
    (err, pelanggan) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Gagal memeriksa data pelanggan',
                error: err.message
            });
        }

        // Jika pelanggan tidak ditemukan
        if (!pelanggan) {
            return res.status(404).json({
                success: false,
                message: 'Pelanggan tidak ditemukan'
            });
        }

        // Menyimpan transaksi ke database
        db.run(sql, [
            pelanggan_id,
            berat,
            HARGA_PER_KG,
            total_harga
        ], function(err) {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Gagal menambahkan transaksi',
                    error: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: 'Transaksi berhasil ditambahkan',
                data: {
                    id: this.lastID,
                    pelanggan_id: pelanggan_id,
                    berat: berat,
                    harga_per_kg: HARGA_PER_KG,
                    total_harga: total_harga,
                    status_pengerjaan: 'Menunggu',
                    status_pembayaran: 'Belum dibayar'
                }
            });

        });

    });
}); // Penutup router.post()
// API untuk menampilkan semua transaksi
router.get('/', (req, res) => {

    const sql = `
        SELECT
            pesanan.*,
            pelanggan.nama AS nama_pelanggan,
            pelanggan.no_hp
        FROM pesanan
        JOIN pelanggan
        ON pesanan.pelanggan_id = pelanggan.id
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Gagal mengambil data transaksi',
                error: err.message
            });
        }

        res.json({
            success: true,
            message: 'Data transaksi berhasil ditampilkan',
            data: rows
        });

    });

});
// API untuk menampilkan transaksi berdasarkan ID
router.get('/:id', (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT
        pesanan.*,
        pelanggan.nama AS nama_pelanggan,
        pelanggan.no_hp
        FROM pesanan
        JOIN pelanggan
        ON pesanan.pelanggan_id = pelanggan.id
        WHERE pesanan.id = ?
    `;

    db.get(sql, [id], (err, row) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Gagal mengambil data transaksi',
                error: err.message
            });
        }

        if (!row) {
            return res.status(404).json({
                success: false,
                message: 'Transaksi tidak ditemukan'
            });
        }

        res.json({
            success: true,
            message: 'Data transaksi berhasil ditemukan',
            data: row
        });

    });

});
// API untuk mengubah berat cucian
router.put('/:id', (req, res) => {

    const { id } = req.params;
    const berat = Number(req.body.berat);

    // Validasi berat cucian
    if (
        req.body.berat === undefined ||
        !Number.isFinite(berat) ||
        berat <= 0
    ) {
        return res.status(400).json({
            success: false,
            message: 'Berat cucian harus lebih dari 0'
        });
    }

    // Periksa status pengerjaan pesanan
    const cekSql = `
        SELECT status_pengerjaan
        FROM pesanan
        WHERE id = ?
    `;

    db.get(cekSql, [id], (err, row) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Gagal memeriksa transaksi',
                error: err.message
            });
        }

        // Periksa apakah pesanan ditemukan
        if (!row) {
            return res.status(404).json({
                success: false,
                message: 'Transaksi tidak ditemukan'
            });
        }

        // Berat hanya boleh diubah saat status Menunggu
        if (row.status_pengerjaan !== 'Menunggu') {
            return res.status(400).json({
                success: false,
                message: 'Berat hanya dapat diubah saat status pengerjaan Menunggu'
            });
        }

        // Hitung ulang total harga
        const total_harga = berat * HARGA_PER_KG;

        const updateSql = `
            UPDATE pesanan
            SET berat = ?, harga_per_kg = ?, total_harga = ?
            WHERE id = ? AND status_pengerjaan = 'Menunggu'
        `;

        db.run(
            updateSql,
            [berat, HARGA_PER_KG, total_harga, id],
            function(err) {

                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Gagal mengubah berat cucian',
                        error: err.message
                    });
                }

                if (this.changes === 0) {
                    return res.status(409).json({
                        success: false,
                        message: 'Berat tidak dapat diubah karena status pesanan sudah berubah'
                    });
                }

                res.json({
                    success: true,
                    message: 'Berat cucian berhasil diubah',
                    data: {
                        id: Number(id),
                        berat: berat,
                        harga_per_kg: HARGA_PER_KG,
                        total_harga: total_harga
                    }
                });

            }
        );

    });

});
// API untuk memulai proses pengerjaan pesanan
router.put('/:id/mulai', (req, res) => {

    const { id } = req.params;

    // Perintah SQL untuk mengubah status
    const sql = `
        UPDATE pesanan
        SET status_pengerjaan = 'Diproses'
        WHERE id = ? AND status_pengerjaan = 'Menunggu'
    `;

    db.run(sql, [id], function(err) {

        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Gagal memulai proses pesanan',
                error: err.message
            });
        }

        // Jika tidak ada data yang berubah
        if (this.changes === 0) {
            return res.status(400).json({
                success: false,
                message: 'Pesanan tidak ditemukan atau status bukan Menunggu'
            });
        }

        res.json({
            success: true,
            message: 'Pesanan berhasil dimulai',
            data: {
                id: Number(id),
                status_pengerjaan: 'Diproses'
            }
        });

    });

});
// API untuk menyelesaikan pesanan
router.put('/:id/selesai', (req, res) => {

    const { id } = req.params;

    const sql = `
        UPDATE pesanan
        SET status_pengerjaan = 'Selesai'
        WHERE id = ? AND status_pengerjaan = 'Diproses'
    `;

    db.run(sql, [id], function(err) {

        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Gagal menyelesaikan pesanan',
                error: err.message
            });
        }

        if (this.changes === 0) {
            return res.status(400).json({
                success: false,
                message: 'Pesanan tidak ditemukan atau status bukan Diproses'
            });
        }

        res.json({
            success: true,
            message: 'Pesanan berhasil diselesaikan',
            data: {
                id: Number(id),
                status_pengerjaan: 'Selesai',
                status_pembayaran: 'Belum dibayar'
            }
        });

    });

});
// API untuk melakukan pembayaran pesanan
router.put('/:id/bayar', (req, res) => {

    const { id } = req.params;

    const sql = `
        UPDATE pesanan
        SET status_pembayaran = 'Lunas'
        WHERE id = ?
        AND status_pengerjaan = 'Selesai'
        AND status_pembayaran = 'Belum dibayar'
    `;

    db.run(sql, [id], function(err) {

        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Gagal memproses pembayaran',
                error: err.message
            });
        }

        if (this.changes === 0) {
            return res.status(400).json({
                success: false,
                message: 'Pembayaran hanya dapat dilakukan jika pesanan sudah Selesai dan belum dibayar'
            });
        }

        res.json({
            success: true,
            message: 'Pembayaran berhasil',
            data: {
                id: Number(id),
                status_pengerjaan: 'Selesai',
                status_pembayaran: 'Lunas'
            }
        });

    });

});
module.exports = router;