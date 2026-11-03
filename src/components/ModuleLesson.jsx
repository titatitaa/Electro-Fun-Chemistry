import { courseModules } from '../data/database.js'
import './ModuleLesson.css'

export default function ModuleLesson({
  moduleId,
  completedModules,
  onClose,
  onComplete,
  onSelectModule,
  onStartQuiz,
}) {
  const module = courseModules.find((item) => item.id === moduleId)
  if (!module) return null

  const moduleIndex = courseModules.findIndex((item) => item.id === moduleId)
  const previousModule = courseModules[moduleIndex - 1]
  const nextModule = courseModules[moduleIndex + 1]
  const subtopicCount = module.subtopics.length

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
          </div>
          <figure className="lesson-hero-figure">
            <img src={module.image} alt={`Ilustrasi materi: ${module.title}`} />
            <figcaption>Visualisasi konsep • pilih subbab untuk belajar bertahap</figcaption>
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
              {module.subtopics.map((subtopic, index) => (
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
                  Rujukan OpenStax Chemistry 2e tersedia dengan lisensi
                  {' '}<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>.
                  Konten pada halaman ini merupakan parafrasa dan materi belajar tambahan, bukan salinan teks atau gambar buku.
                </p>
              </section>
            )}
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
