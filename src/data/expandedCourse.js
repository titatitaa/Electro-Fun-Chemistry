const openStaxSection = (section) => (
  `https://openstax.org/books/chemistry-2e/pages/${section}`
)

export const expandedCourseReferences = [
  {
    citation: 'Flowers, P., Theopold, K., Langley, R., & Robinson, W. R. (2019). Chemistry 2e. OpenStax, Rice University.',
    detail: 'Rujukan konsep larutan, elektrolit, kelarutan, kesetimbangan, dan elektrokimia.',
    url: 'https://openstax.org/details/books/chemistry-2e',
    sections: [
      { label: '§11.1 The Dissolution Process', url: openStaxSection('11-1-the-dissolution-process') },
      { label: '§11.2 Electrolytes', url: openStaxSection('11-2-electrolytes') },
      { label: '§11.3 Solubility', url: openStaxSection('11-3-solubility') },
      { label: '§13.1 Chemical Equilibria', url: openStaxSection('13-1-chemical-equilibria') },
      { label: '§17.2 Galvanic Cells', url: openStaxSection('17-2-galvanic-cells') },
      { label: '§17.7 Electrolysis', url: openStaxSection('17-7-electrolysis') },
    ],
  },
  {
    citation: 'Suari, N. N. J. (2019). Profil model mental siswa tentang larutan elektrolit dan nonelektrolit. Jurnal Pendidikan Kimia Indonesia, 2(2), 59.',
    detail: 'Penelitian pendidikan tentang variasi model mental siswa pada topik elektrolit.',
    url: 'https://doi.org/10.23887/jpk.v2i2.16615',
  },
  {
    citation: 'Widayanti, Y. (2021). The development of e-instrument to test students mental models on electrolyte and non-electrolyte solutions. Edukimia, 3(3), 174–177.',
    detail: 'Pengembangan instrumen untuk menilai model mental siswa.',
    url: 'https://doi.org/10.24036/ekj.v3.i3.a287',
  },
  {
    citation: 'Hasna, H., Laksmiwati, D., Hadisaputra, S., & Muti’ah. (2023). Development of a contextual-based chemistry e-module on electrolyte and non-electrolyte solutions for high school students. Chemistry Education Practice, 6(1), 123–127.',
    detail: 'Pengembangan e-modul kontekstual untuk materi elektrolit dan nonelektrolit.',
    url: 'https://doi.org/10.29303/cep.v6i1.3608',
  },
  {
    citation: 'Syauqiah, N., Rahmawati, H., & Irawati, R. K. (2024). Validity of student worksheets based on multiple representations of electrolyte and non-electrolyte solution materials. Journal of Mathematics Science and Computer Education, 4(1), 35.',
    detail: 'Validasi LKPD berbasis multipel representasi pada topik elektrolit.',
    url: 'https://doi.org/10.20527/jmscedu.v4i1.11322',
  },
]

const question = (prompt, options, answer, explanation) => ({
  prompt,
  options,
  answer,
  explanation,
})

export const expandedChapters = [
  {
    id: 'bab-1',
    title: 'Pengenalan Larutan',
    lead: 'Mulai dari benda dan minuman di sekitar kita: apa yang membuat campuran disebut larutan, dan apa bedanya dari suspensi atau koloid?',
    objectives: [
      'Menguraikan peran pelarut dan zat terlarut serta proses pelarutan.',
      'Membedakan larutan, koloid, dan suspensi berdasarkan sifat campurannya.',
      'Menghubungkan contoh sehari-hari dengan komponen dan sifat campurannya.',
    ],
    summary: [
      'Larutan adalah campuran homogen dengan zat terlarut yang tersebar di dalam pelarut.',
      'Larutan, koloid, dan suspensi berbeda dalam ukuran partikel, kestabilan, dan kecenderungan mengendap.',
      'Pelarutan gula dan garam tampak mirip, tetapi partikel penyusunnya berbeda.',
    ],
    reflection: 'Apa bukti yang kamu perlukan untuk mengetahui apakah campuran bening berisi molekul netral atau ion?',
    sections: [
      {
        title: 'Campuran homogen dan komponennya',
        paragraphs: [
          'Larutan adalah campuran homogen dengan komposisi seragam pada skala pengamatan. Komponen yang jumlahnya relatif lebih banyak disebut pelarut, sedangkan zat yang tersebar di dalamnya disebut zat terlarut. Istilah ini ditentukan oleh komposisi dan fase, bukan oleh apakah zat tersebut padat atau cair.',
          'Pada air garam, air merupakan pelarut dan natrium klorida zat terlarut. Pada cuka dapur, asam asetat bercampur dengan air. Larutan dapat berupa gas, cair, atau padat; udara merupakan campuran gas homogen dan kuningan merupakan larutan padat logam.',
        ],
      },
      {
        title: 'Bagaimana zat melarut?',
        paragraphs: [
          'Pelarutan terjadi ketika interaksi pelarut dengan partikel zat terlarut cukup menguntungkan untuk menyebarkan partikel ke seluruh campuran. Molekul air yang polar mengelilingi ion garam (hidrasi), sedangkan molekul sukrosa yang polar berinteraksi dengan air namun tetap sebagai molekul utuh. Pengadukan mempercepat pencampuran; pemanasan dapat mempercepat pelarutan padatan tertentu, tetapi tidak selalu menaikkan kelarutan semua zat.',
          'Larutan jenuh mengandung jumlah zat terlarut maksimum pada suhu tertentu dalam kesetimbangan dengan zat yang belum larut. Kejernihan saja tidak mengungkap apakah partikel terlarut berupa molekul atau ion.',
        ],
      },
      {
        title: 'Larutan, koloid, dan suspensi',
        paragraphs: [
          'Larutan sejati memiliki partikel sangat kecil yang tersebar homogen dan tidak mengendap. Koloid memiliki partikel terdispersi lebih besar, dapat menghamburkan cahaya (efek Tyndall), tetapi umumnya tidak cepat mengendap. Suspensi memiliki partikel besar yang dapat tampak keruh dan mengendap jika didiamkan; penyaringan biasa dapat memisahkan sebagian partikelnya.',
          'Sebutan homogen atau heterogen bergantung pada skala dan fase yang dikaji. Koloid sering tampak seragam oleh mata, tetapi secara mikroskopik merupakan fase terdispersi di dalam medium pendispersi.',
        ],
      },
    ],
    equations: [
      'Konsentrasi molar, M = n / V (mol·L⁻¹); n adalah mol zat terlarut dan V volume akhir larutan dalam liter.',
      'NaCl(s) → Na⁺(aq) + Cl⁻(aq)  |  C₁₂H₂₂O₁₁(s) → C₁₂H₂₂O₁₁(aq)',
    ],
    examples: [
      ['Air garam', 'Kristal garam terdispersi sebagai ion terhidrasi sehingga campuran tampak seragam dan tidak mengendap.'],
      ['Air gula', 'Sukrosa larut sebagai molekul netral; larutan bening tidak berarti zat menghasilkan ion.'],
      ['Cuka dan air mineral', 'Cuka adalah campuran asam asetat dalam air; air mineral mengandung ion terlarut dengan kadar yang bergantung pada sumber dan merek.'],
    ],
    applications: [
      ['Membuat oralit', 'Garam dan gula harus larut merata dalam air sesuai petunjuk kemasan agar komposisi larutan yang diminum seragam.'],
      ['Pengolahan air keruh', 'Pengendapan atau filtrasi membantu memisahkan partikel suspensi; zat terlarut sejati memerlukan proses lain.'],
    ],
    case: {
      prompt: 'Segelas air sungai tampak keruh dan meninggalkan endapan setelah didiamkan, sedangkan air garam tetap bening. Apa perbedaan campurannya?',
      answer: 'Endapan menunjukkan partikel suspensi yang cukup besar dan dapat mengendap. Air garam merupakan larutan homogen selama garam berada di bawah batas kelarutannya.',
    },
    misconception: 'Semua campuran bening bukan berarti zat penyusunnya berperilaku sama; larutan gula dan garam sama-sama homogen tetapi hanya larutan garam menghasilkan ion.',
    visual: 'mixtures',
    referenceKeys: [0],
    questions: [
      question('Pada larutan air garam yang encer, komponen yang berperan sebagai pelarut ialah …', ['Air', 'Natrium klorida', 'Ion klorida saja', 'Gelas'], 0, 'Air merupakan komponen yang melarutkan NaCl dan jumlahnya lebih banyak pada larutan encer.'),
      question('Campuran yang partikelnya dapat mengendap bila didiamkan paling tepat disebut …', ['Larutan', 'Suspensi', 'Pelarut', 'Campuran gas'], 1, 'Partikel suspensi relatif besar sehingga dapat mengendap.'),
      question('Larutan gula tidak menghantarkan listrik dengan baik karena …', ['Gula tidak larut dalam air', 'Molekul gula tetap netral saat larut', 'Air tidak memiliki molekul', 'Gula mengendap seluruhnya'], 1, 'Sukrosa terlarut sebagai molekul netral, bukan ion bergerak.'),
      question('Saat membuat larutan, pengadukan terutama …', ['Selalu menambah kelarutan maksimum', 'Mempercepat penyebaran zat terlarut', 'Mengubah semua zat menjadi ion', 'Mengubah larutan menjadi koloid'], 1, 'Pengadukan mempercepat kontak dan penyebaran partikel, namun tidak otomatis mengubah identitas kimia zat.'),
      question('Air sungai keruh meninggalkan endapan. Bukti ini paling mendukung bahwa sampel mengandung …', ['Suspensi', 'Larutan gas', 'Hanya ion terhidrasi', 'Logam murni'], 0, 'Partikel yang mengendap merupakan ciri campuran suspensi.'),
    ],
  },
  {
    id: 'bab-2',
    title: 'Konsep Elektrolit dan Nonelektrolit',
    lead: 'Kunci daya hantar bukan sekadar zat larut, tetapi keberadaan pembawa muatan yang dapat bergerak di dalam larutan.',
    objectives: [
      'Menjelaskan hubungan ion bergerak dan arus listrik dalam larutan.',
      'Membedakan kation, anion, ionisasi, dan disosiasi.',
      'Menghubungkan pengamatan, model partikel, dan persamaan kimia.',
    ],
    summary: [
      'Ion bergerak membawa muatan dalam larutan, sedangkan elektron bergerak dalam kawat logam.',
      'Disosiasi memisahkan ion yang telah ada; ionisasi membentuk ion dari molekul netral.',
      'Penjelasan kimia menghubungkan bukti makroskopik, model partikel, dan persamaan simbolik.',
    ],
    reflection: 'Bagaimana kamu membedakan apa yang benar-benar diamati dari penjelasan tentang partikel yang tidak terlihat?',
    sections: [
      {
        title: 'Ion sebagai pembawa muatan',
        paragraphs: [
          'Elektrolit menghasilkan ion bergerak ketika dilarutkan atau dilelehkan sehingga dapat menghantarkan arus. Kation bermuatan positif dan anion bermuatan negatif. Dalam medan listrik, kation bergerak menuju katode bermuatan negatif dan anion menuju anode bermuatan positif.',
          'Di kabel logam pembawa muatan utamanya elektron; di larutan elektrolit pembawa muatannya ion. Nonelektrolit seperti sukrosa dapat larut tetapi tidak menghasilkan ion dalam jumlah berarti, sehingga daya hantarnya sangat kecil.',
        ],
      },
      {
        title: 'Disosiasi dan ionisasi',
        paragraphs: [
          'Disosiasi adalah pemisahan ion-ion yang sudah ada dalam kristal ionik ketika zat larut. Ionisasi adalah pembentukan ion dari molekul netral melalui reaksi dengan pelarut. HCl merupakan senyawa molekuler yang bereaksi dengan air; asam asetat mengalami ionisasi sebagian.',
          'Sejarah singkat: gagasan disosiasi elektrolit dikembangkan melalui kajian konduktivitas dan teori ion pada abad ke-19. Arrhenius mengusulkan bahwa elektrolit membentuk ion dalam larutan; pemahaman modern melengkapinya dengan interaksi ion-pelarut serta kesetimbangan kimia.',
        ],
      },
      {
        title: 'Tiga cara membaca satu fenomena',
        paragraphs: [
          'Makroskopik: lampu alat uji menyala atau arus terukur. Submikroskopik: ion bergerak membawa muatan melalui larutan. Simbolik: persamaan menunjukkan zat awal dan ion yang terbentuk. Ketiganya saling melengkapi; lampu adalah observasi, bukan gambar langsung partikel.',
          'Senyawa ionik seperti NaCl tersusun dari ion sebelum dilarutkan; banyak senyawa kovalen seperti sukrosa tetap berupa molekul. Sebagian senyawa kovalen polar seperti HCl bereaksi dengan air membentuk ion.',
        ],
      },
    ],
    equations: [
      'NaCl(s) → Na⁺(aq) + Cl⁻(aq)  (disosiasi)',
      'HCl(aq) + H₂O(l) → H₃O⁺(aq) + Cl⁻(aq)  (ionisasi)',
      'CH₃COOH(aq) + H₂O(l) ⇌ H₃O⁺(aq) + CH₃COO⁻(aq)',
    ],
    examples: [
      ['Larutan garam dapur', 'Ion Na⁺ dan Cl⁻ bergerak dalam air dan membawa muatan.'],
      ['Cuka', 'Asam asetat membentuk sebagian ion H₃O⁺ dan CH₃COO⁻, sementara sebagian besar tetap berupa molekul.'],
      ['Air gula', 'Sukrosa larut tetapi tetap sebagai molekul netral sehingga berbeda dari larutan garam.'],
    ],
    applications: [
      ['Memeriksa air mineral', 'Sensor konduktivitas memperkirakan banyaknya ion terlarut; nilainya bukan identifikasi jenis ion satu per satu.'],
      ['Memahami cairan tubuh', 'Ion seperti Na⁺ dan K⁺ berperan dalam keseimbangan cairan dan sinyal listrik biologis; konsentrasinya diatur tubuh.'],
    ],
    case: {
      prompt: 'Gula dan garam sama-sama menghilang setelah diaduk. Prediksi mana yang menyalakan alat uji dan jelaskan pada tingkat partikel.',
      answer: 'Larutan garam biasanya menghantarkan karena mengandung ion Na⁺ dan Cl⁻ bergerak. Gula larut sebagai molekul netral sehingga tidak menyediakan pembawa muatan sebanding.',
    },
    misconception: 'Semua zat yang larut dalam air pasti elektrolit. Pelarutan adalah proses pencampuran; pembentukan ion ditentukan oleh struktur dan reaksi zat.',
    visual: 'particles',
    referenceKeys: [0, 1, 4],
    questions: [
      question('Partikel bermuatan positif disebut …', ['Anion', 'Kation', 'Molekul netral', 'Pelarut'], 1, 'Kation adalah ion bermuatan positif.'),
      question('Pada kawat logam, pembawa muatan utamanya adalah …', ['Molekul air', 'Elektron', 'Anion', 'Gelembung'], 1, 'Arus di kawat logam terutama melibatkan gerak elektron.'),
      question('Proses NaCl(s) → Na⁺(aq) + Cl⁻(aq) disebut …', ['Ionisasi', 'Disosiasi', 'Netralisasi', 'Pengendapan'], 1, 'NaCl telah tersusun dari ion; pelarutan memisahkan ion-ion tersebut.'),
      question('Mengapa CH₃COOH menggunakan tanda kesetimbangan dalam persamaan ionisasinya?', ['Karena ionisasi berlangsung sebagian dan bolak-balik', 'Karena tidak larut dalam air', 'Karena tidak ada molekul netral', 'Karena menghasilkan endapan'], 0, 'Asam asetat lemah terionisasi sebagian dan berada dalam kesetimbangan dengan molekulnya.'),
      question('Pernyataan yang menghubungkan tiga representasi dengan benar adalah …', ['Lampu menyala = pengamatan; ion bergerak = model partikel; persamaan = simbolik', 'Persamaan adalah hasil yang terlihat langsung', 'Ion hanya terdapat pada gambar', 'Lampu menunjukkan rumus molekul'], 0, 'Makroskopik adalah pengamatan, submikroskopik menjelaskan partikel, simbolik menyatakan proses melalui rumus.'),
    ],
  },
  {
    id: 'bab-3',
    title: 'Klasifikasi Larutan Elektrolit',
    lead: 'Kuat atau lemahnya elektrolit menunjukkan derajat pembentukan ion, bukan seberapa pekat larutan dibuat.',
    objectives: [
      'Membedakan elektrolit kuat, elektrolit lemah, dan nonelektrolit.',
      'Menafsirkan derajat ionisasi dan persamaan reaksi.',
      'Membaca nyala lampu dan gelembung secara kualitatif dengan hati-hati.',
    ],
    summary: [
      'Kuat, lemah, dan nonelektrolit dibedakan oleh banyaknya zat terlarut yang menghasilkan ion.',
      'Konsentrasi larutan berbeda makna dengan derajat ionisasi.',
      'Nyala dan gelembung adalah petunjuk kualitatif yang bergantung pada kondisi uji.',
    ],
    reflection: 'Variabel apa yang perlu dikendalikan agar respons dua larutan dapat dibandingkan secara adil?',
    sections: [
      {
        title: 'Elektrolit kuat',
        paragraphs: [
          'Elektrolit kuat terdisosiasi atau terionisasi hampir sempurna dalam larutan pada kondisi yang sesuai. Contoh umumnya adalah garam mudah larut seperti NaCl, asam kuat seperti HCl, dan basa kuat seperti NaOH. Istilah “kuat” merujuk pada pembentukan ion, bukan konsentrasi.',
          'Larutan elektrolit kuat encer tetap tergolong elektrolit kuat, tetapi jumlah ion per volume kecil dan lampu dapat tampak kurang terang dibanding larutan yang lebih pekat.',
        ],
      },
      {
        title: 'Elektrolit lemah dan nonelektrolit',
        paragraphs: [
          'Elektrolit lemah hanya terionisasi sebagian. Asam asetat dan amonia dalam air menjadi contoh; jumlah molekul netral dan ion berada dalam kesetimbangan. Derajat ionisasi α adalah fraksi zat yang membentuk ion. Nonelektrolit seperti sukrosa tidak menghasilkan ion dalam jumlah berarti saat larut.',
          'Pengamatan alat sederhana: kuat sering memberikan lampu lebih terang, lemah bisa redup atau tak tampak, dan nonelektrolit biasanya tidak menyalakan lampu. Gelembung dapat muncul akibat reaksi elektroda, tetapi hasil dipengaruhi konsentrasi, jarak elektroda, tegangan, dan sensitivitas alat.',
        ],
      },
      {
        title: 'Membaca perbandingan dengan adil',
        paragraphs: [
          'Perbandingan klasifikasi bermakna jika kondisi pengukuran sebanding. Larutan kuat yang sangat encer dapat memberi arus lebih kecil daripada larutan lemah yang lebih pekat. Karena itu intensitas lampu tidak mengukur α secara langsung.',
          'Dalam model partikel, elektrolit kuat digambarkan terutama sebagai ion; elektrolit lemah sebagai campuran molekul netral dan ion; nonelektrolit sebagai molekul netral. Model adalah representasi, bukan foto partikel sesungguhnya.',
        ],
      },
    ],
    equations: [
      'NaOH(s) → Na⁺(aq) + OH⁻(aq)',
      'CH₃COOH(aq) + H₂O(l) ⇌ H₃O⁺(aq) + CH₃COO⁻(aq)',
      'Sukrosa(aq): C₁₂H₂₂O₁₁ tetap sebagai molekul netral',
    ],
    examples: [
      ['NaCl dan NaOH', 'Zat terlarut menghasilkan ion bergerak dalam air sehingga termasuk elektrolit kuat pada kondisi umum.'],
      ['Asam asetat pada cuka', 'Ionisasi sebagian menjadikan cuka elektrolit lemah; cuka pangan juga mengandung air dan komponen lain.'],
      ['Larutan sukrosa', 'Sukrosa larut, tetapi tidak terionisasi secara berarti dan termasuk nonelektrolit.'],
    ],
    applications: [
      ['Memilih larutan standar', 'Larutan garam tertentu dapat digunakan sebagai pembanding alat konduktivitas, dengan konsentrasi dan prosedur terkontrol.'],
      ['Membaca minuman elektrolit', 'Ion terlarut dapat menghantarkan arus, tetapi klaim “elektrolit” tidak menjelaskan komposisi atau kesesuaian konsumsi.'],
    ],
    comparison: [
      ['Kuat', 'α mendekati 1 untuk zat terlarut yang larut', 'Banyak ion relatif terhadap zat terlarut', 'Umumnya baik; besarnya tetap dipengaruhi konsentrasi', 'Sering terang', 'Dapat tampak; bergantung reaksi elektrode', 'NaCl, HCl, NaOH'],
      ['Lemah', '0 < α < 1', 'Ion dan molekul netral bersama', 'Menghantarkan; respons alat bisa kecil', 'Redup atau tak tampak', 'Sedikit atau tidak tampak', 'CH₃COOH, NH₃(aq)'],
      ['Nonelektrolit', 'Mendekati 0 untuk pembentukan ion', 'Didominasi molekul netral', 'Sangat kecil pada kondisi uji sederhana', 'Biasanya padam', 'Biasanya tidak tampak akibat elektrolisis', 'Sukrosa, etanol'],
    ],
    case: {
      prompt: 'Pada alat yang sama, X lebih terang daripada Y. Bolehkah langsung menyimpulkan X memiliki α lebih besar?',
      answer: 'Tidak. Konsentrasi, identitas dan mobilitas ion, suhu, geometri elektroda, dan tegangan ikut memengaruhi arus. Nyala lampu adalah indikator kualitatif.',
    },
    misconception: 'Elektrolit lemah bukan berarti tidak terionisasi; sebagian partikel membentuk ion. Elektrolit kuat pun tidak selalu pekat.',
    visual: 'classification',
    referenceKeys: [0, 1],
    questions: [
      question('Kekuatan elektrolit terutama menyatakan …', ['Konsentrasi larutan', 'Derajat pembentukan ion', 'Volume pelarut', 'Warna larutan'], 1, 'Istilah kuat/lemah mengacu pada seberapa besar zat menghasilkan ion, bukan konsentrasi awal.'),
      question('Sampel yang mengandung banyak molekul netral dan sebagian ion paling sesuai dengan …', ['Elektrolit lemah', 'Elektrolit kuat', 'Logam padat', 'Suspensi'], 0, 'Elektrolit lemah terionisasi sebagian sehingga terdapat molekul netral dan ion.'),
      question('Mengapa larutan elektrolit kuat encer dapat menyalakan lampu lebih redup?', ['Jumlah ion per volume dapat lebih sedikit', 'Ia berubah menjadi nonelektrolit', 'Ion tidak bermuatan', 'Air menjadi logam'], 0, 'Konsentrasi ion memengaruhi arus meskipun zatnya tetap elektrolit kuat.'),
      question('Gelembung pada elektroda merupakan …', ['Ukuran langsung derajat ionisasi', 'Kemungkinan produk reaksi elektroda', 'Bukti pasti larutan nonelektrolit', 'Ion yang membentuk arus di kawat'], 1, 'Gas dapat terbentuk melalui reaksi elektrode; kemunculannya bergantung pada kondisi.'),
      question('Hubungan derajat ionisasi yang tepat untuk elektrolit kuat adalah …', ['Mendekati 1 bagi zat yang larut', 'Selalu sama dengan konsentrasi molar', 'Selalu 0', 'Tidak terkait pembentukan ion'], 0, 'Elektrolit kuat mengalami pembentukan ion hampir sempurna, dengan batasan kondisi dan kelarutan.'),
    ],
  },
  {
    id: 'bab-4',
    title: 'Mekanisme Daya Hantar Listrik',
    lead: 'Ikuti jalur muatan dari sumber listrik, melalui kabel, lalu melewati ion yang bergerak di dalam larutan.',
    objectives: [
      'Menjelaskan pembawa muatan di logam dan larutan.',
      'Menentukan arah gerak kation dan anion pada sel elektrolisis.',
      'Menjelaskan faktor yang menentukan kuat arus dalam larutan.',
    ],
    summary: [
      'Arus memerlukan rangkaian tertutup dan pembawa muatan yang dapat bergerak.',
      'Dalam sel elektrolisis, kation menuju katode negatif dan anion menuju anode positif.',
      'Konduktivitas dipengaruhi konsentrasi, muatan, mobilitas ion, suhu, dan kondisi sel.',
    ],
    reflection: 'Mengapa arah gerak anion berlawanan dengan arah gerak kation tetapi keduanya sama-sama berkontribusi pada arus?',
    sections: [
      {
        title: 'Rangkaian dan pembawa muatan',
        paragraphs: [
          'Arus memerlukan rangkaian tertutup dan partikel bermuatan yang dapat bergerak. Pada kawat logam, elektron bergerak melalui kisi logam. Pada larutan, ion positif dan negatif bermigrasi di bawah pengaruh medan listrik; tumbukan dengan pelarut membatasi geraknya.',
          'Pada sel elektrolisis, katode terhubung ke kutub negatif sumber dan menarik kation; anode terhubung ke kutub positif dan menarik anion. Definisi anode adalah tempat oksidasi dan katode tempat reduksi. Tanda elektrode tersebut berlaku untuk sel elektrolisis, sedangkan pada sel galvanik tandanya berbeda.',
        ],
      },
      {
        title: 'Konduktivitas bukan hanya hitungan ion',
        paragraphs: [
          'Konduktivitas dipengaruhi jumlah dan muatan ion, konsentrasi, mobilitas ion, suhu, jenis pelarut, serta desain sel. Banyak ion bergerak biasanya mendukung arus lebih besar, tetapi ion dengan mobilitas berbeda memberi kontribusi berbeda.',
          'Elektrode adalah antarmuka tempat muatan berpindah antara konduktor elektronik dan larutan ionik. Jika reaksi berlangsung, proses redoks terjadi di permukaan elektrode. Gelembung bukan pembawa arus melintasi larutan.',
        ],
      },
      {
        title: 'Arah gerak dan konvensi arus',
        paragraphs: [
          'Kation tertarik ke katode negatif dan anion ke anode positif dalam sel elektrolisis. Gerak muatan negatif berlawanan arah dengan arah arus konvensional; gabungan perpindahan ion positif dan negatif tetap membentuk arus di larutan.',
          'Diagram berikut menunjukkan migrasi ion secara sederhana. Ukuran panah hanya menunjukkan arah, bukan kecepatan atau jumlah ion yang sebenarnya.',
        ],
      },
    ],
    equations: [
      'Katode (−): reduksi; menarik kation.  |  Anode (+): oksidasi; menarik anion (sel elektrolisis).',
      'NaCl(aq) → Na⁺(aq) + Cl⁻(aq); muatan di larutan dibawa oleh ion bergerak.',
    ],
    examples: [
      ['Air laut', 'Garam terlarut menyediakan ion bergerak; komposisi dan konduktivitas bergantung pada kandungan mineral.'],
      ['Larutan garam', 'Kation dan anion bermigrasi menuju elektroda bermuatan berlawanan ketika diberi beda potensial.'],
      ['Air suling', 'Air sangat murni memiliki sangat sedikit ion sehingga daya hantarnya rendah, tetapi bukan nol mutlak.'],
    ],
    applications: [
      ['Sensor konduktivitas', 'Mengukur respons listrik larutan untuk pemantauan kualitas air atau proses, bukan menentukan semua zat terlarut secara spesifik.'],
      ['Elektrolisis', 'Arus melalui elektrolit dapat mendorong reaksi redoks pada elektrode dan digunakan dalam pelapisan atau pemurnian tertentu.'],
    ],
    case: {
      prompt: 'Mengapa lampu pada larutan dapat mati jika salah satu kabel terputus meskipun larutan mengandung banyak ion?',
      answer: 'Rangkaian menjadi terbuka sehingga muatan tidak dapat mengalir kontinu. Keberadaan ion saja tidak cukup; dibutuhkan jalur tertutup dan beda potensial.',
    },
    misconception: 'Elektron tidak mengalir bebas menyeberangi seluruh larutan seperti di kawat; di larutan elektrolit, pembawa muatan utamanya adalah ion.',
    visual: 'migration',
    referenceKeys: [0],
    questions: [
      question('Dalam larutan elektrolit, pembawa muatan bergerak terutama adalah …', ['Elektron bebas saja', 'Kation dan anion', 'Molekul netral', 'Gelembung gas'], 1, 'Ion bergerak membawa muatan di dalam fase larutan.'),
      question('Pada sel elektrolisis, kation bermigrasi menuju …', ['Anode positif', 'Katode negatif', 'Permukaan air saja', 'Kabel netral'], 1, 'Muatan positif tertarik menuju elektrode negatif, yaitu katode pada sel elektrolisis.'),
      question('Definisi elektrokimia yang benar adalah …', ['Anode tempat reduksi', 'Katode tempat oksidasi', 'Anode tempat oksidasi', 'Katode selalu positif'], 2, 'Anode merupakan tempat oksidasi; tanda elektrode bergantung jenis sel.'),
      question('Rangkaian yang terbuka tidak mengalirkan arus kontinu karena …', ['Tidak ada jalur tertutup', 'Larutan menjadi jenuh', 'Ion menjadi netral semua', 'Lampu menghasilkan ion'], 0, 'Arus memerlukan jalur lengkap melalui rangkaian dan sampel.'),
      question('Gelembung yang timbul di elektroda terutama menunjukkan …', ['Perpindahan gelembung sebagai arus utama', 'Kemungkinan pembentukan produk gas pada reaksi elektrode', 'Bahwa semua ion berhenti', 'Bahwa larutan pasti nonelektrolit'], 1, 'Gas dapat dihasilkan oleh reaksi elektrode, tetapi bukan pembawa arus di larutan.'),
    ],
  },
  {
    id: 'bab-5',
    title: 'Percobaan Identifikasi Elektrolit',
    lead: 'Rancang uji yang aman dan adil; catat nyala, gelembung, serta kondisi alat sebelum menarik kesimpulan.',
    objectives: [
      'Mengenali fungsi bagian-bagian alat uji sederhana.',
      'Menerapkan prosedur pengujian dengan pengendalian variabel.',
      'Menyimpulkan hasil secara kualitatif tanpa menganggap lampu sebagai alat ukur kuantitatif.',
    ],
    summary: [
      'Uji yang adil menggunakan kondisi dan prosedur yang sama untuk setiap sampel.',
      'Kontrol positif membantu memastikan rangkaian bekerja sebelum data ditafsirkan.',
      'Lampu dan gelembung memberi bukti kualitatif; catat keduanya terpisah.',
    ],
    reflection: 'Apa yang akan kamu periksa terlebih dahulu jika kontrol positif dan sampel sama-sama tidak menyalakan lampu?',
    sections: [
      {
        title: 'Alat, fungsi, dan prinsip',
        paragraphs: [
          'Alat uji edukasi terdiri atas sumber tegangan rendah, kabel, lampu atau indikator, dua elektrode, serta wadah sampel. Sumber memberi beda potensial; kabel menghubungkan rangkaian; elektrode menjadi kontak ke larutan; lampu menunjukkan arus yang cukup untuk menyalakannya.',
          'Jarak elektrode harus tetap dan keduanya tidak boleh bersentuhan. Kontak langsung memintas sampel dan membuat hasil tidak valid. Untuk mengukur konduktivitas kuantitatif diperlukan instrumen yang sesuai dan prosedur terkalibrasi.',
        ],
      },
      {
        title: 'Prosedur dan keselamatan',
        paragraphs: [
          'Siapkan sampel berlabel dan volume kecil. Periksa alat dengan kontrol positif yang diketahui, matikan sumber ketika mengganti sampel, lalu celupkan elektrode pada kedalaman dan jarak yang sama. Amati lampu dan gelembung secara terpisah serta catat durasi pengamatan.',
          'Bilas elektrode di antara sampel untuk menghindari kontaminasi silang. Gunakan hanya sumber tegangan rendah pendidikan di bawah pengawasan guru. Jangan gunakan listrik rumah, mencicipi larutan, atau menyentuh larutan yang tidak dikenal; ikuti petunjuk keselamatan sekolah.',
        ],
      },
      {
        title: 'Interpretasi data pengamatan',
        paragraphs: [
          'Terang lampu adalah indikator kualitatif arus pada rangkaian tertentu, bukan pembacaan kuantitatif langsung konduktivitas atau derajat ionisasi. Gelembung dapat berasal dari reaksi elektrode; ketiadaannya tidak otomatis menunjukkan tidak ada arus.',
          'Bandingkan NaCl, HCl, dan NaOH pada kondisi terkendali sebagai elektrolit kuat; CH₃COOH sebagai elektrolit lemah; larutan gula sebagai nonelektrolit. Air mineral dapat menghantarkan karena mengandung ion dengan kadar bervariasi; air suling sangat murni memiliki daya hantar rendah.',
        ],
      },
    ],
    equations: [
      'HCl(aq) + H₂O(l) → H₃O⁺(aq) + Cl⁻(aq)',
      'NaOH(s) → Na⁺(aq) + OH⁻(aq)',
    ],
    examples: [
      ['NaCl, HCl, dan NaOH', 'Pada larutan yang cukup pekat, biasanya menghasilkan respons jelas karena menghasilkan ion; sifat elektrode dan kondisi uji tetap penting.'],
      ['CH₃COOH dan gula', 'Asam asetat terionisasi sebagian; gula larut sebagai molekul netral. Respons alat dapat berbeda.'],
      ['Air mineral dan air suling', 'Mineral terlarut menyediakan ion; air suling yang sangat murni memiliki sedikit ion dan respons rendah.'],
    ],
    applications: [
      ['Kontrol positif', 'Larutan elektrolit yang telah diketahui membantu memastikan rangkaian, baterai, dan lampu bekerja sebelum sampel dianalisis.'],
      ['Uji kualitas air awal', 'Konduktivitas dapat menjadi skrining kandungan ion total; hasil tidak menggantikan pemeriksaan kontaminan spesifik.'],
    ],
    observation: [
      ['NaCl(aq)', 'Na⁺, Cl⁻', 'Biasanya terang pada konsentrasi memadai', 'Dapat terbentuk', 'Elektrolit kuat'],
      ['CH₃COOH(aq)', 'H₃O⁺, CH₃COO⁻ dan molekul', 'Redup atau tak tampak', 'Sedikit atau tak tampak', 'Elektrolit lemah'],
      ['Gula(aq)', 'Molekul sukrosa', 'Biasanya padam', 'Tidak diharapkan dari elektrolisis larutan', 'Nonelektrolit'],
      ['HCl / NaOH(aq)', 'Ion terlarut', 'Biasanya jelas pada kondisi sesuai', 'Dapat terbentuk', 'Elektrolit kuat'],
      ['Air mineral', 'Ion mineral bervariasi', 'Bervariasi', 'Bergantung kondisi', 'Mengandung elektrolit; respons bergantung komposisi'],
      ['Air suling', 'Sangat sedikit ion jika murni', 'Biasanya padam/redup', 'Umumnya tidak tampak', 'Daya hantar sangat rendah'],
    ],
    case: {
      prompt: 'Sampel A tidak menyalakan lampu. Kontrol positif NaCl juga tidak menyalakan lampu. Langkah ilmiah berikutnya?',
      answer: 'Jangan simpulkan sampel A nonelektrolit. Periksa baterai, kabel, lampu, sambungan, dan kebersihan elektrode; ulangi setelah kontrol positif berhasil.',
    },
    misconception: 'Lampu padam bukan bukti tunggal nonelektrolit. Gelembung dan nyala adalah indikator kualitatif yang bergantung alat serta kondisi sampel.',
    visual: 'apparatus',
    referenceKeys: [0],
    questions: [
      question('Fungsi utama elektrode pada alat uji larutan adalah …', ['Menimbang zat', 'Menghubungkan rangkaian listrik dengan sampel', 'Mengatur warna larutan', 'Menaikkan kelarutan'], 1, 'Elektrode menyediakan antarmuka listrik antara rangkaian dan larutan.'),
      question('Mengapa elektrode tidak boleh saling bersentuhan?', ['Supaya larutan tidak menguap', 'Kontak dapat memintas sampel', 'Agar suhu selalu naik', 'Agar zat menjadi koloid'], 1, 'Jika bersentuhan, arus dapat melewati jalur pintas dan tidak menguji larutan.'),
      question('Jika kontrol positif gagal menyalakan lampu, kesimpulan paling tepat adalah …', ['Sampel pasti nonelektrolit', 'Alat perlu diperiksa sebelum sampel ditafsirkan', 'Semua sampel adalah elektrolit lemah', 'Air suling menjadi elektrolit kuat'], 1, 'Kontrol yang gagal menunjukkan masalah alat atau prosedur mungkin terjadi.'),
      question('Nyala lampu pada uji sederhana merupakan …', ['Pengukuran kuantitatif langsung nilai konduktivitas', 'Indikator kualitatif arus pada alat tertentu', 'Pengukuran derajat ionisasi yang tepat', 'Bukti jenis ion spesifik'], 1, 'Nyala bergantung pada alat dan kondisi; pengukuran kuantitatif memerlukan instrumen yang sesuai.'),
      question('Agar membandingkan NaCl dan CH₃COOH secara adil, siswa sebaiknya …', ['Mengubah konsentrasi dan jarak elektrode sekaligus', 'Menjaga kondisi uji sama dan mengganti jenis larutan', 'Memakai satu elektrode saja', 'Menggunakan listrik rumah'], 1, 'Mengendalikan variabel lain membantu mengaitkan perbedaan respons dengan larutan yang diuji.'),
    ],
  },
  {
    id: 'bab-6',
    title: 'Faktor Daya Hantar Listrik',
    lead: 'Jenis elektrolit, konsentrasi, mobilitas ion, suhu, dan pelarut bersama-sama menentukan konduktivitas yang terukur.',
    objectives: [
      'Mengidentifikasi faktor larutan dan faktor alat yang memengaruhi pengukuran.',
      'Membedakan konsentrasi ion, konduktivitas, dan derajat ionisasi.',
      'Menjelaskan dampak pengenceran terhadap elektrolit lemah.',
    ],
    summary: [
      'Konduktivitas bergantung pada jumlah ion bergerak dan mobilitasnya.',
      'Suhu, jenis pelarut, dan rancangan pengukuran juga mengubah hasil.',
      'Pengenceran elektrolit lemah dapat menaikkan derajat ionisasi tanpa menaikkan konduktivitas spesifik.',
    ],
    reflection: 'Mengapa peningkatan persen ionisasi setelah pengenceran tidak selalu berarti arus yang lebih besar?',
    sections: [
      {
        title: 'Konsentrasi dan jenis ion',
        paragraphs: [
          'Konsentrasi ion yang lebih besar umumnya menyediakan lebih banyak pembawa muatan per volume. Namun konduktivitas tidak selalu meningkat secara linear pada semua konsentrasi karena interaksi ion, viskositas, dan mobilitas turut berubah.',
          'Ion dengan muatan dan ukuran terhidrasi berbeda memiliki mobilitas berbeda. Zat yang menghasilkan beberapa ion per satuan formula juga dapat memberi konsentrasi ion berbeda dibanding elektrolit lain pada konsentrasi formal sama.',
        ],
      },
      {
        title: 'Suhu dan pelarut',
        paragraphs: [
          'Kenaikan suhu pada larutan berair sering meningkatkan mobilitas ion karena viskositas air menurun, tetapi suhu juga dapat mengubah kesetimbangan dan sifat larutan. Perbandingan eksperimen harus dilakukan pada suhu terkendali.',
          'Kepolaran dan kemampuan pelarut menstabilkan ion memengaruhi pembentukan serta pemisahan ion. Air adalah pelarut polar yang baik untuk banyak garam; perilaku di pelarut lain tidak otomatis sama.',
        ],
      },
      {
        title: 'Pengenceran dan derajat ionisasi',
        paragraphs: [
          'Untuk elektrolit lemah, pengenceran dapat menaikkan fraksi molekul yang terionisasi menurut kesetimbangan. Namun jumlah ion per satuan volume dapat turun karena larutan menjadi lebih encer. Maka kenaikan derajat ionisasi tidak berarti konduktivitas spesifik selalu naik.',
          'Derajat ionisasi α adalah fraksi partikel zat yang membentuk ion. Konduktivitas menggambarkan kemampuan larutan menghantarkan arus pada keadaan tertentu. Keduanya berkaitan, tetapi bukan besaran yang sama.',
        ],
      },
    ],
    equations: [
      'α = jumlah zat yang terionisasi / jumlah zat mula-mula',
      'CH₃COOH(aq) + H₂O(l) ⇌ H₃O⁺(aq) + CH₃COO⁻(aq)',
      'M₁V₁ = M₂V₂ (pengenceran; jumlah mol zat terlarut tetap)',
    ],
    examples: [
      ['NaCl pekat dan encer', 'NaCl tetap elektrolit kuat, tetapi larutan encer mengandung lebih sedikit ion per satuan volume.'],
      ['Pengenceran cuka', 'Fraksi CH₃COOH yang terionisasi dapat bertambah, sementara konsentrasi ion per volume dapat berkurang.'],
      ['Larutan hangat dan dingin', 'Mobilitas ion dan viskositas pelarut dapat berubah dengan suhu; pengukuran harus mengendalikan temperatur.'],
    ],
    applications: [
      ['Pemantauan air proses', 'Sensor konduktivitas membantu memantau variasi ion terlarut dalam proses pengolahan air.'],
      ['Kontrol formulasi minuman', 'Komposisi ion dan konsentrasi berpengaruh pada konduktivitas, namun nilai tersebut sendiri tidak menentukan keamanan atau rasa.'],
    ],
    factors: [
      ['Konsentrasi ion', 'Lebih banyak pembawa muatan per volume umumnya menaikkan konduktivitas; respons tidak selalu linear.'],
      ['Jenis elektrolit', 'Elektrolit kuat menghasilkan banyak ion relatif terhadap zatnya; elektrolit lemah hanya sebagian terionisasi.'],
      ['Muatan dan mobilitas ion', 'Muatan, ukuran terhidrasi, dan interaksi dengan pelarut memengaruhi laju migrasi ion.'],
      ['Suhu larutan', 'Suhu dapat mengubah viskositas, mobilitas ion, dan kesetimbangan; kendalikan suhu saat membandingkan.'],
      ['Jenis pelarut', 'Kepolaran dan kemampuan menstabilkan ion memengaruhi pemisahan serta keberadaan ion dalam larutan.'],
      ['Pengenceran elektrolit lemah', 'Fraksi ionisasi dapat naik, tetapi konsentrasi ion per volume dapat turun; konduktivitas tidak otomatis naik.'],
    ],
    case: {
      prompt: 'Setelah cuka diencerkan, persen ionisasi CH₃COOH meningkat. Apakah nilai konduktivitas pasti meningkat?',
      answer: 'Tidak. Derajat ionisasi bisa meningkat, tetapi total konsentrasi zat dan ion per volume turun. Konduktivitas spesifik bergantung pada konsentrasi ion, mobilitas, suhu, dan kondisi ukur.',
    },
    misconception: 'Konsentrasi tinggi, derajat ionisasi besar, dan konduktivitas tinggi bukan istilah yang saling menggantikan.',
    visual: 'factors',
    referenceKeys: [0],
    questions: [
      question('Faktor yang secara langsung menambah pembawa muatan per volume adalah …', ['Konsentrasi ion', 'Warna wadah', 'Nama larutan', 'Bentuk tabel'], 0, 'Jumlah ion tersedia per satuan volume berkaitan dengan kemampuan membawa arus.'),
      question('Pada pengenceran elektrolit lemah, derajat ionisasi dapat naik tetapi …', ['Konduktivitas pasti menjadi nol', 'Konsentrasi ion per volume tetap dapat turun', 'Zat berubah menjadi garam', 'Semua molekul menjadi ion'], 1, 'Persen ionisasi dapat naik saat konsentrasi total menurun, sehingga ion per volume tidak harus meningkat.'),
      question('Mengapa suhu perlu dikendalikan saat membandingkan dua sampel?', ['Suhu dapat memengaruhi mobilitas ion dan sifat larutan', 'Suhu mengubah semua kation menjadi anion', 'Suhu menentukan nama kimia', 'Suhu membuat alat tidak memerlukan listrik'], 0, 'Temperatur dapat memengaruhi gerak ion, viskositas, dan kesetimbangan.'),
      question('Derajat ionisasi α paling tepat didefinisikan sebagai …', ['Volume dibagi massa', 'Fraksi zat awal yang terionisasi', 'Jumlah elektrode', 'Arus dibagi waktu'], 1, 'α membandingkan jumlah zat yang terionisasi dengan jumlah zat mula-mula.'),
      question('Untuk percobaan pengaruh jenis larutan, variabel yang harus dibuat sama antara lain …', ['Konsentrasi dan jarak elektroda', 'Nama sampel', 'Hasil pengamatan', 'Jenis zat yang sengaja diubah'], 0, 'Mengendalikan faktor lain menjadikan perbandingan lebih valid.'),
    ],
  },
  {
    id: 'bab-7',
    title: 'Penerapan Elektrolit dalam Kehidupan',
    lead: 'Dari oralit hingga aki, ion berperan dalam fungsi biologis, perpindahan muatan, dan proses elektrokimia.',
    objectives: [
      'Menjelaskan peran ion dalam larutan tubuh dan produk sehari-hari.',
      'Menghubungkan elektrolit dengan sel galvanik dan elektrolisis.',
      'Membedakan konduktivitas larutan dari fungsi kimia penerapannya.',
    ],
    summary: [
      'Ion berperan pada fungsi fisiologis dan harus berada pada kadar yang sesuai.',
      'Sel galvanik menghasilkan listrik dari reaksi spontan, sedangkan elektrolisis memakai listrik untuk mendorong reaksi.',
      'Konduktivitas membantu memantau ion, tetapi tidak mengidentifikasi semua bahaya atau komposisi.',
    ],
    reflection: 'Mengapa hasil pengukuran konduktivitas saja belum cukup untuk menyatakan air aman diminum?',
    sections: [
      {
        title: 'Elektrolit dalam tubuh dan air',
        paragraphs: [
          'Cairan tubuh mengandung ion seperti Na⁺, K⁺, Ca²⁺, Cl⁻, dan HCO₃⁻. Ion berperan dalam keseimbangan osmotik, kerja saraf dan otot, serta keseimbangan asam-basa. Konsentrasinya diatur melalui proses fisiologis; larutan buatan tidak menggantikan evaluasi medis.',
          'Oralit memanfaatkan perpaduan air, glukosa, dan elektrolit dengan komposisi yang dirancang untuk membantu penyerapan air dan garam pada kondisi tertentu. Gunakan sesuai petunjuk tenaga kesehatan atau kemasan; jangan meracik dengan takaran sembarang.',
        ],
      },
      {
        title: 'Air laut, air mineral, dan larutan garam',
        paragraphs: [
          'Air laut menghantarkan listrik karena mengandung berbagai ion terlarut, terutama ion natrium dan klorida. Air sumur dan air mineral memiliki kandungan ion yang dipengaruhi geologi, sumber, dan pengolahan.',
          'Keberadaan ion tidak otomatis berarti air aman diminum. Konduktivitas hanya menggambarkan respons listrik total dan tidak mengidentifikasi kontaminan tertentu.',
        ],
      },
      {
        title: 'Aki dan elektrolisis',
        paragraphs: [
          'Aki timbal-asam menggunakan larutan asam sulfat sebagai elektrolit dan mengubah energi kimia menjadi listrik melalui reaksi redoks pada elektroda. Aki mengandung bahan korosif dan tidak boleh dibuka atau dijadikan alat praktikum siswa.',
          'Pada elektrolisis, sumber listrik memaksa reaksi redoks nonspontan. Industri menggunakannya antara lain untuk pelapisan, pemurnian logam, dan produksi bahan kimia; penerapan spesifik memerlukan kendali proses dan keselamatan.',
        ],
      },
    ],
    equations: [
      'Sel galvanik: reaksi redoks spontan mengubah energi kimia menjadi energi listrik.',
      'Elektrolisis: energi listrik mendorong reaksi redoks nonspontan.',
      'NaCl(aq) → Na⁺(aq) + Cl⁻(aq) (model ion dalam air garam)',
    ],
    examples: [
      ['Oralit', 'Ion dan glukosa bekerja dalam larutan sesuai komposisi terukur; ikuti petunjuk resmi.'],
      ['Air laut dan air sumur', 'Ion terlarut membuat keduanya menghantarkan dengan tingkat berbeda sesuai komposisi.'],
      ['Aki kendaraan', 'Elektrolit asam sulfat mendukung perpindahan ion dan reaksi redoks; aki bukan alat uji larutan.'],
    ],
    applications: [
      ['Pelapisan logam', 'Elektrolisis dapat mengendapkan logam pada permukaan benda melalui reaksi di katode.'],
      ['Pengolahan air', 'Konduktivitas dapat menjadi salah satu parameter pemantauan, tetapi pengujian lain diperlukan untuk menilai kualitas dan keamanan.'],
    ],
    case: {
      prompt: 'Air sumur memiliki konduktivitas lebih tinggi daripada air suling. Apakah itu membuktikan air sumur aman diminum?',
      answer: 'Tidak. Konduktivitas mengindikasikan adanya ion yang dapat bergerak, tetapi tidak mengidentifikasi jenis ion atau keberadaan mikroorganisme dan kontaminan tertentu.',
    },
    misconception: 'Minuman berlabel elektrolit atau air dengan konduktivitas tertentu tidak otomatis aman atau sesuai untuk setiap orang dan keadaan.',
    visual: 'applications',
    referenceKeys: [0],
    questions: [
      question('Ion elektrolit tubuh berperan antara lain dalam …', ['Menghantarkan sinyal saraf dan menjaga keseimbangan cairan', 'Mengubah semua zat menjadi gula', 'Menghentikan seluruh reaksi kimia', 'Membuat air tidak memiliki massa'], 0, 'Ion seperti Na⁺ dan K⁺ memiliki peran fisiologis penting yang diatur tubuh.'),
      question('Mengapa konduktivitas air tidak cukup untuk menyatakan air aman diminum?', ['Tidak mengidentifikasi kontaminan tertentu atau mikroorganisme', 'Konduktivitas selalu nol', 'Air tidak mengandung ion', 'Lampu alat menentukan rasa'], 0, 'Konduktivitas adalah ukuran respons listrik total, bukan analisis spesifik semua bahaya.'),
      question('Pada aki timbal-asam, larutan elektrolitnya adalah …', ['Asam sulfat', 'Sukrosa', 'Etanol murni', 'Air tanpa zat terlarut'], 0, 'Aki timbal-asam menggunakan larutan asam sulfat dalam sistem redoks.'),
      question('Elektrolisis menggunakan energi listrik untuk …', ['Mendorong reaksi redoks nonspontan', 'Membuat pelarut hilang', 'Menghilangkan muatan ion', 'Mengukur massa secara langsung'], 0, 'Sumber listrik eksternal mendorong reaksi yang tidak spontan.'),
      question('Sikap aman terhadap aki kendaraan adalah …', ['Membuka dan mengambil elektrolit untuk uji', 'Menghindari pembukaan dan mengikuti prosedur keselamatan', 'Menyentuh elektrode dengan tangan', 'Menghubungkan aki ke alat praktikum tanpa pengawasan'], 1, 'Aki mengandung bahan korosif dan energi listrik; bukan bahan praktikum siswa.'),
    ],
  },
  {
    id: 'bab-8',
    title: 'Miskonsepsi dan Refleksi Konsep',
    lead: 'Uji pemahaman dengan membedakan apa yang terlihat, apa yang terjadi pada partikel, dan apa yang dapat disimpulkan dari data.',
    objectives: [
      'Mengoreksi miskonsepsi umum berdasarkan model partikel dan bukti.',
      'Menilai keterbatasan lampu, gelembung, dan konduktivitas.',
      'Menyusun penjelasan ilmiah yang konsisten dari fenomena hingga persamaan.',
    ],
    summary: [
      'Larut tidak selalu berarti menghasilkan ion; zat ionik padat pun perlu ion yang bergerak untuk menghantarkan.',
      'Satu indikator atau pengukuran tanpa kontrol tidak cukup untuk menyimpulkan sifat sampel.',
      'Penjelasan ilmiah menyatakan bukti, mekanisme partikel, persamaan, dan batas kesimpulan.',
    ],
    reflection: 'Pilih satu miskonsepsi yang pernah kamu yakini. Bukti dan model partikel apa yang mengubah pemahamanmu?',
    sections: [
      {
        title: 'Larut tidak selalu berarti menjadi ion',
        paragraphs: [
          'Gula dapat larut dalam air tanpa membentuk ion. Kristal NaCl dan gula sama-sama dapat menghilang dari pandangan, tetapi model partikel dan perilaku listriknya berbeda. Pengamatan perlu dijelaskan dengan sifat zat, bukan penampilan saja.',
          'Senyawa ionik padat juga tidak selalu menghantarkan listrik: ionnya tersusun dalam kisi dan tidak bebas bergerak. Lelehan atau larutannya dapat menghantarkan jika ion dapat berpindah.',
        ],
      },
      {
        title: 'Lampu padam bukan jawaban final',
        paragraphs: [
          'Lampu yang tidak menyala dapat disebabkan larutan sangat encer, elektrolit lemah, alat tidak sensitif, baterai lemah, sambungan buruk, atau sampel nonelektrolit. Periksa kontrol positif, kondisi alat, dan kemungkinan pengukuran arus kecil sebelum menyimpulkan.',
          'Gelembung bukan bukti tunggal daya hantar; gas dapat terbentuk melalui reaksi elektrode. Tidak adanya gelembung pun tidak membuktikan arus nol. Catat observasi dan pisahkan dari interpretasi.',
        ],
      },
      {
        title: 'Bangun penjelasan berbasis bukti',
        paragraphs: [
          'Penjelasan yang baik menyebut bukti makroskopik, menjelaskan partikel yang bergerak, lalu menuliskan persamaan yang relevan. Hindari mengklaim hasil eksperimen yang belum dilakukan; tabel prakiraan harus diberi label sebagai prediksi.',
          'Gunakan pola: “Saya mengamati …; pada tingkat partikel …; persamaan yang mewakili …; kesimpulan ini berlaku dengan asumsi …”. Cara tersebut membantu menghubungkan bukti dan model tanpa menyamakan model dengan realitas secara harfiah.',
        ],
      },
    ],
    equations: [
      'NaCl(s) → Na⁺(aq) + Cl⁻(aq); NaCl(s) memiliki ion tetapi ion dalam kisi tidak bergerak bebas.',
      'C₁₂H₂₂O₁₁(s) → C₁₂H₂₂O₁₁(aq); sukrosa larut sebagai molekul netral.',
    ],
    examples: [
      ['Gula larut tetapi lampu padam', 'Konsisten dengan molekul sukrosa netral; hasil tetap perlu kontrol alat.'],
      ['Lampu padam dan kontrol positif gagal', 'Data belum cukup untuk mengklasifikasikan sampel karena alat belum terbukti bekerja.'],
      ['Padatan garam dan lelehan garam', 'Ion ada pada keduanya, tetapi mobilitas ion sangat berbeda karena struktur fase.'],
    ],
    applications: [
      ['Mengevaluasi klaim air “murni”', 'Perlu metode dan parameter yang jelas; satu pengamatan lampu tidak mengukur semua jenis kontaminan.'],
      ['Menulis laporan praktikum', 'Pisahkan tabel observasi, analisis partikel, persamaan, kesimpulan, serta keterbatasan alat.'],
    ],
    case: {
      prompt: 'Siswa menyimpulkan “larutan pasti nonelektrolit karena lampu tidak menyala” tanpa menguji alat. Bagaimana memperbaiki kesimpulannya?',
      answer: 'Nyatakan bahwa lampu tidak menyala adalah observasi. Uji alat dengan kontrol positif, periksa sambungan dan elektrode, pertimbangkan konsentrasi/sensitivitas, lalu gunakan bukti tambahan sebelum mengklasifikasikan sampel.',
    },
    misconception: 'Lampu padam berarti nonelektrolit; elektrolit kuat berarti larutan pekat; elektrolit lemah tidak terionisasi; semua zat larut pasti menghantarkan.',
    visual: 'evidence',
    referenceKeys: [0, 1, 2, 3, 4],
    questions: [
      question('Gula larut dalam air tetapi tidak menyalakan lampu karena …', ['Gula tidak pernah larut', 'Sukrosa tetap sebagai molekul netral', 'Air selalu menghambat arus', 'Gula berubah menjadi logam'], 1, 'Pelarutan sukrosa tidak menghasilkan ion dalam jumlah berarti.'),
      question('Kristal NaCl padat tidak menghantarkan listrik dengan baik karena …', ['Tidak memiliki ion', 'Ion terkunci pada kisi dan tidak bebas bergerak', 'Mengandung elektron bebas seperti logam', 'Tidak memiliki massa'], 1, 'Ion tersedia tetapi mobilitasnya dalam kisi padat sangat terbatas.'),
      question('Jika lampu padam, langkah awal yang tepat adalah …', ['Langsung menyatakan nonelektrolit', 'Memeriksa alat dan menguji kontrol positif', 'Mengubah semua sampel sekaligus', 'Menambahkan listrik rumah'], 1, 'Kontrol positif memastikan alat bekerja sebelum menginterpretasikan sampel.'),
      question('Lampu terang mengukur secara langsung …', ['Derajat ionisasi dengan tepat', 'Tidak mengukur α secara langsung; hanya respons kualitatif alat', 'Jenis ion tertentu', 'Konsentrasi setiap zat secara spesifik'], 1, 'Nyala lampu bergantung berbagai variabel dan bukan ukuran langsung α atau komposisi spesifik.'),
      question('Penjelasan multipel representasi yang baik harus …', ['Menyebut observasi, model partikel, dan persamaan yang sesuai', 'Menganggap gambar partikel sebagai foto', 'Mengabaikan kondisi alat', 'Menyamakan semua larutan jernih'], 0, 'Penalaran menghubungkan bukti makroskopik, mekanisme submikroskopik, dan simbol kimia.'),
    ],
  },
]
