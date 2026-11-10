import { useMemo, useState } from 'react'
import {
  readLearningData,
  recordLearningActivity,
  writeLearningData,
} from '../../data/learningStore.js'
import './DiagnosticTest.css'

const chapters = {
  larut: { id: 'bab-1', title: 'Bab 1 · Pengenalan Larutan' },
  ion: { id: 'bab-2', title: 'Bab 2 · Konsep Elektrolit dan Nonelektrolit' },
  klasifikasi: { id: 'bab-3', title: 'Bab 3 · Klasifikasi Larutan Elektrolit' },
  hantar: { id: 'bab-4', title: 'Bab 4 · Mekanisme Daya Hantar Listrik' },
  uji: { id: 'bab-5', title: 'Bab 5 · Percobaan Identifikasi Elektrolit' },
  faktor: { id: 'bab-6', title: 'Bab 6 · Faktor Daya Hantar Listrik' },
  aplikasi: { id: 'bab-7', title: 'Bab 7 · Penerapan Elektrolit dalam Kehidupan' },
  miskonsepsi: { id: 'bab-8', title: 'Bab 8 · Miskonsepsi dan Refleksi Konsep' },
}

const item = (id, tag, prompt, context, answer, options, explanation, misconceptionConcepts, misconceptionReasons) => ({
  id, tag, prompt, context, answer, options, explanation, misconceptionConcepts, misconceptionReasons,
})

const questions = [
  item('brine', 'ion', 'Kristal NaCl dimasukkan ke dalam air dan larut. Partikel utama yang bergerak bebas dalam larutan adalah …', 'Gunakan model partikel untuk menjelaskan mengapa larutan garam dapat menghantarkan arus.', 1,
    ['Kristal NaCl utuh bergerak sebagai molekul netral.', 'Ion Na⁺ dan Cl⁻ yang terhidrasi.', 'Atom natrium dan klorin yang terpisah.', 'Elektron bebas yang dilepas garam ke air.', 'Molekul air berubah seluruhnya menjadi ion.'],
    'NaCl padat terurai menjadi ion-ion terhidrasi; ion yang dapat bergerak membawa muatan dalam larutan.', [0, 3], [0, 3]),
  item('sugar', 'larut', 'Larutan gula tampak bening, tetapi lampu pada uji konduktivitas tidak menyala. Penjelasan terbaik adalah …', 'Larutan homogen tidak selalu tersusun dari ion.', 0,
    ['Gula tetap sebagai molekul netral meskipun larut.', 'Gula tidak benar-benar larut karena bening.', 'Semua ion gula bergerak terlalu cepat.', 'Air murni selalu menghantarkan kuat.', 'Gula mengendap dan menutup elektroda.'],
    'Sukrosa larut sebagai molekul netral, sehingga tidak menyediakan banyak pembawa muatan bergerak.', [1], [1]),
  item('acetic', 'klasifikasi', 'Cuka mengandung asam asetat (CH₃COOH) dan air. Mengapa larutannya menghantarkan listrik lemah?', 'Bandingkan dengan larutan HCl pada konsentrasi sebanding.', 2,
    ['Asam asetat tidak bercampur dengan air sama sekali.', 'Asam asetat hanya menghantar jika dipanaskan sampai mendidih.', 'Sebagian molekul asam asetat terionisasi menjadi ion dalam air.', 'Asam asetat berubah seluruhnya menjadi elektron bebas.', 'Air menghalangi semua muatan bergerak.'],
    'CH₃COOH adalah elektrolit lemah: ionisasi parsialnya menghasilkan ion, tetapi jumlahnya lebih sedikit daripada elektrolit kuat.', [3], [1]),
  item('lamp', 'uji', 'Lampu redup dan hanya sedikit gelembung tampak saat larutan diuji. Kesimpulan paling hati-hati ialah …', 'Alat dan konsentrasi sampel telah diperiksa; pengamatan tetap merupakan bukti, bukan definisi zat.', 3,
    ['Larutan pasti nonelektrolit.', 'Larutan pasti elektrolit kuat yang sangat pekat.', 'Gelembung membuktikan zat terlarut berupa molekul netral.', 'Larutan mungkin elektrolit lemah; uji alat dan kondisi perlu dipertimbangkan.', 'Semua larutan yang menghantar harus menyalakan lampu terang.'],
    'Cahaya redup dan gelembung sedikit konsisten dengan arus kecil, misalnya pada elektrolit lemah; hasil dipengaruhi alat dan kondisi uji.', [0, 4], [4]),
  item('solid', 'ion', 'NaCl padat tidak menghantarkan seperti larutan NaCl. Apa penyebab utamanya?', 'Ion memang ada di kisi kristal, tetapi keadaan fisiknya berbeda.', 1,
    ['Zat padat tidak mengandung partikel bermuatan.', 'Ion-ion dalam kisi padat tidak bebas bergerak membawa muatan.', 'NaCl padat merupakan molekul netral tunggal.', 'Air di dalam kristal menyerap semua arus.', 'Elektron berubah menjadi proton saat garam membeku.'],
    'Dalam kisi padat, ion terikat pada posisi kisi. Ketika meleleh atau dilarutkan, ion memperoleh mobilitas untuk membawa muatan.', [0, 2], [4]),
  item('hcl', 'klasifikasi', 'Pada konsentrasi sama, HCl(aq) umumnya menghantarkan lebih kuat daripada CH₃COOH(aq). Mengapa?', 'Pertimbangkan banyaknya ion, bukan sekadar banyaknya zat yang dilarutkan.', 0,
    ['HCl terionisasi hampir sempurna, sedangkan CH₃COOH terionisasi sebagian.', 'HCl tidak menghasilkan ion tetapi molekulnya sangat cepat.', 'Semua asam mengionisasi sama; hanya warna larutan berbeda.', 'CH₃COOH menghasilkan lebih banyak ion daripada HCl.', 'HCl menghantar karena atom klorin melepas elektron bebas.'],
    'HCl adalah elektrolit kuat dalam air, sementara asam asetat merupakan elektrolit lemah; fraksi partikel yang menjadi ion berbeda.', [2, 3], [2, 3]),
  item('water', 'aplikasi', 'Air murni menghantarkan listrik sangat lemah, tetapi air keran dapat menghantar lebih baik. Penjelasan yang tepat adalah …', 'Komposisi air sehari-hari dapat berbeda antar sumber.', 2,
    ['Molekul air murni menghantarkan kuat, lalu pipa mematikannya.', 'Air keran mengandung elektron bebas dari mineral.', 'Ion mineral terlarut dalam air keran dapat menjadi pembawa muatan.', 'Air murni sama sekali tidak mengandung partikel bermuatan dalam kondisi apa pun.', 'Mineral membuat molekul air berubah menjadi logam.'],
    'Air keran biasanya memiliki ion terlarut. Air murni pun memiliki ionisasi diri yang sangat kecil, sehingga bukan isolator sempurna.', [3], [3]),
  item('concentration', 'faktor', 'Larutan NaCl diencerkan dengan menambah air. Pada saat itu, jumlah mol NaCl tetap. Pernyataan yang paling tepat adalah …', 'Bedakan konsentrasi dari jumlah total zat terlarut.', 2,
    ['Jumlah ion total langsung menjadi nol.', 'Konsentrasi ion meningkat karena volume bertambah.', 'Konsentrasi berkurang; daya hantar terukur dapat berubah dan perlu mempertimbangkan geometri serta kondisi ukur.', 'Semua larutan encer berubah menjadi nonelektrolit.', 'NaCl berhenti terdisosiasi setelah ditambah air.'],
    'Pengenceran menurunkan konsentrasi ion, tetapi zat tetap elektrolit. Nilai konduktivitas dan konduktansi juga bergantung pada bagaimana pengukuran dilakukan.', [3], [3]),
  item('particles', 'hantar', 'Dalam rangkaian uji larutan, pembawa muatan di dalam larutan terutama bergerak sebagai …', 'Elektron mengalir di kabel; mekanisme pembawa muatan dalam larutan berbeda.', 1,
    ['Elektron bebas saja, melewati larutan dari satu elektroda ke elektroda lain.', 'Kation dan anion bergerak ke arah elektroda yang bermuatan berlawanan.', 'Proton dan neutron mengalir bersama sebagai atom netral.', 'Molekul air berubah menjadi kabel logam.', 'Ion diam; hanya lampu yang memindahkan muatan.'],
    'Arus dalam larutan elektrolit dibawa oleh gerak ion: kation menuju katoda dan anion menuju anoda dalam sel elektrolisis.', [0], [0]),
  item('bubbles', 'uji', 'Pada elektroda terlihat gelembung ketika larutan dialiri arus. Apa makna yang paling masuk akal?', 'Pengamatan ini dapat membantu, tetapi perlu dibaca bersama bukti lain.', 3,
    ['Gelembung adalah ion yang membeku.', 'Gelembung membuktikan larutan nonelektrolit.', 'Gelembung berarti air tidak ikut bereaksi dalam kondisi apa pun.', 'Gelembung dapat berasal dari produk gas pada elektroda; jumlahnya tidak sendirian mengukur kekuatan elektrolit.', 'Gelembung adalah elektron yang terlihat.'],
    'Elektrolisis dapat menghasilkan gas di elektroda. Jumlah dan jenis gelembung bergantung pada reaksi, arus, waktu, dan kondisi percobaan.', [1, 4], [4]),
  item('ionsugar', 'miskonsepsi', 'Larutan sukrosa (gula) dibuat dengan melarutkan kristalnya dalam air. Model yang benar untuk sukrosa terlarut ialah …', 'Pelarutan dan ionisasi adalah proses berbeda.', 0,
    ['Molekul sukrosa utuh tersebar di antara molekul air.', 'Kristal sukrosa berubah menjadi kation dan anion.', 'Atom karbon berubah menjadi ion logam.', 'Semua molekul sukrosa terurai menjadi elektron dan proton.', 'Sukrosa tidak dapat berada dalam larutan bening.'],
    'Sukrosa larut sebagai molekul utuh; tidak terionisasi hanya karena berada di air.', [1, 3], [1]),
  item('compare', 'faktor', 'Seorang siswa membandingkan dua larutan dengan konsentrasi berbeda dan lampu berbeda terang. Agar pengaruh jenis zat dapat dibandingkan lebih adil, ia sebaiknya …', 'Buat perbandingan eksperimen yang mengisolasi variabel.', 4,
    ['Mengubah konsentrasi setiap kali pengamatan.', 'Menggunakan elektroda yang berbeda dan tidak membersihkannya.', 'Menguji sampel pada waktu dan suhu berbeda.', 'Memilih sampel berdasarkan warna lampu yang disukai.', 'Mengendalikan konsentrasi, tegangan, elektroda, suhu, dan geometri pengukuran.'],
    'Variabel lain perlu dikendalikan agar perbedaan pengamatan lebih dapat dikaitkan dengan sifat sampel.', [], [0, 2]),
]

const choices = ['A', 'B', 'C', 'D', 'E']
const correctReasons = [1, 0, 2, 3, 1, 0, 2, 2, 1, 3, 0, 4]
const reasonOptions = {
  brine: [
    'Kristal garam tetap berupa molekul netral ketika larut.',
    'Air memisahkan kisi NaCl menjadi ion-ion terhidrasi yang bergerak.',
    'NaCl menyumbangkan elektron bebas ke seluruh air.',
    'Semua zat terlarut berubah menjadi ion dengan cara yang sama.',
    'Ion Na⁺ dan Cl⁻ tetap terkunci pada kisi setelah larut.',
  ],
  sugar: [
    'Sukrosa larut dengan menyebarkan molekul netralnya di antara molekul air.',
    'Setiap zat yang menghilang dari pandangan pasti terionisasi.',
    'Molekul gula melepaskan elektron ke rangkaian.',
    'Air mengubah sukrosa menjadi garam setelah diaduk.',
    'Larutan bening tidak memiliki partikel zat terlarut.',
  ],
  acetic: [
    'Asam asetat tidak bercampur dengan air sehingga menghasilkan arus kecil.',
    'Asam asetat selalu terionisasi sempurna seperti setiap asam.',
    'Sebagian molekul asam asetat membentuk ion, tetapi tidak seluruhnya.',
    'Asam asetat melepaskan elektron bebas tanpa membentuk ion.',
    'Semua molekul air berubah menjadi asam saat dicampur.',
  ],
  lamp: [
    'Lampu redup membuktikan tidak ada ion yang bergerak.',
    'Lampu hanya merespons molekul netral, bukan ion.',
    'Gelembung selalu menentukan klasifikasi tanpa perlu memeriksa alat.',
    'Jumlah ion bergerak, kondisi sampel, dan kepekaan alat memengaruhi sinyal.',
    'Setiap elektrolit pasti menyalakan lampu dengan terang yang sama.',
  ],
  solid: [
    'Senyawa ionik tidak mengandung ion ketika masih padat.',
    'Ion dalam kristal terikat pada kisi; dalam larutan ion dapat bergerak.',
    'NaCl padat merupakan molekul netral yang berubah menjadi ion karena arus.',
    'Air membentuk elektron bebas yang tidak berhubungan dengan ion.',
    'Keberadaan ion saja cukup; kemampuan ion bergerak tidak berpengaruh.',
  ],
  hcl: [
    'Derajat ionisasi HCl dan CH₃COOH berbeda sehingga jumlah ion bergeraknya berbeda.',
    'Semua asam mempunyai derajat ionisasi yang sama.',
    'Asam asetat selalu menghasilkan lebih banyak ion daripada HCl.',
    'HCl menghantar hanya karena klorinnya melepas elektron bebas.',
    'Kekuatan elektrolit ditentukan oleh nama asam, bukan jumlah ion.',
  ],
  water: [
    'Air keran mengandung elektron bebas yang berasal langsung dari pipa.',
    'Air murni tidak memiliki ion sama sekali dalam kondisi apa pun.',
    'Ion mineral terlarut dapat membawa muatan; air murni memiliki ionisasi diri yang sangat kecil.',
    'Semua jenis air keran mempunyai komposisi dan konduktivitas identik.',
    'Molekul air berubah menjadi atom logam saat bercampur mineral.',
  ],
  concentration: [
    'Penambahan air mengubah semua ion menjadi molekul netral.',
    'Volume bertambah sehingga konsentrasi larutan ikut naik.',
    'Pengenceran menurunkan konsentrasi ion, tetapi tidak mengubah zat menjadi nonelektrolit.',
    'Lampu yang redup membuktikan ion sudah hilang.',
    'Jumlah mol yang sama berarti konsentrasinya tidak berubah meskipun volumenya bertambah.',
  ],
  particles: [
    'Elektron saja melintasi larutan; ion tidak ikut membawa muatan.',
    'Kation dan anion bergerak menuju elektroda bermuatan berlawanan.',
    'Proton dan neutron mengalir bersama sebagai atom netral.',
    'Molekul air menjadi logam yang menyambungkan elektroda.',
    'Ion tetap diam dan lampu yang memindahkan muatan.',
  ],
  bubbles: [
    'Gelembung merupakan ion yang berubah menjadi padatan.',
    'Gelembung memastikan larutan nonelektrolit.',
    'Gelembung selalu hadir dengan jumlah yang sama pada semua larutan.',
    'Reaksi elektrode dapat membentuk gas; pengamatan perlu dibaca bersama bukti lain.',
    'Gelembung adalah elektron yang terlihat bergerak.',
  ],
  ionsugar: [
    'Sukrosa larut sebagai molekul utuh dan tidak otomatis menghasilkan ion.',
    'Melarut dan terionisasi adalah proses yang sama.',
    'Atom karbon berubah menjadi ion logam saat gula masuk ke air.',
    'Semua zat polar harus terurai menjadi kation dan anion.',
    'Sukrosa tidak dapat berada dalam larutan bening.',
  ],
  compare: [
    'Terang lampu hanya ditentukan jenis zat; variabel lain tidak perlu dikendalikan.',
    'Setiap larutan perlu diuji dengan elektroda dan suhu berbeda.',
    'Sampel dengan konsentrasi berbeda tetap menjadi perbandingan adil.',
    'Warna larutan adalah satu-satunya faktor yang perlu disamakan.',
    'Konsentrasi, tegangan, elektroda, suhu, dan geometri perlu dikendalikan.',
  ],
}
const blankAnswer = () => ({ concept: null, reason: null, confidence: null })
const defaultData = { reports: [] }

function classify(question, answer) {
  const conceptCorrect = answer.concept === question.answer
  const reasonCorrect = answer.reason === question.reasons.correct
  const misconceptionChosen = question.misconceptionReasons.includes(answer.reason)
    || question.misconceptionConcepts.includes(answer.concept)
  let category = 'tidak paham'
  if (conceptCorrect && reasonCorrect) category = 'paham konsep'
  else if (conceptCorrect || reasonCorrect) category = 'paham sebagian'
  else if (misconceptionChosen && answer.confidence === 'yakin') category = 'terindikasi miskonsepsi'
  return { category, conceptCorrect, reasonCorrect, misconceptionChosen }
}

function buildQuestions() {
  return questions.map((question, index) => ({
    ...question,
    reasons: { choices: reasonOptions[question.id], correct: correctReasons[index] },
  }))
}

const assessmentItems = buildQuestions().map((question, index) => ({
  ...question,
  correctReason: correctReasons[index],
}))

export default function DiagnosticTest({ userId, onActivity }) {
  const [data, setData] = useState(() => readLearningData(userId, 'diagnostic', defaultData))
  const [answers, setAnswers] = useState(() => assessmentItems.map(blankAnswer))
  const [step, setStep] = useState(0)
  const [report, setReport] = useState(() => readLearningData(userId, 'diagnostic', defaultData).reports?.[0] || null)
  const [error, setError] = useState('')
  const active = assessmentItems[step]
  const response = answers[step]
  const answeredCount = answers.filter((answer) => answer.concept !== null && answer.reason !== null && answer.confidence).length
  const categories = useMemo(() => report?.results.reduce((counts, result) => {
    counts[result.category] = (counts[result.category] || 0) + 1
    return counts
  }, {}) || {}, [report])

  const setAnswer = (key, value) => {
    setAnswers((current) => current.map((answer, index) => (
      index === step ? { ...answer, [key]: value } : answer
    )))
    setError('')
  }

  const finish = () => {
    if (answeredCount !== assessmentItems.length) {
      setError('Lengkapi pilihan jawaban, alasan, dan tingkat keyakinan di setiap soal.')
      return
    }
    const results = assessmentItems.map((question, index) => ({
      questionId: question.id,
      tag: question.tag,
      prompt: question.prompt,
      explanation: question.explanation,
      conceptSelection: answers[index].concept,
      reasonSelection: answers[index].reason,
      confidence: answers[index].confidence,
      ...classify(question, answers[index]),
    }))
    const byTag = results.reduce((groups, result) => {
      groups[result.tag] ||= []
      groups[result.tag].push(result)
      return groups
    }, {})
    const patterns = Object.entries(byTag).map(([tag, rows]) => {
      const concepts = rows.filter((row) => row.category === 'paham konsep').length
      const identified = rows.filter((row) => row.category === 'terindikasi miskonsepsi').length
      const partial = rows.filter((row) => row.category === 'paham sebagian').length
      const chapter = chapters[tag] || chapters.miskonsepsi
      return {
        tag,
        chapter,
        status: identified > 0 ? 'Perlu diluruskan' : concepts === rows.length ? 'Sudah kuat' : 'Perlu latihan',
        identified,
        concepts,
        partial,
        explanation: identified
          ? `Ada ${identified} jawaban dengan pola gagasan yang perlu diperiksa ulang. Baca ${chapter.title}, lalu bandingkan alasan ilmiahnya dengan bukti percobaan.`
          : concepts === rows.length
            ? `Jawaban pada topik ini konsisten dengan penjelasan ilmiah. Pertahankan pemahaman dengan latihan kontekstual di ${chapter.title}.`
            : `Sebagian ide sudah tepat, tetapi hubungan konsep dan alasan belum konsisten. Ulangi contoh dan representasi pada ${chapter.title}.`,
      }
    })
    const nextReport = {
      id: `${Date.now()}`,
      completedAt: new Date().toISOString(),
      total: assessmentItems.length,
      score: results.reduce((score, result) => score + Number(result.conceptCorrect) + Number(result.reasonCorrect), 0),
      maxScore: assessmentItems.length * 2,
      results,
      patterns,
    }
    const next = { ...data, reports: [nextReport, ...(data.reports || [])].slice(0, 20) }
    try {
      writeLearningData(userId, 'diagnostic', next)
      recordLearningActivity(userId, {
        type: 'diagnostic',
        title: 'Tes Diagnostik Elektrolit',
        score: nextReport.score,
        maxScore: nextReport.maxScore,
        detail: `${results.filter((result) => result.category === 'paham konsep').length} dari ${assessmentItems.length} soal dipahami utuh`,
        completedAt: nextReport.completedAt,
      }, onActivity)
      setData(next)
      setReport(nextReport)
      setError('')
    } catch (saveError) {
      setError(saveError.message || 'Laporan belum dapat disimpan. Coba lagi.')
    }
  }

  const restart = () => {
    setAnswers(assessmentItems.map(blankAnswer))
    setStep(0)
    setReport(null)
    setError('')
  }

  return (
    <section className="learning-tool learning-tool--diagnostic" aria-labelledby="diagnostic-title">
      <header className="learning-tool__header">
        <p className="learning-tool__eyebrow">Kenali cara berpikirmu</p>
        <h2 id="diagnostic-title">Tes Diagnostik Elektrolit</h2>
        <p>12 soal tiga tingkat: pilih gagasan, alasan ilmiah, lalu nyatakan keyakinanmu. Ini peta belajar, bukan nilai rapor.</p>
      </header>

      {report ? (
        <div className="learning-tool__report" aria-live="polite">
          <div className="learning-tool__score-card">
            <span className="learning-tool__score">{report.score}<small>/{report.maxScore}</small></span>
            <div><h3>Laporan belajarmu tersimpan</h3><p>{new Date(report.completedAt).toLocaleString('id-ID')}</p></div>
          </div>
          <p className="learning-tool__report-note">Skor mencerminkan ketepatan konsep dan alasan. Kategori pemahaman juga mempertimbangkan pola jawaban, bukan hanya total benar.</p>
          <div className="learning-tool__category-grid">
            {['paham konsep', 'paham sebagian', 'tidak paham', 'terindikasi miskonsepsi'].map((category) => (
              <div className="learning-tool__category" key={category}>
                <strong>{categories[category] || 0}</strong><span>{category}</span>
              </div>
            ))}
          </div>
          <h3 className="learning-tool__section-title">Pola jawaban & rekomendasi bab</h3>
          <div className="learning-tool__pattern-list">
            {report.patterns.map((pattern) => (
              <article className="learning-tool__pattern" key={pattern.tag}>
                <span className={`learning-tool__status learning-tool__status--${pattern.status === 'Sudah kuat' ? 'good' : pattern.identified ? 'alert' : 'practice'}`}>{pattern.status}</span>
                <h4>{pattern.chapter.title}</h4>
                <p>{pattern.explanation}</p>
                <span className="learning-tool__recommendation">Rekomendasi: {pattern.chapter.title}</span>
              </article>
            ))}
          </div>
          <details className="learning-tool__details">
            <summary>Lihat hasil tiap soal</summary>
            <ol>
              {report.results.map((result, index) => (
                <li key={result.questionId}>
                  <strong>Soal {index + 1}: {result.category}</strong> — {result.prompt}
                  <p>Pilihanmu: {choices[result.conceptSelection]} · alasan {choices[result.reasonSelection]} · keyakinan {result.confidence}.</p>
                  <p>{result.explanation}</p>
                </li>
              ))}
            </ol>
          </details>
          {(data.reports || []).length > 1 && <p className="learning-tool__history">Tersimpan {data.reports.length} laporan diagnostik untuk akun ini.</p>}
          <button className="learning-tool__button learning-tool__button--primary" type="button" onClick={restart}>Coba lagi</button>
        </div>
      ) : (
        <div className="learning-tool__quiz">
          <div className="learning-tool__progress-row">
            <span>Soal {step + 1} dari {assessmentItems.length}</span>
            <span>{answeredCount}/{assessmentItems.length} lengkap</span>
          </div>
          <progress className="learning-tool__progress" max={assessmentItems.length} value={step + (response.concept !== null && response.reason !== null && response.confidence ? 1 : 0)} aria-label="Kemajuan tes" />
          <article className="learning-tool__question">
            <p className="learning-tool__context">{active.context}</p>
            <h3>{active.prompt}</h3>
            <fieldset className="learning-tool__fieldset">
              <legend>Tingkat 1 · Pilih jawaban paling tepat</legend>
              <div className="learning-tool__option-list">
                {active.options.map((option, index) => (
                  <label className={`learning-tool__option ${response.concept === index ? 'is-selected' : ''}`} key={option}>
                    <input type="radio" name={`concept-${active.id}`} checked={response.concept === index} onChange={() => setAnswer('concept', index)} />
                    <span className="learning-tool__choice">{choices[index]}</span><span>{option}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className="learning-tool__fieldset">
              <legend>Tingkat 2 · Pilih alasan yang paling mendukung jawabanmu</legend>
              <div className="learning-tool__option-list">
                {active.reasons.choices.map((reason, index) => (
                  <label className={`learning-tool__option ${response.reason === index ? 'is-selected' : ''}`} key={reason}>
                    <input type="radio" name={`reason-${active.id}`} checked={response.reason === index} onChange={() => setAnswer('reason', index)} />
                    <span className="learning-tool__choice">{choices[index]}</span><span>{reason}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className="learning-tool__fieldset learning-tool__confidence">
              <legend>Tingkat 3 · Seberapa yakin kamu?</legend>
              {[
                ['yakin', 'Yakin'], ['ragu', 'Agak ragu'], ['menebak', 'Menebak'],
              ].map(([value, label]) => (
                <label className={`learning-tool__confidence-choice ${response.confidence === value ? 'is-selected' : ''}`} key={value}>
                  <input type="radio" name={`confidence-${active.id}`} checked={response.confidence === value} onChange={() => setAnswer('confidence', value)} />
                  {label}
                </label>
              ))}
            </fieldset>
          </article>
          {error && <p className="learning-tool__error" role="alert">{error}</p>}
          <div className="learning-tool__actions">
            <button className="learning-tool__button" type="button" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0}>Sebelumnya</button>
            {step < assessmentItems.length - 1 ? (
              <button className="learning-tool__button learning-tool__button--primary" type="button" onClick={() => setStep((value) => Math.min(assessmentItems.length - 1, value + 1))}>Soal berikutnya</button>
            ) : (
              <button className="learning-tool__button learning-tool__button--primary" type="button" onClick={finish}>Lihat hasil & simpan</button>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
