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

export { quizQuestions }
