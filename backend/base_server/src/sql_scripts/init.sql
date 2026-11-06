CREATE TABLE IF NOT EXISTS test_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO test_logs DEFAULT VALUES;

CREATE TABLE IF NOT EXISTS products (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      name          TEXT    NOT NULL,
      price         REAL    NOT NULL,
      stock         INTEGER DEFAULT 0,
      category      TEXT,
      description   TEXT,
      is_available  INTEGER DEFAULT 1,
      created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP
    );
CREATE TABLE IF NOT EXISTS pelanggan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    no_hp TEXT NOT NULL,
    alamat TEXT
);
CREATE TABLE IF NOT EXISTS pesanan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pelanggan_id INTEGER NOT NULL,
    berat REAL NOT NULL CHECK (berat > 0),
    harga_per_kg INTEGER NOT NULL,
    total_harga INTEGER NOT NULL,
    status_pengerjaan TEXT DEFAULT 'Menunggu',
    status_pembayaran TEXT DEFAULT 'Belum dibayar',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (pelanggan_id) REFERENCES pelanggan(id)
);
