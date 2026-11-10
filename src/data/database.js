import quizQuestions from './quizQuestions.js'

export const courseModules = [
  {
    id: 'modul-1',
    number: 'Modul 1',
    title: 'Kenali Larutan Elektrolit dan Nonelektrolit',
    intro:
      'Mulai dari contoh garam, gula, dan air untuk memahami apa yang terjadi saat zat larut. Kunci utamanya bukan sekadar zat itu larut atau tidak, tetapi apakah ada pembawa muatan yang dapat bergerak.',
    image: '/images/solution-particles.svg',
    objectives: [
      'Menjelaskan peran zat terlarut dan pelarut saat larutan terbentuk.',
      'Membedakan larutan elektrolit dan nonelektrolit dari partikel penyusunnya.',
      'Menghubungkan keberadaan ion bergerak dengan kemampuan larutan menghantarkan arus.',
    ],
    sources: [
      {
        title: 'Chemistry 2e, §11.1 The Dissolution Process',
        author: 'Flowers, Theopold, Langley, & Robinson',
        publisher: 'OpenStax, Rice University (2019)',
        url: 'https://openstax.org/books/chemistry-2e/pages/11-1-the-dissolution-process',
      },
      {
        title: 'Chemistry 2e, §11.2 Electrolytes',
        author: 'Flowers, Theopold, Langley, & Robinson',
        publisher: 'OpenStax, Rice University (2019)',
        url: 'https://openstax.org/books/chemistry-2e/pages/11-2-electrolytes',
      },
      {
        title: 'Chemistry 2e, §11.3 Solubility',
        author: 'Flowers, Theopold, Langley, & Robinson',
        publisher: 'OpenStax, Rice University (2019)',
        url: 'https://openstax.org/books/chemistry-2e/pages/11-3-solubility',
      },
    ],
    subtopics: [
      {
        title: '1. Larutan, zat terlarut, dan pelarut',
        paragraphs: [
          'Larutan adalah campuran homogen yang tersusun atas zat terlarut dan pelarut. Pada larutan garam, air berperan sebagai pelarut dan NaCl sebagai zat terlarut. Komposisi larutan dapat dinyatakan melalui konsentrasi; molaritas menyatakan jumlah mol zat terlarut dalam setiap liter larutan.',
          'Air memiliki bagian bermuatan parsial: sisi oksigen sedikit negatif dan sisi hidrogen sedikit positif. Molekul air mengelilingi partikel zat terlarut. Pada NaCl, tarikan ini membantu memisahkan ion dari kristal dan menstabilkannya dalam larutan.',
          'Pembentukan larutan dapat dipahami sebagai penyebaran partikel zat terlarut ke seluruh pelarut. Pengadukan dan pemanasan sering mempercepat proses melarut, tetapi tidak selalu menambah jumlah maksimum zat yang dapat larut. Batas maksimum pada suhu tertentu disebut kelarutan; larutan yang mengandung jumlah maksimum zat terlarut disebut jenuh.',
          'Garam yang larut dan gula yang larut sama-sama dapat membentuk campuran homogen, tetapi proses mikroskopiknya berbeda. Kristal NaCl menghasilkan ion terhidrasi, sedangkan molekul sukrosa tetap utuh dan tersebar di antara molekul air. Perbedaan inilah yang penting untuk memahami daya hantar, bukan kejernihan larutan.',
        ],
        equation: 'Molaritas (M) = jumlah mol zat terlarut (n) ÷ volume larutan (V, L)',
        example: {
          title: 'Contoh menghitung konsentrasi',
          text: 'Jika 0,20 mol NaCl dilarutkan hingga volume akhir 0,50 L, molaritasnya M = 0,20 mol ÷ 0,50 L = 0,40 mol/L. Pastikan volume yang dipakai adalah volume akhir larutan, bukan hanya volume air sebelum garam ditambahkan.',
        },
        misconception:
          'Mengaduk gula sampai tidak terlihat bukan berarti gula berubah menjadi ion. Kecepatan melarut dan sifat elektrolit adalah dua hal yang berbeda.',
        keyPoints: [
          'Zat terlarut tersebar merata di dalam pelarut.',
          'Pelarutan adalah pencampuran partikel; tidak semua zat yang larut membentuk ion.',
          'Suhu dan jumlah zat terlarut dapat memengaruhi kelarutan.',
        ],
        videoQuery: 'larutan zat terlarut pelarut molaritas kimia kelas 10',
      },
      {
        title: '2. Elektrolit dan nonelektrolit',
        paragraphs: [
          'Larutan elektrolit menghantarkan arus karena mengandung ion-ion bergerak. Senyawa ionik seperti NaCl berpisah menjadi Na⁺ dan Cl⁻ saat dilarutkan. Senyawa molekuler tertentu, misalnya HCl, bereaksi dengan air dan membentuk ion.',
          'Sukrosa juga larut dalam air, tetapi partikel utamanya tetap berupa molekul netral. Karena tidak menghasilkan ion bergerak dalam jumlah berarti, larutan sukrosa digolongkan sebagai nonelektrolit. Jadi, larut tidak sama dengan terionisasi.',
          'Senyawa ionik sudah tersusun dari kation dan anion. Saat larut, molekul air yang polar tertarik pada ion lalu membantu memisahkannya dari kisi kristal; proses pemisahan ini disebut disosiasi. Dalam larutan, ion-ion dikelilingi air (terhidrasi) dan dapat bergerak membawa muatan.',
          'Beberapa senyawa kovalen mulai sebagai molekul netral tetapi bereaksi dengan air membentuk ion. HCl, misalnya, menyerahkan proton kepada air dan membentuk H₃O⁺ serta Cl⁻. Sebaliknya, sukrosa larut sebagai molekul netral. Uji konduktivitas membantu membedakan larutan yang mengandung ion dari larutan yang tidak.',
        ],
        equation: 'NaCl(s) → Na⁺(aq) + Cl⁻(aq)',
        example: {
          title: 'Bandingkan garam dengan gula',
          text: 'Dalam model partikel NaCl(aq), gambarkan kation Na⁺ dan anion Cl⁻ terpisah serta tersebar di antara molekul air. Untuk sukrosa(aq), gambarkan molekul netral sukrosa yang tersebar tanpa memecahnya menjadi ion.',
        },
        misconception:
          'Padatan NaCl tidak menghantarkan listrik dengan cara yang sama seperti larutannya: ion dalam kristal padat terkunci pada kisi. Ion baru dapat membawa arus ketika dapat bergerak, misalnya setelah senyawa dilelehkan atau dilarutkan.',
        keyPoints: [
          'Ion positif disebut kation, sedangkan ion negatif disebut anion.',
          'Arus dalam larutan dibawa oleh gerak ion, bukan elektron bebas seperti pada kawat logam.',
          'Air gula dapat jernih dan homogen tanpa menjadi larutan elektrolit.',
        ],
        videoQuery: 'larutan elektrolit dan nonelektrolit NaCl gula kimia SMA',
      },
      {
        title: '3. Menghubungkan partikel dengan daya hantar',
        paragraphs: [
          'Daya hantar larutan bergantung pada jumlah ion yang tersedia dan kemampuan ion bergerak. Semakin banyak pembawa muatan yang bergerak, umumnya arus yang dapat dibawa semakin besar. Jenis ion, konsentrasi, suhu, dan kondisi pengukuran juga ikut berpengaruh.',
          'Model partikel membantu menjelaskan hasil pengamatan: elektrolit kuat memiliki banyak ion, elektrolit lemah memiliki ion dan molekul netral, sedangkan nonelektrolit didominasi molekul netral. Lampu hanyalah salah satu indikator; gelembung dan kondisi alat juga perlu diperhatikan.',
          'Pada tingkat makroskopik kita melihat lampu dan gelembung; pada tingkat submikroskopik kita menjelaskan pengamatan tersebut dengan pergerakan ion; pada tingkat simbolik kita menuliskan persamaan ionisasi atau disosiasi. Menghubungkan tiga cara representasi ini membantu menghindari hafalan klasifikasi tanpa alasan.',
          'Konduktivitas larutan juga dipengaruhi suhu, jenis dan muatan ion, konsentrasi, jarak elektroda, dan tegangan. Karena itu, membandingkan dua sampel secara adil memerlukan kondisi yang sama. Lampu redup tidak langsung membuktikan bahwa larutan merupakan nonelektrolit.',
        ],
        example: {
          title: 'Menafsirkan model partikel',
          text: 'Jika satu gambar berisi hampir seluruhnya ion, satu gambar lain berisi banyak molekul netral dan beberapa ion, dan gambar ketiga hanya molekul netral, urutkan masing-masing sebagai elektrolit kuat, elektrolit lemah, dan nonelektrolit.',
        },
        misconception:
          'Kekuatan elektrolit menjelaskan seberapa besar fraksi zat yang membentuk ion; kuat atau lemahnya nyala lampu juga dipengaruhi konsentrasi dan kondisi alat.',
        keyPoints: [
          'Larutan elektrolit kuat: banyak ion bergerak.',
          'Larutan elektrolit lemah: hanya sebagian partikel membentuk ion.',
          'Larutan nonelektrolit: hampir tidak ada ion dari zat terlarut.',
        ],
        videoQuery: 'daya hantar listrik larutan elektrolit jumlah ion kimia',
      },
    ],
  },
  {
    id: 'modul-2',
    number: 'Modul 2',
    title: 'Laboratorium Mini: Uji Daya Hantar Listrik',
    intro:
      'Pelajari prinsip rangkaian uji, langkah eksperimen yang aman, dan cara menafsirkan nyala lampu bersama pengamatan gelembung tanpa mengabaikan keterbatasan alat.',
    image: '/images/conductivity-apparatus.svg',
    objectives: [
      'Mengidentifikasi fungsi sumber listrik, kabel, lampu, dan elektroda.',
      'Melaksanakan prosedur pengujian dengan pengendalian variabel dan keselamatan.',
      'Membaca nyala lampu dan gelembung secara kritis serta memeriksa validitas alat.',
    ],
    sources: [
      {
        title: 'Chemistry 2e, §11.2 Electrolytes',
        author: 'Flowers, Theopold, Langley, & Robinson',
        publisher: 'OpenStax, Rice University (2019)',
        url: 'https://openstax.org/books/chemistry-2e/pages/11-2-electrolytes',
      },
      {
        title: 'Chemistry 2e, §11.1 The Dissolution Process',
        author: 'Flowers, Theopold, Langley, & Robinson',
        publisher: 'OpenStax, Rice University (2019)',
        url: 'https://openstax.org/books/chemistry-2e/pages/11-1-the-dissolution-process',
      },
    ],
    subtopics: [
      {
        title: '1. Prinsip kerja alat uji',
        paragraphs: [
          'Rangkaian sederhana terdiri dari sumber tegangan rendah, kabel, lampu atau indikator arus, dan dua elektroda. Saat elektroda dicelupkan ke larutan elektrolit, kation dan anion bergerak ke elektroda yang bermuatan berlawanan sehingga rangkaian dapat menghantarkan arus.',
          'Jika larutan mengandung sangat sedikit ion atau alat kurang sensitif, lampu dapat redup atau bahkan tidak terlihat menyala. Karena itu, hasil lampu perlu dibaca bersama bukti lain dan tidak boleh menjadi satu-satunya dasar klasifikasi.',
          'Rangkaian hanya dapat menyala ketika ada jalur tertutup: arus melalui kabel dan lampu, lalu melalui elektrolit di antara kedua elektroda. Di kawat logam, elektron menjadi pembawa muatan; di bagian larutan, kation dan anion bergerak ke arah elektroda bermuatan berlawanan. Pada permukaan elektroda, reaksi dapat menghasilkan gas atau produk lain.',
          'Terang lampu merupakan indikator kualitatif arus pada rangkaian tertentu, bukan ukuran langsung derajat ionisasi. Jika alat dilengkapi amperemeter atau sensor konduktivitas, arus atau konduktivitas dapat diukur lebih objektif dengan tetap menjaga geometri elektroda dan suhu.',
        ],
        equation: 'Arus listrik dalam larutan elektrolit dibawa oleh perpindahan kation dan anion.',
        example: {
          title: 'Menelusuri jalur arus',
          text: 'Mulai dari baterai menuju kabel dan lampu, lanjut ke elektroda pertama, melintasi larutan melalui ion-ion bergerak, lalu kembali melalui elektroda kedua dan kabel. Jika larutan diganti dengan nonelektrolit, jumlah pembawa muatan dalam larutan menjadi terlalu kecil untuk mengalirkan arus yang teramati.',
        },
        misconception:
          'Gelembung terbentuk karena reaksi kimia di permukaan elektroda, bukan karena gelembung itu sendiri yang membawa arus melewati larutan.',
        keyPoints: [
          'Elektroda menyediakan kontak antara rangkaian dan larutan.',
          'Ion bergerak di dalam larutan; elektron bergerak melalui kabel logam.',
          'Gunakan sumber tegangan rendah khusus demonstrasi pendidikan.',
        ],
        videoQuery: 'cara kerja alat uji elektrolit elektroda lampu praktikum kimia',
      },
      {
        title: '2. Langkah pengujian dan keselamatan',
        paragraphs: [
          'Siapkan sampel berlabel dan alat dengan sumber tegangan rendah. Celupkan kedua elektroda ke sampel tanpa membiarkan elektroda saling bersentuhan, amati lampu dan gelembung pada permukaannya, lalu catat hasil sebelum menguji sampel berikutnya.',
          'Bilas elektroda dengan air dan keringkan seperlunya di antara sampel agar larutan tidak tercampur. Jangan mencicipi bahan kimia, hindari kontak langsung dengan sampel, dan jangan pernah menghubungkan alat pendidikan ke stopkontak atau tegangan listrik rumah.',
          'Sebelum mulai, tuliskan pertanyaan eksperimen, variabel yang diubah (jenis larutan), variabel terikat (misalnya arus atau intensitas lampu), dan variabel yang dikendalikan (konsentrasi, volume, suhu, elektroda, serta lama pengamatan). Siapkan tabel dengan kolom sampel, kondisi percobaan, hasil lampu, gelembung, dan kesimpulan sementara.',
          'Gunakan sampel dalam jumlah kecil dan wadah berlabel. Matikan rangkaian sebelum membersihkan alat atau mengganti sambungan. Ikuti petunjuk guru dan lembar keselamatan bahan yang digunakan; jangan menyentuh larutan yang tidak diketahui, dan cuci tangan setelah kegiatan. Baterai atau catu daya demonstrasi harus bertegangan rendah serta tidak tersambung ke listrik rumah.',
        ],
        example: {
          title: 'Membuat perbandingan adil',
          text: 'Untuk membandingkan NaCl dan CH₃COOH, gunakan larutan dengan konsentrasi dan volume yang sama, elektroda yang sama, jarak serta kedalaman celup yang sama, baterai dan waktu pengamatan yang sama. Hanya jenis zat yang menjadi pembeda utama.',
        },
        misconception:
          'Mengganti konsentrasi, jarak elektroda, dan sampel sekaligus membuat penyebab perbedaan hasil tidak dapat ditentukan.',
        keyPoints: [
          'Jaga jarak elektroda dan kedalaman pencelupan tetap konsisten.',
          'Bilas elektroda di antara pengujian untuk mencegah kontaminasi silang.',
          'Lakukan percobaan dengan pengawasan guru dan ikuti label keselamatan bahan.',
        ],
        videoQuery: 'praktikum uji daya hantar listrik larutan prosedur keselamatan',
      },
      {
        title: '3. Membaca hasil dan mengendalikan variabel',
        paragraphs: [
          'Lampu terang dan gelembung yang terlihat biasanya menandakan arus cukup besar pada kondisi percobaan. Lampu redup atau padam dengan sedikit gelembung dapat terjadi pada elektrolit lemah atau larutan yang sangat encer. Tidak ada respons baru mendukung dugaan nonelektrolit setelah alat dipastikan bekerja.',
          'Agar perbandingan adil, samakan volume dan konsentrasi sampel, jenis serta jarak elektroda, lama pengamatan, suhu, dan kondisi baterai. Uji alat terlebih dahulu dengan larutan elektrolit yang diketahui sebagai kontrol positif, dan bila tersedia gunakan pengukur arus yang sesuai.',
          'Sebelum menguji larutan yang belum dikenal, lakukan kontrol positif menggunakan larutan elektrolit yang diketahui dan kontrol pembanding yang sesuai. Jika kontrol positif juga tidak membuat alat bereaksi, periksa baterai, sambungan kabel, lampu, kebersihan elektroda, serta kontak elektroda dengan larutan sebelum menyimpulkan apa pun tentang sampel.',
          'Catat hasil mentah terlebih dahulu, bukan hanya klasifikasinya. Ulangi pengukuran bila memungkinkan dan bandingkan hasil ulangan. Gelembung dapat baru tampak setelah beberapa saat; ketiadaannya tidak selalu berarti arus nol. Amperemeter yang sesuai atau sensor konduktivitas dapat membantu mengamati arus kecil.',
        ],
        example: {
          title: 'Menguji dugaan nonelektrolit',
          text: 'Sampel X tidak menyalakan lampu. Uji larutan NaCl yang telah diketahui tanpa mengubah setelan. Jika NaCl juga tidak menyalakan lampu, hasil untuk X belum sah—perbaiki alat terlebih dahulu. Jika kontrol bekerja, catat bahwa X tidak menunjukkan hantaran yang teramati dalam kondisi uji tersebut.',
        },
        misconception:
          'Hasil uji padam berarti “tidak terdeteksi dengan alat dan kondisi ini”, bukan bukti universal bahwa tidak ada ion sama sekali.',
        keyPoints: [
          'Jangan simpulkan nonelektrolit hanya dari lampu yang padam.',
          'Gelembung terbentuk karena reaksi elektrode dan dapat bergantung pada kondisi.',
          'Kontrol variabel membantu mengaitkan perbedaan hasil dengan jenis larutan.',
        ],
        videoQuery: 'analisis hasil percobaan daya hantar listrik larutan elektrolit',
      },
    ],
  },
  {
    id: 'modul-3',
    number: 'Modul 3',
    title: 'Jelajahi Ion: Disosiasi, Ionisasi, dan Kekuatan Elektrolit',
    intro:
      'Amati representasi partikel untuk membedakan pemisahan ion dari pembentukan ion, lalu hubungkan derajat ionisasi dengan klasifikasi elektrolit dan pengaruh pengenceran.',
    image: '/images/ionization-models.svg',
    objectives: [
      'Menyusun persamaan sederhana untuk disosiasi dan ionisasi dalam air.',
      'Menggunakan representasi partikel untuk membandingkan kekuatan elektrolit.',
      'Menghitung derajat ionisasi sederhana dan menjelaskan pengaruh pengenceran.',
    ],
    sources: [
      {
        title: 'Chemistry 2e, §11.2 Electrolytes',
        author: 'Flowers, Theopold, Langley, & Robinson',
        publisher: 'OpenStax, Rice University (2019)',
        url: 'https://openstax.org/books/chemistry-2e/pages/11-2-electrolytes',
      },
      {
        title: 'Chemistry 2e, §14.1 Brønsted-Lowry Acids and Bases',
        author: 'Flowers, Theopold, Langley, & Robinson',
        publisher: 'OpenStax, Rice University (2019)',
        url: 'https://openstax.org/books/chemistry-2e/pages/14-1-bronsted-lowry-acids-and-bases',
      },
      {
        title: 'Chemistry 2e, §14.3 Relative Strengths of Acids and Bases',
        author: 'Flowers, Theopold, Langley, & Robinson',
        publisher: 'OpenStax, Rice University (2019)',
        url: 'https://openstax.org/books/chemistry-2e/pages/14-3-relative-strengths-of-acids-and-bases',
      },
    ],
    subtopics: [
      {
        title: '1. Disosiasi dan ionisasi',
        paragraphs: [
          'Disosiasi adalah pemisahan ion-ion yang sudah terdapat dalam kisi senyawa ionik ketika zat larut. Sebagai contoh, satu satuan formula NaCl menghasilkan satu Na⁺ dan satu Cl⁻. Muatan dan jumlah atom pada persamaan harus seimbang.',
          'Ionisasi adalah pembentukan ion dari molekul netral melalui reaksi dengan air. Asam asetat, misalnya, bereaksi secara reversibel dengan air membentuk ion hidronium dan asetat. Tanda kesetimbangan menunjukkan bahwa reaksi berlangsung dua arah dan tidak semua molekul terionisasi.',
          'Keadaan fisik membantu membaca persamaan: (s) berarti padat, (l) cair, (g) gas, dan (aq) spesies berada dalam larutan air. Notasi ini mencegah salah paham antara kristal yang ion-ionnya masih berada di kisi dan ion terlarut yang dikelilingi molekul air. Persamaan kimia juga harus mempertahankan jumlah atom dan total muatan.',
          'Dalam model asam Brønsted–Lowry, asam menyumbangkan proton dan basa menerimanya. Air bertindak sebagai basa saat menerima proton dari asam asetat; hasilnya adalah H₃O⁺ dan basa konjugat CH₃COO⁻. Menuliskan H₃O⁺ lebih tepat untuk larutan air daripada menggambarkan proton bebas.',
        ],
        equation:
          'NaCl(s) → Na⁺(aq) + Cl⁻(aq);  CH₃COOH(aq) + H₂O(l) ⇌ H₃O⁺(aq) + CH₃COO⁻(aq)',
        example: {
          title: 'Kenali jenis perubahan dari persamaan',
          text: 'NaCl tersusun dari ion sebelum larut, sehingga Na⁺ dan Cl⁻ hanya berpisah: disosiasi. CH₃COOH tersusun dari molekul netral yang mentransfer H⁺ ke air: ionisasi. Panah satu arah biasa menunjukkan proses yang sangat berpihak ke produk, sedangkan ⇌ menunjukkan kesetimbangan.',
        },
        misconception:
          'Jangan menyebut setiap pembentukan ion sebagai ionisasi. Untuk garam ionik yang memisahkan ion yang telah ada, istilah yang digunakan adalah disosiasi.',
        keyPoints: [
          'Disosiasi memisahkan ion yang telah ada di dalam zat.',
          'Ionisasi membentuk ion dari molekul netral.',
          'Ion dalam persamaan harus setara muatannya.',
        ],
        videoQuery: 'perbedaan ionisasi dan disosiasi kimia SMA',
      },
      {
        title: '2. Elektrolit kuat, lemah, dan nonelektrolit',
        paragraphs: [
          'Elektrolit kuat menghasilkan ion dalam jumlah besar di dalam larutan, baik melalui disosiasi senyawa ionik yang larut maupun ionisasi yang berlangsung hampir tuntas. Elektrolit lemah hanya menghasilkan ion dari sebagian partikel sehingga kesetimbangan antara molekul dan ion terbentuk.',
          'Nonelektrolit larut tanpa menghasilkan ion dalam jumlah berarti. Kekuatan elektrolit menjelaskan derajat pembentukan ion, bukan banyaknya zat yang dilarutkan. Larutan elektrolit kuat yang encer tetap elektrolit kuat, walaupun arus yang terukur bisa kecil karena konsentrasinya rendah.',
          'Dalam model partikel, untuk jumlah zat terlarut yang sama, elektrolit kuat digambarkan terutama sebagai ion; elektrolit lemah sebagai campuran molekul netral dan ion; nonelektrolit sebagai molekul netral. Asam kuat seperti HCl bereaksi hampir tuntas dengan air, sementara asam lemah seperti CH₃COOH berada dalam kesetimbangan dan hanya sebagian molekulnya terionisasi.',
          'Klasifikasi kuat/lemah berkaitan dengan proporsi zat yang menghasilkan ion dalam kondisi tertentu. Konsentrasi adalah banyaknya zat dalam volume tertentu. Dua larutan dengan kekuatan elektrolit sama dapat memiliki konsentrasi berbeda, dan ini mengubah jumlah total ion per volume serta besar konduktivitas yang diukur.',
        ],
        example: {
          title: 'Pisahkan kekuatan dan konsentrasi',
          text: 'HCl encer tetap merupakan elektrolit kuat karena molekul HCl yang terlarut hampir seluruhnya terionisasi. Larutan CH₃COOH pekat tetap merupakan elektrolit lemah karena hanya sebagian molekulnya membentuk ion.',
        },
        misconception:
          'Kata “kuat” tidak berarti pekat, berbahaya, atau selalu menyalakan lampu paling terang; istilah ini merujuk pada pembentukan ion.',
        keyPoints: [
          'Kuat: fraksi partikel yang menjadi ion besar.',
          'Lemah: ionisasi sebagian dan ada molekul netral tersisa.',
          'Nonelektrolit: zat terlarut tetap sebagai molekul netral.',
        ],
        videoQuery: 'elektrolit kuat lemah nonelektrolit derajat ionisasi kimia',
      },
      {
        title: '3. Derajat ionisasi dan pengenceran',
        paragraphs: [
          'Derajat ionisasi (α) adalah perbandingan jumlah zat yang terionisasi dengan jumlah zat mula-mula. Nilainya berada antara 0 dan 1. Untuk elektrolit lemah, pengenceran umumnya meningkatkan fraksi molekul yang terionisasi karena kesetimbangan berubah.',
          'Kenaikan derajat ionisasi tidak otomatis berarti daya hantar spesifik meningkat. Penambahan air menurunkan konsentrasi total, sehingga jumlah ion pada setiap satuan volume dapat berkurang. Bedakan fraksi partikel yang terionisasi dari konsentrasi ion dan hasil pengukuran konduktivitas.',
          'Derajat ionisasi dapat dinyatakan sebagai pecahan atau persen. Jika dari 100 molekul zat mula-mula ada 5 yang terionisasi, α = 5/100 = 0,05 atau 5%. Untuk asam monoprotik HA, pada kesetimbangan satu molekul terionisasi menghasilkan satu H₃O⁺ dan satu A⁻; karena itu perubahan konsentrasi dapat dihubungkan melalui koefisien reaksi.',
          'Untuk asam lemah, besarnya ionisasi juga dipengaruhi kesetimbangan kimia. Konstanta ionisasi asam Ka menggambarkan posisi kesetimbangan pada suhu tertentu. Nilai Ka yang lebih besar menunjukkan ionisasi yang lebih berpihak pada produk dibandingkan asam lemah dengan Ka lebih kecil, tetapi tidak boleh disamakan begitu saja dengan persen ionisasi tanpa mengetahui konsentrasi awal.',
        ],
        equation: 'α = jumlah zat yang terionisasi ÷ jumlah zat mula-mula',
        example: {
          title: 'Menghitung derajat ionisasi',
          text: 'Jika mula-mula terdapat 0,20 mol HA dan 0,01 mol telah terionisasi, α = 0,01 ÷ 0,20 = 0,05 = 5%. Perhitungan ini mengukur fraksi yang terionisasi, bukan molaritas larutan atau konduktivitasnya.',
        },
        misconception:
          'Pengenceran dapat meningkatkan persen ionisasi asam lemah, tetapi konduktivitas spesifik (daya hantar per geometri tertentu) tidak harus ikut meningkat karena ion per satuan volume juga berubah.',
        keyPoints: [
          'α mendekati 1 berarti ionisasi berlangsung hampir sempurna.',
          'Pengenceran dapat menaikkan α untuk elektrolit lemah.',
          'Derajat ionisasi dan konsentrasi ion adalah besaran yang berbeda.',
        ],
        videoQuery: 'derajat ionisasi pengenceran elektrolit lemah asam asetat',
      },
    ],
  },
]

export const moduleLearningSupports = {
  'modul-1': {
    subtopics: [
      {
        macroscopic: 'Kristal garam dan gula sama-sama dapat menghilang dari pandangan saat diaduk ke dalam air; keduanya membentuk campuran homogen.',
        submicroscopic: 'Molekul air menarik ion dari kisi NaCl dan menghidrasi Na⁺ serta Cl⁻. Molekul sukrosa yang polar berinteraksi dengan air, tetapi molekulnya tetap utuh.',
        symbolic: 'NaCl(s) → Na⁺(aq) + Cl⁻(aq); C₁₂H₂₂O₁₁(s) → C₁₂H₂₂O₁₁(aq)',
        reflection: 'Jika larutan garam dan larutan gula sama-sama jernih, pengamatan tambahan apa yang diperlukan untuk membedakan partikel penyusunnya?',
        citation: 'OpenStax (2019, §11.1).',
      },
      {
        macroscopic: 'Pada alat uji sederhana, larutan garam biasanya menyalakan lampu; larutan gula tidak menunjukkan nyala yang berarti pada kondisi yang sama.',
        submicroscopic: 'Ion yang bergerak membawa muatan melalui larutan. Kation bergerak menuju katode (elektrode negatif), sedangkan anion menuju anode (elektrode positif).',
        symbolic: 'NaCl(aq) → Na⁺(aq) + Cl⁻(aq); HCl(aq) + H₂O(l) → H₃O⁺(aq) + Cl⁻(aq)',
        reflection: 'Mengapa elektron menjadi pembawa muatan di kabel, tetapi ion menjadi pembawa muatan di dalam larutan?',
        citation: 'OpenStax (2019, §11.2).',
      },
      {
        macroscopic: 'Nyala lampu memberi petunjuk kualitatif tentang arus dalam alat tertentu, tetapi tidak mengukur langsung fraksi zat yang terionisasi.',
        submicroscopic: 'Larutan garam larut memiliki ion, larutan asam asetat mengandung ion dan molekul netral, sedangkan larutan gula didominasi molekul netral.',
        symbolic: 'NaCl(aq) → ion-ion; CH₃COOH(aq) + H₂O(l) ⇌ H₃O⁺(aq) + CH₃COO⁻(aq); sukrosa(aq) tetap molekuler.',
        reflection: 'Mengapa hasil uji nyala harus dibandingkan pada konsentrasi dan kondisi alat yang sama?',
        citation: 'OpenStax (2019, §11.2); Suari (2019).',
      },
    ],
    applications: {
      title: 'Elektrolit di sekitar kita',
      note: 'Contoh berikut menjelaskan komposisi secara umum. Produk komersial dapat mengandung campuran zat; jangan menyimpulkan konduktivitas hanya dari nama atau kejernihannya.',
      rows: [
        ['Air garam', 'NaCl terlarut terdisosiasi menjadi ion bergerak.', 'Elektrolit; daya hantar bergantung pada konsentrasi dan kondisi.'],
        ['Air mineral', 'Mengandung ion mineral terlarut dalam kadar yang bervariasi.', 'Dapat menghantarkan listrik; hasil antarproduk tidak sama.'],
        ['Larutan gula', 'Sukrosa larut sebagai molekul netral, bukan ion.', 'Nonelektrolit untuk sukrosa murni dalam air.'],
        ['Cuka', 'Asam asetat terionisasi sebagian dalam air.', 'Elektrolit lemah; cuka pangan adalah campuran.'],
        ['Minuman elektrolit', 'Dapat mengandung ion seperti Na⁺, K⁺, dan Cl⁻ serta zat lain.', 'Konduktivitas ditentukan oleh komposisi, bukan klaim kemasan saja.'],
        ['Cairan aki timbal-asam', 'Elektrolitnya adalah larutan asam sulfat; baterai menghasilkan listrik melalui reaksi redoks.', 'Bukan sekadar alat uji konduktivitas; jangan membuka atau menangani aki.'],
        ['Pupuk cair', 'Komposisi berbeda; pupuk yang mengandung garam terlarut menyediakan ion.', 'Ikuti label dan prosedur keselamatan produk.'],
      ],
      image: {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Car_battery_cross-section.jpeg/500px-Car_battery_cross-section.jpeg',
        alt: 'Foto potongan melintang aki mobil yang memperlihatkan bagian dalam baterai timbal-asam.',
        caption: 'Aki mobil timbal-asam: contoh penerapan elektrokimia, bukan foto uji daya hantar larutan.',
        source: 'Wikimedia Commons, “Car battery cross-section.jpeg”',
        author: 'Ben Cossalter',
        license: 'CC BY-SA 3.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
        pageUrl: 'https://commons.wikimedia.org/wiki/File:Car_battery_cross-section.jpeg',
      },
    },
  },
  'modul-2': {
    subtopics: [
      {
        macroscopic: 'Pada rangkaian tertutup, lampu dapat menyala ketika ada jalur penghantar melalui larutan.',
        submicroscopic: 'Elektron bergerak melalui kawat; di larutan, kation dan anion bergerak ke elektrode dengan muatan berlawanan. Reaksi elektrode dapat terjadi pada permukaannya.',
        symbolic: 'Kawat: aliran elektron; larutan: perpindahan ion. Anode (+) menarik anion dan katode (−) menarik kation pada alat elektrolisis.',
        reflection: 'Di bagian mana rangkaian elektron harus digantikan oleh gambaran gerak ion?',
        citation: 'OpenStax (2019, §11.2).',
        visual: {
          src: 'https://openstax.org/apps/image-cdn/v1/f=webp/apps/archive/20260604.144757/resources/187c4636de22e76c8ee80d274211b6dfbdbe35aa',
          alt: 'Diagram OpenStax yang membandingkan respons tiga larutan pada rangkaian uji lampu.',
          caption: 'Gambar 11.6 membandingkan partikel zat dan daya hantar secara skematis. Ilustrasi buku menampilkan stopkontak sebagai gambaran konseptual—jangan ditiru; praktik kelas hanya boleh memakai sumber tegangan rendah di bawah pengawasan guru.',
          source: 'Flowers et al., Chemistry 2e, Figure 11.6, OpenStax',
          author: 'OpenStax, Rice University',
          license: 'CC BY-NC-SA 4.0',
          licenseUrl: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
          pageUrl: 'https://openstax.org/books/chemistry-2e/pages/11-2-electrolytes',
        },
      },
      {
        macroscopic: 'Percobaan membandingkan larutan dalam volume, suhu, waktu pengamatan, jenis elektrode, dan jarak elektrode yang dibuat sama.',
        submicroscopic: 'Jenis zat memengaruhi jenis dan jumlah ion yang ada; suhu serta konsentrasi juga mengubah gerak dan jumlah pembawa muatan.',
        symbolic: 'Variabel bebas: jenis larutan. Variabel terikat: arus atau nyala. Variabel kontrol: konsentrasi, volume, suhu, elektrode, dan geometri.',
        reflection: 'Apa yang harus dibuat tetap agar perbedaan hasil dapat dikaitkan dengan jenis larutan?',
        citation: 'OpenStax (2019, §11.2).',
      },
      {
        macroscopic: 'Catat nyala dan gelembung sebagai pengamatan terpisah; gelembung hanya muncul jika reaksi elektrode menghasilkan gas dalam kondisi tersebut.',
        submicroscopic: 'Lampu merespons arus total, yang dipengaruhi konsentrasi, muatan, dan mobilitas ion serta rancangan alat.',
        symbolic: 'Konduktivitas bergantung pada konsentrasi dan mobilitas ion; tidak sama dengan derajat ionisasi saja.',
        reflection: 'Jika lampu padam, kontrol apa yang memastikan bahwa alat masih berfungsi?',
        citation: 'OpenStax (2019, §11.2 dan §17.7).',
      },
    ],
    observationTable: {
      title: 'Prakiraan kualitatif uji beberapa larutan',
      label: 'Prakiraan ilustratif—bukan data eksperimen. Hasil aktual bergantung pada konsentrasi, suhu, komposisi, elektrode, dan sensitivitas alat.',
      headers: ['Sampel', 'Partikel utama dalam air', 'Prakiraan respons alat sederhana'],
      rows: [
        ['NaCl(aq)', 'Na⁺ dan Cl⁻ terhidrasi', 'Lampu biasanya jelas pada konsentrasi memadai.'],
        ['CH₃COOH(aq)', 'Molekul CH₃COOH serta sebagian H₃O⁺ dan CH₃COO⁻', 'Nyala dapat lebih redup; dipengaruhi konsentrasi dan alat.'],
        ['Sukrosa(aq)', 'Molekul sukrosa netral', 'Tidak ada nyala berarti pada alat sederhana.'],
        ['Air mineral', 'Air dan ion mineral dengan kadar bervariasi', 'Respons dapat berbeda antarproduk.'],
        ['Air suling', 'H₂O dengan jumlah sangat kecil H₃O⁺ dan OH⁻', 'Biasanya tidak tampak menyala pada alat sederhana.'],
      ],
      interpretation: 'Tabel ini membantu membuat hipotesis, bukan menggantikan pengukuran. Air murni tidak benar-benar bebas ion, dan lampu yang padam hanya berarti arus tidak teramati dengan kondisi uji itu.',
    },
  },
  'modul-3': {
    subtopics: [
      {
        macroscopic: 'Kristal garam larut dan menyebar; asam asetat bercampur dengan air tanpa terlihat terpisah.',
        submicroscopic: 'Pada disosiasi, ion yang sudah ada pada zat ionik terpisah. Pada ionisasi, molekul netral bereaksi dengan air membentuk ion.',
        symbolic: 'NaCl(s) → Na⁺(aq) + Cl⁻(aq); CH₃COOH(aq) + H₂O(l) ⇌ H₃O⁺(aq) + CH₃COO⁻(aq)',
        reflection: 'Dari persamaan reaksi, bagaimana kamu mengetahui apakah zat awalnya berupa ion atau molekul netral?',
        citation: 'OpenStax (2019, §§11.1, 14.1).',
      },
      {
        macroscopic: 'Larutan elektrolit kuat umumnya memberi respons arus lebih jelas daripada larutan elektrolit lemah pada kondisi sebanding; ini bukan aturan untuk membandingkan sampel sembarang.',
        submicroscopic: 'Elektrolit kuat menghasilkan banyak ion dari zat terlarut; elektrolit lemah berada dalam kesetimbangan dengan molekul netral; nonelektrolit tetap terutama molekuler.',
        symbolic: 'HCl(aq) + H₂O(l) → H₃O⁺(aq) + Cl⁻(aq); CH₃COOH(aq) + H₂O(l) ⇌ H₃O⁺(aq) + CH₃COO⁻(aq)',
        reflection: 'Mengapa kata “kuat” tidak dapat dipakai untuk menyatakan larutan itu pekat?',
        citation: 'OpenStax (2019, §§11.2, 14.3); Suari (2019); Syauqiah et al. (2024).',
      },
      {
        macroscopic: 'Pengenceran menurunkan jumlah zat per volume; perubahan nyala atau bacaan konduktivitas perlu ditafsirkan bersama perubahan fraksi ionisasi.',
        submicroscopic: 'Untuk elektrolit lemah, pengenceran umumnya meningkatkan fraksi yang terionisasi, tetapi menurunkan konsentrasi total partikel per volume.',
        symbolic: 'α = n terionisasi ÷ n mula-mula; Ka = [H₃O⁺][CH₃COO⁻] ÷ [CH₃COOH]. Untuk CH₃COOH, Ka ≈ 1,8 × 10⁻⁵ pada 25 °C.',
        reflection: 'Bagaimana α bisa meningkat sementara jumlah ion per volume atau konduktivitas terukur tidak meningkat?',
        citation: 'OpenStax (2019, §14.3).',
      },
    ],
    structureTable: {
      title: 'Struktur zat dan perilaku dalam air',
      headers: ['Jenis zat', 'Saat zat dilarutkan', 'Contoh'],
      rows: [
        ['Senyawa ionik yang larut', 'Ion dalam kisi terpisah dan terhidrasi (disosiasi).', 'NaCl → Na⁺ + Cl⁻'],
        ['Molekul kovalen yang bereaksi dengan air', 'Molekul membentuk ion melalui reaksi (ionisasi).', 'HCl + H₂O → H₃O⁺ + Cl⁻'],
        ['Molekul kovalen yang tidak membentuk ion', 'Molekul netral tetap tersebar di antara molekul air.', 'Sukrosa(aq)'],
      ],
      interpretation: 'Jenis ikatan memberi petunjuk awal, tetapi kelarutan dan reaksi zat dengan air menentukan apakah ion bergerak terbentuk. Tidak semua senyawa kovalen nonelektrolit dan tidak semua zat ionik larut banyak.',
    },
    factorsTable: {
      title: 'Faktor yang memengaruhi daya hantar larutan',
      headers: ['Faktor', 'Pengaruh terhadap pengamatan'],
      rows: [
        ['Konsentrasi ion', 'Lebih banyak pembawa muatan per volume umumnya meningkatkan konduktivitas; hubungan tidak selalu linear pada semua konsentrasi.'],
        ['Muatan dan jumlah ion', 'Stoikiometri disosiasi dan besar muatan memengaruhi banyaknya muatan yang dapat dibawa.'],
        ['Jenis dan mobilitas ion', 'Ion yang berbeda bergerak dengan laju berbeda dalam medan listrik; karena itu jenis ion penting, bukan hanya jumlahnya.'],
        ['Derajat ionisasi', 'Menentukan fraksi zat terlarut yang menjadi ion; sangat penting untuk membandingkan elektrolit kuat dan lemah.'],
        ['Temperatur', 'Perubahan suhu memengaruhi gerak ion, viskositas pelarut, dan kesetimbangan; bandingkan sampel pada suhu yang sama.'],
        ['Alat dan geometri', 'Jarak dan luas elektrode, tegangan, serta sensitivitas sensor memengaruhi arus atau bacaan yang teramati.'],
      ],
      interpretation: 'Konduktivitas terukur merupakan sifat larutan dan kondisi pengukuran sekaligus. Untuk membandingkan jenis zat, kendalikan konsentrasi, suhu, dan geometri elektrode.',
    },
  },
}

export const courseReferences = [
  {
    citation: 'Flowers, P., Theopold, K., Langley, R., & Robinson, W. R. (2019). Chemistry 2e. OpenStax, Rice University.',
    linkText: 'https://openstax.org/details/books/chemistry-2e',
    url: 'https://openstax.org/details/books/chemistry-2e',
    type: 'Buku teks kimia terbuka; §§11.1–11.2, 14.1, 14.3, 17.2, dan 17.7.',
  },
  {
    citation: 'Suari, N. N. J. (2019). Profil model mental siswa tentang larutan elektrolit dan nonelektrolit. Jurnal Pendidikan Kimia Indonesia, 2(2), 59.',
    linkText: 'https://doi.org/10.23887/jpk.v2i2.16615',
    url: 'https://doi.org/10.23887/jpk.v2i2.16615',
    type: 'Penelitian pendidikan kimia; membahas variasi model mental siswa.',
  },
  {
    citation: 'Widayanti, Y. (2021). The development of e-instrument to test students mental models on electrolyte and non-electrolyte solutions. Edukimia, 3(3), 174–177.',
    linkText: 'https://doi.org/10.24036/ekj.v3.i3.a287',
    url: 'https://doi.org/10.24036/ekj.v3.i3.a287',
    type: 'Penelitian pengembangan instrumen; validasi, bukan uji efektivitas pembelajaran.',
  },
  {
    citation: 'Hasna, H., Laksmiwati, D., Hadisaputra, S., & Muti’ah. (2023). Development of a contextual-based chemistry e-module on electrolyte and non-electrolyte solutions for high school students. Chemistry Education Practice, 6(1), 123–127.',
    linkText: 'https://doi.org/10.29303/cep.v6i1.3608',
    url: 'https://doi.org/10.29303/cep.v6i1.3608',
    type: 'Penelitian pengembangan e-modul kontekstual.',
  },
  {
    citation: 'Syauqiah, N., Rahmawati, H., & Irawati, R. K. (2024). Validity of student worksheets based on multiple representations of electrolyte and non-electrolyte solution materials. Journal of Mathematics Science and Computer Education, 4(1), 35.',
    linkText: 'https://doi.org/10.20527/jmscedu.v4i1.11322',
    url: 'https://doi.org/10.20527/jmscedu.v4i1.11322',
    type: 'Penelitian pengembangan LKPD berbasis multipel representasi; melaporkan validasi ahli.',
  },
]

export { quizQuestions }
