# Lost & Found FILKOM

Website frontend layanan **Lost & Found** untuk lingkungan Fakultas Ilmu Komputer Universitas Brawijaya (FILKOM UB). Dibangun murni menggunakan **HTML, CSS, JavaScript (Vanilla), dan Bootstrap 5.3** tanpa framework JavaScript tambahan.

🔗 **Live Demo:** https://22ar-era.github.io/test-lost-and-found/

---

## Fitur Utama

### 1. Halaman Publik & Autentikasi
- **Landing Page:** Pencarian cepat barang temuan, akses peran (Mahasiswa & Satpam), daftar barang temuan terbaru, dan alur klaim 3 langkah.
- **Pilih Peran & Login:** Halaman login terpisah untuk **Mahasiswa** dan **Satpam**.

### 2. Alur Mahasiswa
- **Dashboard Mahasiswa:** Ringkasan barang temuan terbaru, notifikasi kecocokan barang (dengan modal detail kecocokan), dan status laporan kehilangan.
- **Lapor Kehilangan & Lapor Temuan:** Form pelaporan lengkap dengan unggah foto.
- **Cari Barang Temuan:** Filter berdasarkan kategori, lokasi, dan tanggal.
- **Detail Barang & Ajukan Klaim:** Informasi lokasi penemuan/penitipan serta form pertanyaan verifikasi kepemilikan.
- **Status Klaim Saya:** Pantau status klaim (`Diajukan`, `Disetujui`, `Ditolak`) serta pembatalan klaim.

### 3. Alur Satpam
- **Verifikasi Laporan Temuan:** Tinjau antrean laporan masuk, cek penerimaan barang fisik, verifikasi ke resepsionis, atau tolak dengan alasan.
- **Kelola Klaim & Serah Terima:** Bandingkan ciri khusus tersimpan dengan jawaban pengklaim, setujui/tolak klaim, dan catat serah terima barang.
- **Riwayat Laporan & Penyerahan:** Daftar riwayat lengkap beserta halaman detail dan log aktivitas (`RiwayatAktivitas`).

---

## Teknologi yang Digunakan
- **HTML5**
- **CSS3** (Custom styling sesuai desain High-Fidelity Figma)
- **JavaScript (Vanilla ES6+)** + `localStorage` untuk persistensi data demo
- **Bootstrap 5.3** & **Bootstrap Icons**

---

## Struktur Folder

```text
lost-and-found-filkom/
├── index.html          # Halaman utama & modal Bootstrap
├── css/
│   └── style.css       # Stylesheet custom sesuai desain Figma
├── js/
│   ├── data.js         # Data awal & manajemen localStorage
│   └── app.js          # Logika routing & interaktivitas 18 layar
├── assets/             # Foto barang temuan
└── README.md
```

---

## Cara Menjalankan di Lokal

1. Clone repository ini:
   ```bash
   git clone https://github.com/22ar-era/test-lost-and-found.git
   ```
2. Buka folder proyek, lalu double-click `index.html` di browser (atau jalankan dengan ekstensi **Live Server** di VS Code).

### Reset Data Demo
Untuk mengembalikan seluruh data percobaan ke kondisi awal, buka Console browser (`F12` → **Console**) lalu jalankan:
```js
resetDemo()
```
