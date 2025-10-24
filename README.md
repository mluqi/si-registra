# SI-REGISTRA: Sistem Buku Register Digital

SI-REGISTRA adalah aplikasi web yang berfungsi sebagai sistem buku register digital terintegrasi untuk Pengadilan Negeri Singaraja. Aplikasi ini terdiri dari dua bagian utama:

- **Frontend**: Dibangun dengan React dan Vite, menyediakan antarmuka pengguna yang interaktif.
- **Backend**: Dibangun dengan Node.js dan Express, menangani logika bisnis dan interaksi dengan database.

---

## Daftar Isi

- [Prasyarat](#prasyarat)
- [Konfigurasi Awal (Wajib)](#konfigurasi-awal-wajib)
  - [Langkah 1: Menyiapkan Google Sheet (Database)](#langkah-1-menyiapkan-google-sheet-database)
  - [Langkah 2: Menyiapkan Google Cloud Service Account](#langkah-2-menyiapkan-google-cloud-service-account)
  - [Langkah 3: Konfigurasi Variabel Lingkungan (.env)](#langkah-3-konfigurasi-variabel-lingkungan-env)
- [Instalasi](#instalasi)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
  - [Mode Pengembangan (Development)](#mode-pengembangan-development)
  - [Mode Produksi (Production)](#mode-produksi-production)
- [Struktur Folder](#struktur-folder)

---

## Prasyarat

Pastikan Anda telah menginstal perangkat lunak berikut di sistem Anda:

- [Node.js](https://nodejs.org/) (disarankan versi LTS)
- [npm](https://www.npmjs.com/) atau package manager lain seperti [yarn](https://yarnpkg.com/) atau [pnpm](https://pnpm.io/).

---

## Instalasi

Ikuti langkah-langkah berikut untuk menginstal dependensi proyek di direktori `frontend` dan `backend`.

1.  **Instalasi Dependensi Backend**

    Buka terminal, navigasi ke direktori `backend`, dan jalankan perintah berikut:

    ```bash
    cd backend
    npm install
    ```

2.  **Instalasi Dependensi Frontend**

    Buka terminal baru, navigasi ke direktori `frontend`, dan jalankan perintah berikut:

    ```bash
    cd frontend
    npm install
    ```

---

## Konfigurasi

Aplikasi backend memerlukan file konfigurasi lingkungan (`.env`) untuk berjalan dengan benar.

1.  Buat file baru bernama `.env` di dalam direktori `backend`.
2.  Salin konten dari file `.env.example` (jika ada) atau isi dengan variabel yang dibutuhkan. Berdasarkan konfigurasi proxy di frontend, backend server disarankan berjalan di port 8000.

    **Contoh isi file `.env` di direktori `backend`:**

    ```env
    PORT=8000
    # Tambahkan variabel lain yang mungkin dibutuhkan, seperti:
    # DATABASE_URL=...
    # JWT_SECRET=...
    ```

---

## Menjalankan Aplikasi

### Mode Pengembangan (Development)

Untuk menjalankan aplikasi dalam mode pengembangan, Anda perlu menjalankan server backend dan frontend secara bersamaan di dua terminal yang berbeda.

1.  **Jalankan Server Backend**

    Di terminal pertama, dari direktori `backend`:

    ```bash
    # Dari direktori /backend
    npm start
    # atau jika ada script dev
    # npm run dev
    ```

    Server backend akan berjalan di `http://localhost:8000` (sesuai konfigurasi `.env`).

2.  **Jalankan Server Frontend**

    Di terminal kedua, dari direktori `frontend`:

    ```bash
    # Dari direktori /frontend
    npm run dev
    ```

    Server frontend akan berjalan di `http://localhost:5173` (atau port lain yang tersedia) dan secara otomatis akan melakukan proxy request API ke server backend.

### Mode Produksi (Production)

Dalam mode produksi, frontend akan di-build menjadi file statis dan akan disajikan langsung oleh server backend.

1.  **Build Aplikasi Frontend**

    Dari direktori `frontend`, jalankan perintah build:

    ```bash
    # Dari direktori /frontend
    npm run build
    ```

    Hasil build akan tersimpan di direktori `frontend/dist`.

2.  **Jalankan Server Backend**

    Server backend akan secara otomatis menyajikan file dari `frontend/dist`.

    ```bash
    # Dari direktori /backend
    npm start
    ```

    Aplikasi sekarang dapat diakses di `http://localhost:8000` (atau port yang dikonfigurasi di `.env`).

---

## Struktur Folder

```
/
├── backend/      # Kode sumber Express.js
└── frontend/     # Kode sumber React (Vite)
```
