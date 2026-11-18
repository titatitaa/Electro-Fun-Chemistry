# LAPORAN PENGUJIAN SISTEM & UJI OTORISASI
**ElectroFun Chemistry — Panel Guru & Hasil Belajar Siswa**

---

## 1. Lingkungan Pengujian
- **Platform:** Vite + React 19 + Firebase Auth & Cloud Firestore
- **Sesi Pengujian:**
  1. **Akun Guru Pengajar:** `guru.kimia@electrolab.id` (Role: `teacher`, Kode Kelas: `KIMIA-X1`)
  2. **Akun Siswa A:** `budi@gmail.com` / Budi Santoso (Role: `student`)
  3. **Akun Siswa B:** `siti@gmail.com` / Siti Aminah (Role: `student`)
  4. **Akun Tamu:** Mode Tamu Anonim (Role: `guest`)
- **Skrip Otomasi Pengujian:** `tests/systemTest.js`

---

## 2. Matriks Hasil Pengujian (20 Skenario Bagian L)

| No | Skenario Pengujian | Hasil Aktual | Status |
|:---:|---|---|:---:|
| 1 | Guru berhasil login dan membuka Panel Guru | Akun dengan email `guru.kimia@electrolab.id` otomatis mendapatkan role `teacher`, label hijau "Guru Pengajar", dan tombol "🏫 Panel Guru" aktif. | **PASS** |
| 2 | Siswa tidak dapat membuka Panel Guru | Akun siswa `budi@gmail.com` mendapatkan role `student`. Tombol Panel Guru tidak ditampilkan dan route terproteksi. | **PASS** |
| 3 | Akun tamu tidak dapat membuka Panel Guru | Akun tamu mendapatkan role `guest` (`isGuest: true`). Tidak memiliki akses ke Panel Guru. | **PASS** |
| 4 | Siswa A bergabung ke kelas menggunakan kode `KIMIA-X1` | Siswa A memasukkan `KIMIA-X1` via modal. Dokumen user diperbarui dengan `classCode: 'KIMIA-X1'`. | **PASS** |
| 5 | Siswa B bergabung ke kelas menggunakan kode `KIMIA-X1` | Siswa B memasukkan `KIMIA-X1`. Terhubung langsung ke data kelas guru. | **PASS** |
| 6 | Siswa A mengerjakan kuis dan mengirimkan hasilnya | Submisi Modul 1 siswa A terkirim dengan skor 8/10 (80%), rincian butir soal, dan timestamp server. | **PASS** |
| 7 | Siswa B mengerjakan kuis dan mengirimkan hasilnya | Submisi Modul 1 siswa B terkirim dengan skor 10/10 (100%) dan berstatus `received`. | **PASS** |
| 8 | Guru membuka Panel Guru dan melihat data siswa yang telah bergabung | Guru melihat tepat 2 siswa (Budi Santoso & Siti Aminah) terdaftar di kelas `KIMIA-X1`. | **PASS** |
| 9 | Guru dapat melihat hasil kuis siswa | Tabel hasil menampilkan daftar submisi dengan modul, nilai, waktu siswa, dan waktu terima server. | **PASS** |
| 10 | Guru dapat membuka Detail Jawaban | Modal detail jawaban terbuka menampilkan ringkasan pengerjaan siswa. | **PASS** |
| 11 | Jawaban asli siswa ditampilkan sesuai versi soal | Menampilkan teks soal, pilihan asli siswa (opsi B), kunci jawaban, dan pembahasan versi `v1.0`. | **PASS** |
| 12 | Grafik distribusi nilai diperbarui sesuai data yang diterima | Histogram batang terbarui otomatis menghitung kelompok nilai aktual (80% & 100%). | **PASS** |
| 13 | Analisis pembelajaran menampilkan hasil berdasarkan data aktual | Rata-rata kelas terhitung 90% secara presisi tanpa angka fiktif. | **PASS** |
| 14 | Rekap jawaban per butir sesuai dengan perhitungan manual | Analisis butir soal menghitung frekuensi pilihan A–E dan persentase kesalahan per nomor soal. | **PASS** |
| 15 | Satu siswa tidak dihitung berulang kali dalam rekap sesuai aturan percobaan | Ketika Siswa A mencoba kuis untuk kedua kalinya (skor 9/10), rekap ketuntasan tetap menghitung 1 kali per siswa (n = 2 siswa). | **PASS** |
| 16 | Hasil pending tidak dihitung sebagai hasil nol | Filter hanya memproses submisi yang terverifikasi `status: 'received'`. | **PASS** |
| 17 | Siswa A tidak dapat melihat hasil milik Siswa B | Query submisi siswa dibatasi strictly berdasarkan `userId == studentA.id`. | **PASS** |
| 18 | Akun tamu dapat belajar, tetapi hasilnya tidak masuk ke Panel Guru | Submisi akun tamu otomatis diblokir dari sinkronisasi Firestore kelas guru. | **PASS** |
| 19 | Logout guru berfungsi dengan benar | Sesi Firebase Auth diakhiri via `signOut(auth)` dan penyimpanan sesi dibersihkan. | **PASS** |
| 20 | Halaman Panel Guru tidak dapat diakses setelah logout | Setelah logout, status sesi kembali ke `null` dan halaman dialihkan ke Login. | **PASS** |

---

## 3. Pengujian Tampilan & Aksesibilitas
- **Desktop (1440px & 1080px):** Sidebar 270px di sebelah kiri, topbar breadcrumb, dan konten scrollable rapi tanpa tumpang tindih.
- **Ponsel Pintar / Mobile (375px):** Sidebar otomatis berubah menjadi drawer menu dengan tombol toggle hamburger `☰` dan tombol close `✕`. Tabel hasil memiliki wrapper horizontal scroll (`table-responsive`).
- **Simbol & Rumus Kimia:** Notasi ion seperti $\text{Na}^+$, $\text{Cl}^-$, $\text{H}_3\text{O}^+$, dan $\text{CH}_3\text{COO}^-$ ditampilkan dengan subskrip/superskrip yang presisi.
- **Kontras Warna:** Sesuai standar WCAG AA dengan rasio kontras teks di atas latar minimal 4.5:1.

