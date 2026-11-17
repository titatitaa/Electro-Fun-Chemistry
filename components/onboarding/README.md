# Fitur Interactive Onboarding Tutorial - ElectroFun Chemistry

Modul ini adalah fitur panduan interaktif (*interactive onboarding tutorial & guided tour*) untuk website pembelajaran kimia **ElectroFun Chemistry** (Materi Larutan Elektrolit dan Non-Elektrolit, Fase E SMA Kelas X).

Fitur ini dirancang modular, terisolasi penuh, dan tidak mengganggu fungsionalitas utama yang sudah ada pada website.

---

## 1. Struktur File Modul

Modul onboarding ditempatkan terpisah di dalam direktori `/components/onboarding/`:

| Nama File | Deskripsi & Tanggung Jawab |
|---|---|
| `onboarding.html` | Berisi **HANYA** struktur semantik HTML untuk pop-up selamat datang (*welcome modal*), backdrop spotlight, dan kotak panduan (*tooltip tour*). Bebas dari tag `<style>` dan `<script>`. |
| `onboarding.css` | Berisi **HANYA** styling untuk pop-up, highlight spotlight cutout, animasi transisi, dan tooltip responsif (laptop & mobile). Menggunakan font dan palet warna resmi website tanpa mengubah styling global. |
| `onboarding.js` | Berisi **HANYA** logika JavaScript mandiri untuk mengontrol state onboarding, kalkulasi koordinat spotlight, navigasi 6 langkah tour, integrasi `localStorage`, serta penanganan resize/scroll. |
| `README.md` | Dokumentasi cara kerja, struktur, dan panduan pengujian fitur. |

---

## 2. Cara Kerja Fitur

### A. Pop-up Selamat Datang (Welcome Modal)
1. Saat halaman selesai dimuat (`DOMContentLoaded`), script membaca `localStorage` untuk memeriksa kunci:
   - Kunci umum: `electrofun_onboarding_done`
   - Kunci spesifik sesi (jika login): `electrofun_onboarding_done_[userId]`
2. Jika belum bernilai `"1"` (pengguna baru), pop-up Selamat Datang muncul secara otomatis di tengah layar dengan latar belakang gelap transparan setelah jeda **600ms**.
3. Jika pengguna menekan tombol **"Lewati"**, modal tertutup dan status disimpan ke `localStorage` agar tidak muncul lagi saat refresh.
4. Jika pengguna menekan tombol **"Mulai Panduan"**, halaman akan diarahkan/digulir secara halus ke Beranda (atas), kemudian Guided Tour dimulai dari Langkah 1 setelah jeda **400ms**.

### B. Guided Tour 6 Langkah
Tour menyorot elemen secara berurutan dengan kotak highlight (*spotlight pulse*) dan backdrop redup penahan klik tidak sengaja:

1. **Langkah 1**: `#nav-beranda` — *Kenali Halaman Beranda* (Ikon 🏠)
2. **Langkah 2**: `#nav-materi` — *Pelajari Materi Kimia* (Ikon 📚)
3. **Langkah 3**: `#nav-lab` — *Eksplorasi Laboratorium Virtual* (Ikon 🧪)
4. **Langkah 4**: `#nav-kuis` — *Uji Pemahamanmu!* (Ikon ✏️)
5. **Langkah 5**: `#nav-fitur` — *Manfaatkan Fitur Belajar* (Ikon ✨)
6. **Langkah 6**: `#btn-mulai-belajar` — *Saatnya Mulai Belajar!* (Ikon 🚀)

Pada Langkah 6, tombol utama berubah menjadi **"Mulai Belajar"**. Saat diklik, tour selesai, status disimpan ke `localStorage`, dan aksi tombol Mulai Belajar asli dijalankan (mengarahkan pengguna langsung ke materi).

### C. Komponen Tooltip & Responsivitas
- **Indikator**: Menampilkan teks langkah (misal: "Langkah 1 dari 6"), progress bar persentase dinamis, serta 6 bulatan indikator (*step dots*).
- **Penempatan Otomatis**: Pada laptop/desktop, tooltip mendeteksi sisa ruang vertikal. Jika ruang di bawah cukup, tooltip berada di bawah target; jika tidak cukup, tooltip beralih ke atas target. Panah segitiga (*arrow pointer*) mengarah presisi ke pusat elemen target.
- **Tampilan HP (Mobile ≤ 600px)**: Tooltip otomatis beradaptasi menjadi *bottom sheet* selebar layar dengan padding tepi 12px, sehingga dijamin tidak terpotong dan tidak keluar layar.
- **Scroll & Resize Resilient**: Posisi highlight dan tooltip secara otomatis dihitung ulang ketika pengguna menggulir halaman atau mengubah ukuran layar (*window resize*).

### D. Akses Ulang Melalui Tombol "Panduan Penggunaan"
Tombol dengan atribut `id="btn-panduan"` tersedia di Navbar dan Footer:
- Saat diklik, status `electrofun_onboarding_done` di `localStorage` akan direset.
- Pop-up Selamat Datang akan ditampilkan kembali sehingga siswa SMA dapat membuka panduan kapan saja mereka membutuhkan panduan ulang.

---

## 3. Integrasi ke Halaman Utama

File utama (`index.html`) hanya menambahkan 3 baris bersih:
```html
<!-- 1. Stylesheet Onboarding di dalam <head> -->
<link rel="stylesheet" href="/components/onboarding/onboarding.css" />

<!-- 2. Kontainer Mounting di dalam <body> -->
<div id="onboarding-root"></div>

<!-- 3. Script Onboarding Controller di dalam <body> -->
<script src="/components/onboarding/onboarding.js"></script>
```

Elemen menu navigasi di Navbar (`Navbar.jsx`) disematkan atribut `id` standar tanpa mengubah class maupun gaya aslinya:
- `#nav-beranda`
- `#nav-materi`
- `#nav-lab`
- `#nav-kuis`
- `#nav-fitur`
- `#btn-mulai-belajar`
- `#btn-panduan`

---

## 4. Panduan Pengujian (Testing)

1. **Pengujian Pengguna Baru**:
   - Buka DevTools (F12) -> tab Application / Storage -> Local Storage.
   - Hapus key `electrofun_onboarding_done`.
   - Refresh halaman.
   - **Verifikasi**: Pop-up Selamat Datang muncul secara otomatis setelah 600ms.
2. **Pengujian Alur Tour**:
   - Klik tombol **"Mulai Panduan"**.
   - **Verifikasi**: Layar bergulir ke atas dan Langkah 1 menyorot menu Beranda dengan border spotlight bercahaya teal.
   - Klik **"Selanjutnya"** hingga Langkah 6.
   - **Verifikasi**: Sorotan berpindah tepat sasaran ke Materi, Laboratorium Mini, Kuis, Fitur Belajar, dan Mulai Belajar.
   - Klik **"Kembali"** -> posisi sorotan kembali mundur dengan akurat.
3. **Pengujian Tombol Lewati**:
   - Klik tombol **"Lewati"** di pop-up atau pada tooltip.
   - **Verifikasi**: Tour langsung ditutup dan `electrofun_onboarding_done` bernilai `"1"` di `localStorage`.
4. **Pengujian Refresh Setelah Selesai**:
   - Refresh halaman saat status `"1"`.
   - **Verifikasi**: Pop-up TIDAK muncul lagi secara otomatis.
5. **Pengujian Buka Ulang Panduan**:
   - Klik tombol **"Panduan Penggunaan"** (`#btn-panduan`) di navbar atau footer.
   - **Verifikasi**: Pop-up Selamat Datang terbuka kembali dan siap memandu pengguna.
6. **Pengujian Tampilan Seluler (Mobile 375px)**:
   - Atur tampilan DevTools ke dimensi HP (misal: iPhone SE 375px atau Android 360px).
   - **Verifikasi**: Tooltip tour terpasang rapi di bagian bawah layar tanpa ada teks atau tombol yang terpotong ke luar layar.
