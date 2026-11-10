import { courseModules, courseReferences, moduleLearningSupports } from '../data/database.js'
import './ModuleLesson.css'

const courseConceptMap = [
  'Zat terlarut + pelarut membentuk campuran homogen',
  'Pelarutan menyebarkan partikel; struktur zat menentukan apakah ion terpisah, terbentuk, atau tidak terbentuk',
  'Ion bergerak membawa arus di dalam larutan',
  'Jumlah, muatan, dan mobilitas ion serta suhu dan konsentrasi memengaruhi daya hantar',
  'Klasifikasi: elektrolit kuat, elektrolit lemah, atau nonelektrolit',
]

export default function ModuleLesson({
  moduleId,
  completedModules,
  onClose,
  onComplete,
  onSelectModule,
  onStartQuiz,
  onOpenVirtualLab,
}) {
  const module = courseModules.find((item) => item.id === moduleId)
  if (!module) return null

  const moduleIndex = courseModules.findIndex((item) => item.id === moduleId)
  const previousModule = courseModules[moduleIndex - 1]
  const nextModule = courseModules[moduleIndex + 1]
  const subtopicCount = module.subtopics.length
  const learningSupport = moduleLearningSupports[moduleId]
  const lessonSubtopics = module.subtopics.map((subtopic, index) => ({
    ...subtopic,
    learningSupport: learningSupport?.subtopics[index],
  }))

  return (
    <div className="lesson-page" role="dialog" aria-modal="true" aria-labelledby="lesson-title">
      <header className="lesson-page-header">
        <button type="button" className="lesson-back-button" onClick={onClose}>
          ← Kembali ke beranda
        </button>
        <div className="lesson-header-meta">
          <span>{module.number} • Materi pembelajaran</span>
          <span>{subtopicCount} subbab</span>
        </div>
      </header>

      <main className="lesson-content">
        <div className="lesson-intro">
          <div className="lesson-intro-copy">
            <span className="lesson-kicker">{module.number} <span>•</span> KIMIA SMA FASE E</span>
            <h1 id="lesson-title">{module.title}</h1>
            <p>{module.intro}</p>
            <a className="lesson-start-link" href={`#${module.id}-subbab-1`}>
              Mulai membaca <span aria-hidden="true">↓</span>
            </a>
            {module.id === 'modul-2' && (
              <button type="button" className="lesson-start-link lesson-open-lab" onClick={onOpenVirtualLab}>
                Buka Virtual Lab <span aria-hidden="true">⚗</span>
              </button>
            )}
          </div>
          <figure className="lesson-hero-figure">
            <img src={module.image} alt={`Ilustrasi materi: ${module.title}`} />
            <figcaption>Skema pembelajaran lokal; bukan foto dokumentasi eksperimen.</figcaption>
          </figure>
        </div>

        <section className="lesson-objectives" aria-labelledby="lesson-objectives-title">
          <div className="lesson-objectives-heading">
            <span aria-hidden="true">✦</span>
            <div>
              <span className="lesson-section-eyebrow">ARAH BELAJAR</span>
              <h2 id="lesson-objectives-title">Setelah mempelajari modul ini, kamu dapat:</h2>
            </div>
          </div>
          <ul>
            {module.objectives.map((objective) => (
              <li key={objective}>
                <span aria-hidden="true">✓</span>
                {objective}
              </li>
            ))}
          </ul>
        </section>

        <div className="lesson-layout">
          <aside className="lesson-sidebar">
            <div className="lesson-sidebar-card">
              <span className="lesson-section-eyebrow">ISI MODUL</span>
              <nav className="lesson-subtopic-nav" aria-label="Daftar subbab">
                {module.subtopics.map((subtopic, index) => (
                  <a key={subtopic.title} href={`#${module.id}-subbab-${index + 1}`}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    {subtopic.title.replace(/^\d+\.\s*/, '')}
                  </a>
                ))}
              </nav>
              <div className="lesson-sidebar-note">
                <span aria-hidden="true">📚</span>
                <p>Baca berurutan, amati contoh, lalu coba kuis untuk mengecek pemahaman.</p>
              </div>
            </div>
          </aside>

          <div className="lesson-main-content">
            <div className="lesson-subtopics">
              {lessonSubtopics.map((subtopic, index) => (
                <article
                  className={`lesson-subtopic lesson-subtopic-${(index % 3) + 1}`}
                  id={`${module.id}-subbab-${index + 1}`}
                  key={subtopic.title}
                >
                  <div className="lesson-subtopic-heading">
                    <span className="lesson-subtopic-number">{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <span className="lesson-section-eyebrow">SUBBAB {String(index + 1).padStart(2, '0')}</span>
                      <h2>{subtopic.title.replace(/^\d+\.\s*/, '')}</h2>
                    </div>
                  </div>
                  <div className="lesson-subtopic-body">
                    {subtopic.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {subtopic.equation && (
                      <div className="lesson-equation" aria-label="Persamaan atau rumus">
                        <span className="lesson-card-label">PERSAMAAN KUNCI</span>
                        <span>{subtopic.equation}</span>
                      </div>
                    )}
                    {subtopic.example && (
                      <aside className="lesson-example">
                        <span className="lesson-card-label">🔎 CONTOH &amp; PENERAPAN</span>
                        <h3>{subtopic.example.title}</h3>
                        <p>{subtopic.example.text}</p>
                      </aside>
                    )}
                    <div className="lesson-takeaways">
                      <h3>Ingat poin penting ini</h3>
                      <ul className="lesson-key-points">
                        {subtopic.keyPoints.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </div>
                    {subtopic.learningSupport && (
                      <section className="lesson-representations" aria-label="Tiga tingkat representasi kimia">
                        <h3>Menghubungkan tiga representasi kimia</h3>
                        <div className="lesson-representation-grid">
                          <div>
                            <span className="lesson-card-label">MAKROSKOPIS • YANG DIAMATI</span>
                            <p>{subtopic.learningSupport.macroscopic}</p>
                          </div>
                          <div>
                            <span className="lesson-card-label">SUBMIKROSKOPIS • PARTIKEL</span>
                            <p>{subtopic.learningSupport.submicroscopic}</p>
                          </div>
                          <div>
                            <span className="lesson-card-label">SIMBOLIK • PERSAMAAN</span>
                            <p>{subtopic.learningSupport.symbolic}</p>
                          </div>
                        </div>
                        <p className="lesson-inline-citation">{subtopic.learningSupport.citation}</p>
                        {subtopic.learningSupport.visual && (
                          <figure className="lesson-sourced-figure">
                            <img
                              src={subtopic.learningSupport.visual.src}
                              alt={subtopic.learningSupport.visual.alt}
                              loading="lazy"
                            />
                            <figcaption>
                              {subtopic.learningSupport.visual.caption}{' '}
                              Sumber: {subtopic.learningSupport.visual.author},{' '}
                              <a href={subtopic.learningSupport.visual.pageUrl} target="_blank" rel="noreferrer">
                                {subtopic.learningSupport.visual.source}
                              </a>
                              . Lisensi{' '}
                              <a href={subtopic.learningSupport.visual.licenseUrl} target="_blank" rel="noreferrer">
                                {subtopic.learningSupport.visual.license}
                              </a>
                              ; digunakan tanpa adaptasi.
                            </figcaption>
                          </figure>
                        )}
                        <aside className="lesson-reflection">
                          <span className="lesson-card-label">PERTANYAAN REFLEKSI</span>
                          <p>{subtopic.learningSupport.reflection}</p>
                        </aside>
                      </section>
                    )}
                    {subtopic.misconception && (
                      <aside className="lesson-misconception">
                        <span aria-hidden="true">💡</span>
                        <p><strong>Hindari miskonsepsi:</strong> {subtopic.misconception}</p>
                      </aside>
                    )}
                    <a
                      className="lesson-video-link"
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(subtopic.videoQuery)}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="lesson-video-icon" aria-hidden="true">▶</span>
                      <span>
                        <strong>Belajar lewat video</strong>
                        <small>Cari video YouTube untuk subbab ini</small>
                      </span>
                      <span className="lesson-video-arrow" aria-hidden="true">↗</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>

            {learningSupport?.applications && (
              <section className="lesson-support-panel" aria-labelledby="lesson-applications-title">
                <span className="lesson-section-eyebrow">KIMIA DALAM KEHIDUPAN</span>
                <h2 id="lesson-applications-title">{learningSupport.applications.title}</h2>
                <p className="lesson-table-note">{learningSupport.applications.note}</p>
                <div className="lesson-table-scroll">
                  <table className="lesson-data-table">
                    <thead>
                      <tr><th>Contoh</th><th>Partikel atau proses</th><th>Hubungannya dengan daya hantar</th></tr>
                    </thead>
                    <tbody>
                      {learningSupport.applications.rows.map((row) => (
                        <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <figure className="lesson-sourced-figure lesson-application-figure">
                  <img
                    src={learningSupport.applications.image.src}
                    alt={learningSupport.applications.image.alt}
                    loading="lazy"
                  />
                  <figcaption>
                    {learningSupport.applications.image.caption} Sumber:{' '}
                    <a href={learningSupport.applications.image.pageUrl} target="_blank" rel="noreferrer">
                      {learningSupport.applications.image.source}
                    </a>, {learningSupport.applications.image.author}. Lisensi{' '}
                    <a href={learningSupport.applications.image.licenseUrl} target="_blank" rel="noreferrer">
                      {learningSupport.applications.image.license}
                    </a>.
                  </figcaption>
                </figure>
              </section>
            )}

            {learningSupport?.observationTable && (
              <section className="lesson-support-panel" aria-labelledby="lesson-observation-title">
                <span className="lesson-section-eyebrow">DATA UNTUK BERPIKIR KRITIS</span>
                <h2 id="lesson-observation-title">{learningSupport.observationTable.title}</h2>
                <p className="lesson-table-label">{learningSupport.observationTable.label}</p>
                <div className="lesson-table-scroll">
                  <table className="lesson-data-table">
                    <thead>
                      <tr>
                        {learningSupport.observationTable.headers.map((header) => <th key={header}>{header}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {learningSupport.observationTable.rows.map((row) => (
                        <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="lesson-table-note">{learningSupport.observationTable.interpretation}</p>
              </section>
            )}

            {learningSupport?.structureTable && (
              <section className="lesson-support-panel" aria-labelledby="lesson-structure-title">
                <span className="lesson-section-eyebrow">STRUKTUR MENJELASKAN SIFAT</span>
                <h2 id="lesson-structure-title">{learningSupport.structureTable.title}</h2>
                <div className="lesson-table-scroll">
                  <table className="lesson-data-table">
                    <thead>
                      <tr>
                        {learningSupport.structureTable.headers.map((header) => <th key={header}>{header}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {learningSupport.structureTable.rows.map((row) => (
                        <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="lesson-table-note">{learningSupport.structureTable.interpretation}</p>
              </section>
            )}

            {learningSupport?.factorsTable && (
              <section className="lesson-support-panel" aria-labelledby="lesson-factors-title">
                <span className="lesson-section-eyebrow">MENGAPA NILAI DAYA HANTAR BERBEDA?</span>
                <h2 id="lesson-factors-title">{learningSupport.factorsTable.title}</h2>
                <div className="lesson-table-scroll">
                  <table className="lesson-data-table">
                    <thead>
                      <tr>
                        {learningSupport.factorsTable.headers.map((header) => <th key={header}>{header}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {learningSupport.factorsTable.rows.map((row) => (
                        <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="lesson-table-note">{learningSupport.factorsTable.interpretation}</p>
              </section>
            )}

            <section className="lesson-concept-map" aria-labelledby="lesson-concept-map-title">
              <span className="lesson-section-eyebrow">RANGKUMAN VISUAL</span>
              <h2 id="lesson-concept-map-title">Peta konsep: dari pelarutan ke daya hantar</h2>
              <ol>
                {courseConceptMap.map((step) => <li key={step}>{step}</li>)}
              </ol>
              <p>Kuat atau lemahnya elektrolit menyatakan banyaknya zat yang membentuk ion, bukan pekat atau encernya larutan.</p>
            </section>

            {module.sources?.length > 0 && (
              <section className="lesson-sources" aria-labelledby="lesson-sources-title">
                <div className="lesson-sources-heading">
                  <span aria-hidden="true">📖</span>
                  <div>
                    <span className="lesson-section-eyebrow">BACAAN RUJUKAN</span>
                    <h2 id="lesson-sources-title">Sumber materi</h2>
                  </div>
                </div>
                <p className="lesson-sources-note">
                  Materi disarikan dan ditulis ulang dengan bahasa pembelajaran sendiri; lihat buku sumber
                  untuk uraian, gambar, dan latihan yang lebih lengkap.
                </p>
                <ol className="lesson-source-list">
                  {module.sources.map((source) => (
                    <li key={source.url}>
                      <a href={source.url} target="_blank" rel="noreferrer">
                        <strong>{source.title}</strong>
                        <span>{source.author} • {source.publisher}</span>
                      </a>
                    </li>
                  ))}
                </ol>
                <p className="lesson-license-note">
                  Buku OpenStax Chemistry 2e berlisensi
                  {' '}<a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noreferrer">CC BY-NC-SA 4.0</a>.
                  Materi ini ditulis ulang; gambar eksternal diberi atribusi dan keterangan lisensi tersendiri.
                </p>
              </section>
            )}

            <section className="lesson-sources lesson-research-sources" aria-labelledby="lesson-research-title">
              <div className="lesson-sources-heading">
                <span aria-hidden="true">🧾</span>
                <div>
                  <span className="lesson-section-eyebrow">PENELITIAN PENDIDIKAN</span>
                  <h2 id="lesson-research-title">Daftar pustaka (APA edisi ke-7)</h2>
                </div>
              </div>
              <ol className="lesson-reference-list">
                {courseReferences.map((reference) => (
                  <li key={reference.url}>
                    {reference.citation}{' '}
                    <a href={reference.url} target="_blank" rel="noreferrer">{reference.linkText}</a>
                    <span>{reference.type}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>

        <div className="lesson-actions">
          <button type="button" className="btn-secondary" onClick={() => onComplete(module.id)}>
            {completedModules.includes(module.id) ? '✓ Modul selesai' : 'Tandai modul selesai'}
          </button>
          {previousModule && (
            <button
              type="button"
              className="lesson-module-button"
              onClick={() => onSelectModule(previousModule.id)}
            >
              ← {previousModule.number}
            </button>
          )}
          {nextModule && (
            <button
              type="button"
              className="lesson-module-button"
              onClick={() => onSelectModule(nextModule.id)}
            >
              {nextModule.number} →
            </button>
          )}
          <button type="button" className="btn-primary" onClick={() => onStartQuiz(module.id)}>
            Kuis {module.number} →
          </button>
        </div>
      </main>
    </div>
  )
}
