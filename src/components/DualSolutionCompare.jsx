import { useState, useMemo, useEffect } from 'react'
import {
  laboratorySolutions,
  calculateLabResult,
  createParticles,
  formatMeasurement,
  concentrationChoices,
  voltageChoices,
  temperatureChoices,
  distanceChoices,
} from '../data/labModel.js'
import './DualSolutionCompare.css'

// Preset pasangan zat (HANYA menggunakan zat yang ada di laboratorySolutions)
const COMPARISON_PRESETS = [
  {
    id: 'preset-strong-weak',
    label: 'Elektrolit Kuat vs Lemah (NaCl vs CH₃COOH)',
    solA: 'nacl',
    solB: 'acetic',
    description: 'Bandingkan garam terionisasi sempurna dengan asam lemah terionisasi sebagian pada konsentrasi sama.',
    promptQuestion: 'Mengapa larutan NaCl 0,10 M membuat lampu menyala terang, sedangkan CH₃COOH 0,10 M hanya redup padahal konsentrasinya sama?',
    promptAnswer: 'Meskipun konsentrasi analitiknya sama (0,10 M), NaCl terurai sempurna (α ≈ 1) menjadi 0,20 M ion bebas. Sebaliknya, CH₃COOH adalah asam lemah yang hanya terionisasi sebagian (α ≈ 1,3%), sehingga jumlah ion pembawa muatan jauh lebih sedikit.',
  },
  {
    id: 'preset-strong-none',
    label: 'Elektrolit Kuat vs Nonelektrolit (NaCl vs Sukrosa)',
    solA: 'nacl',
    solB: 'sucrose',
    description: 'Bandingkan larutan penghantar listrik dengan larutan gula yang molekulnya tidak menghasilkan ion.',
    promptQuestion: 'Mengapa larutan gula larut dengan sangat baik di dalam air tetapi tidak dapat menyalakan lampu sama sekali?',
    promptAnswer: 'Kelarutan zat tidak identik dengan daya hantar listrik. Sukrosa larut sebagai molekul netral (C₁₂H₂₂O₁₁) yang dikelilingi molekul air tanpa membentuk partikel bermuatan (ion). Tanpa ion bebas, arus listrik tidak dapat mengalir.',
  },
  {
    id: 'preset-weak-none',
    label: 'Elektrolit Lemah vs Nonelektrolit (CH₃COOH vs Glukosa)',
    solA: 'acetic',
    solB: 'glucose',
    description: 'Amati perbedaan larutan yang memiliki sedikit ion dengan larutan yang sama sekali tidak memiliki ion.',
    promptQuestion: 'Apakah larutan dengan nyala lampu sangat redup sama statusnya dengan larutan yang lampunya padam?',
    promptAnswer: 'Tidak sama. Larutan elektrolit lemah tetap menghasilkan sejumlah kecil ion sehingga memiliki konduktivitas terukur dan sedikit gelembung. Nonelektrolit seperti glukosa tidak menghasilkan ion sama sekali (konduktivitas mendekati nol mutlak).',
  },
  {
    id: 'preset-strong-acid-weak-base',
    label: 'Asam Kuat vs Basa Lemah (HCl vs NH₃)',
    solA: 'hcl',
    solB: 'ammonia',
    description: 'Perbandingan asam kuat yang terionisasi sempurna dengan basa lemah amonia dalam air.',
    promptQuestion: 'Bagaimana perbandingan mobilitas ion H₃O⁺ pada asam kuat dibanding ion pada basa lemah?',
    promptAnswer: 'HCl bereaksi sempurna dengan air menghasilkan ion hidronium (H₃O⁺) yang memiliki mobilitas ionik tertinggi dalam air, menghasilkan konduktivitas sangat tinggi. Amonia (NH₃) hanya menghasilkan sedikit ion NH₄⁺ dan OH⁻ melalui kesetimbangan lemah.',
  },
  {
    id: 'preset-water-samples',
    label: 'Air Suling vs Air Mineral (H₂O vs H₂O + Mineral)',
    solA: 'distilled',
    solB: 'mineral',
    description: 'Pahami perbedaan antara air murni laboratorium dengan air yang mengandung ion-ion mineral terlarut.',
    promptQuestion: 'Apakah air murni merupakan penghantar listrik yang baik?',
    promptAnswer: 'Air murni (aquades) adalah penghantar yang sangat buruk karena autoionisasi air hanya menghasilkan ion [H₃O⁺] dan [OH⁻] sebesar 10⁻⁷ M. Sebaliknya, air mineral mengandung ion garam terlarut (Na⁺, Ca²⁺, Cl⁻) yang meningkatkan daya hantarnya.',
  },
  {
    id: 'preset-univalent-divalent',
    label: 'Garam 1:1 vs 1:2 (NaCl vs CaCl₂)',
    solA: 'nacl',
    solB: 'cacl2',
    description: 'Bandingkan dua elektrolit kuat dengan jumlah ion per satuan rumus yang berbeda.',
    promptQuestion: 'Pada konsentrasi yang sama (misal 0,10 M), manakah yang menghantarkan arus lebih besar: NaCl atau CaCl₂?',
    promptAnswer: 'CaCl₂ menghasilkan daya hantar lebih tinggi karena setiap 1 mol CaCl₂ terurai menjadi 3 mol ion (1 Ca²⁺ bertegangan muatan +2 dan 2 Cl⁻), sedangkan 1 mol NaCl hanya menghasilkan 2 mol ion (1 Na⁺ dan 1 Cl⁻).',
  },
]

const STORAGE_KEY = 'compare_records'

// Warna kecerahan bola lampu konsisten dengan ambang lampLevel labModel.js
const BULB_COLORS = ['#94a3b8', '#fef08a', '#facc15', '#f59e0b']

// Slot posisi partikel terpisah di dalam batas cairan beker
const PARTICLE_SLOTS = [
  { x: 148, y: 190 },
  { x: 180, y: 182 },
  { x: 212, y: 190 },
  { x: 158, y: 214 },
  { x: 202, y: 214 },
  { x: 148, y: 238 },
  { x: 180, y: 236 },
  { x: 212, y: 240 },
]

function SingleBeakerSVG({ solution, result, particles, isPowered, label }) {
  const lampLevel = result.lampLevel || 0
  const isDissolved = true
  const volume = 100
  const cleanId = label.toLowerCase().replace(/[^a-z0-9]/g, '')
  const bulbColor = BULB_COLORS[lampLevel] || '#94a3b8'

  const lampStatusText = !isPowered
    ? 'Lampu: OFF'
    : lampLevel === 0
    ? 'Lampu: Padam'
    : lampLevel === 1
    ? 'Lampu: Sangat redup'
    : lampLevel === 2
    ? 'Lampu: Redup'
    : 'Lampu: Terang'

  return (
    <div className="dual-beaker-box">
      <div className="dual-beaker-badge">
        <strong>{label}:</strong> {solution.name} ({solution.formula})
      </div>

      <svg
        className={`dual-svg-canvas${isPowered ? ' is-powered' : ''}`}
        viewBox="0 0 360 320"
        role="img"
        aria-label={`Rangkaian uji daya hantar ${label} untuk larutan ${solution.name}`}
      >
        <defs>
          <filter id={`bulbGlow-${cleanId}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={lampLevel * 3.5} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Kawat Rangkaian (Jalur rapi tidak menimpa label elektrode) */}
        <path
          d="M 40 50 L 173 50 M 187 50 L 320 50 M 40 50 L 40 110 L 115 110 M 320 50 L 320 110 L 245 110"
          fill="none"
          stroke="#64748b"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Animasi Arus Listrik saat Menyala */}
        {isPowered && lampLevel > 0 && (
          <path
            d="M 40 50 L 173 50 M 187 50 L 320 50 M 40 50 L 40 110 L 115 110 M 320 50 L 320 110 L 245 110"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3"
            strokeDasharray="6 8"
            className="circuit-dash-anim"
          />
        )}

        {/* Lampu Pijar Klasik (Bola kaca, filamen, soket ulir) */}
        <g transform="translate(0, 0)">
          {/* Pendaran Cahaya saat Menyala */}
          {isPowered && lampLevel > 0 && (
            <g stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" opacity="0.85">
              <line x1="180" y1="2" x2="180" y2="-6" />
              <line x1="152" y1="10" x2="145" y2="5" />
              <line x1="208" y1="10" x2="215" y2="5" />
              <line x1="144" y1="24" x2="136" y2="24" />
              <line x1="216" y1="24" x2="224" y2="24" />
            </g>
          )}

          {/* Bola Kaca Lampu */}
          <path
            d="M 173 46 C 163 40 158 31 158 20 A 22 22 0 1 1 202 20 C 202 31 197 40 187 46 Z"
            fill={isPowered && lampLevel > 0 ? bulbColor : '#f1f5f9'}
            stroke={isPowered && lampLevel > 0 ? '#eab308' : '#94a3b8'}
            strokeWidth="2.5"
            filter={isPowered && lampLevel > 0 ? `url(#bulbGlow-${cleanId})` : undefined}
          />

          {/* Kawat Penyangga Filamen di dalam Bola Lampu */}
          <line
            x1="175"
            y1="46"
            x2="175"
            y2="25"
            stroke={isPowered && lampLevel > 0 ? '#d97706' : '#64748b'}
            strokeWidth="1.5"
          />
          <line
            x1="185"
            y1="46"
            x2="185"
            y2="25"
            stroke={isPowered && lampLevel > 0 ? '#d97706' : '#64748b'}
            strokeWidth="1.5"
          />

          {/* Filamen Tungsten (Menyala Terang jika Arus Mengalir) */}
          <path
            d="M 175 25 Q 180 17 185 25"
            fill="none"
            stroke={isPowered && lampLevel > 0 ? '#ffffff' : '#64748b'}
            strokeWidth={isPowered && lampLevel > 0 ? '2.8' : '1.5'}
            strokeLinecap="round"
          />

          {/* Soket Ulir Logam Lampu */}
          <rect x="173" y="46" width="14" height="10" rx="1" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
          <line x1="173" y1="49" x2="187" y2="49" stroke="#64748b" strokeWidth="1" />
          <line x1="173" y1="52" x2="187" y2="52" stroke="#64748b" strokeWidth="1" />
          <ellipse cx="180" cy="57" rx="4" ry="2" fill="#334155" />

          {/* Label Status Nyala Lampu Konsisten dengan labModel.js */}
          <text x="180" y="74" textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155">
            {lampStatusText}
          </text>
        </g>

        {/* Gelas Beker & Cairan */}
        <g transform="translate(0, 30)">
          {/* Garis Dinding Kaca Beker Transparan */}
          <path
            d="M 80 115 L 95 260 Q 98 270 110 270 L 250 270 Q 262 270 265 260 L 280 115"
            fill="rgba(255,255,255,0.7)"
            stroke="#64748b"
            strokeWidth="3.5"
          />

          {/* Cairan Bening Biru Muda Transparan (Bebas dari warna hitam) */}
          {isDissolved && (
            <>
              <path
                d="M 87 170 L 96 260 Q 98 268 110 268 L 250 268 Q 262 268 264 260 L 273 170 Z"
                fill="rgba(147, 197, 253, 0.35)"
              />
              {/* Garis Permukaan Meniskus Cairan */}
              <path
                d="M 87 170 L 273 170"
                stroke="rgba(96, 165, 250, 0.75)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            </>
          )}

          {/* Batang Elektroda Anode & Katode */}
          <rect x="115" y="90" width="12" height="145" rx="3" fill="#92400e" stroke="#78350f" strokeWidth="1.5" />
          <rect x="233" y="90" width="12" height="145" rx="3" fill="#92400e" stroke="#78350f" strokeWidth="1.5" />

          {/* Badge Label Polaritas Anode (+) dan Katode (−) Konsisten dengan VirtualLab.jsx */}
          <g transform="translate(98, 64)">
            <rect width="46" height="20" rx="4" fill="#ffffff" stroke="#92400e" strokeWidth="1.5" />
            <text x="23" y="14" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#92400e">
              Anode (+)
            </text>
          </g>

          <g transform="translate(216, 64)">
            <rect width="46" height="20" rx="4" fill="#ffffff" stroke="#92400e" strokeWidth="1.5" />
            <text x="23" y="14" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#92400e">
              Katode (−)
            </text>
          </g>

          {/* Partikel Tersebar di Dalam Batas Cairan Beker (Clamp aman, tidak keluar beker) */}
          {particles.slice(0, 8).map((particle, idx) => {
            const slot = PARTICLE_SLOTS[idx % PARTICLE_SLOTS.length]
            return (
              <g key={particle.id} transform={`translate(${slot.x}, ${slot.y})`}>
                <g className={`compare-particle ${particle.type}${isPowered ? ' moving' : ''}`}>
                  <circle r={particle.type === 'neutral' ? 9.5 : 10} />
                  <text y="3" textAnchor="middle" fontSize="7.5" fontWeight="800">
                    {particle.formula}
                  </text>
                </g>
              </g>
            )
          })}

          {/* Gelembung Gas di sekitar elektrode jika menyala */}
          {isPowered && lampLevel > 0 && Array.from({ length: Math.min(lampLevel * 2, 6) }, (_, idx) => (
            <circle
              key={`bubble-${cleanId}-${idx}`}
              className="compare-bubble"
              cx={idx % 2 === 0 ? 121 + (idx * 2) : 239 - (idx * 2)}
              cy={215 - (idx * 16)}
              r={2 + (idx % 2)}
              fill="#ffffff"
              opacity="0.85"
            />
          ))}

          <text x="180" y="286" textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155">
            {solution.formula} ({volume} mL)
          </text>
        </g>
      </svg>
    </div>
  )
}

export default function DualSolutionCompare({ user, onOpenJournal }) {
  // Pilihan Preset atau Manual
  const [selectedPresetId, setSelectedPresetId] = useState(COMPARISON_PRESETS[0].id)
  const [solAId, setSolAId] = useState(COMPARISON_PRESETS[0].solA)
  const [solBId, setSolBId] = useState(COMPARISON_PRESETS[0].solB)

  // Variabel Eksperimen Bersama (Fair Test)
  const [concentration, setConcentration] = useState(0.1)
  const [volume] = useState(100)
  const [temperature, setTemperature] = useState(25)
  const [voltage, setVoltage] = useState(1.5)
  const [distance, setDistance] = useState(1)

  // State Rangkaian
  const [isPowered, setIsPowered] = useState(false)
  const [repMode, setRepMode] = useState('macro') // 'macro' | 'micro' | 'symbolic'
  const [showPromptAnswer, setShowPromptAnswer] = useState(false)
  const [records, setRecords] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })
  const [notification, setNotification] = useState('')

  const activePreset = useMemo(
    () => COMPARISON_PRESETS.find((p) => p.id === selectedPresetId),
    [selectedPresetId]
  )

  const solutionA = useMemo(
    () => laboratorySolutions.find((s) => s.id === solAId) || laboratorySolutions[0],
    [solAId]
  )
  const solutionB = useMemo(
    () => laboratorySolutions.find((s) => s.id === solBId) || laboratorySolutions[1],
    [solBId]
  )

  // Hitung hasil simulasi menggunakan model fisika-kimia yang sudah ada di labModel.js
  const resultA = useMemo(
    () =>
      calculateLabResult({
        solution: solutionA,
        concentration,
        volume,
        temperature,
        voltage,
        distance,
        dissolved: true,
      }),
    [solutionA, concentration, volume, temperature, voltage, distance]
  )

  const resultB = useMemo(
    () =>
      calculateLabResult({
        solution: solutionB,
        concentration,
        volume,
        temperature,
        voltage,
        distance,
        dissolved: true,
      }),
    [solutionB, concentration, volume, temperature, voltage, distance]
  )

  const particlesA = useMemo(() => createParticles(resultA, solutionA), [resultA, solutionA])
  const particlesB = useMemo(() => createParticles(resultB, solutionB), [resultB, solutionB])

  // Pilih preset
  const handleSelectPreset = (presetId) => {
    setSelectedPresetId(presetId)
    const found = COMPARISON_PRESETS.find((p) => p.id === presetId)
    if (found) {
      setSolAId(found.solA)
      setSolBId(found.solB)
      setIsPowered(false)
      setShowPromptAnswer(false)
      setNotification(`Preset "${found.label}" diaktifkan. Variabel disetarakan untuk perbandingan adil.`)
    }
  }

  // Pilih zat manual (ubah preset ke kustom)
  const handleManualSolA = (id) => {
    setSolAId(id)
    setSelectedPresetId('custom')
    setIsPowered(false)
  }

  const handleManualSolB = (id) => {
    setSolBId(id)
    setSelectedPresetId('custom')
    setIsPowered(false)
  }

  // Analisis Rasio Daya Hantar
  const conductivityRatioText = useMemo(() => {
    if (!isPowered) return null

    const condA = resultA.conductivity || 0
    const condB = resultB.conductivity || 0
    const zeroThreshold = 1e-6

    const isAZero = condA <= zeroThreshold
    const isBZero = condB <= zeroThreshold

    if (isAZero && isBZero) {
      return 'Kedua larutan tidak menghantarkan arus listrik.'
    }
    if (isAZero) {
      return `Larutan A (${solutionA.formula}) tidak menghantarkan listrik.`
    }
    if (isBZero) {
      return `Larutan B (${solutionB.formula}) tidak menghantarkan listrik.`
    }

    if (condA >= condB) {
      const ratio = (condA / condB).toFixed(1)
      return `Larutan A (${solutionA.formula}) menghantar ± ${ratio} kali lebih baik daripada Larutan B (${solutionB.formula}).`
    } else {
      const ratio = (condB / condA).toFixed(1)
      return `Larutan B (${solutionB.formula}) menghantar ± ${ratio} kali lebih baik daripada Larutan A (${solutionA.formula}).`
    }
  }, [isPowered, resultA.conductivity, resultB.conductivity, solutionA.formula, solutionB.formula])

  // Umpan balik edukatif otomatis
  const educationalFeedback = useMemo(() => {
    if (!isPowered) return null

    const catA = solutionA.category
    const catB = solutionB.category

    if (catA === 'none' && catB === 'none') {
      return 'Kedua zat tergolong nonelektrolit. Keduanya larut dalam bentuk molekul netral dan tidak menghasilkan ion bebas, sehingga lampu tidak menyala sama sekali.'
    }

    if (catA !== catB) {
      return `Konsentrasi awal kedua larutan sama (${concentration.toFixed(2)} M), namun daya hantarnya sangat berbeda. Hal ini membuktikan bahwa daya hantar listrik bukan sekadar ditentukan oleh konsentrasi larutan, melainkan oleh jumlah ion yang benar-benar terbentuk di dalam air (derajat ionisasi α).`
    }

    if (catA === 'kuat' && catB === 'kuat') {
      return `Kedua larutan sama-sama elektrolit kuat (terionisasi sempurna). Perbedaan nilai konduktivitas spesifik disebabkan oleh valensi muatan ion (misalnya ion divalen Ca²⁺ vs monovalen Na⁺) serta kecepatan gerak (mobilitas) ion di dalam medan listrik.`
    }

    if (catA === 'lemah' && catB === 'lemah') {
      return `Kedua larutan tergolong elektrolit lemah. Keduanya hanya terionisasi sebagian dengan derajat ionisasi (α) kecil. Larutan dengan tetapan ionisasi (Ka atau Kb) lebih besar menghasilkan ion sedikit lebih banyak.`
    }

    return 'Perhatikan keterkaitan antara struktur partikel submikroskopik dengan nyala lampu makroskopik.'
  }, [isPowered, solutionA.category, solutionB.category, concentration])

  // Catat Perbandingan ke LocalStorage (key berawalan compare_)
  const handleRecordComparison = () => {
    if (!isPowered) {
      setNotification('Hubungkan rangkaian terlebih dahulu sebelum mencatat perbandingan.')
      return
    }

    const newRecord = {
      id: `compare-${Date.now()}`,
      time: new Date().toLocaleString('id-ID'),
      studentName: user?.name || 'Siswa',
      solA: {
        name: solutionA.name,
        formula: solutionA.formula,
        category: solutionA.category,
        current: formatMeasurement(resultA.current, 4),
        conductivity: formatMeasurement(resultA.conductivity, 4),
        lamp: ['Padam', 'Sangat redup', 'Redup', 'Terang'][resultA.lampLevel],
      },
      solB: {
        name: solutionB.name,
        formula: solutionB.formula,
        category: solutionB.category,
        current: formatMeasurement(resultB.current, 4),
        conductivity: formatMeasurement(resultB.conductivity, 4),
        lamp: ['Padam', 'Sangat redup', 'Redup', 'Terang'][resultB.lampLevel],
      },
      variables: {
        concentration: `${concentration.toFixed(2)} M`,
        temperature: `${temperature} °C`,
        voltage: `${voltage.toFixed(1)} V`,
      },
      ratioSummary: conductivityRatioText || '',
    }

    const updated = [newRecord, ...records].slice(0, 25)
    setRecords(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      setNotification('✓ Hasil perbandingan berhasil disimpan ke catatan perangkat!')
    } catch {
      setNotification('Gagal menyimpan catatan ke penyimpanan lokal.')
    }
  }

  const handleClearRecords = () => {
    if (window.confirm('Hapus seluruh riwayat perbandingan yang tersimpan?')) {
      setRecords([])
      try {
        localStorage.removeItem(STORAGE_KEY)
        setNotification('Riwayat perbandingan telah dikosongkan.')
      } catch {}
    }
  }

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(''), 4000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  return (
    <section className="dual-compare-section" aria-labelledby="dual-compare-title">
      {/* Header Mode Bandingkan */}
      <div className="dual-header">
        <span className="dual-mini-tag">LABORATORIUM MINI • MULTI-BEKER</span>
        <h2 id="dual-compare-title">Mode Bandingkan Dua Larutan</h2>
        <p>
          Uji dua larutan kimia secara berdampingan dengan variabel percobaan yang disetarakan (*fair test*).
          Amati perbedaan nyala lampu, gerakan ion, dan respon sensor digital secara simultan.
        </p>
      </div>

      {/* Preset Pasangan Zat */}
      <div className="dual-preset-bar">
        <label htmlFor="preset-select" className="dual-preset-label">
          <strong>Pilih Preset Pembelajaran:</strong>
        </label>
        <select
          id="preset-select"
          className="dual-preset-select"
          value={selectedPresetId}
          onChange={(e) => handleSelectPreset(e.target.value)}
        >
          {COMPARISON_PRESETS.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.label}
            </option>
          ))}
          <option value="custom">— Pilih Zat Sendiri (Kustom) —</option>
        </select>
      </div>

      {activePreset && selectedPresetId !== 'custom' && (
        <p className="dual-preset-desc">
          💡 <em>{activePreset.description}</em>
        </p>
      )}

      {/* Kontrol Pemilihan Zat & Variabel Seragam */}
      <div className="dual-control-panel">
        <div className="dual-solution-selectors">
          <div className="dual-sol-picker sol-a">
            <label htmlFor="solASelect">
              <span className="dot dot-a" /> <strong>Larutan A:</strong>
            </label>
            <select
              id="solASelect"
              value={solAId}
              onChange={(e) => handleManualSolA(e.target.value)}
            >
              {laboratorySolutions.map((sol) => (
                <option key={`a-${sol.id}`} value={sol.id}>
                  {sol.name} ({sol.formula})
                </option>
              ))}
            </select>
          </div>

          <div className="dual-sol-picker sol-b">
            <label htmlFor="solBSelect">
              <span className="dot dot-b" /> <strong>Larutan B:</strong>
            </label>
            <select
              id="solBSelect"
              value={solBId}
              onChange={(e) => handleManualSolB(e.target.value)}
            >
              {laboratorySolutions.map((sol) => (
                <option key={`b-${sol.id}`} value={sol.id}>
                  {sol.name} ({sol.formula})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Variabel Terkontrol (Fair Test) */}
        <div className="dual-variables-strip">
          <div className="dual-var-item">
            <label>Konsentrasi Bersama:</label>
            <select
              value={concentration}
              onChange={(e) => {
                setConcentration(Number(e.target.value))
                setIsPowered(false)
              }}
            >
              {concentrationChoices.map((c) => (
                <option key={c} value={c}>
                  {c.toFixed(2)} M
                </option>
              ))}
            </select>
          </div>

          <div className="dual-var-item">
            <label>Tegangan Sumber:</label>
            <select
              value={voltage}
              onChange={(e) => {
                setVoltage(Number(e.target.value))
                setIsPowered(false)
              }}
            >
              {voltageChoices.map((v) => (
                <option key={v} value={v}>
                  {v.toFixed(1)} V
                </option>
              ))}
            </select>
          </div>

          <div className="dual-var-item">
            <label>Suhu Larutan:</label>
            <select
              value={temperature}
              onChange={(e) => {
                setTemperature(Number(e.target.value))
                setIsPowered(false)
              }}
            >
              {temperatureChoices.map((t) => (
                <option key={t} value={t}>
                  {t} °C
                </option>
              ))}
            </select>
          </div>

          <div className="dual-var-item">
            <label>Jarak Elektroda:</label>
            <select
              value={distance}
              onChange={(e) => {
                setDistance(Number(e.target.value))
                setIsPowered(false)
              }}
            >
              {distanceChoices.map((d) => (
                <option key={d} value={d}>
                  {d} cm
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tombol Eksekusi Daya */}
        <div className="dual-power-actions">
          <button
            type="button"
            className={`btn-power ${isPowered ? 'active' : ''}`}
            onClick={() => setIsPowered(!isPowered)}
          >
            {isPowered ? '⏹ Putus Rangkaian' : '⚡ Mulai Uji Kedua Larutan'}
          </button>

          <button
            type="button"
            className="btn-record-compare"
            onClick={handleRecordComparison}
            disabled={!isPowered}
          >
            📝 Catat Perbandingan
          </button>
        </div>

        {notification && (
          <div className="dual-notification-pill" role="status">
            {notification}
          </div>
        )}
      </div>

      {/* Visualisasi Dua Gelas Beker & Dua Lampu Berdampingan */}
      <div className="dual-beakers-container">
        <SingleBeakerSVG
          label="Larutan A"
          solution={solutionA}
          result={resultA}
          particles={particlesA}
          isPowered={isPowered}
        />
        <SingleBeakerSVG
          label="Larutan B"
          solution={solutionB}
          result={resultB}
          particles={particlesB}
          isPowered={isPowered}
        />
      </div>

      {/* Banner Rasio Daya Hantar & Umpan Balik Edukatif */}
      {isPowered && (
        <div className="dual-insights-panel">
          {conductivityRatioText && (
            <div className="dual-ratio-badge">
              <div className="dual-ratio-content">
                <span className="ratio-icon">⚖️</span>
                <strong>Perbandingan Daya Hantar:</strong> {conductivityRatioText}
              </div>
              <small className="dual-ratio-note">
                Rasio dihitung dari model sederhana, bukan hasil ukur nyata.
              </small>
            </div>
          )}

          {educationalFeedback && (
            <div className="dual-feedback-box">
              <span className="feedback-icon">💡</span>
              <p>{educationalFeedback}</p>
            </div>
          )}
        </div>
      )}

      {/* Hasil Sensor Dua Kolom */}
      <div className="dual-sensor-table-wrapper">
        <h3 className="dual-subheading">Hasil Sensor &amp; Pengukuran Komparatif</h3>
        <table className="dual-sensor-table">
          <thead>
            <tr>
              <th>Parameter Pengukuran</th>
              <th>Larutan A: {solutionA.formula}</th>
              <th>Larutan B: {solutionB.formula}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Nama Bahan</td>
              <td><strong>{solutionA.name}</strong></td>
              <td><strong>{solutionB.name}</strong></td>
            </tr>
            <tr>
              <td>Klasifikasi Sampel</td>
              <td><span className={`cat-pill ${solutionA.category}`}>{solutionA.category}</span></td>
              <td><span className={`cat-pill ${solutionB.category}`}>{solutionB.category}</span></td>
            </tr>
            <tr>
              <td>Respon Nyala Lampu</td>
              <td>
                {isPowered ? (
                  resultA.lampLevel === 0 ? 'Padam' : resultA.lampLevel === 1 ? 'Sangat redup' : resultA.lampLevel === 2 ? 'Redup' : 'Terang'
                ) : (
                  <em>Belum ada pengukuran</em>
                )}
              </td>
              <td>
                {isPowered ? (
                  resultB.lampLevel === 0 ? 'Padam' : resultB.lampLevel === 1 ? 'Sangat redup' : resultB.lampLevel === 2 ? 'Redup' : 'Terang'
                ) : (
                  <em>Belum ada pengukuran</em>
                )}
              </td>
            </tr>
            <tr>
              <td>Arus Listrik Terukur (I)</td>
              <td>{isPowered ? `${formatMeasurement(resultA.current, 4)} A` : <em>Belum ada pengukuran</em>}</td>
              <td>{isPowered ? `${formatMeasurement(resultB.current, 4)} A` : <em>Belum ada pengukuran</em>}</td>
            </tr>
            <tr>
              <td>Konduktansi Sel (G)</td>
              <td>{isPowered ? `${formatMeasurement(resultA.conductance, 4)} S` : <em>Belum ada pengukuran</em>}</td>
              <td>{isPowered ? `${formatMeasurement(resultB.conductance, 4)} S` : <em>Belum ada pengukuran</em>}</td>
            </tr>
            <tr>
              <td>Konduktivitas Spesifik (κ)</td>
              <td>{isPowered ? `${formatMeasurement(resultA.conductivity, 4)} S/m` : <em>Belum ada pengukuran</em>}</td>
              <td>{isPowered ? `${formatMeasurement(resultB.conductivity, 4)} S/m` : <em>Belum ada pengukuran</em>}</td>
            </tr>
            <tr>
              <td>Konsentrasi Total Ion [ion]</td>
              <td>{isPowered ? `${formatMeasurement(resultA.ionConcentration, 3)} M` : <em>Belum ada pengukuran</em>}</td>
              <td>{isPowered ? `${formatMeasurement(resultB.ionConcentration, 3)} M` : <em>Belum ada pengukuran</em>}</td>
            </tr>
            <tr>
              <td>Derajat Ionisasi (α model)</td>
              <td>
                {isPowered ? (
                  solutionA.category === 'lemah'
                    ? `${(resultA.ionization * 100).toFixed(2)}%`
                    : solutionA.category === 'none'
                    ? '0%'
                    : '≈ 100%'
                ) : (
                  <em>Belum ada pengukuran</em>
                )}
              </td>
              <td>
                {isPowered ? (
                  solutionB.category === 'lemah'
                    ? `${(resultB.ionization * 100).toFixed(2)}%`
                    : solutionB.category === 'none'
                    ? '0%'
                    : '≈ 100%'
                ) : (
                  <em>Belum ada pengukuran</em>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Tiga Tab Representasi Kimia (Makroskopik / Submikroskopik / Simbolik) */}
      <div className="dual-rep-section">
        <div className="dual-rep-tabs" role="tablist" aria-label="Level Representasi Kimia">
          <button
            type="button"
            role="tab"
            aria-selected={repMode === 'macro'}
            className={repMode === 'macro' ? 'active' : ''}
            onClick={() => setRepMode('macro')}
          >
            Makroskopik (Teramati)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={repMode === 'micro'}
            className={repMode === 'micro' ? 'active' : ''}
            onClick={() => setRepMode('micro')}
          >
            Submikroskopik (Partikel)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={repMode === 'symbolic'}
            className={repMode === 'symbolic' ? 'active' : ''}
            onClick={() => setRepMode('symbolic')}
          >
            Simbolik (Persamaan)
          </button>
        </div>

        <div className="dual-rep-content">
          {repMode === 'macro' && (
            <div className="rep-grid">
              <div className="rep-col">
                <h4>Pengamatan Makroskopik: {solutionA.name}</h4>
                <p>
                  <strong>Lampu:</strong> {isPowered ? (resultA.lampLevel === 0 ? 'Padam sama sekali' : resultA.lampLevel === 1 ? 'Menyala sangat redup' : resultA.lampLevel === 2 ? 'Menyala redup' : 'Menyala terang benderang') : 'Rangkaian belum dihubungkan.'}
                </p>
                <p>
                  <strong>Gelembung Gas:</strong> {isPowered && resultA.lampLevel > 0 ? 'Terdapat gelembung gas di sekitar elektroda akibat reaksi elektrokimia.' : 'Tidak tampak gelembung gas.'}
                </p>
              </div>
              <div className="rep-col">
                <h4>Pengamatan Makroskopik: {solutionB.name}</h4>
                <p>
                  <strong>Lampu:</strong> {isPowered ? (resultB.lampLevel === 0 ? 'Padam sama sekali' : resultB.lampLevel === 1 ? 'Menyala sangat redup' : resultB.lampLevel === 2 ? 'Menyala redup' : 'Menyala terang benderang') : 'Rangkaian belum dihubungkan.'}
                </p>
                <p>
                  <strong>Gelembung Gas:</strong> {isPowered && resultB.lampLevel > 0 ? 'Terdapat gelembung gas di sekitar elektroda akibat reaksi elektrokimia.' : 'Tidak tampak gelembung gas.'}
                </p>
              </div>
            </div>
          )}

          {repMode === 'micro' && (
            <div className="rep-grid">
              <div className="rep-col">
                <h4>Tingkat Submikroskopik: {solutionA.name}</h4>
                <p>{solutionA.description}</p>
                <div className="particle-pills">
                  {solutionA.ions.length > 0 ? (
                    solutionA.ions.map(([formula]) => (
                      <span key={formula} className="particle-pill ion">
                        Ion {formula}
                      </span>
                    ))
                  ) : (
                    <span className="particle-pill neutral">Molekul netral {solutionA.formula}</span>
                  )}
                </div>
                <small>Partikel bermuatan bergerak terarah menuju elektroda berlawanan saat daya aktif.</small>
              </div>
              <div className="rep-col">
                <h4>Tingkat Submikroskopik: {solutionB.name}</h4>
                <p>{solutionB.description}</p>
                <div className="particle-pills">
                  {solutionB.ions.length > 0 ? (
                    solutionB.ions.map(([formula]) => (
                      <span key={formula} className="particle-pill ion">
                        Ion {formula}
                      </span>
                    ))
                  ) : (
                    <span className="particle-pill neutral">Molekul netral {solutionB.formula}</span>
                  )}
                </div>
                <small>Partikel bermuatan bergerak terarah menuju elektroda berlawanan saat daya aktif.</small>
              </div>
            </div>
          )}

          {repMode === 'symbolic' && (
            <div className="rep-grid">
              <div className="rep-col">
                <h4>Representasi Simbolik: {solutionA.name}</h4>
                <div className="equation-box">{solutionA.equation}</div>
                <p className="chem-note">
                  {solutionA.category === 'kuat' && 'Tanda panah satu arah (→) menunjukkan ionisasi/disosiasi sempurna.'}
                  {solutionA.category === 'lemah' && 'Tanda panah bolak-balik (⇌) menunjukkan kesetimbangan ionisasi parsial.'}
                  {solutionA.category === 'none' && 'Pelarutan molekuler tanpa menghasilkan ion pembawa muatan.'}
                </p>
              </div>
              <div className="rep-col">
                <h4>Representasi Simbolik: {solutionB.name}</h4>
                <div className="equation-box">{solutionB.equation}</div>
                <p className="chem-note">
                  {solutionB.category === 'kuat' && 'Tanda panah satu arah (→) menunjukkan ionisasi/disosiasi sempurna.'}
                  {solutionB.category === 'lemah' && 'Tanda panah bolak-balik (⇌) menunjukkan kesetimbangan ionisasi parsial.'}
                  {solutionB.category === 'none' && 'Pelarutan molekuler tanpa menghasilkan ion pembawa muatan.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Kartu "Coba Ini" (Pertanyaan Pemantik & Penjelasan) */}
      <div className="dual-coba-card">
        <div className="coba-header">
          <span className="coba-badge">🎯 Coba Ini!</span>
          <h4>Pertanyaan Pemantik Konsep</h4>
        </div>
        <p className="coba-question">
          {activePreset?.promptQuestion || 'Mengapa dua larutan dengan konsentrasi yang sama dapat menghasilkan daya hantar yang berbeda secara signifikan?'}
        </p>
        <button
          type="button"
          className="btn-toggle-explain"
          onClick={() => setShowPromptAnswer(!showPromptAnswer)}
        >
          {showPromptAnswer ? 'Sembunyikan Penjelasan ▲' : 'Lihat Penjelasan ▼'}
        </button>

        {showPromptAnswer && (
          <div className="coba-answer-box">
            <p>
              {activePreset?.promptAnswer || 'Daya hantar listrik larutan dipengaruhi oleh keberadaan ion bebas, jumlah konsentrasi ion total, dan mobilitas ion tersebut. Larutan nonelektrolit tidak memiliki ion sama sekali, sedangkan larutan elektrolit lemah hanya memiliki sedikit ion bebas dibandingkan elektrolit kuat.'}
            </p>
          </div>
        )}
      </div>

      {/* Tabel Riwayat Catatan Perbandingan yang Tersimpan di LocalStorage */}
      {records.length > 0 && (
        <div className="dual-history-section">
          <div className="history-header">
            <h3>Catatan Perbandingan Tersimpan ({records.length})</h3>
            <div>
              {onOpenJournal && (
                <button type="button" className="btn-small-sec" onClick={onOpenJournal}>
                  Buka Jurnal Praktikum
                </button>
              )}
              <button type="button" className="btn-small-danger" onClick={handleClearRecords}>
                Hapus Riwayat
              </button>
            </div>
          </div>
          <div className="history-table-scroll">
            <table className="dual-sensor-table history-table">
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>Larutan A</th>
                  <th>Larutan B</th>
                  <th>Variabel</th>
                  <th>Rangkuman Komparasi</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec) => (
                  <tr key={rec.id}>
                    <td>{rec.time}</td>
                    <td>
                      <strong>{rec.solA.formula}</strong> ({rec.solA.lamp})<br />
                      <small>{rec.solA.conductivity} S/m</small>
                    </td>
                    <td>
                      <strong>{rec.solB.formula}</strong> ({rec.solB.lamp})<br />
                      <small>{rec.solB.conductivity} S/m</small>
                    </td>
                    <td>
                      <small>
                        {rec.variables.concentration} • {rec.variables.temperature} • {rec.variables.voltage}
                      </small>
                    </td>
                    <td><small>{rec.ratioSummary}</small></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}
