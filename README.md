# ElectroFun Chemistry — Media Pembelajaran Kimia SMA
## Materi: Larutan Elektrolit dan Larutan Nonelektrolit (Fase E • Kelas X)

**ElectroFun Chemistry** adalah media web pembelajaran kimia interaktif yang dirancang dengan prinsip *colorful, joyful, and meaningful* untuk memvisualisasikan keterkaitan antara pengamatan makroskopik, penjelasan submikroskopik (pergerakan ion), dan representasi simbolik kimia.

---

## 🚀 Fitur Utama

1. **Pustaka Materi & Konsep:**
   - 3 Modul Inti: Kenali Larutan (Modul 1), Laboratorium Mini (Modul 2), dan Jelajahi Ion (Modul 3).
   - 8 Bab Modul Lanjutan dengan diagram interaktif, persamaan reaksi disosiasi/ionisasi, dan soal konseptual.
   - Matriks Pencegahan Miskonsepsi Kimia.
2. **Laboratorium Mini Virtual:**
   - Simulasi 8 langkah pengujian daya hantar listrik dengan 15 jenis larutan.
   - Observasi nyala lampu, pembentukan gelembung di elektrode, serta representasi submikroskopik partikel/ion.
   - Penyusunan dan cetak LKPD praktikum digital.
3. **8 Fitur Belajar Interaktif:**
   - *Flashcard & Glosarium*, *Molecular Explorer*, *Concept Map*, *Jurnal Praktikum*, *Tes Diagnostik*, *Chemistry Mission*, *Progres Belajar*, dan *Studi Kasus Nyata*.
4. **Sistem Akun Role-Based & Keamanan:**
   - Autentikasi terintegrasi Firebase Authentication dan Cloud Firestore.
   - Pembedaan peran aman antara **Guru Pengajar (Teacher)**, **Siswa (Student)**, dan **Pengunjung Tamu (Guest)**.
   - Sistem kode kelas **`KIMIA-X1`** untuk menghubungkan siswa ke kelas guru.
5. **🏫 Panel Guru (Teacher Dashboard):**
   - **Dashboard Utama:** 4 Kartu Statistik (Total Siswa, Pengerjaan Kuis, Rata-rata Nilai, Kuis Tersedia), Grafik Batang Distribusi Nilai aktual, Aktivitas Terbaru dengan timestamp penerimaan server, dan Salin Kode Kelas.
   - **Hasil Kuis Siswa:** Tabel rekapitulasi lengkap dengan filter modul, jenis pengerjaan, versi soal, pencarian siswa, pengurutan, dan **Modal Detail Jawaban Asli Siswa** (butir soal, pilihan siswa, kunci jawaban, dan pembahasan).
   - **Data Siswa:** Rekapitulasi anggota kelas `KIMIA-X1`, filter kelas asal, pengurutan, dan profil capaian belajar.
   - **Analisis Pembelajaran:** Ketuntasan Klasikal dengan pengaturan KKM dinamis, perbandingan rata-rata per modul, dan Analisis Butir Soal (Peringkat soal kesalahan tertinggi beserta frekuensi distraktor A–E).
   - **Navigasi & Keamanan:** Tombol "Kembali ke Beranda" tanpa logout dan tombol Logout resmi.

---

## 🔑 Akun Uji Coba

### 1. Akun Guru Pengajar
- **Email Guru Resmi:**
  - `guru.kimia@electrolab.id`
  - `guru@electrofun.id`
  - `guru.kimia@gmail.com`
- **Kata Sandi:** `password123` *(atau kata sandi apa pun saat registrasi awal)*
- **Role:** `teacher`
- **Kode Kelas Aktif:** `KIMIA-X1`

### 2. Akun Siswa
- **Email Siswa A:** `budi@gmail.com` (Nama: Budi Santoso)
- **Email Siswa B:** `siti@gmail.com` (Nama: Siti Aminah)
- **Role:** `student`
- **Cara Bergabung:** Klik tombol **"+ Gabung Kelas"** di session bar atas, lalu masukkan kode **`KIMIA-X1`**.

### 3. Akun Tamu
- Klik tombol **"Masuk sebagai Tamu"** pada halaman login untuk eksplorasi mandiri tanpa sinkronisasi kelas.

---

## 🛠️ Cara Menjalankan Proyek

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Menjalankan Server Development
```bash
npm run dev
```
Buka browser pada alamat yang ditampilkan di terminal (default: `http://localhost:5173`).

### 3. Pemeriksaan Kualitas Kode (Linter)
```bash
npm run lint
```

### 4. Build Produksi & Preview
```bash
npm run build
npm run preview
```

### 5. Menjalankan Skrip Pengujian Sistem (20 Skenario Otomatis)
```bash
node tests/systemTest.js
```
