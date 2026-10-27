import React, { useState } from 'react'

export default function HeroSection({ onStartLearning, onOpenLab }) {
  // State for interactive demonstration in the Hero apparatus illustration
  // 'strong' (NaCl), 'weak' (CH3COOH), 'non' (Sukrosa)
  const [selectedSample, setSelectedSample] = useState('strong')

  const sampleData = {
    strong: {
      id: 'strong',
      name: 'Larutan Garam (NaCl)',
      soluteFormula: 'NaCl(s)',
      type: 'Elektrolit Kuat',
      colorClass: 'strong',
      bulbState: 'bright',
      bulbGlow: '#FFD700',
      bulbFilter: 'drop-shadow(0 0 24px rgba(255, 215, 0, 0.95))',
      filamentColor: '#FFFFFF',
      bubbleCount: 8,
      reaction: 'NaCl(s) \u2192 Na\u207A(aq) + Cl\u207B(aq)',
      description: 'Zat terdisosiasi sempurna menghasilkan konsentrasi ion bergerak tinggi. Arus listrik mengalir lancar sehingga lampu menyala terang dan banyak gelembung gas di elektrode.',
      ions: [
        { label: 'Na⁺', type: 'cation', x: 195, y: 260, color: '#16A6A1' },
        { label: 'Cl⁻', type: 'anion', x: 265, y: 275, color: '#203864' },
        { label: 'Na⁺', type: 'cation', x: 235, y: 310, color: '#16A6A1' },
        { label: 'Cl⁻', type: 'anion', x: 175, y: 320, color: '#203864' },
        { label: 'Na⁺', type: 'cation', x: 295, y: 290, color: '#16A6A1' },
        { label: 'Cl⁻', type: 'anion', x: 215, y: 345, color: '#203864' },
      ]
    },
    weak: {
      id: 'weak',
      name: 'Asam Cuka (CH₃COOH)',
      soluteFormula: 'CH₃COOH(aq)',
      type: 'Elektrolit Lemah',
      colorClass: 'weak',
      bulbState: 'dim',
      bulbGlow: '#F4A340',
      bulbFilter: 'drop-shadow(0 0 10px rgba(244, 163, 64, 0.55))',
      filamentColor: '#F4A340',
      bubbleCount: 3,
      reaction: 'CH\u2083COOH(aq) + H\u2082O(l) \u21CC H\u2083O\u207A(aq) + CH\u2083COO\u207B(aq)',
      description: 'Hanya sebagian kecil molekul yang terionisasi (mengalami kesetimbangan). Sebagian besar tetap berupa molekul netral. Lampu menyala redup dan gelembung gas tampak sedikit.',
      ions: [
        { label: 'CH₃COOH', type: 'neutral', x: 200, y: 265, color: '#7a8799', isMolecule: true },
        { label: 'H₃O⁺', type: 'cation', x: 270, y: 275, color: '#F4A340' },
        { label: 'CH₃COO⁻', type: 'anion', x: 180, y: 325, color: '#F4A340' },
        { label: 'CH₃COOH', type: 'neutral', x: 250, y: 330, color: '#7a8799', isMolecule: true },
        { label: 'CH₃COOH', type: 'neutral', x: 295, y: 300, color: '#7a8799', isMolecule: true },
      ]
    },
    non: {
      id: 'non',
      name: 'Larutan Gula (Sukrosa)',
      soluteFormula: 'C₁₂H₂₂O₁₁(s)',
      type: 'Nonelektrolit',
      colorClass: 'non',
      bulbState: 'off',
      bulbGlow: '#8c9ba5',
      bulbFilter: 'none',
      filamentColor: '#7a8799',
      bubbleCount: 0,
      reaction: 'C\u2081\u2082H\u2082\u2082O\u2081\u2081(s) \u2192 C\u2081\u2082H\u2082\u2082O\u2081\u2081(aq)',
      description: 'Zat terlarut tersebar merata sebagai molekul netral dan TIDAK menghasilkan ion bebas. Tanpa pembawa muatan bergerak, lampu padam dan tidak ada gelembung elektrode.',
      ions: [
        { label: 'Sukrosa', type: 'neutral', x: 195, y: 270, color: '#8A6DCE', isMolecule: true },
        { label: 'Sukrosa', type: 'neutral', x: 265, y: 285, color: '#8A6DCE', isMolecule: true },
        { label: 'Sukrosa', type: 'neutral', x: 220, y: 325, color: '#8A6DCE', isMolecule: true },
        { label: 'Sukrosa', type: 'neutral', x: 290, y: 335, color: '#8A6DCE', isMolecule: true },
      ]
    }
  }

  const current = sampleData[selectedSample]

  return (
    <section className="hero-section" id="beranda" aria-labelledby="hero-heading">
      <div className="container">
        <div className="hero-grid">
          {/* Left Column: Educational Content & CTAs */}
          <div className="hero-content">
            <div className="hero-badge-pill">
              <span className="hero-badge-dot" aria-hidden="true"></span>
              <span>Kimia Fase E (Kelas X SMA) • Pembelajaran Berbasis Konsep</span>
            </div>

            <h1 id="hero-heading" className="hero-title">
              Yuk, Jelajahi <br />
              <span className="highlight-gradient">Dunia Larutan!</span>
            </h1>

            <p className="hero-description">
              Pernahkah kamu penasaran mengapa air garam mampu menyalakan lampu, sedangkan air gula tidak?
              Bersama <strong>ElectroFun Chemistry</strong>, singkap misteri partikel mikroskopik di balik
              daya hantar listrik larutan melalui eksperimen virtual, animasi ion yang interaktif, dan pemahaman konsep yang kokoh tanpa hafalan buta!
            </p>

            {/* Feature Pills */}
            <div className="hero-feature-tags" aria-label="Keunggulan Pembelajaran">
              <span className="feature-tag-item">
                <span role="img" aria-label="Simulasi">⚡</span> Simulasi Daya Hantar Nyata
              </span>
              <span className="feature-tag-item">
                <span role="img" aria-label="Ion">🔬</span> Visualisasi Partikel Submikroskopik
              </span>
              <span className="feature-tag-item">
                <span role="img" aria-label="Bebas miskonsepsi">🎯</span> Bebas Miskonsepsi Kimia
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="hero-cta-group">
              <button
                type="button"
                id="hero-btn-mulai"
                className="btn-primary btn-lg"
                onClick={onStartLearning}
              >
                <span>Mulai Belajar</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
                </svg>
              </button>

              <button
                type="button"
                id="hero-btn-lab"
                className="btn-secondary btn-lg"
                onClick={onOpenLab}
              >
                <span>Coba Laboratorium</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5V2" />
                  <path d="M8.5 2h7" />
                  <path d="M14.5 16h-5" />
                </svg>
              </button>
            </div>

            {/* Concept Warning / Did You Know Callout */}
            <aside className="hero-did-you-know" aria-label="Pojok Konsep Penting">
              <span className="hero-did-you-know-icon" aria-hidden="true">💡</span>
              <div>
                <strong>Konsep Kunci:</strong> Larut dalam air <em>tidak sama</em> dengan terionisasi!
                Gula larut sempurna karena membentuk ikatan hidrogen dengan air, namun tetap berada sebagai molekul netral tanpa muatan bebas, sehingga tidak menghantarkan listrik.
              </div>
            </aside>
          </div>

          {/* Right Column: Educational Electrical Conductivity Testing Apparatus (Alat Uji Daya Hantar Listrik) */}
          <div className="apparatus-wrapper" aria-label="Simulasi Alat Uji Daya Hantar Listrik">
            {/* Header with Title and Mode */}
            <div className="apparatus-header">
              <div className="apparatus-title-group">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#203864" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                <span className="apparatus-title">Alat Uji Daya Hantar Listrik</span>
              </div>
              <span className={`apparatus-status-pill ${current.colorClass}`}>
                {current.type}
              </span>
            </div>

            {/* Interactive Sample Selector Tabs */}
            <div className="sample-tabs" role="tablist" aria-label="Pilih Sampel Larutan">
              <button
                type="button"
                role="tab"
                aria-selected={selectedSample === 'strong'}
                id="sample-tab-nacl"
                className={`sample-tab-btn tab-strong ${selectedSample === 'strong' ? 'active' : ''}`}
                onClick={() => setSelectedSample('strong')}
              >
                <span className="sample-tab-name">Larutan NaCl</span>
                <span className="sample-tab-type">Elektrolit Kuat</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={selectedSample === 'weak'}
                id="sample-tab-ch3cooh"
                className={`sample-tab-btn tab-weak ${selectedSample === 'weak' ? 'active' : ''}`}
                onClick={() => setSelectedSample('weak')}
              >
                <span className="sample-tab-name">CH₃COOH</span>
                <span className="sample-tab-type">Elektrolit Lemah</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={selectedSample === 'non'}
                id="sample-tab-sugar"
                className={`sample-tab-btn tab-non ${selectedSample === 'non' ? 'active' : ''}`}
                onClick={() => setSelectedSample('non')}
              >
                <span className="sample-tab-name">Sukrosa (Gula)</span>
                <span className="sample-tab-type">Nonelektrolit</span>
              </button>
            </div>

            {/* SVG Apparatus Stage */}
            <div className="apparatus-stage-box">
              <svg
                viewBox="0 0 460 380"
                className="apparatus-svg"
                role="img"
                aria-label={`Ilustrasi alat uji listrik dengan ${current.name}, nyala lampu ${current.bulbState === 'bright' ? 'terang' : current.bulbState === 'dim' ? 'redup' : 'padam'}`}
              >
                <defs>
                  {/* Glass Liquid Gradients */}
                  <linearGradient id="solutionGradStrong" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C4EBE9" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#87D4D0" stopOpacity="0.9" />
                  </linearGradient>
                  <linearGradient id="solutionGradWeak" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FBEBD6" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#F8D4A8" stopOpacity="0.9" />
                  </linearGradient>
                  <linearGradient id="solutionGradNon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EBE5F7" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#D5C5F1" stopOpacity="0.9" />
                  </linearGradient>

                  {/* Electrode Metal Gradient */}
                  <linearGradient id="electrodeGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#374151" />
                    <stop offset="50%" stopColor="#6B7280" />
                    <stop offset="100%" stopColor="#1F2937" />
                  </linearGradient>

                  {/* Battery Metal Gradient */}
                  <linearGradient id="batteryGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#203864" />
                    <stop offset="60%" stopColor="#2F5597" />
                    <stop offset="100%" stopColor="#162847" />
                  </linearGradient>
                </defs>

                {/* 1. POWER SOURCE (BATERAI / SUMBER LISTRIK DC) */}
                <g id="power-source" transform="translate(60, 20)">
                  <rect x="0" y="8" width="60" height="38" rx="5" fill="url(#batteryGrad)" stroke="#1a2e50" strokeWidth="1.5" />
                  {/* Positive Terminal Tab */}
                  <rect x="60" y="20" width="6" height="14" rx="2" fill="#D97706" />
                  {/* Negative Terminal Tab */}
                  <rect x="-4" y="20" width="4" height="14" rx="1" fill="#4B5563" />
                  {/* Polarity Markings */}
                  <text x="48" y="32" fill="#FFFFFF" fontSize="13" fontWeight="bold">+</text>
                  <text x="12" y="32" fill="#FFFFFF" fontSize="15" fontWeight="bold">-</text>
                  <text x="30" y="30" fill="#93C5FD" fontSize="8" fontWeight="600" textAnchor="middle">9V DC</text>
                  <text x="30" y="58" fill="#203864" fontSize="10" fontWeight="700" textAnchor="middle">Baterai</text>
                </g>

                {/* 2. LIGHT BULB (LAMPU INDIKATOR) */}
                <g id="light-bulb" transform="translate(230, 16)">
                  {/* Glow halo when turned on */}
                  {current.bulbState === 'bright' && (
                    <circle cx="20" cy="20" r="32" fill="#FFD700" opacity="0.35" filter="blur(6px)" />
                  )}
                  {current.bulbState === 'dim' && (
                    <circle cx="20" cy="20" r="22" fill="#F4A340" opacity="0.3" filter="blur(4px)" />
                  )}

                  {/* Glass Bulb Dome */}
                  <path
                    d="M6,20 C6,10 12,4 20,4 C28,4 34,10 34,20 C34,26 30,29 29,33 L11,33 C10,29 6,26 6,20 Z"
                    fill={current.bulbState === 'bright' ? '#FFF59D' : current.bulbState === 'dim' ? '#FFE0B2' : '#E2E8F0'}
                    stroke="#94A3B8"
                    strokeWidth="1.5"
                    style={{ filter: current.bulbFilter }}
                  />

                  {/* Internal Filament */}
                  <path
                    d="M14,33 L17,22 L20,25 L23,22 L26,33"
                    fill="none"
                    stroke={current.filamentColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Bulb Base & Screw */}
                  <rect x="12" y="33" width="16" height="5" fill="#94A3B8" rx="1" />
                  <rect x="13" y="38" width="14" height="4" fill="#64748B" rx="1" />
                  <rect x="15" y="42" width="10" height="3" fill="#334155" rx="1.5" />

                  {/* Light Emission Rays (for bright) */}
                  {current.bulbState === 'bright' && (
                    <g stroke="#EAB308" strokeWidth="2" strokeLinecap="round">
                      <line x1="20" y1="-3" x2="20" y2="-9" />
                      <line x1="36" y1="7" x2="42" y2="3" />
                      <line x1="40" y1="23" x2="46" y2="25" />
                      <line x1="4" y1="7" x2="-2" y2="3" />
                      <line x1="0" y1="23" x2="-6" y2="25" />
                    </g>
                  )}

                  <text x="20" y="58" fill="#203864" fontSize="10" fontWeight="700" textAnchor="middle">
                    {current.bulbState === 'bright' ? 'Menyala Terang' : current.bulbState === 'dim' ? 'Menyala Redup' : 'Lampu Padam'}
                  </text>
                </g>

                {/* 3. CONNECTING WIRES (KABEL TEMBAGA) */}
                <g id="wires" fill="none" strokeWidth="3" strokeLinecap="round">
                  {/* Left Wire: Battery (-) to Left Electrode (Katoda) */}
                  <path d="M56,40 L30,40 L30,175 L180,175" stroke="#374151" />

                  {/* Middle Wire: Battery (+) to Lamp */}
                  <path d="M126,40 L230,40" stroke="#DC2626" />

                  {/* Right Wire: Lamp to Right Electrode (Anoda) */}
                  <path d="M250,40 L410,40 L410,175 L280,175" stroke="#DC2626" />

                  {/* Electron Flow Annotation (on metallic wire only!) */}
                  {current.bulbState !== 'off' && (
                    <g>
                      <circle cx="100" cy="40" r="3" fill="#3B82F6" />
                      <circle cx="330" cy="40" r="3" fill="#3B82F6" />
                      <text x="100" y="32" fill="#2563EB" fontSize="8" fontWeight="bold" textAnchor="middle">e⁻</text>
                      <text x="330" y="32" fill="#2563EB" fontSize="8" fontWeight="bold" textAnchor="middle">e⁻</text>
                    </g>
                  )}
                </g>

                {/* 4. BEAKER GLASS (GELAS KIMIA) */}
                <g id="beaker" transform="translate(140, 160)">
                  {/* Graduation marks on glass */}
                  <line x1="2" y1="40" x2="16" y2="40" stroke="#CBD5E1" strokeWidth="1.5" />
                  <line x1="2" y1="70" x2="22" y2="70" stroke="#CBD5E1" strokeWidth="1.5" />
                  <text x="28" y="73" fill="#94A3B8" fontSize="8">100 mL</text>
                  <line x1="2" y1="100" x2="16" y2="100" stroke="#CBD5E1" strokeWidth="1.5" />
                  <line x1="2" y1="130" x2="22" y2="130" stroke="#CBD5E1" strokeWidth="1.5" />
                  <text x="28" y="133" fill="#94A3B8" fontSize="8">200 mL</text>

                  {/* Solution Fill */}
                  <path
                    d="M6,55 Q90,58 174,55 L174,185 Q174,195 160,195 L20,195 Q6,195 6,185 Z"
                    fill={selectedSample === 'strong' ? 'url(#solutionGradStrong)' : selectedSample === 'weak' ? 'url(#solutionGradWeak)' : 'url(#solutionGradNon)'}
                  />

                  {/* Solution Surface Meniscus */}
                  <ellipse cx="90" cy="55" rx="84" ry="7" fill="none" stroke="#64748B" strokeWidth="1" opacity="0.6" />

                  {/* Outer Beaker Outline with Spout */}
                  <path
                    d="M-3,8 L10,8 L10,185 Q10,198 25,198 L155,198 Q170,198 170,185 L170,8 L180,8"
                    fill="none"
                    stroke="#475569"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Beaker Label */}
                  <text x="90" y="214" fill="#203864" fontSize="11" fontWeight="700" textAnchor="middle">
                    Gelas Kimia (Sampel Larutan)
                  </text>
                </g>

                {/* 5. TWO ELECTRODES (DUA BATANG ELEKTRODE) */}
                <g id="electrodes">
                  {/* Left Electrode (-) Katoda */}
                  <rect x="172" y="140" width="14" height="150" rx="3" fill="url(#electrodeGrad)" stroke="#111827" strokeWidth="1" />
                  <text x="179" y="132" fill="#203864" fontSize="9" fontWeight="bold" textAnchor="middle">(-)</text>
                  <text x="179" y="121" fill="#4B5563" fontSize="8" fontWeight="600" textAnchor="middle">Katoda</text>

                  {/* Right Electrode (+) Anoda */}
                  <rect x="274" y="140" width="14" height="150" rx="3" fill="url(#electrodeGrad)" stroke="#111827" strokeWidth="1" />
                  <text x="281" y="132" fill="#203864" fontSize="9" fontWeight="bold" textAnchor="middle">(+)</text>
                  <text x="281" y="121" fill="#4B5563" fontSize="8" fontWeight="600" textAnchor="middle">Anoda</text>

                  {/* Gas Bubbles at Electrodes (Simulated by sample) */}
                  {selectedSample === 'strong' && (
                    <g fill="#FFFFFF" stroke="#16A6A1" strokeWidth="0.8" opacity="0.9">
                      {/* Left electrode bubbles */}
                      <circle cx="169" cy="270" r="3" className="bubble-anim-1" />
                      <circle cx="188" cy="255" r="2.5" className="bubble-anim-2" />
                      <circle cx="168" cy="240" r="3.2" className="bubble-anim-3" />
                      <circle cx="189" cy="225" r="2.8" className="bubble-anim-1" />
                      <circle cx="170" cy="205" r="3.5" className="bubble-anim-2" />
                      {/* Right electrode bubbles */}
                      <circle cx="271" cy="275" r="2.5" className="bubble-anim-2" />
                      <circle cx="290" cy="260" r="3.2" className="bubble-anim-1" />
                      <circle cx="270" cy="245" r="3" className="bubble-anim-3" />
                      <circle cx="291" cy="220" r="2.8" className="bubble-anim-2" />
                    </g>
                  )}

                  {selectedSample === 'weak' && (
                    <g fill="#FFFFFF" stroke="#F4A340" strokeWidth="0.8" opacity="0.8">
                      <circle cx="169" cy="265" r="2.5" className="bubble-anim-2" />
                      <circle cx="290" cy="260" r="2.2" className="bubble-anim-1" />
                      <circle cx="170" cy="225" r="2" className="bubble-anim-3" />
                    </g>
                  )}
                </g>

                {/* 6. SUBMICROSCOPIC PARTICLES INSIDE SOLUTION */}
                <g id="solution-particles">
                  {current.ions.map((ion, idx) => (
                    <g
                      key={`${current.id}-ion-${idx}`}
                      className="particle-ion"
                      transform={`translate(${ion.x}, ${ion.y})`}
                    >
                      {ion.isMolecule ? (
                        /* Neutral Molecule Representation (Pill/capsule shape for sugar or acetic acid molecule) */
                        <g>
                          <rect x="-24" y="-10" width="48" height="20" rx="10" fill={ion.color} opacity="0.9" />
                          <text x="0" y="3.5" fill="#FFFFFF" fontSize="8.5" fontWeight="700" textAnchor="middle">
                            {ion.label}
                          </text>
                        </g>
                      ) : (
                        /* Charged Mobile Ion Representation */
                        <g>
                          <circle cx="0" cy="0" r="14" fill={ion.color} />
                          <circle cx="0" cy="0" r="12" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.5" />
                          <text x="0" y="4.5" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">
                            {ion.label}
                          </text>
                        </g>
                      )}
                    </g>
                  ))}
                </g>

                {/* Scientific Note Badge inside SVG */}
                <g transform="translate(150, 362)">
                  <rect x="0" y="0" width="160" height="16" rx="8" fill="#203864" opacity="0.85" />
                  <text x="80" y="11" fill="#FFFFFF" fontSize="8" fontWeight="600" textAnchor="middle">
                    Partikel bergerak bebas membawa arus
                  </text>
                </g>
              </svg>
            </div>

            {/* Explanation Panel under the apparatus */}
            <div className="apparatus-result-panel">
              <div className={`result-icon-badge ${current.colorClass}`} aria-hidden="true">
                {selectedSample === 'strong' ? '⚡' : selectedSample === 'weak' ? '💡' : '🚫'}
              </div>
              <div className="result-details">
                <div className="result-chemical-eq">
                  {current.reaction}
                </div>
                <p className="result-explanation-text">
                  {current.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
