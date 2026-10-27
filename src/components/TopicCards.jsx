import React from 'react'

export default function TopicCards({ onSelectModule }) {
  const modules = [
    {
      id: 'modul-1',
      number: 'Modul 1',
      title: 'Kenali Larutan',
      subtitle: 'Konsep Elektrolit & Nonelektrolit',
      colorClass: 'card-teal',
      accentColor: '#16A6A1',
      timeEstimate: '10 Menit',
      description:
        'Pelajari mengapa tidak semua zat yang larut dalam air dapat menghantarkan listrik. Temukan perbedaan fundamental antara partikel bermuatan (ion) dan molekul netral.',
      highlights: [
        'Pengertian larutan, zat terlarut, dan pelarut air',
        'Definisi larutan elektrolit vs larutan nonelektrolit',
        'Contoh nyata: Garam dapur (NaCl) vs Gula pasir (Sukrosa)',
        'Peran vital ion bebas sebagai pembawa muatan listrik'
      ],
      equation: 'NaCl(s) \u2192 Na\u207A(aq) + Cl\u207B(aq)',
      misconception:
        'Penting: Larut \u2260 Terionisasi. Sukrosa larut sempurna secara homogen namun tetap berwujud molekul netral tanpa ion!',
      btnText: 'Mulai Modul 1'
    },
    {
      id: 'modul-2',
      number: 'Modul 2',
      title: 'Laboratorium Mini',
      subtitle: 'Simulasi Uji Daya Hantar Listrik',
      colorClass: 'card-orange',
      accentColor: '#F4A340',
      timeEstimate: '15 Menit',
      description:
        'Eksperimen virtual merangkai alat uji daya hantar listrik. Uji berbagai larutan dan amati hubungan antara nyala lampu, gelembung elektrode, dan pergerakan ion.',
      highlights: [
        'Komponen alat uji: sumber arus DC, elektrode, & lampu uji',
        'Pengamatan ganda: intensitas nyala lampu & gelembung gas',
        'Uji sampel: Air garam, Asam cuka, Sukrosa, HCl, & NaOH',
        'Analisis pengaruh konsentrasi dan sensitivitas alat uji'
      ],
      equation: 'Daya Hantar \u223C Jumlah Ion Bebas \u00D7 Mobilitas Ion',
      misconception:
        'Penting: Lampu padam bukan bukti mutlak larutan nonelektrolit! Cek gelembung gas dan sensitivitas alat pada larutan elektrolit lemah.',
      btnText: 'Buka Laboratorium'
    },
    {
      id: 'modul-3',
      number: 'Modul 3',
      title: 'Jelajahi Ion',
      subtitle: 'Elektrolit Kuat, Lemah, Ionisasi & Disosiasi',
      colorClass: 'card-purple',
      accentColor: '#8A6DCE',
      timeEstimate: '15 Menit',
      description:
        'Selidiki dunia submikroskopik untuk membedakan proses disosiasi senyawa ionik dengan ionisasi senyawa kovalen polar, serta konsep derajat ionisasi (\u03B1).',
      highlights: [
        'Elektrolit Kuat: Disosiasi/ionisasi sempurna (\u03B1 \u2248 1)',
        'Elektrolit Lemah: Mengalami ionisasi sebagian & kesetimbangan',
        'Perbedaan ilmiah antara istilah Disosiasi vs Ionisasi',
        'Kekuatan elektrolit vs kepekatan (konsentrasi) larutan'
      ],
      equation: 'CH\u2083COOH(aq) + H\u2082O(l) \u21CC H\u2083O\u207A(aq) + CH\u2083COO\u207B(aq)',
      misconception:
        'Penting: Elektrolit kuat bukan berarti selalu larutan pekat! Kekuatan merujuk pada derajat pembentukan ion, bukan banyaknya gram zat.',
      btnText: 'Jelajahi Ion'
    }
  ]

  const handleCardClick = (modId) => {
    if (onSelectModule) {
      onSelectModule(modId)
    }
  }

  return (
    <section className="modules-section" id="materi" aria-labelledby="modules-heading">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-pill-tag">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>Peta Pembelajaran Interaktif</span>
          </div>

          <h2 id="modules-heading" className="section-title">
            Tiga Modul Menuju Pemahaman Bermakna
          </h2>

          <p className="section-subtitle">
            Dirancang bertahap sesuai alur berpikir ilmiah: mulai dari mengamati fenomena makroskopik,
            melakukan investigasi virtual, hingga menyingkap fenomena partikel di tingkat submikroskopik.
          </p>
        </div>

        {/* 3 Module Cards Grid */}
        <div className="modules-grid">
          {modules.map((mod) => (
            <article
              key={mod.id}
              id={`card-${mod.id}`}
              className={`module-card ${mod.colorClass}`}
              aria-labelledby={`title-${mod.id}`}
            >
              <div className="module-card-top">
                <div className="module-icon-box" aria-hidden="true">
                  {mod.id === 'modul-1' && (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 2v5.5L4.4 17.5A2.1 2.1 0 0 0 6.2 21h11.6a2.1 2.1 0 0 0 1.8-3.5L14 7.5V2" />
                      <path d="M8.5 2h7" />
                      <circle cx="10" cy="15" r="1" fill="currentColor" />
                      <circle cx="14" cy="17" r="1.5" fill="currentColor" />
                    </svg>
                  )}
                  {mod.id === 'modul-2' && (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="9" y1="18" x2="15" y2="18" />
                      <line x1="10" y1="22" x2="14" y2="22" />
                      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
                    </svg>
                  )}
                  {mod.id === 'modul-3' && (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 21.5c4.7 0 8.5-4.25 8.5-9.5S16.7 2.5 12 2.5 3.5 6.75 3.5 12s3.8 9.5 8.5 9.5Z" />
                      <path d="M2.5 12c0 4.7 4.25 8.5 9.5 8.5s9.5-3.8 9.5-8.5-4.25-8.5-9.5-8.5S2.5 7.3 2.5 12Z" transform="rotate(45 12 12)" />
                    </svg>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <span className="module-badge-seq">{mod.number}</span>
                  <span style={{ fontSize: '0.74rem', color: '#6b7280', fontWeight: '600' }}>
                    {mod.timeEstimate}
                  </span>
                </div>
              </div>

              <h3 id={`title-${mod.id}`} className="module-card-title">
                {mod.title}
              </h3>
              <p className="module-card-subtitle">
                {mod.subtitle}
              </p>

              <p className="module-card-desc">
                {mod.description}
              </p>

              <div className="module-highlights-title">Konsep Pokok:</div>
              <ul className="module-highlights-list">
                {mod.highlights.map((item, idx) => (
                  <li key={idx} className="highlight-item">
                    <span className="highlight-item-bullet" aria-hidden="true"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Chemical Equation Badge */}
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  padding: '0.45rem 0.65rem',
                  background: '#f7fafc',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #e2e8f0',
                  marginBottom: '1rem',
                  color: 'var(--color-navy)',
                  fontWeight: '600',
                  wordBreak: 'break-word'
                }}
              >
                {mod.equation}
              </div>

              {/* Misconception Prevention Alert */}
              <aside className="module-misconception-callout" aria-label="Catatan Miskonsepsi">
                {mod.misconception}
              </aside>

              {/* Card Action Button */}
              <button
                type="button"
                id={`btn-open-${mod.id}`}
                className="module-card-btn"
                onClick={() => handleCardClick(mod.id)}
              >
                <span>{mod.btnText}</span>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
