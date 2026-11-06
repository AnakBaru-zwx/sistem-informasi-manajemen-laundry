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
    console.error('❌ Gagal konek SQLite:', err.message);
    process.exit(1);
  }
  console.log('✅ Terhubung ke SQLite:', dbPath);
});
db.run('PRAGMA foreign_keys = ON', (err) => {
    if (err) {
        console.error('Gagal mengaktifkan Foreign Key:', err.message);
        return;
    }

    db.get('PRAGMA foreign_keys', (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }

        console.log('Foreign Key aktif:', row.foreign_keys === 1);
    });
});

const initializeDatabase = () => 
  new Promise((resolve, reject)=>{
    db.exec(initSQL, (err)=>{
      if (err) reject(err);
      else resolve();
    });
  });


module.exports = { db, initializeDatabase };