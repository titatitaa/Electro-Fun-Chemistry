# BACKLOG PENGEMBANGAN LANJUTAN
**ElectroFun Chemistry**

Berikut catatan item pengembangan dan penyempurnaan di masa mendatang (Post-Release Candidate):

1. **Ekspor Rekap Nilai ke Format Excel / CSV:**
   - Fitur ekspor langsung dari tabel hasil kuis atau data siswa di Panel Guru ke file `.xlsx` atau `.csv` untuk memudahkan pelaporan administrasi sekolah.
2. **Pilihan Pembuatan Kelas Tambahan oleh Guru:**
   - Menyediakan fitur multi-kelas (misal: `KIMIA-X2`, `KIMIA-X3`) jika seorang guru mengampu lebih dari satu rombongan belajar.
3. **Grafik Ekstraksi Analisis Daya Pembeda & Tingkat Kesukaran Soal:**
   - Menambahkan indeks kesukaran klasik ($p$) dan indeks daya pembeda ($d$) otomatis pada Menu 4 (Analisis Pembelajaran).
4. **Sinkronisasi Notifikasi Realtime:**
   - Pemanfaatan `onSnapshot` Firestore untuk pembaruan realtime aktivitas kuis siswa tanpa perlu refresh halaman.

