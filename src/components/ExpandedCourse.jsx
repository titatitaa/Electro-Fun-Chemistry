import { useEffect, useState } from 'react'
import { expandedChapters, expandedCourseReferences } from '../data/expandedCourse.js'
import { readLearningData, recordLearningActivity, writeLearningData } from '../data/learningStore.js'
import './ExpandedCourse.css'

function ChapterDiagram({ kind, title }) {
  const commonProps = {
    viewBox: '0 0 640 230',
    role: 'img',
    'aria-label': title,
  }

  if (kind === 'mixtures') {
    return (
      <svg {...commonProps}>
        <g fill="#eaf7f4" stroke="#6b9b84" strokeWidth="2">
          <path d="M66 54h112l-12 124H78L66 54Z" /><path d="M264 54h112l-12 124h-88L264 54Z" /><path d="M462 54h112l-12 124h-88L462 54Z" />
        </g>
        <g fill="#2b7760">
          <circle cx="92" cy="111" r="6" /><circle cx="128" cy="135" r="6" /><circle cx="156" cy="101" r="6" /><circle cx="113" cy="158" r="6" /><circle cx="147" cy="153" r="6" />
          <circle cx="291" cy="111" r="9" /><circle cx="344" cy="146" r="10" /><circle cx="321" cy="105" r="8" />
          <circle cx="496" cy="152" r="13" /><circle cx="541" cy="119" r="12" />
        </g>
        <g fill="#314e3b" fontSize="14" fontWeight="700" textAnchor="middle">
          <text x="122" y="207">Larutan</text><text x="320" y="207">Koloid</text><text x="518" y="207">Suspensi</text>
        </g>
        <g fill="#78877c" fontSize="11" textAnchor="middle">
          <text x="122" y="39">partikel sangat kecil</text><text x="320" y="39">terdispersi</text><text x="518" y="39">dapat mengendap</text>
        </g>
      </svg>
    )
  }

  if (kind === 'particles' || kind === 'classification') {
    const groups = kind === 'classification'
      ? [
        { x: 18, label: 'Elektrolit kuat', particles: ['Na', 'Cl', 'Na', 'Cl', 'Na', 'Cl', 'Na', 'Cl'] },
        { x: 225, label: 'Elektrolit lemah', particles: ['HA', 'A', 'H', 'HA', 'HA', 'A', 'H', 'HA'] },
        { x: 432, label: 'Nonelektrolit', particles: ['M', 'M', 'M', 'M', 'M', 'M', 'M', 'M'] },
      ]
      : [
        { x: 45, label: 'NaCl dalam air', particles: ['Na', 'Cl', 'Na', 'Cl', 'Na', 'Cl', 'Na', 'Cl'] },
        { x: 335, label: 'Sukrosa dalam air', particles: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'] },
      ]
    return (
      <svg {...commonProps}>
        {groups.map((group) => (
          <g key={group.label}>
            <rect x={group.x} y="35" width={kind === 'classification' ? 185 : 245} height="150" rx="18" fill="#f3f8f2" stroke="#d7e5d7" />
            {group.particles.map((particle, index) => {
              const col = index % 4
              const row = Math.floor(index / 4)
              const cx = group.x + (kind === 'classification' ? 36 : 50) + col * (kind === 'classification' ? 38 : 48)
              const cy = 78 + row * 50 + (col % 2 ? 8 : 0)
              const positive = particle === 'Na' || particle === 'H'
              const negative = particle === 'Cl' || particle === 'A'
              return (
                <g key={`${particle}-${index}`}>
                  <circle cx={cx} cy={cy} r="15" fill={positive ? '#f8dca8' : negative ? '#cce8df' : '#e5e3f5'} />
                  <text x={cx} y={cy + 4} textAnchor="middle" fill="#314e3b" fontSize="9" fontWeight="700">{particle}</text>
                </g>
              )
            })}
            <text x={group.x + (kind === 'classification' ? 92 : 122)} y="211" textAnchor="middle" fill="#314e3b" fontSize="13" fontWeight="700">{group.label}</text>
          </g>
        ))}
        <g fill="#6a786e" fontSize="10">
          <text x="24" y="20">bulatan = representasi partikel (skematis)</text>
          <text x="24" y="226">Na⁺ dan H⁺ positif • Cl⁻ dan A⁻ negatif • M/HA molekul netral</text>
        </g>
      </svg>
    )
  }

  if (kind === 'migration') {
    return (
      <svg {...commonProps}>
        <rect x="135" y="49" width="370" height="130" rx="25" fill="#eaf6f2" stroke="#8ab29b" strokeWidth="2" />
        <rect x="94" y="67" width="29" height="92" rx="6" fill="#d4ae68" />
        <rect x="517" y="67" width="29" height="92" rx="6" fill="#738f9e" />
        <text x="109" y="54" textAnchor="middle" fill="#6a4b1e" fontSize="14" fontWeight="700">+</text>
        <text x="532" y="54" textAnchor="middle" fill="#425d6b" fontSize="14" fontWeight="700">−</text>
        <g stroke="#658c72" strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M210 98H460" /><path d="m449 89 12 9-12 9" />
          <path d="M430 139H180" /><path d="m191 130-12 9 12 9" />
        </g>
        <g fill="#c78538" fontSize="14" fontWeight="700"><text x="310" y="91">Na⁺ → katode (−)</text></g>
        <g fill="#477a83" fontSize="14" fontWeight="700"><text x="260" y="166">Cl⁻ → anode (+)</text></g>
        <text x="109" y="190" textAnchor="middle" fill="#54645a" fontSize="10">Anode (+)</text>
        <text x="532" y="190" textAnchor="middle" fill="#54645a" fontSize="10">Katode (−)</text>
        <text x="320" y="27" textAnchor="middle" fill="#56695b" fontSize="11">Arah migrasi ion pada sel elektrolisis</text>
      </svg>
    )
  }

  if (kind === 'apparatus') {
    return (
      <svg {...commonProps}>
        <rect x="32" y="68" width="84" height="95" rx="12" fill="#fff3d8" stroke="#d7b778" strokeWidth="2" />
        <text x="74" y="108" textAnchor="middle" fill="#674f29" fontSize="13" fontWeight="700">Baterai</text>
        <text x="74" y="130" textAnchor="middle" fill="#674f29" fontSize="11">tegangan rendah</text>
        <path d="M116 88H209Q225 88 225 104V111" fill="none" stroke="#8a6dce" strokeWidth="4" />
        <path d="M116 145H540V112" fill="none" stroke="#508e84" strokeWidth="4" />
        <circle cx="225" cy="88" r="26" fill="#fff7df" stroke="#d4ae68" strokeWidth="3" />
        <path d="m213 91 8-12-1 9 8-3-10 14 2-9Z" fill="#d7a348" />
        <path d="M270 65h118l-12 116h-94L270 65Z" fill="#e7f5f0" stroke="#67917c" strokeWidth="2" />
        <path d="M278 129h101l-5 48h-91Z" fill="#c9e6d9" />
        <path d="M304 78v68M356 78v68" stroke="#8d8c88" strokeWidth="5" strokeLinecap="round" />
        <g fill="#d6aa59"><circle cx="317" cy="132" r="4" /><circle cx="350" cy="120" r="3" /><circle cx="328" cy="111" r="3" /></g>
        <text x="330" y="205" textAnchor="middle" fill="#44594a" fontSize="12" fontWeight="700">Larutan + elektroda terpisah</text>
        <text x="461" y="80" fill="#5b6b60" fontSize="11">Jalur rangkaian tertutup</text>
      </svg>
    )
  }

  if (kind === 'factors') {
    return (
      <svg {...commonProps}>
        <path d="M105 177V50M105 177H552" stroke="#617369" strokeWidth="2" />
        <path d="M112 166C185 142 246 111 315 89S445 61 536 56" fill="none" stroke="#4b8c6b" strokeWidth="4" />
        <path d="m526 51 12 5-11 7" fill="#4b8c6b" />
        <g stroke="#d7e1d7" strokeDasharray="4 5">
          <path d="M105 136H548" /><path d="M105 95H548" />
        </g>
        <text x="330" y="209" textAnchor="middle" fill="#3f5145" fontSize="13" fontWeight="700">Konsentrasi ion (ilustratif)</text>
        <text x="36" y="117" transform="rotate(-90 36 117)" textAnchor="middle" fill="#3f5145" fontSize="12" fontWeight="700">Konduktivitas</text>
        <text x="111" y="35" fill="#65746a" fontSize="11">Skema tren umum; tidak berlaku sebagai kurva data untuk semua larutan</text>
      </svg>
    )
  }

  if (kind === 'applications') {
    return (
      <svg {...commonProps}>
        <g>
          <rect x="34" y="60" width="160" height="112" rx="18" fill="#eff7e9" stroke="#cdddc6" />
          <rect x="240" y="60" width="160" height="112" rx="18" fill="#fff4dd" stroke="#ead7ad" />
          <rect x="446" y="60" width="160" height="112" rx="18" fill="#eef2f8" stroke="#d5dce7" />
        </g>
        <g fill="#3e684b" fontSize="14" fontWeight="700" textAnchor="middle">
          <text x="114" y="102">Tubuh</text><text x="320" y="102">Air</text><text x="526" y="102">Elektrokimia</text>
        </g>
        <g fill="#78877c" fontSize="12" textAnchor="middle">
          <text x="114" y="130">Na⁺ • K⁺ • Cl⁻</text><text x="320" y="130">air mineral • laut</text><text x="526" y="130">aki • elektrolisis</text>
        </g>
        <g stroke="#b48b47" strokeWidth="2.5" fill="none">
          <path d="M196 116h39m-9-8 9 8-9 8" /><path d="M402 116h39m-9-8 9 8-9 8" />
        </g>
        <text x="320" y="204" textAnchor="middle" fill="#5a6c5e" fontSize="11">Penerapan berbeda, prinsip penting: ion bergerak dan/atau reaksi redoks</text>
      </svg>
    )
  }

  return (
    <svg {...commonProps}>
      <g>
        <rect x="28" y="55" width="170" height="118" rx="16" fill="#fff1ee" stroke="#ebc4bd" />
        <rect x="235" y="55" width="170" height="118" rx="16" fill="#fff8e9" stroke="#e9dbb9" />
        <rect x="442" y="55" width="170" height="118" rx="16" fill="#edf7f0" stroke="#c9ddcd" />
      </g>
      <text x="113" y="83" textAnchor="middle" fill="#ad594c" fontSize="12" fontWeight="700">Klaim</text>
      <text x="320" y="83" textAnchor="middle" fill="#8a6e38" fontSize="12" fontWeight="700">Periksa bukti</text>
      <text x="527" y="83" textAnchor="middle" fill="#3d7550" fontSize="12" fontWeight="700">Kesimpulan</text>
      <g fill="#52655a" fontSize="11" textAnchor="middle">
        <text x="113" y="113"><tspan x="113">“Lampu padam,</tspan><tspan x="113" dy="16">pasti nonelektrolit”</tspan></text>
        <text x="320" y="113"><tspan x="320">Kontrol alat,</tspan><tspan x="320" dy="16">konsentrasi, gelembung</tspan></text>
        <text x="527" y="113"><tspan x="527">Tafsir dengan</tspan><tspan x="527" dy="16">batasan yang jelas</tspan></text>
      </g>
      <g stroke="#b48b47" strokeWidth="2.5" fill="none">
        <path d="M198 115h33m-8-7 8 7-8 7" /><path d="M405 115h33m-8-7 8 7-8 7" />
      </g>
      <text x="320" y="208" textAnchor="middle" fill="#5a6c5e" fontSize="11">Observasi → model partikel → persamaan → kesimpulan</text>
    </svg>
  )
}

function ChapterQuiz({ chapter }) {
  const [answers, setAnswers] = useState({})

  return (
    <section className="expanded-quiz" id={`${chapter.id}-kuis`} aria-labelledby={`${chapter.id}-quiz-title`}>
      <span className="expanded-eyebrow">CEK PEMAHAMAN</span>
      <h2 id={`${chapter.id}-quiz-title`}>Kuis Bab {chapter.id.slice(-1)}</h2>
      <p className="expanded-lead">Pilih jawaban untuk melihat umpan balik dan pembahasan.</p>
      <div className="expanded-quiz-list">
        {chapter.questions.map((item, index) => {
          const selected = answers[index]
          const isCorrect = selected === item.answer
          return (
            <fieldset className="expanded-question" key={`${chapter.id}-q${index + 1}`}>
              <legend><span>{index + 1}</span>{item.prompt}</legend>
              <div className="expanded-options">
                {item.options.map((option, optionIndex) => (
                  <label
                    className={[
                      'expanded-option',
                      selected === optionIndex ? 'selected' : '',
                      selected !== undefined && optionIndex === item.answer ? 'correct' : '',
                      selected === optionIndex && !isCorrect ? 'incorrect' : '',
                    ].filter(Boolean).join(' ')}
                    key={option}
                  >
                    <input
                      type="radio"
                      name={`${chapter.id}-q${index}`}
                      checked={selected === optionIndex}
                      onChange={() => setAnswers((current) => ({ ...current, [index]: optionIndex }))}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              {selected !== undefined && (
                <p className={`expanded-feedback ${isCorrect ? 'is-correct' : 'is-incorrect'}`} role="status">
                  <strong>{isCorrect ? 'Tepat.' : 'Belum tepat.'}</strong> {item.explanation}
                </p>
              )}
            </fieldset>
          )
        })}
      </div>
    </section>
  )
}

function ChapterPage({ chapter, chapterIndex }) {
  return (
    <article className="expanded-chapter">
      <header className="expanded-chapter-heading">
        <span className="expanded-eyebrow">BAB {String(chapterIndex + 1).padStart(2, '0')} • KIMIA SMA/MA FASE E</span>
        <h1>{chapter.title}</h1>
        <p>{chapter.lead}</p>
        <div className="expanded-objectives">
          <strong>Tujuan belajar</strong>
          <ul>{chapter.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul>
        </div>
      </header>

      {chapterIndex === 0 && (
        <section className="expanded-concept-map" aria-labelledby="expanded-concept-map-title">
          <span className="expanded-eyebrow">PETA KONSEP • PENGANTAR MATERI</span>
          <h2 id="expanded-concept-map-title">Dari zat terlarut hingga daya hantar</h2>
          <ol>
            <li>Komponen zat dan pelarut membentuk campuran</li>
            <li>Partikel menyebar; sebagian zat membentuk ion</li>
            <li>Ion bergerak dalam medan listrik</li>
            <li>Mobilitas dan jumlah ion menentukan respons hantar</li>
            <li>Bukti dan model digunakan untuk mengklasifikasikan larutan</li>
          </ol>
          <p>Gunakan urutan ini untuk menghubungkan fenomena yang diamati, model submikroskopik, dan persamaan kimia.</p>
        </section>
      )}

      <nav className="expanded-section-nav" aria-label="Daftar isi bab">
        <strong>Dalam bab ini</strong>
        {chapter.sections.map((section, index) => (
          <a href={`#${chapter.id}-bagian-${index + 1}`} key={section.title}>{String(index + 1).padStart(2, '0')} {section.title}</a>
        ))}
        <a href={`#${chapter.id}-contoh`}>Contoh &amp; penerapan</a>
        <a href={`#${chapter.id}-kuis`}>Kuis pemahaman</a>
      </nav>

      <figure className="expanded-diagram">
        <ChapterDiagram kind={chapter.visual} title={`Diagram ${chapter.title}`} />
        <figcaption>
          <strong>Gambar {chapterIndex + 1}. {chapter.title}</strong>
          <span>Skema konseptual buatan untuk membantu membaca konsep; bukan foto eksperimen atau data pengukuran.</span>
        </figcaption>
      </figure>

      {chapter.sections.map((section, index) => (
        <section className="expanded-content-section" id={`${chapter.id}-bagian-${index + 1}`} key={section.title}>
          <span className="expanded-eyebrow">BAGIAN {String(index + 1).padStart(2, '0')}</span>
          <h2>{section.title}</h2>
          {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>
      ))}

      {chapter.comparison && (
        <section className="expanded-data-section" aria-label="Tabel perbandingan elektrolit">
          <span className="expanded-eyebrow">RINGKASAN KLASIFIKASI</span>
          <h2>Perbandingan sifat larutan</h2>
          <div className="expanded-table-scroll">
            <table>
              <thead><tr>{['Kategori', 'Derajat ionisasi', 'Partikel', 'Daya hantar', 'Lampu', 'Gelembung', 'Contoh'].map((head) => <th key={head}>{head}</th>)}</tr></thead>
              <tbody>{chapter.comparison.map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <p>Pengamatan bersifat kualitatif dan bergantung pada konsentrasi, suhu, alat, geometri elektroda, dan jenis elektrode.</p>
        </section>
      )}

      {chapter.observation && (
        <section className="expanded-data-section" aria-label="Prediksi pengamatan uji elektrolit">
          <span className="expanded-eyebrow">PRAKIRAAN PENGAMATAN</span>
          <h2>Perbandingan beberapa sampel</h2>
          <p>Prakiraan ilustratif, bukan data eksperimen. Hasil aktual bergantung pada kadar zat, kondisi dan sensitivitas alat.</p>
          <div className="expanded-table-scroll">
            <table>
              <thead><tr>{['Larutan', 'Partikel dominan', 'Nyala lampu', 'Gelembung', 'Interpretasi'].map((head) => <th key={head}>{head}</th>)}</tr></thead>
              <tbody>{chapter.observation.map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </section>
      )}

      {chapter.factors && (
        <section className="expanded-data-section" aria-label="Faktor daya hantar listrik">
          <span className="expanded-eyebrow">FAKTOR YANG MEMENGARUHI</span>
          <h2>Hal-hal yang mengubah daya hantar</h2>
          <div className="expanded-table-scroll">
            <table>
              <thead><tr><th>Faktor</th><th>Penjelasan</th></tr></thead>
              <tbody>{chapter.factors.map(([factor, explanation]) => <tr key={factor}><td>{factor}</td><td>{explanation}</td></tr>)}</tbody>
            </table>
          </div>
        </section>
      )}

      <section className="expanded-data-section" id={`${chapter.id}-contoh`}>
        <span className="expanded-eyebrow">KONTEKS KEHIDUPAN</span>
        <h2>Contoh dan penerapan</h2>
        <div className="expanded-example-grid">
          {chapter.examples.map(([title, text]) => (
            <article key={title}><span>CONTOH</span><h3>{title}</h3><p>{text}</p></article>
          ))}
          {chapter.applications.map(([title, text]) => (
            <article key={title}><span>PENERAPAN</span><h3>{title}</h3><p>{text}</p></article>
          ))}
        </div>
      </section>

      <section className="expanded-equations" aria-label="Persamaan kimia penting">
        <span className="expanded-eyebrow">SIMBOLIK • PERSAMAAN KUNCI</span>
        {chapter.equations.map((equation) => <p key={equation}>{equation}</p>)}
      </section>

      <aside className="expanded-case">
        <span className="expanded-eyebrow">ANALISIS FENOMENA</span>
        <h2>Bagaimana kamu menjelaskan?</h2>
        <p><strong>Kasus:</strong> {chapter.case.prompt}</p>
        <details><summary>Lihat pembahasan</summary><p>{chapter.case.answer}</p></details>
      </aside>

      <aside className="expanded-misconception">
        <strong>Waspadai miskonsepsi</strong>
        <p>{chapter.misconception}</p>
      </aside>

      <section className="expanded-summary" aria-labelledby={`${chapter.id}-summary-title`}>
        <span className="expanded-eyebrow">RANGKUMAN BAB</span>
        <h2 id={`${chapter.id}-summary-title`}>Ingat gagasan utama</h2>
        <ul>{chapter.summary.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>
      <aside className="expanded-reflection">
        <span className="expanded-eyebrow">REFLEKSI PEMBELAJARAN</span>
        <p>{chapter.reflection}</p>
      </aside>

      <ChapterQuiz chapter={chapter} />

      <section className="expanded-references" aria-labelledby={`${chapter.id}-references-title`}>
        <span className="expanded-eyebrow">RUJUKAN BAB</span>
        <h2 id={`${chapter.id}-references-title`}>Sumber referensi</h2>
        <ul>
          {chapter.referenceKeys.map((referenceIndex) => {
            const reference = expandedCourseReferences[referenceIndex]
            return (
              <li key={reference.url}>
                <p>{reference.citation}</p>
                <span>{reference.detail} </span>
                <a href={reference.url} target="_blank" rel="noreferrer">Buka sumber ↗</a>
                {reference.sections && (
                  <div className="expanded-source-sections">
                    {reference.sections.map((section) => (
                      <a key={section.url} href={section.url} target="_blank" rel="noreferrer">{section.label}</a>
                    ))}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </section>
    </article>
  )
}

export default function ExpandedCourse({ userId = 'anonymous', onActivity }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeChapter, setActiveChapter] = useState(0)
  const [readChapters, setReadChapters] = useState(() => readLearningData(userId, 'course-reading', []))

  const markChapterRead = (index) => {
    if (readChapters.includes(index)) return
    const next = [...readChapters, index]
    setReadChapters(next)
    writeLearningData(userId, 'course-reading', next)
    recordLearningActivity(userId, {
      type: 'lesson',
      title: 'Membuka materi pembelajaran',
      detail: expandedChapters[index].title,
    }, onActivity)
  }

  const selectChapter = (index) => {
    setActiveChapter(index)
    markChapterRead(index)
    document.querySelector('.expanded-course-panel')?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const chapter = expandedChapters[activeChapter]
  const progress = Math.round((readChapters.length / expandedChapters.length) * 100)

  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const openLibrary = () => {
    setIsOpen(true)
    markChapterRead(activeChapter)
  }

  return (
    <>
      <section className="expanded-course-launch" aria-label="Materi lengkap">
        <div>
          <span className="expanded-eyebrow">SUMBER BELAJAR LENGKAP</span>
          <h2>Jelajahi materi dalam 8 bab</h2>
          <p>Pelajari konsep, diagram, aplikasi, referensi, dan lima soal latihan pada setiap bab.</p>
        </div>
        <button type="button" className="expanded-launch-button" onClick={openLibrary}>
          Buka materi lengkap <span aria-hidden="true">→</span>
        </button>
      </section>

      {isOpen && (
        <div className="expanded-course-overlay" role="dialog" aria-modal="true" aria-labelledby="expanded-course-title">
          <div className="expanded-course-panel">
            <header className="expanded-course-header">
              <button type="button" onClick={() => setIsOpen(false)}>← Kembali ke beranda</button>
              <div>
                <span>CHEMISTRY LAB • BAHAN AJAR FASE E</span>
                <strong id="expanded-course-title">Larutan Elektrolit dan Nonelektrolit</strong>
              </div>
              <span className="expanded-progress-label">{readChapters.length}/8 bab dibuka</span>
            </header>
            <div className="expanded-progress-track" role="progressbar" aria-label="Progres membaca bab" aria-valuemin={0} aria-valuemax={8} aria-valuenow={readChapters.length}>
              <span style={{ width: `${progress}%` }} />
            </div>
            <div className="expanded-course-layout">
              <aside className="expanded-course-sidebar">
                <span className="expanded-eyebrow">DAFTAR ISI</span>
                <nav aria-label="Daftar bab materi">
                  {expandedChapters.map((item, index) => (
                    <button
                      type="button"
                      className={index === activeChapter ? 'active' : ''}
                      aria-current={index === activeChapter ? 'page' : undefined}
                      key={item.id}
                      onClick={() => selectChapter(index)}
                    >
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <span>{item.title}</span>
                      {readChapters.includes(index) && <b aria-label="Sudah dibuka">✓</b>}
                    </button>
                  ))}
                </nav>
                <p>Progres menunjukkan bab yang telah dibuka pada sesi ini.</p>
              </aside>
              <main className="expanded-course-main">
                <ChapterPage chapter={chapter} chapterIndex={activeChapter} />
                <footer className="expanded-chapter-actions">
                  <button type="button" disabled={activeChapter === 0} onClick={() => selectChapter(activeChapter - 1)}>← Bab sebelumnya</button>
                  <span>Bab {activeChapter + 1} dari {expandedChapters.length}</span>
                  <button type="button" disabled={activeChapter === expandedChapters.length - 1} onClick={() => selectChapter(activeChapter + 1)}>Bab berikutnya →</button>
                </footer>
                <section className="expanded-bibliography" aria-labelledby="expanded-bibliography-title">
                  <span className="expanded-eyebrow">RUJUKAN LINTAS BAB</span>
                  <h2 id="expanded-bibliography-title">Daftar pustaka</h2>
                  <ol>
                    {expandedCourseReferences.map((reference) => (
                      <li key={reference.url}>
                        {reference.citation}{' '}
                        <a href={reference.url} target="_blank" rel="noreferrer">Sumber ↗</a>
                      </li>
                    ))}
                  </ol>
                  <p>Referensi penelitian dicantumkan sebagai konteks pengembangan pembelajaran; temuan validasi instrumen atau e-modul bukan bukti langsung efektivitas pada semua kelas.</p>
                </section>
              </main>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
