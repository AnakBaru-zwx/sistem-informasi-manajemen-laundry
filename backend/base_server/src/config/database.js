const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../database.sqlite');

const initSQL = fs.readFileSync(
    path.join(__dirname, '../sql_scripts/init.sql'),
    'utf8'
);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Gagal konek SQLite:', err.message);
    } else {
        console.log('Terhubung ke SQLite:', dbPath);
    }
});

// Inisialisasi database
const initializeDatabase = () =>
    new Promise((resolve, reject) => {

        // Mengaktifkan Foreign Key
        db.run('PRAGMA foreign_keys = ON', (err) => {

            if (err) {
                return reject(err);
            }

            // Memeriksa status Foreign Key
            db.get('PRAGMA foreign_keys', (err, row) => {

                if (err) {
                    return reject(err);
                }

                if (row.foreign_keys !== 1) {
                    return reject(
                        new Error('Foreign Key gagal diaktifkan')
                    );
                }

                console.log('Foreign Key aktif:', true);

                // Membuat tabel database
                db.exec(initSQL, (err) => {

                    if (err) {
                        return reject(err);
                    }

                    console.log('Database berhasil diinisialisasi');
                    resolve();

                });

            });

        });

    });

module.exports = {
    db,
    initializeDatabase
};