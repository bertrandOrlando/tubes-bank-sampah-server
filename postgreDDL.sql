CREATE DATABASE tubes_manpro

CREATE TYPE pengguna_role AS ENUM ('admin', 'pengguna');
CREATE TYPE tipe_transaksi AS ENUM ('masuk', 'keluar');

CREATE TABLE Kecamatan (
    kec_id SERIAL PRIMARY KEY,
    nama_kec VARCHAR(20) NOT NULL
);

CREATE TABLE Kelurahan (
    kel_id SERIAL PRIMARY KEY,
    nama_kel VARCHAR(50) NOT NULL,
    kec_id INT REFERENCES Kecamatan(kec_id) NOT NULL
);

CREATE TABLE Pengguna (
    pengguna_id SERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    no_telp VARCHAR(30),
    alamat VARCHAR(255), 
    email VARCHAR(255) UNIQUE NOT NULL,
    role pengguna_role NOT NULL DEFAULT 'pengguna',
    kel_id INT REFERENCES Kelurahan(kel_id) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE TABLE SUK (
    suk_id SERIAL PRIMARY KEY,
    nama_suk VARCHAR(10) NOT NULL UNIQUE
);

CREATE TABLE Sampah (
    sampah_id SERIAL PRIMARY KEY,
    nama_sampah VARCHAR(40) NOT NULL,
    harga_sekarang INT NOT NULL,
    suk_id INT REFERENCES SUK(suk_id) NOT NULL,
    slug_image VARCHAR(40),
    kuantitas INT NOT NULL DEFAULT 0 CHECK (kuantitas >= 0),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    UNIQUE (nama_sampah, suk_id)
);

CREATE TABLE Transaksi (
    transaksi_id SERIAL PRIMARY KEY,
    pengguna_id INT REFERENCES pengguna(pengguna_id) NOT NULL,
    tanggal TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipe_transaksi tipe_transaksi NOT NULL
);

CREATE TABLE Transaksi_Sampah (
    transaksi_sampah_id INT REFERENCES Transaksi(transaksi_id) NOT NULL,
    sampah_id INT REFERENCES Sampah(sampah_id) NOT NULL,
    jumlah_sampah INT NOT NULL,
    harga_sampah INT NOT NULL,
    PRIMARY KEY (transaksi_sampah_id, sampah_id)
);
