import { useMemo, useState } from 'react'
import { readLearningData, writeLearningData, recordLearningActivity } from '../../data/learningStore.js'
import './FlashcardGlossary.css'

const TERMS = [
  { id: 'anion', term: 'Anion', category: 'Ion dan larutan', definition: 'Ion bermuatan negatif, terbentuk ketika atom atau gugus atom menerima elektron.', formula: 'Contoh: Cl⁻, SO₄²⁻.', example: 'Dalam NaCl(aq), ion Cl⁻ bergerak menuju elektroda positif saat elektrolisis.' },
  { id: 'aqueous', term: 'Aqueous (aq)', category: 'Ion dan larutan', definition: 'Penanda bahwa suatu zat berada dalam larutan air.', formula: 'NaCl(aq) berarti natrium klorida terlarut dalam air.', example: 'Notasi (aq) berbeda dari (l), yang menunjukkan zat cair murni.' },
  { id: 'cathode', term: 'Katode', category: 'Pengujian', definition: 'Elektrode tempat terjadinya reduksi; dalam sel elektrolisis, katode terhubung ke kutub negatif sumber listrik.', formula: 'Reduksi: zat menerima elektron.', example: 'Pada elektrolisis larutan, spesies yang dapat direduksi menerima elektron di katode.' },
  { id: 'conductance', term: 'Konduktansi', category: 'Pengukuran', definition: 'Ukuran kemudahan arus mengalir melalui suatu sel atau penghantar; merupakan kebalikan hambatan.', formula: 'G = 1/R; satuan siemens (S).', example: 'Konduktansi sel bergantung pada larutan dan geometri sel, tidak hanya pada jenis zat.' },
  { id: 'conductivity', term: 'Konduktivitas', category: 'Pengukuran', definition: 'Kemampuan bahan menghantarkan arus listrik. Dalam larutan, perpindahan muatan terutama dilakukan oleh ion bergerak.', formula: 'κ = G × (jarak elektroda / luas elektroda); satuan S·m⁻¹.', example: 'Bandingkan larutan hanya dengan mempertimbangkan konsentrasi, suhu, dan kondisi pengukuran yang sama.' },
  { id: 'dissociation', term: 'Disosiasi', category: 'Proses', definition: 'Pemisahan ion yang sudah tersusun dalam senyawa ionik ketika senyawa larut.', formula: 'NaCl(s) → Na⁺(aq) + Cl⁻(aq).', example: 'Ion Na⁺ dan Cl⁻ telah ada sebagai bagian kisi ionik sebelum terpisah di air.' },
  { id: 'electrolyte', term: 'Elektrolit', category: 'Klasifikasi', definition: 'Zat yang menghasilkan ion bergerak ketika dilarutkan atau dilelehkan sehingga dapat menghantarkan listrik.', formula: 'Dikelompokkan menjadi elektrolit kuat dan lemah.', example: 'NaCl(aq) menghantarkan listrik karena mengandung ion Na⁺ dan Cl⁻.' },
  { id: 'strong-electrolyte', term: 'Elektrolit kuat', category: 'Klasifikasi', definition: 'Elektrolit yang terurai atau terionisasi hampir sempurna dalam larutan pada kondisi yang dibahas.', formula: 'Untuk NaCl: NaCl(aq) → Na⁺(aq) + Cl⁻(aq).', example: 'HCl, NaOH, dan banyak garam larut merupakan contoh umum; konsentrasi tetap memengaruhi daya hantar.' },
  { id: 'weak-electrolyte', term: 'Elektrolit lemah', category: 'Klasifikasi', definition: 'Elektrolit yang hanya terionisasi sebagian; ion dan molekulnya berada dalam kesetimbangan.', formula: 'CH₃COOH(aq) + H₂O(l) ⇌ H₃O⁺(aq) + CH₃COO⁻(aq).', example: 'Asam asetat adalah contoh elektrolit lemah.' },
  { id: 'nonelectrolyte', term: 'Nonelektrolit', category: 'Klasifikasi', definition: 'Zat yang larut tanpa menghasilkan ion bergerak dalam jumlah berarti, sehingga larutannya tidak menghantarkan listrik secara berarti.', formula: 'Sukrosa(aq) tetap berupa molekul sukrosa.', example: 'Larut tidak selalu berarti terionisasi: larutan gula tetap homogen tetapi tidak menghasilkan ion dari gula.' },
  { id: 'electrode', term: 'Elektrode', category: 'Pengujian', definition: 'Penghantar yang menjadi tempat perpindahan elektron antara rangkaian listrik dan zat yang diuji.', formula: 'Dua elektrode membentuk jalur arus melalui larutan.', example: 'Gelembung dapat muncul pada elektrode karena reaksi elektrolisis, tetapi tidak selalu terlihat.' },
  { id: 'ion', term: 'Ion', category: 'Ion dan larutan', definition: 'Atom atau gugus atom yang memiliki muatan listrik karena kehilangan atau menerima elektron.', formula: 'Kation (+), anion (−).', example: 'Ion-ion terlarut bergerak membawa muatan melalui larutan.' },
  { id: 'ionization', term: 'Ionisasi', category: 'Proses', definition: 'Pembentukan ion dari molekul netral, sering terjadi ketika zat molekuler bereaksi dengan air.', formula: 'HCl + H₂O → H₃O⁺ + Cl⁻.', example: 'HCl mengalami ionisasi di air; bandingkan dengan disosiasi garam ionik.' },
  { id: 'ionization-degree', term: 'Derajat ionisasi (α)', category: 'Pengukuran', definition: 'Fraksi jumlah zat terlarut yang terionisasi. Nilainya bergantung pada zat dan kondisi, termasuk konsentrasi.', formula: 'α = jumlah terionisasi / jumlah mula-mula; persen α = α × 100%.', example: 'Nilai α besar menunjukkan fraksi yang terionisasi besar, tetapi bukan pengukuran langsung konduktivitas.' },
  { id: 'cation', term: 'Kation', category: 'Ion dan larutan', definition: 'Ion bermuatan positif, terbentuk ketika atom atau gugus atom melepaskan elektron.', formula: 'Contoh: Na⁺, Ca²⁺, NH₄⁺.', example: 'Kation bergerak menuju katode pada sel elektrolisis.' },
  { id: 'anode', term: 'Anode', category: 'Pengujian', definition: 'Elektrode tempat terjadinya oksidasi; dalam sel elektrolisis, anode terhubung ke kutub positif sumber listrik.', formula: 'Oksidasi: zat melepaskan elektron.', example: 'Produk reaksi di anode bergantung pada ion dan kondisi larutan.' },
  { id: 'molarity', term: 'Konsentrasi molar', category: 'Pengukuran', definition: 'Jumlah mol zat terlarut per liter larutan.', formula: 'M = n/V; satuan mol·L⁻¹ (M).', example: 'Saat membandingkan daya hantar, konsentrasi larutan perlu dikendalikan.' },
  { id: 'dilution', term: 'Pengenceran', category: 'Proses', definition: 'Penurunan konsentrasi larutan dengan menambahkan pelarut tanpa mengubah jumlah mol zat terlarut.', formula: 'M₁V₁ = M₂V₂ (untuk pengenceran).', example: 'Larutan elektrolit tetap elektrolit setelah diencerkan, meskipun konduktivitasnya dapat berubah.' },
  { id: 'equilibrium', term: 'Kesetimbangan ionisasi', category: 'Proses', definition: 'Keadaan dinamis ketika laju ionisasi dan penggabungan kembali ion sama.', formula: 'CH₃COOH + H₂O ⇌ H₃O⁺ + CH₃COO⁻.', example: 'Elektrolit lemah memiliki ion dan molekul netral pada kesetimbangan.' },
  { id: 'solvent', term: 'Pelarut', category: 'Ion dan larutan', definition: 'Zat yang melarutkan zat lain dan biasanya jumlahnya lebih banyak dalam larutan.', formula: 'Dalam larutan berair, pelarutnya adalah H₂O(l).', example: 'Molekul air membantu menstabilkan ion yang terpisah di dalam larutan.' },
  { id: 'solute', term: 'Zat terlarut', category: 'Ion dan larutan', definition: 'Zat yang tersebar di dalam pelarut untuk membentuk larutan.', formula: 'Larutan = pelarut + satu atau lebih zat terlarut.', example: 'Garam dapur merupakan zat terlarut saat dibuat menjadi larutan garam.' },
  { id: 'voltage', term: 'Tegangan listrik', category: 'Pengukuran', definition: 'Beda potensial listrik yang mendorong aliran muatan pada rangkaian.', formula: 'V = I × R; satuan volt (V).', example: 'Tegangan lebih tinggi dapat mengubah arus pada alat uji; bukan berarti larutannya otomatis lebih kuat.' },
  { id: 'current', term: 'Arus listrik', category: 'Pengukuran', definition: 'Laju aliran muatan listrik melalui penghantar atau rangkaian.', formula: 'I = Q/t; satuan ampere (A).', example: 'Dalam larutan, ion bergerak; pada kawat, elektron bergerak.' },
  { id: 'temperature', term: 'Suhu', category: 'Pengukuran', definition: 'Besaran yang memengaruhi gerak partikel dan dapat memengaruhi mobilitas ion serta hasil pengukuran.', formula: 'Bandingkan larutan pada suhu yang sama untuk uji yang adil.', example: 'Perubahan suhu dapat mengubah konduktivitas meskipun larutan yang diuji sama.' },
]

const CATEGORIES = ['Semua kategori', ...new Set(TERMS.map((item) => item.category))]
const REVIEW_INTERVAL_DAYS = [1, 3, 7, 14, 30]

function validReviewData(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return {}
  return Object.fromEntries(Object.entries(data).filter(([, value]) =>
    value && Number.isFinite(value.streak) && typeof value.dueAt === 'string',
  ))
}

function validGlossaryData(data) {
  if (!Array.isArray(data)) return []
  const allowed = new Set(TERMS.map((item) => item.id))
  return [...new Set(data.filter((id) => typeof id === 'string' && allowed.has(id)))]
}

function formatDue(value, now) {
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) return 'belum dijadwalkan'
  if (date.getTime() <= now) return 'perlu diulang'
  return `ulang ${new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(date)}`
}

function FlashcardGlossaryInstance({ userId, onActivity }) {
  const [tab, setTab] = useState('flashcards')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Semua kategori')
  const [flipped, setFlipped] = useState(false)
  const [cardIndex, setCardIndex] = useState(0)
  const [notice, setNotice] = useState('')
  const [initialTime] = useState(() => Date.now())
  const [reviews, setReviews] = useState(() => validReviewData(readLearningData(userId, 'flashcards', {})))
  const [glossaryMastered, setGlossaryMastered] = useState(() => validGlossaryData(readLearningData(userId, 'glossary', [])))

  const filteredTerms = useMemo(() => TERMS
    .filter((item) => category === 'Semua kategori' || item.category === category)
    .filter((item) => {
      const needle = query.trim().toLocaleLowerCase()
      return !needle || [item.term, item.category, item.definition, item.formula, item.example]
        .some((value) => value.toLocaleLowerCase().includes(needle))
    })
    .sort((a, b) => a.term.localeCompare(b.term, 'id')),
  [category, query])

  const deck = useMemo(() => filteredTerms.slice().sort((a, b) => {
    const dueA = reviews[a.id]?.dueAt ? new Date(reviews[a.id].dueAt).getTime() : 0
    const dueB = reviews[b.id]?.dueAt ? new Date(reviews[b.id].dueAt).getTime() : 0
    return dueA - dueB || a.term.localeCompare(b.term, 'id')
  }), [filteredTerms, reviews])
  const activeCard = deck.length ? deck[cardIndex % deck.length] : null
  const masteredCount = glossaryMastered.length
  const dueCount = TERMS.filter((item) => !reviews[item.id]?.dueAt || new Date(reviews[item.id].dueAt).getTime() <= initialTime).length

  function recordActivity(activity) {
    try {
      const activities = recordLearningActivity(userId, activity)
      try {
        onActivity?.(activities)
      } catch (error) {
        return `Aktivitas tersimpan, tetapi pembaruan ringkasan gagal: ${error instanceof Error ? error.message : 'kesalahan callback.'}`
      }
      return ''
    } catch (error) {
      return `Aktivitas belum tersimpan: ${error instanceof Error ? error.message : 'kesalahan penyimpanan.'}`
    }
  }

  function changeTab(nextTab) {
    setTab(nextTab)
    setFlipped(false)
  }

  function changeCard(offset) {
    if (!deck.length) return
    setCardIndex((current) => (current + offset + deck.length) % deck.length)
    setFlipped(false)
  }

  function saveReview(recalled) {
    if (!activeCard) return
    const previous = reviews[activeCard.id] ?? { streak: 0 }
    const streak = recalled ? previous.streak + 1 : 0
    const intervalDays = recalled ? REVIEW_INTERVAL_DAYS[Math.min(streak - 1, REVIEW_INTERVAL_DAYS.length - 1)] : 0
    const dueAt = new Date(Date.now() + intervalDays * 24 * 60 * 60 * 1000).toISOString()
    const next = {
      ...reviews,
      [activeCard.id]: { streak, dueAt, lastReviewedAt: new Date().toISOString() },
    }
    try {
      writeLearningData(userId, 'flashcards', next)
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Kemajuan kartu tidak dapat disimpan.')
      return
    }
    setReviews(next)
    setCardIndex(0)
    setFlipped(false)
    const mastery = streak >= 3 ? 'Kartu mencapai tiga pengulangan berturut-turut.' : `Ulasan tersimpan; kartu dijadwalkan ${intervalDays ? `kembali dalam ${intervalDays} hari` : 'untuk segera diulang'}.`
    const activityNotice = recordActivity({
      feature: 'flashcards',
      action: recalled ? 'card-recalled' : 'card-review-needed',
      term: activeCard.term,
      streak,
      dueAt,
    })
    setNotice(`${mastery}${activityNotice ? ` ${activityNotice}` : ''}`)
  }

  function toggleGlossaryMastery(termId) {
    const next = glossaryMastered.includes(termId)
      ? glossaryMastered.filter((id) => id !== termId)
      : [...glossaryMastered, termId]
    try {
      writeLearningData(userId, 'glossary', next)
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Status penguasaan tidak dapat disimpan.')
      return
    }
    setGlossaryMastered(next)
    const activityNotice = recordActivity({
      feature: 'glossary',
      action: next.includes(termId) ? 'term-mastered' : 'mastery-cleared',
      term: TERMS.find((item) => item.id === termId)?.term,
    })
    const masteryNotice = next.includes(termId) ? 'Istilah ditandai telah dikuasai.' : 'Tanda penguasaan istilah dihapus.'
    setNotice(`${masteryNotice}${activityNotice ? ` ${activityNotice}` : ''}`)
  }

  return (
    <section className="learning-tool learning-tool-flashcards" aria-labelledby="flashcards-title">
      <header className="learning-tool__header">
        <div>
          <p className="learning-tool__eyebrow">Latihan mandiri kimia</p>
          <h2 id="flashcards-title">Kartu Belajar & Glosarium</h2>
          <p>Ulangi istilah dengan kartu dua sisi atau cari definisi, rumus, dan contoh secara alfabetis.</p>
        </div>
        <div className="learning-tool__stats" aria-label="Ringkasan belajar">
          <span><strong>{dueCount}</strong> kartu perlu diulang</span>
          <span><strong>{masteredCount}</strong> istilah dikuasai</span>
        </div>
      </header>

      <p className="learning-tool__notice" role="status" aria-live="polite">{notice || 'Progres kartu dan penguasaan istilah disimpan di perangkat ini.'}</p>

      <div className="learning-tool__tabs" role="tablist" aria-label="Pilih alat belajar">
        <button type="button" role="tab" id="flashcards-tab" aria-selected={tab === 'flashcards'} onClick={() => changeTab('flashcards')}>Kartu belajar</button>
        <button type="button" role="tab" id="glossary-tab" aria-selected={tab === 'glossary'} onClick={() => changeTab('glossary')}>Glosarium A–Z</button>
      </div>

      {tab === 'flashcards' ? (
        <div id="flashcards-panel" role="tabpanel" aria-labelledby="flashcards-tab" className="learning-tool__flash-panel">
          <div className="learning-tool__filters">
            <label htmlFor="flashcard-category">Kategori kartu</label>
            <select id="flashcard-category" value={category} onChange={(event) => { setCategory(event.target.value); setCardIndex(0); setFlipped(false) }}>
              {CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <span>{deck.length} kartu dalam pilihan</span>
          </div>

          {activeCard ? (
            <>
              <button
                type="button"
                className={`learning-tool__flash-card${flipped ? ' is-flipped' : ''}`}
                onClick={() => setFlipped((current) => !current)}
              >
                {!flipped ? (
                  <span className="learning-tool__flash-face">
                    <span className="learning-tool__flash-meta">{activeCard.category} · {cardIndex + 1} dari {deck.length}</span>
                    <strong>{activeCard.term}</strong>
                    <span className="learning-tool__flash-hint">Pikirkan jawabannya, lalu pilih untuk membalik kartu.</span>
                  </span>
                ) : (
                  <span className="learning-tool__flash-face learning-tool__flash-face--back">
                    <span className="learning-tool__flash-meta">Pengertian</span>
                    <strong>{activeCard.definition}</strong>
                    <span className="learning-tool__flash-formula">{activeCard.formula}</span>
                    <span className="learning-tool__flash-example">{activeCard.example}</span>
                    <span className="learning-tool__flash-hint">Pilih kartu untuk kembali ke sisi depan.</span>
                  </span>
                )}
              </button>
              <div className="learning-tool__card-status">
                Status: {reviews[activeCard.id]?.streak >= 3 ? 'dikuasai' : `pengulangan ${reviews[activeCard.id]?.streak ?? 0}/3`} · {reviews[activeCard.id]?.dueAt ? formatDue(reviews[activeCard.id].dueAt, initialTime) : 'belum pernah diulas'}
              </div>
              <div className="learning-tool__review-actions">
                <button type="button" className="learning-tool__button learning-tool__button--secondary" onClick={() => changeCard(-1)}>Sebelumnya</button>
                <button type="button" className="learning-tool__button learning-tool__button--danger" onClick={() => saveReview(false)}>Belum ingat · ulangi</button>
                <button type="button" className="learning-tool__button" onClick={() => saveReview(true)}>Saya ingat</button>
                <button type="button" className="learning-tool__button learning-tool__button--secondary" onClick={() => changeCard(1)}>Berikutnya</button>
              </div>
              <p className="learning-tool__schedule-note">Pengulangan terjadwal sederhana: jawaban benar berturut-turut dijeda 1, 3, 7, 14, lalu 30 hari. Pilihan “Belum ingat” mengembalikan kartu ke antrean segera.</p>
            </>
          ) : (
            <p className="learning-tool__empty">Tidak ada kartu yang sesuai kategori.</p>
          )}
        </div>
      ) : (
        <div id="glossary-panel" role="tabpanel" aria-labelledby="glossary-tab" className="learning-tool__glossary-panel">
          <div className="learning-tool__filters learning-tool__filters--glossary">
            <label htmlFor="glossary-search">Cari istilah, rumus, atau definisi</label>
            <input id="glossary-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Contoh: ionisasi, α, HCl…" />
            <label htmlFor="glossary-category">Kategori</label>
            <select id="glossary-category" value={category} onChange={(event) => setCategory(event.target.value)}>
              {CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <span>{filteredTerms.length} istilah · diurutkan A–Z</span>
          </div>
          <div className="learning-tool__glossary-list" aria-live="polite">
            {filteredTerms.map((item) => {
              const isMastered = glossaryMastered.includes(item.id)
              return (
                <article className="learning-tool__term" key={item.id}>
                  <div className="learning-tool__term-title">
                    <div><span className="learning-tool__term-category">{item.category}</span><h3>{item.term}</h3></div>
                    <button
                      type="button"
                      className={`learning-tool__mastery${isMastered ? ' is-mastered' : ''}`}
                      aria-pressed={isMastered}
                      onClick={() => toggleGlossaryMastery(item.id)}
                    >
                      {isMastered ? '✓ Dikuasai' : 'Tandai dikuasai'}
                    </button>
                  </div>
                  <p>{item.definition}</p>
                  <p className="learning-tool__term-detail"><strong>Rumus/notasi:</strong> {item.formula}</p>
                  <p className="learning-tool__term-detail"><strong>Contoh:</strong> {item.example}</p>
                </article>
              )
            })}
            {!filteredTerms.length && <p className="learning-tool__empty">Tidak ada istilah yang cocok. Coba kata pencarian atau kategori lain.</p>}
          </div>
        </div>
      )}
      <footer className="learning-tool__footer">
        <span>Jadwal pengulangan dan tanda penguasaan tersimpan per pengguna pada perangkat ini.</span>
      </footer>
    </section>
  )
}

export default function FlashcardGlossary(props) {
  return <FlashcardGlossaryInstance key={String(props.userId || 'anonymous')} {...props} />
}
