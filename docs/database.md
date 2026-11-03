# Database Materi dan Kuis

Konten pembelajaran disimpan sebagai data lokal JavaScript di
[`src/data/database.js`](../src/data/database.js), tanpa backend atau database
eksternal. Setiap modul berisi pengantar, tujuan belajar, referensi, dan subbab.
Setiap subbab menyimpan uraian materi, rumus/persamaan, contoh, miskonsepsi yang
perlu dihindari, poin penting, serta kata kunci video YouTube. Tautan video
membuka hasil pencarian YouTube yang sesuai dengan subbab.

Ilustrasi konsep dibuat khusus untuk situs ini dan disimpan sebagai berkas SVG di
`public/images/`. Ilustrasi tersebut adalah diagram pembelajaran, bukan foto
eksperimen nyata.

Materi kimia dirangkum dan ditulis ulang berdasarkan bagian buku elektronik
*Chemistry 2e* dari OpenStax yang dicantumkan pada setiap modul. Rujukan tersebut
tersedia di bawah lisensi CC BY 4.0; halaman ini menggunakan parafrasa dan
ilustrasi sendiri, bukan salinan teks atau gambar bukunya.

Soal kuis beserta kunci dan umpan balik berada di
[`src/data/quizQuestions.js`](../src/data/quizQuestions.js). Setiap soal
memiliki `modulId` agar muncul pada kuis modul yang sesuai, `opsi`,
`jawabanBenar`, `feedbackBenar`, `feedbackSalah`, `pembahasan`, dan
`caraPengerjaan`. Properti `rumus` digunakan bila soal membutuhkan rumus atau
persamaan.

Saat ini tersedia 10 soal untuk setiap modul. Pilihan jawaban setiap soal
mencakup A sampai E.

Tampilan dan alur jawaban berada di
[`src/components/Quiz.jsx`](../src/components/Quiz.jsx); pemilihan modul,
umpan balik, pembahasan, dan langkah pengerjaan membaca data soal dari berkas
database. Data materi ditampilkan oleh
[`src/components/ModuleLesson.jsx`](../src/components/ModuleLesson.jsx).
