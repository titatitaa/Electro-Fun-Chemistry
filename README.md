# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Prototipe autentikasi CHEMISTRY LAB

Halaman awal menyediakan registrasi siswa (nama, email, kelas, dan password), login, validasi formulir, pilihan “Ingat Saya”, dan logout. Setelah masuk, siswa diarahkan ke beranda pembelajaran yang sudah ada.

Autentikasi ini hanya untuk prototipe: akun dan password disimpan di `localStorage` browser, sehingga password belum dienkripsi dan tidak aman untuk penggunaan nyata. Jangan gunakan password pribadi. Sebelum dipakai secara publik, pindahkan autentikasi ke backend dengan HTTPS, penyimpanan password menggunakan hash adaptif yang aman, validasi server, dan pengelolaan sesi/token yang sesuai.

Visual laboratorium pada halaman login menggunakan foto dari Unsplash dan memerlukan koneksi internet.

## Pustaka materi 8 bab

Setelah masuk, bagian “Jelajahi materi dalam 8 bab” membuka materi bertahap tentang larutan, konsep elektrolit, klasifikasi, mekanisme daya hantar, percobaan, faktor, penerapan, dan miskonsepsi. Setiap bab memuat diagram skematis buatan untuk pembelajaran, contoh kontekstual, persamaan, sumber rujukan, rangkuman, refleksi, dan lima soal dengan umpan balik.

Referensi pendidikan dan DOI ditautkan pada tiap bab. Diagram SVG dibuat untuk situs ini dan diberi keterangan sebagai skema konseptual, bukan foto atau hasil pengukuran eksperimen.

## Laboratorium Mini virtual

Tab Laboratorium di navigasi, tombol “Coba Laboratorium”, dan tombol pada Modul 2 membuka praktikum virtual identifikasi daya hantar. Panduan prosedur delapan langkah membimbing siswa dari perumusan tujuan, pemilihan sampel dan prediksi, pengaturan variabel, persiapan larutan, pengujian, pencatatan, perbandingan data, hingga kesimpulan. Siswa dapat memilih 15 sampel model, membuat prediksi, mengatur konsentrasi/volume/suhu/tegangan/jarak elektrode, melarutkan dan mengaduk solut, mengamati partikel dan respons rangkaian, membandingkan tiga zat pada konsentrasi bersama, lalu menyimpan data dan kesimpulan LKPD. LKPD dapat dicetak atau disimpan sebagai PDF dari dialog cetak browser. Catatan dan tabel pengamatan tersimpan di `localStorage` perangkat.

Perhitungan konduktivitas, mobilitas ion, kesetimbangan elektrolit lemah, dan respons lampu merupakan model pembelajaran sederhana, bukan data eksperimen atau prediksi instrumen akurat. Nilai air mineral merupakan asumsi model; tahap ionisasi kedua asam karbonat dan efek nonideal larutan pekat tidak disimulasikan. Visual partikel serta gelembung tidak berskala. Inspirasi simulasi konsep: [PhET Sugar and Salt Solutions](https://phet.colorado.edu/en/simulations/sugar-and-salt-solutions); fitur dan perhitungan di situs ini dibuat mandiri dan bukan bagian dari PhET.

## Fitur pembelajaran tambahan

Menu **Fitur Belajar** membuka delapan alat yang dimuat saat dipilih:

- **Flashcard & Glosarium** untuk mengulang istilah dan definisi.
- **Molecular Explorer** untuk menelaah representasi partikel, ion, dan hidrasi.
- **Concept Map** untuk menyusun, menghubungkan, dan mengevaluasi peta konsep.
- **Jurnal Praktikum** untuk menulis beberapa catatan dan menautkan pengamatan Laboratorium Mini.
- **Tes Diagnostik** untuk memeriksa pemahaman konsep dan pola miskonsepsi.
- **Chemistry Mission** berisi lima tantangan penalaran kimia.
- **Progres Belajar** merangkum hasil dan aktivitas yang tersimpan.
- **Studi Kasus** untuk menghubungkan konsep elektrolit dengan konteks sehari-hari.

Progres fitur-fitur tersebut, hasil kuis, bab yang dibuka, aktivitas, serta catatan Laboratorium Mini baru disimpan di `localStorage` browser dan dipisahkan berdasarkan akun yang sedang masuk. Data hanya tersedia pada browser/perangkat yang sama dan dapat hilang jika data situs dihapus. Penanda penyelesaian tiga modul lama masih menggunakan key lokal bersama yang sudah dipakai aplikasi sebelumnya; penanda itu tidak menjadi bukti penyelesaian bab materi. Catatan laboratorium lama tanpa identitas akun tetap tersimpan, tetapi tidak dicampurkan dengan progres akun.

Jalankan proyek secara lokal dengan `npm install`, lalu `npm run dev`. Gunakan `npm run lint` dan `npm run build` untuk pemeriksaan statis dan build produksi. Autentikasi lokal serta seluruh penyimpanan di browser hanya untuk prototipe; gunakan backend dengan pengelolaan password dan sesi yang aman sebelum deployment publik.
