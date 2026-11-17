# SiLapor Kampus

Sistem informasi pelaporan dan pemeliharaan fasilitas kampus yang cepat, transparan, dan mudah digunakan. Mahasiswa atau staf dapat melaporkan kerusakan fasilitas lewat formulir singkat, lalu memantau tindak lanjutnya memakai nomor tiket.

Proyek akhir mata kuliah **Pemrograman Web** (Interaksi Manusia dan Komputer).

**Dibuat oleh:** [arrafi-byte](https://github.com/arrafi-byte)

**Demo:** https://arrafi-byte.github.io/siLaporKampus-IMK/

---

## Fitur

### Untuk pelapor
- **Buat laporan**: isi identitas, lokasi, kategori fasilitas, deskripsi, dan foto bukti (opsional).
- **Nomor tiket otomatis** setelah laporan terkirim, lengkap dengan tombol salin.
- **Cek status laporan**: lacak progres penanganan dengan nomor tiket.
- **Daftar laporan terbuka** dengan filter tanggal, status, dan kategori sebagai bentuk transparansi.
- **Upload foto dengan kontrol penuh**: ada pratinjau, nama dan ukuran file, serta tombol **Hapus foto** jika salah pilih.

### Untuk petugas sarpras (admin)
- Login admin dan dashboard ringkasan laporan.
- Cari laporan dan filter berdasarkan status atau gedung.
- Lihat detail laporan, update status, tambah catatan tindak lanjut, dan unggah foto setelah diperbaiki.
- Hapus laporan dan reset data contoh.

### Aksesibilitas
- Pengaturan ukuran teks (A, A+, A++).
- Mode kontras tinggi.
- Tautan "Lewati ke konten utama", label ARIA, dan navigasi keyboard.
- Menghormati preferensi `prefers-reduced-motion`.

---

## Daftar gedung

Formulir dan filter dashboard memakai lokasi berikut:

- Gedung A
- Gedung F
- Gedung G
- Gedung RV
- Perpustakaan
- Lab Komputer

Daftar ini bisa diubah di `script.js` pada konstanta `GEDUNG`. Kalau data contoh juga ikut diubah, naikkan nilai `STORAGE_KEY` (misalnya `silapor-data-v4`) supaya data lama di browser tergantikan.

## Kategori fasilitas

AC & Pendingin, Proyektor & Audio, Kelistrikan & Lampu, Meja & Kursi, Toilet & Air, Jaringan Wi-Fi, dan Lainnya (dengan isian jenis fasilitas sendiri).

---

## Teknologi

- HTML5
- CSS3
- JavaScript (vanilla, tanpa framework)
- [Bootstrap 5.3](https://getbootstrap.com/) dan [Bootstrap Icons](https://icons.getbootstrap.com/) lewat CDN
- Font Inter dari Google Fonts
- `localStorage` untuk menyimpan data laporan, dan `sessionStorage` untuk sesi login admin

Situs ini **statis dan tidak memakai server atau database**. Semua data tersimpan di browser masing-masing pengguna.

## Struktur proyek

```
siLaporKampus-IMK/
├── index.html   # struktur halaman, formulir, dan modal
├── style.css    # gaya khusus di atas Bootstrap
├── script.js    # data, routing, formulir, pelacakan, dan dashboard admin
└── README.md
```

---

## Cara menjalankan

### Lokal
1. Unduh atau clone repo ini.
2. Buka `index.html` di browser. Koneksi internet diperlukan untuk memuat Bootstrap dan font dari CDN.

```bash
git clone https://github.com/arrafi-byte/siLaporKampus-IMK.git
cd siLaporKampus-IMK
```

### Deploy ke GitHub Pages
1. Buka **Settings**, lalu **Pages**.
2. Pada *Build and deployment*, pilih **Deploy from a branch**.
3. Pilih branch `main` dan folder `/ (root)`, lalu **Save**.
4. Tunggu 1 sampai 2 menit, situs akan aktif di `https://<username>.github.io/siLaporKampus-IMK/`.

---

## Akun demo admin

| Username | Kata sandi |
|----------|------------|
| `admin`  | `admin123` |

Akun ini hanya untuk demonstrasi. Proyek ini tidak memakai server, jadi pengecekan login dilakukan di sisi browser dan **tidak aman untuk penggunaan nyata**.

---

## Catatan dan batasan

- **Data tersimpan per browser.** Laporan yang dibuat di satu perangkat tidak muncul di perangkat lain.
- **Batas penyimpanan** `localStorage` sekitar 5 MB. Foto otomatis diperkecil (maksimal lebar 900 px, format JPEG) sebelum disimpan.
- **Format foto** yang diterima: JPG atau PNG, maksimal 5 MB. Video belum didukung.
- Tombol **Hapus foto** di formulir hanya membatalkan pilihan sebelum laporan dikirim. Laporan yang sudah terkirim hanya bisa dihapus oleh admin.
- Menghapus data situs atau cache browser akan mengembalikan data ke data contoh.

## Pengembangan lanjutan

- Backend dan database sungguhan (misalnya Firebase atau Supabase) agar data dapat dibagikan antarpengguna.
- Autentikasi admin yang aman.
- Notifikasi status laporan lewat email atau WhatsApp.
- Dukungan upload video.

---

## Pembuat

Dirancang dan dikembangkan oleh **arrafi-byte** sebagai proyek akhir mata kuliah Pemrograman Web.

- GitHub: [arrafi-byte](https://github.com/arrafi-byte)

## Lisensi

Proyek ini dibuat untuk keperluan pembelajaran. &copy; 2026 arrafi-byte.
