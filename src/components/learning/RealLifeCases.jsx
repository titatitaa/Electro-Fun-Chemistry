import { useEffect, useState } from 'react'
import { readLearningData, writeLearningData, recordLearningActivity } from '../../data/learningStore.js'
import './RealLifeCases.css'

const CASES = [
  {
    id: 'rehydration',
    category: 'Kesehatan',
    title: 'Oralit dan penyerapan air',
    image: 'Cholera rehydration nurses.jpg',
    alt: 'Petugas kesehatan merawat pasien dalam konteks program rehidrasi kolera.',
    caption: 'Foto dokumentasi perawatan rehidrasi kolera.',
    focus: 'Ion dan transpor bersama glukosa',
    context: 'Diare dapat menyebabkan tubuh kehilangan air dan garam. Larutan rehidrasi oral (oralit/ORS) memasok air, glukosa, dan elektrolit dalam komposisi terukur.',
    prompt: 'Mengapa larutan rehidrasi oral mengandung glukosa sekaligus garam, bukan sekadar air?',
    concept: 'Natrium dan glukosa diserap bersama melalui mekanisme transpor di usus; penyerapan keduanya membantu penyerapan air. Garam terlarut terdisosiasi menjadi ion bergerak, sehingga larutan juga menghantarkan listrik.',
    equation: 'NaCl(aq) → Na⁺(aq) + Cl⁻(aq)',
    questions: [
      {
        question: 'Partikel apa yang membawa muatan dalam larutan oralit?',
        answer: 'Ion terlarut, misalnya Na⁺, K⁺, dan Cl⁻, bergerak di dalam larutan. Glukosa tetap sebagai molekul netral; keberadaannya penting untuk penyerapan, bukan untuk menghantarkan arus sebagai ion.',
      },
      {
        question: 'Apakah minum garam atau oralit yang lebih pekat selalu lebih baik?',
        answer: 'Tidak. Oralit harus dilarutkan tepat sesuai petunjuk kemasan/tenaga kesehatan. Konsentrasi yang salah dapat berbahaya; kasus ini menjelaskan prinsip kimia, bukan memberi resep pengobatan.',
      },
    ],
    quiz: {
      question: 'Zat mana yang terutama menjadi pembawa muatan dalam larutan oralit?',
      choices: ['Molekul glukosa netral', 'Ion-ion terlarut', 'Elektron bebas yang mengalir di air'],
      correct: 1,
      explanation: 'Ion-ion yang bergerak membawa muatan di larutan; elektron tidak mengalir bebas seperti di kawat logam.',
    },
    sources: [
      { label: 'WHO — Diarrhoeal disease', url: 'https://www.who.int/news-room/fact-sheets/detail/diarrhoeal-disease' },
      { label: 'OpenStax Chemistry 2e — 11.2 Electrolytes', url: 'https://openstax.org/books/chemistry-2e/pages/11-2-electrolytes' },
    ],
  },
  {
    id: 'sweat',
    category: 'Olahraga',
    title: 'Keringat dan elektrolit',
    image: 'Azerbaijani athlete Valentine Khristov won bronze in the weightlifting competition of the 2012 London Olympic Games.jpg',
    alt: 'Atlet angkat besi bertanding di Olimpiade London 2012.',
    caption: 'Atlet saat bertanding; foto ini memberi konteks aktivitas fisik, bukan pengukuran keringat.',
    focus: 'Keseimbangan cairan dan ion',
    context: 'Keringat mengandung air dan elektrolit, terutama natrium dan klorida, dengan kadar yang bervariasi. Kehilangan cairan saat aktivitas fisik dipengaruhi suhu, durasi, intensitas, dan individu.',
    prompt: 'Apa perbedaan fungsi air dan ion dalam menjaga keseimbangan cairan tubuh?',
    concept: 'Ion terlarut membantu mengatur distribusi cairan dan fungsi fisiologis. Minuman olahraga bukan kebutuhan otomatis untuk setiap aktivitas; kebutuhan cairan dan elektrolit bergantung pada konteks dan kondisi kesehatan.',
    equation: 'NaCl(aq) ⇌ Na⁺(aq) + Cl⁻(aq)',
    questions: [
      {
        question: 'Apakah air murni dan larutan elektrolit memiliki komposisi partikel yang sama?',
        answer: 'Tidak. Air murni terutama terdiri dari molekul H₂O, sedangkan larutan elektrolit mengandung ion terlarut selain molekul air. Air murni tetap dapat mengalami autoionisasi dalam jumlah sangat kecil.',
      },
      {
        question: 'Apakah foto ini membuktikan komposisi keringat atlet?',
        answer: 'Tidak. Foto hanya memberi konteks olahraga. Komposisi keringat memerlukan pengukuran; angka atau kebutuhan elektrolit tidak dapat disimpulkan dari gambar.',
      },
    ],
    quiz: {
      question: 'Mengapa keringat dapat mengubah keseimbangan elektrolit?',
      choices: ['Keringat hanya mengandung molekul air', 'Keringat dapat membawa air dan ion terlarut', 'Ion berubah menjadi elektron bebas saat berkeringat'],
      correct: 1,
      explanation: 'Keringat membawa air dan sejumlah elektrolit; kehilangan relatifnya dipengaruhi keadaan tiap orang.',
    },
    sources: [
      { label: 'OpenStax Chemistry 2e — 11.2 Electrolytes', url: 'https://openstax.org/books/chemistry-2e/pages/11-2-electrolytes' },
      { label: 'MedlinePlus — Dehydration', url: 'https://medlineplus.gov/dehydration.html' },
    ],
  },
  {
    id: 'seawater',
    category: 'Lingkungan',
    title: 'Air laut: banyak ion, tak layak diminum',
    image: 'Anse Source d\'Argent 2-La Digue.jpg',
    alt: 'Pemandangan pantai dan perairan laut di Anse Source d’Argent, La Digue.',
    caption: 'Lanskap pesisir; kandungan ion air laut tidak diukur oleh foto.',
    focus: 'Disosiasi garam dan konduktivitas',
    context: 'Air laut mengandung garam terlarut, terutama ion natrium dan klorida, juga ion lain seperti Mg²⁺, Ca²⁺, dan K⁺. Ion-ion bergerak tersebut membuat air laut menghantarkan listrik lebih baik daripada air sangat murni.',
    prompt: 'Mengapa larutan garam dapat menghantarkan listrik, sedangkan kristal garam padat tidak menghantarkan dengan cara yang sama?',
    concept: 'Ketika garam ionik larut, ionnya terpisah dan dapat bergerak. Di kristal padat, ion terikat pada kisi dan tidak bebas berpindah. Air laut terlalu asin untuk diminum; jangan gunakan contoh kimia ini sebagai saran konsumsi.',
    equation: 'NaCl(s) → Na⁺(aq) + Cl⁻(aq)',
    questions: [
      {
        question: 'Apakah arus listrik dalam air laut dibawa oleh elektron yang mengalir melalui air?',
        answer: 'Dalam larutan, muatan terutama diangkut oleh gerak ion positif dan negatif. Pada elektroda, proses antarmuka melibatkan transfer elektron antara penghantar dan spesies terlarut.',
      },
      {
        question: 'Apa yang menentukan besar konduktivitas air laut?',
        answer: 'Jenis, konsentrasi, dan mobilitas ion berkontribusi; suhu juga memengaruhi gerak ion. Konduktivitas tidak mengukur satu ion saja.',
      },
    ],
    quiz: {
      question: 'Mengapa NaCl terlarut menghantarkan listrik?',
      choices: ['Na⁺ dan Cl⁻ bergerak dalam larutan', 'Molekul NaCl tetap berupa kisi padat di air', 'Air laut mengandung elektron bebas seperti kawat'],
      correct: 0,
      explanation: 'Pelarutan garam menghasilkan ion bergerak yang membawa muatan melalui larutan.',
    },
    sources: [
      { label: 'NOAA — What is the average salinity of the ocean?', url: 'https://oceanservice.noaa.gov/facts/whysalty.html' },
      { label: 'OpenStax Chemistry 2e — 11.2 Electrolytes', url: 'https://openstax.org/books/chemistry-2e/pages/11-2-electrolytes' },
    ],
  },
  {
    id: 'battery',
    category: 'Teknologi',
    title: 'Aki timbal-asam',
    image: 'Photo-CarBattery.jpg',
    alt: 'Aki mobil timbal-asam.',
    caption: 'Foto aki mobil; bagian dalam dan konsentrasi elektrolit tidak tampak.',
    focus: 'Ion bergerak dan reaksi redoks',
    context: 'Aki timbal-asam menggunakan elektrolit asam sulfat berair. Selama reaksi pelepasan energi, reaksi pada kedua elektroda dan perubahan spesies dalam elektrolit saling terkait.',
    prompt: 'Bagaimana peran elektrolit berbeda dari peran kabel logam pada rangkaian aki?',
    concept: 'Di kabel, elektron bergerak melalui logam; di elektrolit, ion bergerak untuk mempertahankan keseimbangan muatan. Arus pada rangkaian memerlukan jalur penghantar dan reaksi elektrokimia yang sesuai.',
    equation: 'Pb(s) + PbO₂(s) + 2 H₂SO₄(aq) ⇌ 2 PbSO₄(s) + 2 H₂O(l)',
    questions: [
      {
        question: 'Apakah persamaan aki menunjukkan semua ion secara rinci?',
        answer: 'Tidak. Persamaan di atas adalah persamaan keseluruhan saat aki melepas energi; persamaan ini tidak menampilkan spesies ion dan tahapan elektroda secara lengkap.',
      },
      {
        question: 'Mengapa elektrolit tidak dapat digantikan begitu saja oleh kawat?',
        answer: 'Kawat dan larutan mengangkut muatan lewat partikel berbeda. Ion dalam elektrolit juga berpartisipasi dalam lingkungan reaksi pada elektroda.',
      },
    ],
    quiz: {
      question: 'Pembawa muatan dominan di larutan elektrolit aki adalah…',
      choices: ['Ion yang bergerak', 'Elektron bebas seperti di kabel', 'Atom timbal yang mengalir dalam kawat'],
      correct: 0,
      explanation: 'Ion bergerak di elektrolit; elektron bergerak di bagian logam luar rangkaian.',
    },
    sources: [
      { label: 'OpenStax Chemistry 2e — 17.2 Galvanic Cells', url: 'https://openstax.org/books/chemistry-2e/pages/17-2-galvanic-cells' },
      { label: 'OpenStax Chemistry 2e — 11.2 Electrolytes', url: 'https://openstax.org/books/chemistry-2e/pages/11-2-electrolytes' },
    ],
  },
  {
    id: 'tap-water',
    category: 'Air sehari-hari',
    title: 'Mineral dalam air minum',
    image: 'Water flowing from drinking water tap.jpg',
    alt: 'Air mengalir dari keran air minum.',
    caption: 'Foto keran air minum; kualitas setiap pasokan air harus merujuk pada hasil uji setempat.',
    focus: 'Ion terlarut dan kualitas air',
    context: 'Air keran dapat mengandung mineral terlarut. Ion kalsium dan magnesium berkontribusi pada kesadahan, tetapi kesadahan bukan satu-satunya ukuran keamanan air minum.',
    prompt: 'Mengapa air dari dua daerah dapat memiliki nilai konduktivitas yang berbeda?',
    concept: 'Komposisi geologi, sumber air, dan pengolahan dapat mengubah konsentrasi ion terlarut. Konduktivitas memberi petunjuk jumlah ion secara umum, tetapi tidak mengidentifikasi zat tertentu atau menyatakan bahwa air aman diminum.',
    equation: 'CaCl₂(aq) → Ca²⁺(aq) + 2 Cl⁻(aq)',
    questions: [
      {
        question: 'Dapatkah konduktivitas saja memastikan air bebas kontaminan?',
        answer: 'Tidak. Konduktivitas tidak menentukan identitas tiap zat dan tidak mendeteksi semua kontaminan. Penilaian keamanan memerlukan pengujian parameter yang sesuai standar.',
      },
      {
        question: 'Ion apa yang sering dikaitkan dengan kesadahan air?',
        answer: 'Terutama Ca²⁺ dan Mg²⁺. Berbagai ion lain juga dapat ada, bergantung pada sumber dan pengolahan air.',
      },
    ],
    quiz: {
      question: 'Apa yang dapat disimpulkan dari konduktivitas air?',
      choices: ['Identitas pasti semua zat terlarut', 'Petunjuk umum tentang ion bergerak, bukan uji keamanan lengkap', 'Bahwa air pasti aman diminum'],
      correct: 1,
      explanation: 'Konduktivitas terkait ion bergerak, tetapi tidak mengidentifikasi kontaminan atau menggantikan uji mutu air.',
    },
    sources: [
      { label: 'USGS — Hardness of Water', url: 'https://www.usgs.gov/special-topics/water-science-school/science/hardness-water' },
      { label: 'U.S. EPA — Drinking Water Regulations and Contaminants', url: 'https://www.epa.gov/sdwa/drinking-water-regulations-and-contaminants' },
      { label: 'OpenStax Chemistry 2e — 11.2 Electrolytes', url: 'https://openstax.org/books/chemistry-2e/pages/11-2-electrolytes' },
    ],
  },
  {
    id: 'pool',
    category: 'Teknologi air',
    title: 'Kolam dengan generator klorin garam',
    image: 'Swimming Pool in a hotel in Tamil Nadu 03.jpg',
    alt: 'Kolam renang luar ruang di sebuah hotel di Tamil Nadu.',
    caption: 'Foto kolam renang; tidak menunjukkan jenis sistem sanitasi yang dipakai.',
    focus: 'Elektrolisis larutan dan batas klaim',
    context: 'Sebagian kolam memakai generator elektrolisis garam: larutan yang mengandung NaCl melewati sel, dan proses elektrokimia menghasilkan spesies disinfektan. Tidak semua kolam memakai teknologi ini.',
    prompt: 'Apa yang membuat air bergaram dapat menjadi bagian dari sistem elektrokimia kolam?',
    concept: 'Ion Na⁺ dan Cl⁻ bergerak dalam air sebagai pembawa muatan. Reaksi pada elektroda menghasilkan spesies kimia baru; proses itu tidak sama dengan sekadar menambahkan garam lalu menganggap air otomatis tersanitasi.',
    equation: '2 Cl⁻(aq) → Cl₂(g) + 2 e⁻  (setengah reaksi anoda, skematis)',
    questions: [
      {
        question: 'Apakah garam saja langsung membunuh semua mikroorganisme di kolam?',
        answer: 'Tidak. Pada sistem generator garam, disinfeksi terkait proses elektrokimia yang terkontrol serta pemantauan kualitas air. Kadar garam bukan pengganti pengelolaan kolam yang benar.',
      },
      {
        question: 'Mengapa persamaan ini disebut skematis?',
        answer: 'Karena reaksi kolam sebenarnya melibatkan spesies klorin dalam air dan kondisi operasi tertentu. Persamaan hanya menyoroti satu proses elektroda, bukan seluruh mekanisme sanitasi.',
      },
    ],
    quiz: {
      question: 'Dalam larutan garam, apa yang bergerak membawa muatan menuju elektroda?',
      choices: ['Ion terlarut', 'Molekul garam padat', 'Elektron bebas yang bergerak di air'],
      correct: 0,
      explanation: 'Ion bergerak melalui larutan; elektron mengalir melalui penghantar dan ikut dalam reaksi elektroda.',
    },
    sources: [
      { label: 'CDC — Healthy Swimming: safety and prevention', url: 'https://www.cdc.gov/healthy-swimming/index.html' },
      { label: 'OpenStax Chemistry 2e — 17.7 Electrolysis', url: 'https://openstax.org/books/chemistry-2e/pages/17-7-electrolysis' },
    ],
  },
  {
    id: 'desalination',
    category: 'Lingkungan',
    title: 'Desalinasi dan pemisahan ion',
    image: 'Water desalination plant in Eilat.jpg',
    alt: 'Fasilitas desalinasi air di Eilat.',
    caption: 'Foto fasilitas desalinasi; tidak menampilkan diagram proses di dalamnya.',
    focus: 'Ion terlarut dan pemisahan membran',
    context: 'Air laut mengandung ion, sedangkan air produk desalinasi memiliki kadar garam yang jauh lebih rendah. Proses industri dapat memakai teknologi seperti osmosis balik; tahapan dan pengolahan lanjut bergantung pada fasilitas.',
    prompt: 'Mengapa memisahkan ion dari air laut berbeda dari sekadar menyaring pasir?',
    concept: 'Ion terlarut berukuran sangat kecil dan tersebar dalam air; penyaringan partikel biasa tidak menghilangkan garam terlarut. Membran dan proses pemisahan lain memerlukan pengendalian tekanan, energi, dan pengolahan air.',
    equation: 'Air laut → permeat rendah garam + aliran konsentrat (skema proses)',
    questions: [
      {
        question: 'Apakah air hasil desalinasi otomatis siap diminum?',
        answer: 'Tidak otomatis. Air produk perlu memenuhi standar mutu dan dapat memerlukan remineralisasi serta disinfeksi. Proses dan pengawasan berbeda antar fasilitas.',
      },
      {
        question: 'Mengapa ion penting dalam pemantauan air produk?',
        answer: 'Kadar ion terkait dengan salinitas dan konduktivitas, tetapi uji konduktivitas saja tetap tidak menggantikan analisis lengkap untuk menilai mutu atau keamanan.',
      },
    ],
    quiz: {
      question: 'Mengapa penyaring pasir biasa tidak cukup untuk menghilangkan garam terlarut?',
      choices: ['Ion terlarut tidak berupa partikel pasir yang tertahan oleh saringan biasa', 'Karena ion selalu bermuatan netral', 'Karena air laut tidak mengandung ion'],
      correct: 0,
      explanation: 'Garam yang larut hadir sebagai ion kecil yang melewati saringan partikel biasa; diperlukan proses pemisahan yang sesuai.',
    },
    sources: [
      { label: 'USGS — Desalination', url: 'https://www.usgs.gov/special-topics/water-science-school/science/desalination' },
      { label: 'OpenStax Chemistry 2e — 11.2 Electrolytes', url: 'https://openstax.org/books/chemistry-2e/pages/11-2-electrolytes' },
    ],
  },
]

const INITIAL_PROGRESS = { read: [], completed: [], quizAnswers: {} }

function normalizeProgress(value) {
  if (!value || typeof value !== 'object') return INITIAL_PROGRESS
  return {
    read: Array.isArray(value.read) ? value.read.filter((id) => CASES.some((item) => item.id === id)) : [],
    completed: Array.isArray(value.completed) ? value.completed.filter((id) => CASES.some((item) => item.id === id)) : [],
    quizAnswers: value.quizAnswers && typeof value.quizAnswers === 'object' ? value.quizAnswers : {},
  }
}

function imageUrl(fileName) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}`
}

function filePage(fileName) {
  return `https://commons.wikimedia.org/wiki/${encodeURIComponent(`File:${fileName}`)}`
}

export default function RealLifeCases({ userId, onActivity }) {
  const [activeId, setActiveId] = useState(CASES[0].id)
  const [savedProgress, setSavedProgress] = useState(() => ({
    owner: userId,
    value: normalizeProgress(userId ? readLearningData(userId, 'cases', INITIAL_PROGRESS) : INITIAL_PROGRESS),
  }))
  const [notice, setNotice] = useState('')
  const storedProgress = savedProgress.owner === userId
    ? savedProgress.value
    : normalizeProgress(userId ? readLearningData(userId, 'cases', INITIAL_PROGRESS) : INITIAL_PROGRESS)
  const progress = storedProgress.read.includes(activeId)
    ? storedProgress
    : { ...storedProgress, read: [...storedProgress.read, activeId] }
  const activeCase = CASES.find((item) => item.id === activeId) ?? CASES[0]
  const selectedAnswer = progress.quizAnswers[activeId]
  const completedCount = progress.completed.length

  useEffect(() => {
    if (!userId) return
    const stored = normalizeProgress(readLearningData(userId, 'cases', INITIAL_PROGRESS))
    if (stored.read.includes(activeId)) return
    const next = { ...stored, read: [...stored.read, activeId] }
    try {
      writeLearningData(userId, 'cases', next)
      recordLearningActivity(userId, { feature: 'real-life-cases', action: 'case-opened', caseId: activeId }, onActivity)
    } catch (error) {
      console.error('Unable to record ElectroFun case progress.', error)
    }
  }, [activeId, onActivity, userId])

  function saveProgress(next, activity, caseId = activeId) {
    const updated = normalizeProgress(next)
    if (!updated.read.includes(caseId)) updated.read = [...updated.read, caseId]
    if (userId) {
      try {
        writeLearningData(userId, 'cases', updated)
        if (activity) recordLearningActivity(userId, { feature: 'real-life-cases', ...activity }, onActivity)
      } catch (error) {
        setNotice(error instanceof Error ? error.message : 'Progres tidak dapat disimpan.')
        return false
      }
    }
    setSavedProgress({ owner: userId, value: updated })
    setNotice(userId ? 'Progres tersimpan di perangkat ini.' : 'Masuk untuk menyimpan progres secara terpisah per akun.')
    return true
  }

  function selectCase(id) {
    setActiveId(id)
    const current = normalizeProgress(progress)
    if (!current.read.includes(id)) {
      saveProgress(current, { action: 'case-opened', caseId: id }, id)
    }
  }

  function chooseAnswer(index) {
    const current = normalizeProgress(progress)
    const next = { ...current, quizAnswers: { ...current.quizAnswers, [activeId]: index } }
    saveProgress(next, { action: 'case-quiz-answered', caseId: activeId, correct: index === activeCase.quiz.correct })
  }

  function markComplete() {
    const current = normalizeProgress(progress)
    const next = current.completed.includes(activeId)
      ? current
      : { ...current, completed: [...current.completed, activeId] }
    saveProgress(next, { action: 'case-completed', caseId: activeId })
  }

  return (
    <section className="learning-tool learning-tool--cases" aria-labelledby="learning-cases-title">
      <header className="learning-tool__hero">
        <div>
          <span className="learning-tool__eyebrow">KIMIA DALAM KEHIDUPAN NYATA</span>
          <h1 id="learning-cases-title">Elektrolit di sekitar kita</h1>
          <p>Jelajahi tujuh konteks nyata, hubungkan ion dengan fungsi sehari-hari, lalu uji pemahamanmu.</p>
        </div>
        <div className="learning-tool__progress" aria-label={`${completedCount} dari ${CASES.length} kasus selesai`}>
          <strong>{completedCount}/{CASES.length}</strong><span>kasus selesai</span>
          <div className="learning-tool__progress-track"><span style={{ width: `${(completedCount / CASES.length) * 100}%` }} /></div>
        </div>
      </header>

      <div className="learning-tool__case-layout">
        <nav className="learning-tool__case-nav" aria-label="Pilih kasus kimia">
          {CASES.map((item, index) => (
            <button
              className={`learning-tool__case-link${item.id === activeId ? ' is-active' : ''}`}
              key={item.id}
              onClick={() => selectCase(item.id)}
              aria-current={item.id === activeId ? 'page' : undefined}
            >
              <span className="learning-tool__case-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="learning-tool__case-link-text"><small>{item.category}</small><strong>{item.title}</strong></span>
              <span className="learning-tool__case-state" aria-label={progress.completed.includes(item.id) ? 'Selesai' : progress.read.includes(item.id) ? 'Sudah dibaca' : 'Belum dibaca'}>
                {progress.completed.includes(item.id) ? '✓' : progress.read.includes(item.id) ? '•' : ''}
              </span>
            </button>
          ))}
        </nav>

        <article className="learning-tool__case-content" key={activeCase.id}>
          <figure className="learning-tool__case-photo">
            <img
              src={imageUrl(activeCase.image)}
              alt={activeCase.alt}
              loading="lazy"
              onError={(event) => { event.currentTarget.hidden = true }}
            />
            <figcaption>{activeCase.caption} <a href={filePage(activeCase.image)} target="_blank" rel="noreferrer">Sumber foto: Wikimedia Commons — {activeCase.image}</a></figcaption>
          </figure>

          <div className="learning-tool__case-copy">
            <span className="learning-tool__pill">{activeCase.category}</span>
            <h2>{activeCase.title}</h2>
            <p className="learning-tool__case-context">{activeCase.context}</p>
            <div className="learning-tool__concept">
              <span>Konsep kunci</span>
              <strong>{activeCase.focus}</strong>
              <p>{activeCase.concept}</p>
              <code>{activeCase.equation}</code>
            </div>

            <section className="learning-tool__prompt" aria-labelledby={`prompt-${activeId}`}>
              <span>BERPIKIR DULU</span>
              <h3 id={`prompt-${activeId}`}>{activeCase.prompt}</h3>
            </section>

            <section className="learning-tool__analysis" aria-labelledby={`analysis-${activeId}`}>
              <h3 id={`analysis-${activeId}`}>Analisis &amp; jawaban beralasan</h3>
              {activeCase.questions.map((item) => (
                <details className="learning-tool__answer" key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </section>

            <section className="learning-tool__quiz" aria-labelledby={`quiz-${activeId}`}>
              <span className="learning-tool__quiz-label">CEK PEMAHAMAN</span>
              <h3 id={`quiz-${activeId}`}>{activeCase.quiz.question}</h3>
              <div className="learning-tool__choices" role="group" aria-label="Pilihan jawaban">
                {activeCase.quiz.choices.map((choice, index) => {
                  const answered = selectedAnswer !== undefined
                  const correct = index === activeCase.quiz.correct
                  return (
                    <button
                      className={`learning-tool__choice${answered && correct ? ' is-correct' : ''}${answered && selectedAnswer === index && !correct ? ' is-incorrect' : ''}`}
                      key={choice}
                      onClick={() => chooseAnswer(index)}
                      aria-pressed={selectedAnswer === index}
                    >
                      <span>{String.fromCharCode(65 + index)}</span>{choice}
                    </button>
                  )
                })}
              </div>
              {selectedAnswer !== undefined && (
                <p className={`learning-tool__feedback${selectedAnswer === activeCase.quiz.correct ? ' is-correct' : ' is-incorrect'}`} role="status">
                  {selectedAnswer === activeCase.quiz.correct ? 'Tepat. ' : 'Belum tepat. '}{activeCase.quiz.explanation}
                </p>
              )}
            </section>

            <section className="learning-tool__references" aria-labelledby={`refs-${activeId}`}>
              <h3 id={`refs-${activeId}`}>Rujukan tepercaya</h3>
              <ul>{activeCase.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}<span aria-hidden="true"> ↗</span></a></li>)}</ul>
            </section>

            <div className="learning-tool__case-actions">
              <button className="learning-tool__primary-button" onClick={markComplete} disabled={progress.completed.includes(activeId)}>
                {progress.completed.includes(activeId) ? 'Kasus sudah selesai ✓' : 'Tandai kasus selesai'}
              </button>
              <span className="learning-tool__save-notice" role="status">{notice}</span>
            </div>
          </div>
        </article>
      </div>
      <p className="learning-tool__disclaimer">Foto hanya memberi konteks, bukan bukti komposisi atau hasil pengukuran. Persamaan dan contoh disederhanakan untuk pembelajaran; ikuti sumber resmi untuk kesehatan dan keselamatan.</p>
    </section>
  )
}
