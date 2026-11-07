const express = require('express');
const router = express.Router();

const { db } = require('../config/database');

// API untuk menambahkan pelanggan
router.post('/', (req, res) =>{ 
    const { nama, no_hp, alamat } = req.body;

// Membersihkan spasi pada input
const namaBersih = typeof nama === 'string' ? nama.trim() : '';
const noHpBersih = typeof no_hp === 'string' ? no_hp.trim() : '';
const alamatBersih = typeof alamat === 'string'
    ? alamat.trim()
    : '';

// Validasi data
if (!namaBersih || !noHpBersih) {
    return res.status(400).json({
        success: false,
        message: 'Nama dan nomor HP wajib diisi dengan benar'
    });
}
    // Perintah SQL
    const sql = `
        INSERT INTO pelanggan (nama, no_hp, alamat)
        VALUES (?, ?, ?)
    `;

    // Menyimpan data ke database
    db.run(sql, [
    namaBersih,
    noHpBersih,
    alamatBersih || null
], function(err) {

        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Gagal menambahkan pelanggan'
            });
        }

        res.status(201).json({
            success: true,
            message: 'Pelanggan berhasil ditambahkan',
            data: {
                id: this.lastID,
                nama: namaBersih,
                no_hp: noHpBersih,
                alamat: alamatBersih || null
            }
        });

    });

});
// API untuk menampilkan semua pelanggan
router.get('/', (req, res) => {

    const sql = 'SELECT * FROM pelanggan';

    db.all(sql, [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Gagal mengambil data pelanggan'
            });
        }

        res.json({
            success: true,
            message: 'Data pelanggan berhasil ditampilkan',
            data: rows
        });

    });

});
// API untuk menampilkan pelanggan berdasarkan ID
router.get('/:id', (req, res) => {

    const { id } = req.params;

    const sql = 'SELECT * FROM pelanggan WHERE id = ?';

    db.get(sql, [id], (err, row) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Gagal mengambil data pelanggan'
            });
        }

        if (!row) {
            return res.status(404).json({
                success: false,
                message: 'Pelanggan tidak ditemukan'
            });
        }

        res.json({
            success: true,
            message: 'Data pelanggan berhasil ditemukan',
            data: row
        });

    });

});
// API untuk mengubah data pelanggan
router.put('/:id', (req, res) => {

    const { id } = req.params;
    const { nama, no_hp, alamat } = req.body;

    // Membersihkan spasi pada input
    const namaBersih = typeof nama === 'string' ? nama.trim() : '';
    const noHpBersih = typeof no_hp === 'string' ? no_hp.trim() : '';
    const alamatBersih = typeof alamat === 'string'
        ? alamat.trim()
        : '';

    // Validasi data
    if (!namaBersih || !noHpBersih) {
        return res.status(400).json({
            success: false,
            message: 'Nama dan nomor HP wajib diisi dengan benar'
        });
    }

    const sql = `
        UPDATE pelanggan
        SET nama = ?, no_hp = ?, alamat = ?
        WHERE id = ?
    `;

    db.run(
        sql,
        [namaBersih, noHpBersih, alamatBersih || null, id],
        function(err) {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Gagal mengubah data pelanggan'
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Pelanggan tidak ditemukan'
                });
            }

            res.json({
                success: true,
                message: 'Data pelanggan berhasil diubah'
            });

        }
    );

});
// API untuk menghapus pelanggan
router.delete('/:id', (req, res) => {

    const { id } = req.params;

    // Periksa apakah pelanggan masih memiliki pesanan
    const cekSql = `
        SELECT id
        FROM pesanan
        WHERE pelanggan_id = ?
        LIMIT 1
    `;

    db.get(cekSql, [id], (err, pesanan) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Gagal memeriksa transaksi pelanggan'
            });
        }

        // Pelanggan tidak boleh dihapus jika masih memiliki pesanan
        if (pesanan) {
            return res.status(409).json({
                success: false,
                message: 'Pelanggan tidak dapat dihapus karena masih memiliki transaksi'
            });
        }

        // Menghapus pelanggan
        const sql = 'DELETE FROM pelanggan WHERE id = ?';

        db.run(sql, [id], function(err) {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Gagal menghapus pelanggan',
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Pelanggan tidak ditemukan'
                });
            }

            res.json({
                success: true,
                message: 'Pelanggan berhasil dihapus'
            });

        });

    });

});
module.exports = router;