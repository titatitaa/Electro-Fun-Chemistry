import { useState } from 'react'
import {
  readLearningData,
  recordLearningActivity,
  writeLearningData,
} from '../../data/learningStore.js'
import './ChemistryMission.css'

const levels = [
  {
    title: 'Misi 1 · Gelas yang serupa',
    scene: 'Di meja praktikum ada larutan garam dan larutan gula. Keduanya bening dan garam serta gula sama-sama sudah larut.',
    prompt: 'Hasil uji sederhana apa yang paling masuk akal?',
    options: [
      'Keduanya pasti menghantar sama kuat karena sama-sama bening.',
      'Larutan garam dapat menghantar karena mengandung ion bergerak; larutan gula umumnya tidak.',
      'Larutan gula menghantar lebih kuat karena molekulnya lebih besar.',
      'Tidak ada yang dapat menghantar karena semua larutan bening netral.',
    ],
    answer: 1,
    reasonPrompt: 'Alasan ilmiah yang paling tepat adalah …',
    reasons: [
      'Pelarutan garam membentuk ion terhidrasi, sedangkan gula larut sebagai molekul netral.',
      'Semua zat yang larut akan melepaskan elektron bebas.',
      'Warna bening menunjukkan tidak adanya partikel.',
      'Molekul gula berubah menjadi ion hanya setelah lampu menyala.',
    ],
    reasonAnswer: 0,
    explanation: 'NaCl terdisosiasi menjadi Na⁺ dan Cl⁻ yang bergerak dalam air. Sukrosa larut sebagai molekul utuh. Penampakan bening tidak memberi tahu apakah partikel terlarut berupa ion.',
  },
  {
    title: 'Misi 2 · Sinyal lampu redup',
    scene: 'Sampel cuka menyalakan lampu redup dan menghasilkan sedikit gelembung. Rangkaian tampak berfungsi.',
    prompt: 'Kesimpulan sementara yang paling bertanggung jawab adalah …',
    options: [
      'Cuka pasti nonelektrolit karena lampu tidak terang.',
      'Cuka pasti elektrolit kuat karena ada gelembung.',
      'Cuka dapat menjadi elektrolit lemah; hasil perlu dibaca bersama sifat alat dan kondisi uji.',
      'Lampu redup membuktikan cuka tidak larut dalam air.',
    ],
    answer: 2,
    reasonPrompt: 'Mengapa kesimpulan itu lebih baik daripada menilai dari terang lampu saja?',
    reasons: [
      'Asam asetat terionisasi sebagian; ion yang terbentuk dapat membawa arus kecil.',
      'Lampu hanya bekerja pada larutan yang mengandung molekul netral.',
      'Gelembung selalu muncul dengan jumlah sama pada semua larutan.',
      'Elektrolit kuat dan lemah hanya dibedakan oleh warna larutan.',
    ],
    reasonAnswer: 0,
    explanation: 'Asam asetat merupakan elektrolit lemah yang terionisasi sebagian di dalam air. Lampu, gelembung, konsentrasi, elektroda, dan kepekaan alat sama-sama memengaruhi pengamatan.',
  },
  {
    title: 'Misi 3 · Dua asam, satu konsentrasi',
    scene: 'Kamu membandingkan HCl dan CH₃COOH pada konsentrasi, suhu, tegangan, dan alat yang sama.',
    prompt: 'Sampel mana yang umumnya menghantarkan lebih kuat, dan mengapa?',
    options: [
      'CH₃COOH, karena setiap asam terionisasi sempurna.',
      'HCl, karena hampir seluruhnya terionisasi dalam air sedangkan CH₃COOH hanya sebagian.',
      'Keduanya selalu sama kuat karena rumusnya sama-sama diawali H.',
      'Tidak dapat dibandingkan meskipun variabel lain sudah dikendalikan.',
    ],
    answer: 1,
    reasonPrompt: 'Faktor partikel yang paling relevan untuk menjelaskan prediksi itu adalah …',
    reasons: [
      'Banyaknya ion bergerak yang dihasilkan pada konsentrasi sebanding.',
      'Jumlah atom hidrogen pada rumus kimia saja.',
      'Kemampuan larutan menghasilkan warna.',
      'Semua molekul asam bergerak sebagai elektron di dalam air.',
    ],
    reasonAnswer: 0,
    explanation: 'HCl adalah elektrolit kuat dan terionisasi hampir sempurna; CH₃COOH adalah elektrolit lemah. Membandingkan pada kondisi terkontrol membantu mengaitkan perbedaan hasil dengan jumlah ion bergerak.',
  },
  {
    title: 'Misi 4 · Kristal dan larutan',
    scene: 'Siswa menguji kristal garam kering lalu menguji larutan garam. Kristal tidak menyalakan rangkaian, tetapi larutannya menghantar.',
    prompt: 'Model penjelasan yang tepat adalah …',
    options: [
      'Ion NaCl hanya ada setelah larutan diberi arus.',
      'Kristal padat tidak memiliki muatan sama sekali.',
      'Ion dalam kristal terikat pada kisi dan tidak bebas bergerak; dalam larutan ion-ionnya dapat bergerak.',
      'Air berubah menjadi logam ketika garam dilarutkan.',
    ],
    answer: 2,
    reasonPrompt: 'Apa perbedaan kunci yang membuat larutan dapat menghantarkan arus?',
    reasons: [
      'Adanya pembawa muatan yang dapat bergerak, bukan sekadar keberadaan ion.',
      'Kristal lebih dingin daripada larutan.',
      'Larutan mengubah proton menjadi elektron.',
      'Semua padatan bersifat netral dan tidak mengandung ion.',
    ],
    reasonAnswer: 0,
    explanation: 'Senyawa ionik mengandung ion dalam kisi padat, tetapi ionnya tidak bebas berpindah. Pelelehan atau pelarutan memberi ion mobilitas sehingga muatan dapat diangkut.',
  },
  {
    title: 'Misi 5 · Detektif sampel',
    scene: 'Sampel X tidak menyalakan lampu pada satu kali percobaan. Kamu belum memeriksa konsentrasi, sambungan kabel, atau kepekaan alat.',
    prompt: 'Langkah berikut yang paling kuat secara ilmiah adalah …',
    options: [
      'Langsung menyatakan sampel X pasti nonelektrolit.',
      'Mengulang uji dengan kontrol positif dan memeriksa sambungan serta kondisi alat.',
      'Menambah gula agar lampu menyala lebih terang.',
      'Mengabaikan hasil karena lampu tidak selalu benar.',
    ],
    answer: 1,
    reasonPrompt: 'Mengapa langkah tersebut penting sebelum menyimpulkan?',
    reasons: [
      'Lampu padam dapat disebabkan faktor alat atau arus yang terlalu kecil; kontrol membantu menilai validitas uji.',
      'Kontrol positif mengubah semua sampel menjadi elektrolit.',
      'Jika satu uji gagal, semua percobaan berikutnya tidak berguna.',
      'Hanya sampel yang berwarna yang bisa diuji dengan listrik.',
    ],
    reasonAnswer: 0,
    explanation: 'Lampu padam bukan diagnosis tunggal. Periksa rangkaian dengan kontrol positif, pastikan elektroda tersambung dan bersih, lalu pertimbangkan konsentrasi atau metode yang lebih sensitif sebelum menyimpulkan.',
  },
]

const emptyProgress = { levels: {} }

export default function ChemistryMission({ userId, onActivity }) {
  const [progress, setProgress] = useState(() => readLearningData(userId, 'mission', emptyProgress))
  const [activeLevel, setActiveLevel] = useState(null)
  const [selected, setSelected] = useState({ concept: null, reason: null })
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const earnedLevels = Object.keys(progress.levels || {}).length
  const totalPoints = Object.values(progress.levels || {}).reduce((sum, level) => sum + (level.bestScore || 0), 0)
  const totalStars = Object.values(progress.levels || {}).reduce((sum, level) => sum + (level.stars || 0), 0)
  const unlocked = (index) => index === 0 || Boolean(progress.levels?.[String(index - 1)])

  const startLevel = (index) => {
    if (!unlocked(index)) return
    setActiveLevel(index)
    setSelected({ concept: null, reason: null })
    setResult(null)
    setError('')
  }

  const submitLevel = () => {
    if (selected.concept === null || selected.reason === null) {
      setError('Pilih jawaban dan alasan sebelum menyelesaikan misi.')
      return
    }
    const level = levels[activeLevel]
    const conceptCorrect = selected.concept === level.answer
    const reasonCorrect = selected.reason === level.reasonAnswer
    const score = (conceptCorrect ? 60 : 0) + (reasonCorrect ? 40 : 0)
    const stars = score === 100 ? 3 : score >= 60 ? 2 : score > 0 ? 1 : 0
    const key = String(activeLevel)
    const previous = progress.levels?.[key]
    const entry = {
      completed: true,
      bestScore: Math.max(previous?.bestScore || 0, score),
      stars: Math.max(previous?.stars || 0, stars),
      latestScore: score,
      attempts: (previous?.attempts || 0) + 1,
      completedAt: new Date().toISOString(),
    }
    const next = {
      levels: { ...(progress.levels || {}), [key]: entry },
      lastPlayed: key,
    }
    const feedback = { score, stars, conceptCorrect, reasonCorrect, explanation: level.explanation }
    try {
      writeLearningData(userId, 'mission', next)
      recordLearningActivity(userId, {
        type: 'chemistry-mission',
        title: level.title,
        score,
        maxScore: 100,
        stars,
        detail: `${conceptCorrect ? 'Jawaban tepat' : 'Jawaban perlu ditinjau'} · ${reasonCorrect ? 'alasan tepat' : 'alasan perlu ditinjau'}`,
        completedAt: entry.completedAt,
      }, onActivity)
      setProgress(next)
      setResult(feedback)
      setError('')
    } catch (saveError) {
      setError(saveError.message || 'Progres belum dapat disimpan. Coba lagi.')
    }
  }

  const closeLevel = () => {
    setActiveLevel(null)
    setResult(null)
  }

  return (
    <section className="learning-tool learning-tool--mission" aria-labelledby="mission-title">
      <header className="learning-tool__header">
        <p className="learning-tool__eyebrow">Misi kimia · 5 level</p>
        <h2 id="mission-title">Chemistry Mission</h2>
        <p>Gunakan bukti dan alasan ilmiah untuk menuntaskan tantangan. Setiap level yang diselesaikan membuka level berikutnya.</p>
      </header>

      <div className="learning-tool__mission-stats" aria-label="Ringkasan progres misi">
        <div><strong>{earnedLevels}/5</strong><span>level diselesaikan</span></div>
        <div><strong>{totalPoints}</strong><span>poin terbaik</span></div>
        <div><strong>{totalStars} ★</strong><span>bintang terbaik</span></div>
      </div>
      <div className="learning-tool__mission-progress">
        <span style={{ width: `${earnedLevels * 20}%` }} />
      </div>
      <p className="learning-tool__mission-caption">Poin tiap level: jawaban benar 60 poin, alasan benar 40 poin. Skor positif memberi 1–3 bintang; skor 0 tetap tercatat agar level berikutnya dapat dibuka dan kamu bisa belajar dari penjelasan.</p>

      {activeLevel === null ? (
        <div className="learning-tool__level-grid" aria-label="Pilih level misi">
          {levels.map((level, index) => {
            const isUnlocked = unlocked(index)
            const record = progress.levels?.[String(index)]
            return (
              <article className={`learning-tool__level-card ${!isUnlocked ? 'is-locked' : ''} ${record ? 'is-earned' : ''}`} key={level.title}>
                <span className="learning-tool__level-number">{isUnlocked ? `LEVEL ${index + 1}` : 'TERKUNCI'}</span>
                <h3>{level.title.replace(/^Misi \d+ · /, '')}</h3>
                <p>{level.scene}</p>
                {record ? <p className="learning-tool__best">Terbaik {record.bestScore}/100 · {'★'.repeat(record.stars)}{'☆'.repeat(3 - record.stars)}</p> : <p className="learning-tool__best">{isUnlocked ? 'Belum dimainkan' : 'Selesaikan level sebelumnya untuk membuka'}</p>}
                <button className="learning-tool__button learning-tool__button--primary" type="button" disabled={!isUnlocked} onClick={() => startLevel(index)}>
                  {record ? 'Main lagi' : isUnlocked ? 'Mulai misi' : 'Level terkunci'}
                </button>
              </article>
            )
          })}
        </div>
      ) : (
        <article className="learning-tool__mission-play" aria-live="polite">
          <div className="learning-tool__mission-play-head">
            <div><span className="learning-tool__level-number">LEVEL {activeLevel + 1} DARI 5</span><h3>{levels[activeLevel].title}</h3></div>
            <button type="button" className="learning-tool__button" onClick={closeLevel}>Kembali ke peta</button>
          </div>
          <p className="learning-tool__scene">{levels[activeLevel].scene}</p>
          {result ? (
            <div className="learning-tool__mission-result">
              <div className="learning-tool__result-score"><strong>{result.score}/100</strong><span aria-label={`${result.stars} bintang`}>{'★'.repeat(result.stars)}{'☆'.repeat(3 - result.stars)}</span></div>
              <p className="learning-tool__feedback-line">{result.conceptCorrect ? '✓ Jawaban utama tepat.' : '↻ Jawaban utama perlu ditinjau.'} {result.reasonCorrect ? 'Alasanmu juga tepat.' : 'Periksa kembali alasanmu.'}</p>
              <h4>Penjelasan</h4>
              <p>{result.explanation}</p>
              {activeLevel < levels.length - 1 && <p className="learning-tool__unlock-note">Level {activeLevel + 2} kini terbuka. Kamu boleh mengulang level ini kapan saja untuk meningkatkan skor terbaik.</p>}
              <div className="learning-tool__actions">
                <button className="learning-tool__button" type="button" onClick={() => startLevel(activeLevel)}>Ulangi level</button>
                <button className="learning-tool__button learning-tool__button--primary" type="button" onClick={closeLevel}>Lanjutkan</button>
              </div>
            </div>
          ) : (
            <>
              <fieldset className="learning-tool__fieldset">
                <legend>{levels[activeLevel].prompt}</legend>
                <div className="learning-tool__option-list">
                  {levels[activeLevel].options.map((option, index) => (
                    <label className={`learning-tool__option ${selected.concept === index ? 'is-selected' : ''}`} key={option}>
                      <input type="radio" name={`mission-answer-${activeLevel}`} checked={selected.concept === index} onChange={() => { setSelected((value) => ({ ...value, concept: index })); setError('') }} />
                      <span className="learning-tool__choice">{String.fromCharCode(65 + index)}</span><span>{option}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset className="learning-tool__fieldset">
                <legend>{levels[activeLevel].reasonPrompt}</legend>
                <div className="learning-tool__option-list">
                  {levels[activeLevel].reasons.map((reason, index) => (
                    <label className={`learning-tool__option ${selected.reason === index ? 'is-selected' : ''}`} key={reason}>
                      <input type="radio" name={`mission-reason-${activeLevel}`} checked={selected.reason === index} onChange={() => { setSelected((value) => ({ ...value, reason: index })); setError('') }} />
                      <span className="learning-tool__choice">{String.fromCharCode(65 + index)}</span><span>{reason}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              {error && <p className="learning-tool__error" role="alert">{error}</p>}
              <div className="learning-tool__actions">
                <button className="learning-tool__button" type="button" onClick={closeLevel}>Batal</button>
                <button className="learning-tool__button learning-tool__button--primary" type="button" onClick={submitLevel}>Kunci jawaban & selesaikan</button>
              </div>
            </>
          )}
        </article>
      )}
      {!earnedLevels && <p className="learning-tool__empty-state">Belum ada progres tersimpan. Mulai dari Level 1; jawabanmu baru dinilai setelah kamu mengirimkannya.</p>}
    </section>
  )
}
