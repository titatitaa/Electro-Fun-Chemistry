import { useEffect, useMemo, useState } from 'react'
import {
  calculateLabResult,
  concentrationChoices,
  createParticles,
  distanceChoices,
  formatMeasurement,
  laboratorySolutions,
  temperatureChoices,
  voltageChoices,
} from '../data/labModel.js'
import { getUserLabLogKey, getUserLabNotesKey } from '../data/learningStore.js'
import './VirtualLab.css'

const categoryLabels = { kuat: 'Elektrolit kuat', lemah: 'Elektrolit lemah', none: 'Nonelektrolit', air: 'Sampel air' }
const procedureSteps = [
  {
    title: 'Tentukan tujuan dan pertanyaan',
    detail: 'Selidiki hubungan antara partikel ion dalam larutan dan kemampuan larutan menghantarkan arus listrik.',
  },
  {
    title: 'Pilih sampel dan buat prediksi',
    detail: 'Pilih satu zat, lalu tentukan prediksi jenis elektrolitnya sebelum uji. Tuliskan alasan berdasarkan pengetahuan awalmu.',
  },
  {
    title: 'Atur variabel percobaan',
    detail: 'Tentukan konsentrasi dan volume sampel, suhu, tegangan, serta jarak elektrode. Untuk membandingkan zat, samakan variabel lainnya.',
  },
  {
    title: 'Siapkan larutan',
    detail: 'Untuk zat padat, tekan “Tambah zat”, kemudian “Aduk / larutkan”. Sampel air sudah siap diuji. Amati penyebaran partikel pada beker.',
  },
  {
    title: 'Jalankan pengujian',
    detail: 'Periksa pengaturan, lalu tekan “Mulai uji”. Amati respons lampu, gelembung model, arah gerak ion, dan nilai sensor.',
  },
  {
    title: 'Catat hasil pengamatan',
    detail: 'Tekan “Catat hasil” agar nilai sampel dan variabel percobaan masuk ke tabel pada tab “LKPD & data”.',
  },
  {
    title: 'Bandingkan data',
    detail: 'Uji sampel lain atau buka tab “Bandingkan larutan”. Gunakan konsentrasi dan kondisi yang sama agar perbandingan adil.',
  },
  {
    title: 'Analisis dan simpulkan',
    detail: 'Hubungkan data dengan keberadaan ion bergerak. Tulis analisis dan kesimpulan pada LKPD; jangan menyimpulkan hanya dari kejernihan larutan atau nyala lampu.',
  },
]

function readStored(key, fallback) {
  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function getStudentName() {
  try {
    const session = JSON.parse(window.localStorage.getItem('chemistry_lab_session') || '{}')
    return typeof session.name === 'string' ? session.name : ''
  } catch {
    return ''
  }
}

function BenchDiagram({ particles, isPowered, isDissolved, lampLevel, solution, volume, zoom }) {
  const bulbColors = ['#9aa7a1', '#e7bf69', '#f4a340', '#ffd66e']
  const fillHeight = Math.max(12, Math.min(93, volume * 0.39))

  return (
    <svg className={`lab-bench-diagram${isPowered ? ' is-powered' : ''}`} style={{ width: `${zoom * 100}%` }} viewBox="0 0 760 410" role="img" aria-label="Rangkaian uji daya hantar dengan baterai, lampu, elektroda, dan larutan">
      <defs>
        <linearGradient id="labLiquid" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#bfe7d7" stopOpacity=".82" />
          <stop offset="1" stopColor="#75bfa0" stopOpacity=".88" />
        </linearGradient>
        <filter id="bulbGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation={lampLevel * 2.4} result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path d="M92 93V55H296V82" fill="none" stroke="#71877a" strokeWidth="5" strokeLinecap="round" />
      <path d="M92 255V314H628V260" fill="none" stroke="#71877a" strokeWidth="5" strokeLinecap="round" />
      <path className="lab-current-dash" d="M130 55H285M108 314H610" fill="none" stroke="#d3a657" strokeWidth="4" strokeDasharray="9 12" />

      <g transform="translate(45 130)">
        <rect x="0" y="0" width="93" height="118" rx="14" fill="#f3ead5" stroke="#b89960" strokeWidth="3" />
        <rect x="17" y="22" width="58" height="74" rx="8" fill="#fffdf7" stroke="#d6c5a1" strokeWidth="2" />
        <path d="M33 31v18M58 31v18" stroke="#506657" strokeWidth="4" strokeLinecap="round" />
        <text x="46" y="70" textAnchor="middle" fill="#4a5b4f" fontSize="13" fontWeight="700">{isPowered ? 'ON' : 'OFF'}</text>
        <text x="46" y="139" textAnchor="middle" fill="#637267" fontSize="12">Sumber DC</text>
      </g>

      <g transform="translate(265 30)" filter={isPowered && lampLevel ? 'url(#bulbGlow)' : undefined}>
        <path d="M18 45a34 34 0 1 1 68 0c0 18-12 24-18 37H36C30 69 18 63 18 45Z" fill={isPowered ? bulbColors[lampLevel] : '#f8f6ef'} stroke={isPowered ? '#d5a846' : '#9da69f'} strokeWidth="4" />
        <path d="M37 87h30M39 98h26M44 108h16" stroke="#7d8981" strokeWidth="5" strokeLinecap="round" />
        <path d="m43 52 10-13 9 14 8-11" fill="none" stroke={isPowered && lampLevel ? '#fff7d5' : '#758279'} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <text x="52" y="134" textAnchor="middle" fill="#637267" fontSize="12">Lampu indikator</text>
      </g>

      <g>
        <path d="M420 126h235l-24 236H445l-25-236Z" fill="rgba(255,255,255,.52)" stroke="#718e7d" strokeWidth="4" />
        {isDissolved && <path d={`M430 ${360 - fillHeight}h215l-18 188H449l-19-188Z`} fill="url(#labLiquid)" />}
        <path d="M414 129h247" stroke="#718e7d" strokeWidth="5" strokeLinecap="round" />
        <path d="M483 113v147M589 113v147" stroke="#a27e44" strokeWidth="7" strokeLinecap="round" />
        <text x="484" y="102" textAnchor="middle" fill="#795b2d" fontSize="12" fontWeight="700">Anode (+)</text>
        <text x="591" y="102" textAnchor="middle" fill="#795b2d" fontSize="12" fontWeight="700">Katode (−)</text>
        <text x="536" y="391" textAnchor="middle" fill="#53675a" fontSize="13" fontWeight="700">{isDissolved ? `${volume} mL • ${solution.formula}` : 'Gelas beker • siapkan sampel'}</text>
      </g>

      {isDissolved && particles.map((particle) => (
        <g
          key={particle.id}
          className={`lab-particle lab-particle-${particle.type}${isPowered ? ' moving' : ''}`}
          style={{ '--particle-delay': particle.delay }}
          transform={`translate(${438 + particle.x * 2.22}, ${155 + particle.y * 1.65})`}
        >
          <circle r={particle.type === 'neutral' ? 12 : 13} />
          <text y="3.5" textAnchor="middle">{particle.formula}</text>
        </g>
      ))}

      {isPowered && lampLevel > 0 && Array.from({ length: Math.min(lampLevel + 1, 4) }, (_, index) => (
        <g className="lab-bubble" key={`bubble-${index}`} style={{ '--bubble-delay': `${index * .65}s` }}>
          <circle cx={index % 2 ? 589 : 484} cy="284" r="4" />
          <circle cx={index % 2 ? 589 : 484} cy="284" r="2" />
        </g>
      ))}
      <text x="435" y="31" fill="#78877c" fontSize="11">Representasi partikel tidak berskala jumlah molekul nyata</text>
    </svg>
  )
}

function Measurement({ label, value, unit, accent }) {
  return (
    <div className={`lab-measurement ${accent || ''}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{unit}</small>
    </div>
  )
}

function ModeContent({ mode, solution, result, particles, isPowered }) {
  if (mode === 'symbolic') {
    return (
      <div className="lab-mode-copy">
        <span className="lab-mini-label">SIMBOLIK • PERSAMAAN</span>
        <strong className="lab-equation">{solution.equation}</strong>
        <p>Model menghitung konsentrasi ion dan mobilitasnya. Lampu hanya menunjukkan respons kualitatif pada rangkaian virtual ini.</p>
        {solution.category === 'lemah' && <p>Derajat ionisasi model: {(result.ionization * 100).toFixed(2)}% pada konsentrasi yang disiapkan.</p>}
      </div>
    )
  }

  if (mode === 'micro') {
    return (
      <div className="lab-mode-copy">
        <span className="lab-mini-label">SUBMIKROSKOPIK • PARTIKEL</span>
        <div className="lab-particle-legend">
          {particles.slice(0, 7).map((particle) => (
            <span className={`lab-legend-item ${particle.type}`} key={particle.id}>
              <i />{particle.formula}
            </span>
          ))}
          {particles.length === 0 && <span>Tambahkan zat dan larutkan untuk melihat model partikel.</span>}
        </div>
        <p>{isPowered ? 'Medan listrik aktif: kation menuju katode (−), anion menuju anode (+).' : 'Hidupkan rangkaian untuk melihat arah migrasi ion.'}</p>
        <small>Jumlah partikel pada gambar disederhanakan dan bukan hitungan molekul sebenarnya.</small>
      </div>
    )
  }

  return (
    <div className="lab-mode-copy">
      <span className="lab-mini-label">MAKROSKOPIK • YANG DIAMATI</span>
      <strong>{result.lampLevel === 0 ? 'Lampu tidak tampak menyala' : result.lampLevel === 1 ? 'Lampu menyala sangat redup' : result.lampLevel === 2 ? 'Lampu menyala redup' : 'Lampu menyala terang (model)'}</strong>
      <p>{isPowered ? 'Pengamatan berasal dari model konduktivitas dan kondisi alat yang dipilih.' : 'Hubungkan rangkaian dan mulai uji untuk mengamati respons lampu serta gelembung.'}</p>
      <small>Gelembung dalam model hanya indikator kualitatif reaksi elektroda, bukan ukuran langsung jumlah ion.</small>
    </div>
  )
}

function LabComparison({ settings }) {
  const [selectedIds, setSelectedIds] = useState(['nacl', 'acetic', 'sucrose'])
  const [comparisonConcentration, setComparisonConcentration] = useState(0.1)
  const comparisons = selectedIds.map((id) => {
    const solution = laboratorySolutions.find((item) => item.id === id) || laboratorySolutions[0]
    return {
      solution,
      result: calculateLabResult({ ...settings, solution, concentration: comparisonConcentration, dissolved: true }),
    }
  })
  const maximum = Math.max(...comparisons.map(({ result }) => result.conductivity), 0.000001)

  const updateSelection = (index, id) => {
    setSelectedIds((current) => current.map((item, currentIndex) => currentIndex === index ? id : item))
  }

  return (
    <section className="lab-secondary-section" aria-labelledby="lab-compare-title">
      <div className="lab-section-heading">
        <span className="lab-mini-label">BANDINGKAN SAMPEL</span>
        <h2 id="lab-compare-title">Tiga larutan, kondisi sama</h2>
        <p>Pilih zat. Konsentrasi, volume, suhu, tegangan, dan jarak elektroda mengikuti pengaturan eksperimen utama.</p>
      </div>
      <div className="lab-compare-controls">
        <label className="lab-field">
          <span>Konsentrasi bersama untuk perbandingan</span>
          <select value={comparisonConcentration} onChange={(event) => setComparisonConcentration(Number(event.target.value))}>
            {concentrationChoices.map((value) => <option value={value} key={value}>{value.toFixed(2)} mol/L</option>)}
          </select>
        </label>
      </div>
      <div className="lab-compare-selects">
        {selectedIds.map((id, index) => (
          <label key={`compare-${index}`}>
            <span>Sampel {index + 1}</span>
            <select value={id} onChange={(event) => updateSelection(index, event.target.value)}>
              {laboratorySolutions.map((solution) => <option value={solution.id} key={solution.id}>{solution.name}</option>)}
            </select>
          </label>
        ))}
      </div>
      <div className="lab-chart" role="img" aria-label="Grafik perbandingan konduktivitas model tiga larutan">
        {comparisons.map(({ solution, result }) => (
          <div className="lab-chart-row" key={solution.id}>
            <span>{solution.formula}</span>
            <div><i style={{ width: `${Math.max(1, (result.conductivity / maximum) * 100)}%` }} /></div>
            <strong>{formatMeasurement(result.conductivity, 3)} S/m</strong>
          </div>
        ))}
      </div>
      <div className="lab-table-scroll">
        <table className="lab-table">
          <thead><tr><th>Zat</th><th>Kategori</th><th>[ion] total (M)</th><th>α (model)</th><th>Konduktivitas (S/m)</th><th>Lampu (model)</th></tr></thead>
          <tbody>{comparisons.map(({ solution, result }) => (
            <tr key={`row-${solution.id}`}>
              <td>{solution.name}<small>{solution.formula}</small></td>
              <td>{categoryLabels[solution.category]}</td>
              <td>{formatMeasurement(result.ionConcentration, 3)}</td>
              <td>{solution.category === 'lemah' ? `${(result.ionization * 100).toFixed(2)}%` : solution.category === 'none' ? '≈ 0%' : '≈ 100%'}</td>
              <td>{formatMeasurement(result.conductivity, 3)}</td>
              <td>{result.lampLevel === 0 ? 'Padam' : ['','Sangat redup','Redup','Terang'][result.lampLevel]}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <p className="lab-caveat">Nilai adalah keluaran model pendekatan dan bukan pengukuran produk atau data eksperimen. Garam pekat tidak selalu mengikuti hukum mobilitas ion pembatas secara ideal.</p>
    </section>
  )
}

function DigitalWorksheet({ notes, setNotes, observations, studentName, onClearObservations, onOpenJournal }) {
  const [evaluation, setEvaluation] = useState('')
  const [checked, setChecked] = useState(false)

  return (
    <section className="lab-secondary-section lab-worksheet" aria-labelledby="lab-worksheet-title">
      <div className="lab-section-heading">
        <span className="lab-mini-label">LKPD DIGITAL • PRAKTIKUM MANDIRI</span>
        <h2 id="lab-worksheet-title">Catat penyelidikanmu</h2>
        <p>Catatan dan tabel hasil tersimpan lokal di perangkat ini. Gunakan “Cetak / Simpan PDF” untuk mengunduh salinan.</p>
      </div>
      <div className="lab-worksheet-summary">
        <p><strong>Nama:</strong> {studentName || 'Siswa'}</p>
        <p><strong>Tujuan:</strong> Menghubungkan keberadaan ion dengan daya hantar listrik larutan.</p>
        <p><strong>Dasar teori:</strong> Dalam larutan, ion bergerak membawa muatan; konduktivitas dipengaruhi konsentrasi, muatan, mobilitas, suhu, dan geometri sel.</p>
        <p><strong>Rumusan masalah:</strong> Mengapa larutan garam dan gula menunjukkan respons alat yang berbeda?</p>
        <p><strong>Alat virtual:</strong> sumber DC rendah, rangkaian, lampu, elektrode, beker, larutan, dan model sensor.</p>
      </div>
      <label className="lab-note-field">
        <span>Hipotesis / prediksi awal</span>
        <textarea value={notes.hypothesis} onChange={(event) => setNotes((current) => ({ ...current, hypothesis: event.target.value }))} placeholder="Saya memprediksi larutan ... karena ..." rows="3" />
      </label>
      <label className="lab-note-field">
        <span>Analisis dan kesimpulan</span>
        <textarea value={notes.conclusion} onChange={(event) => setNotes((current) => ({ ...current, conclusion: event.target.value }))} placeholder="Dari data yang dikumpulkan, saya menyimpulkan ..." rows="3" />
      </label>
      <div className="lab-table-scroll">
        <table className="lab-table">
          <thead><tr><th>Waktu</th><th>Sampel / konsentrasi</th><th>Variabel</th><th>Arus (A)</th><th>Konduktansi (S)</th><th>Konduktivitas (S/m)</th><th>Lampu</th></tr></thead>
          <tbody>{observations.length === 0
            ? <tr><td colSpan="7">Belum ada data. Siapkan sampel, nyalakan rangkaian, lalu pilih “Catat hasil”.</td></tr>
            : observations.map((item) => <tr key={item.id}>
              <td>{item.time}</td>
              <td>{item.solution} ({item.formula})<small>{item.concentration} M</small></td>
              <td>{item.temperature}°C • {item.voltage} V • jarak {item.distance} cm</td>
              <td>{item.current} A</td><td>{item.conductance} S</td><td>{item.conductivity} S/m</td><td>{item.lamp}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
      <label className="lab-note-field">
        <span>Evaluasi hasil: kesimpulan mana yang paling didukung data?</span>
        <select value={evaluation} onChange={(event) => { setEvaluation(event.target.value); setChecked(false) }}>
          <option value="">Pilih jawaban</option>
          <option value="ions">Respons hantar dipengaruhi pembawa muatan ion dan variabel percobaan.</option>
          <option value="clear">Larutan yang jernih pasti menghantarkan arus dengan sama kuat.</option>
          <option value="lamp">Lampu padam selalu membuktikan tidak ada ion.</option>
        </select>
      </label>
      <div className="lab-worksheet-actions">
        <button type="button" className="lab-secondary-button" onClick={onOpenJournal}>Buka Jurnal Praktikum</button>
        <button type="button" className="lab-secondary-button" onClick={() => setChecked(true)}>Periksa analisis</button>
        <button type="button" className="lab-secondary-button" onClick={onClearObservations} disabled={observations.length === 0}>Hapus data</button>
        <button type="button" className="lab-primary-button" onClick={() => window.print()}>Cetak / Simpan PDF</button>
      </div>
      {checked && (
        <p className={`lab-evaluation-feedback ${evaluation === 'ions' ? 'correct' : 'incorrect'}`} role="status">
          {evaluation === 'ions'
            ? 'Tepat. Bandingkan sampel pada konsentrasi, suhu, dan geometri sel yang sama; larutan jernih tidak otomatis menghantarkan.'
            : 'Periksa kembali hubungan antara ion bergerak dan arus. Kejernihan atau lampu padam saja belum cukup untuk menyimpulkan sifat larutan.'}
        </p>
      )}
      <p className="lab-caveat">Simulasi konseptual, bukan pengganti percobaan nyata. Untuk eksperimen langsung, gunakan hanya sumber tegangan rendah di bawah pengawasan guru; jangan gunakan listrik rumah, cicipi sampel, atau membuka aki/bahan korosif.</p>
    </section>
  )
}

export default function VirtualLab({ onClose, onOpenJournal, user }) {
  const studentId = user?.id || user?.email || 'anonymous'
  const logKey = getUserLabLogKey(studentId)
  const notesKey = getUserLabNotesKey(studentId)
  const [solutionId, setSolutionId] = useState('nacl')
  const [concentration, setConcentration] = useState(0.1)
  const [volume, setVolume] = useState(100)
  const [temperature, setTemperature] = useState(25)
  const [voltage, setVoltage] = useState(1.5)
  const [distance, setDistance] = useState(1)
  const [baseMoles, setBaseMoles] = useState(0.01)
  const [addedMoles, setAddedMoles] = useState(0)
  const [dissolved, setDissolved] = useState(false)
  const [stirred, setStirred] = useState(false)
  const [powered, setPowered] = useState(false)
  const [mode, setMode] = useState('macro')
  const [zoom, setZoom] = useState(1)
  const [activeTab, setActiveTab] = useState('experiment')
  const [activeStage, setActiveStage] = useState(0)
  const [prediction, setPrediction] = useState('')
  const [notes, setNotesState] = useState(() => readStored(notesKey, { hypothesis: '', conclusion: '' }))
  const [observations, setObservations] = useState(() => readStored(logKey, []))
  const [notification, setNotification] = useState('')

  const solution = laboratorySolutions.find((item) => item.id === solutionId) || laboratorySolutions[0]
  const moles = solution.category === 'air' ? 0 : baseMoles + addedMoles
  const actualConcentration = volume ? moles / (volume / 1000) : 0
  const result = calculateLabResult({
    solution,
    concentration: actualConcentration,
    volume,
    temperature,
    voltage,
    distance,
    dissolved: dissolved || solution.category === 'air',
  })
  const particles = useMemo(() => createParticles(result, solution), [result, solution])
  const mass = solution.molarMass ? moles * solution.molarMass : 0
  const cellConstant = (distance / 100) / 1e-5
  const studentName = useMemo(() => user?.name || getStudentName(), [user])

  useEffect(() => {
    window.localStorage.setItem(notesKey, JSON.stringify(notes))
  }, [notes, notesKey])

  const setNotes = (update) => setNotesState((current) => (
    typeof update === 'function' ? update(current) : update
  ))

  const selectSolution = (id) => {
    const next = laboratorySolutions.find((item) => item.id === id)
    setSolutionId(id)
    setBaseMoles(next?.molarMass ? concentration * volume / 1000 : 0)
    setPrediction('')
    setNotes((current) => ({ ...current, hypothesis: '' }))
    setAddedMoles(0)
    setDissolved(next?.category === 'air')
    setStirred(false)
    setPowered(false)
    setNotification('')
  }

  const prepareConcentration = (value) => {
    setConcentration(value)
    setBaseMoles(solution.molarMass ? value * volume / 1000 : 0)
    setAddedMoles(0)
    setDissolved(solution.category === 'air')
    setPowered(false)
  }

  const changeVolume = (value) => {
    setVolume(value)
    setPowered(false)
  }

  const addSolute = () => {
    if (solution.category === 'air') {
      setNotification('Sampel air sudah siap. Pilih bahan terlarut jika ingin menambahkan solut.')
      return
    }
    if (!solution.molarMass) return
    setAddedMoles((current) => current + 0.005)
    setDissolved(false)
    setPowered(false)
    setNotification('Zat ditambahkan sebagai solut. Aduk hingga larut sebelum menguji.')
  }

  const stirSolution = () => {
    if (solution.category !== 'air') setDissolved(true)
    setStirred(true)
    setNotification('Sampel diaduk. Pada model, partikel kini tersebar dalam larutan.')
  }

  const diluteSolution = () => {
    const nextVolume = Math.min(250, volume + 50)
    if (nextVolume === volume) {
      setNotification('Volume sudah mencapai batas model (250 mL).')
      return
    }
    setVolume(nextVolume)
    setPowered(false)
    setNotification('Ditambahkan 50 mL air murni model. Jumlah mol tetap; konsentrasi larutan berubah.')
  }

  const startExperiment = () => {
    if (!dissolved && solution.category !== 'air') {
      setNotification('Larutkan sampel terlebih dahulu sebelum menghubungkan rangkaian.')
      return
    }
    setPowered(true)
    setActiveStage(4)
    setNotification('Rangkaian terhubung. Amati lampu, migrasi ion, dan nilai sensor model.')
  }

  const recordObservation = () => {
    if (!powered) {
      setNotification('Mulai uji terlebih dahulu untuk mencatat hasil pengamatan.')
      return
    }
    const row = {
      id: `${Date.now()}-${observations.length}`,
      time: new Date().toLocaleString('id-ID'),
      studentId,
      studentName,
      solution: solution.name,
      formula: solution.formula,
      concentration: formatMeasurement(actualConcentration, 3),
      temperature,
      voltage,
      distance,
      current: formatMeasurement(result.current, 4),
      conductance: formatMeasurement(result.conductance, 4),
      conductivity: formatMeasurement(result.conductivity, 4),
      lamp: result.lampLevel === 0 ? 'Padam' : ['','Sangat redup','Redup','Terang'][result.lampLevel],
    }
    const next = [row, ...observations].slice(0, 30)
    window.localStorage.setItem(logKey, JSON.stringify(next))
    setObservations(next)
    setActiveStage(5)
    setNotification('Pengamatan tersimpan di tabel LKPD pada perangkat ini.')
  }

  const resetExperiment = () => {
    setSolutionId('nacl')
    setConcentration(0.1)
    setVolume(100)
    setTemperature(25)
    setVoltage(1.5)
    setDistance(1)
    setBaseMoles(0.01)
    setAddedMoles(0)
    setDissolved(false)
    setStirred(false)
    setPowered(false)
    setMode('macro')
    setZoom(1)
    setPrediction('')
    setActiveStage(0)
    setNotification('Eksperimen saat ini direset. Log pengamatan tersimpan tetap tersedia.')
  }

  const clearObservations = () => {
    window.localStorage.removeItem(logKey)
    setObservations([])
    setNotification('Tabel pengamatan dikosongkan.')
  }

  const stages = ['Orientasi', 'Masalah', 'Hipotesis', 'Persiapan', 'Eksperimen', 'Data', 'Analisis', 'Kesimpulan']

  return (
    <div className="virtual-lab" role="dialog" aria-modal="true" aria-labelledby="virtual-lab-title">
      <header className="virtual-lab-header">
        <button type="button" className="virtual-lab-back" onClick={onClose}>← Kembali</button>
        <div><span>CHEMISTRY LAB • PRAKTIKUM DIGITAL</span><strong id="virtual-lab-title">Identifikasi daya hantar larutan</strong></div>
        <button type="button" className="virtual-lab-print" onClick={() => window.print()}>Cetak LKPD</button>
      </header>
      <main className="virtual-lab-content">
        <div className="lab-intro">
          <div>
            <span className="lab-mini-label">LABORATORIUM MINI • MODEL INTERAKTIF</span>
            <h1>Uji daya hantar listrik</h1>
            <p>Siapkan larutan, atur variabel, hubungkan rangkaian, amati bukti, dan susun kesimpulanmu sendiri.</p>
          </div>
          <div className="lab-research-question"><strong>Pertanyaan penyelidikan</strong><span>Mengapa larutan garam menghantarkan listrik, sedangkan larutan gula tidak?</span></div>
        </div>

        <nav className="lab-tabs" aria-label="Bagian laboratorium">
          <button type="button" className={activeTab === 'experiment' ? 'active' : ''} onClick={() => setActiveTab('experiment')}>Meja eksperimen</button>
          <button type="button" className={activeTab === 'compare' ? 'active' : ''} onClick={() => setActiveTab('compare')}>Bandingkan larutan</button>
          <button type="button" className={activeTab === 'worksheet' ? 'active' : ''} onClick={() => setActiveTab('worksheet')}>LKPD &amp; data ({observations.length})</button>
        </nav>

        {activeTab === 'experiment' && (
          <>
          <section className="lab-procedure" aria-labelledby="lab-procedure-title">
            <div className="lab-procedure-heading">
              <span className="lab-mini-label">PANDUAN PENYELIDIKAN</span>
              <h2 id="lab-procedure-title">Prosedur praktikum</h2>
              <p>Ikuti langkah berikut secara berurutan. Gunakan tombol pada panel praktikum untuk menyiapkan dan menguji sampel.</p>
            </div>
            <ol className="lab-procedure-list">
              {procedureSteps.map((step) => (
                <li key={step.title}>
                  <strong>{step.title}</strong>
                  <span>{step.detail}</span>
                </li>
              ))}
            </ol>
            <p className="lab-procedure-safety">Keselamatan: ini simulasi digital. Jika melakukan percobaan nyata, gunakan sumber tegangan rendah di bawah pengawasan guru dan jangan menyentuh larutan atau elektrode saat rangkaian aktif.</p>
          </section>
          <div className="lab-workspace">
            <section className="lab-bench" aria-label="Area simulasi peralatan dan larutan">
              <div className="lab-bench-toolbar">
                <span><i /> MEJA KERJA DIGITAL</span>
                <div>
                  <button type="button" onClick={resetExperiment}>Reset</button>
                  <button type="button" onClick={diluteSolution}>Tambah 50 mL air</button>
                </div>
              </div>
              <div className="lab-diagram-zoom" style={{ height: `${Math.max(260, 360 * zoom)}px` }}>
                <BenchDiagram particles={particles} isPowered={powered} isDissolved={dissolved || solution.category === 'air'} lampLevel={result.lampLevel} solution={solution} volume={volume} zoom={zoom} />
              </div>
              <div className="lab-zoom-controls">
                <span>Perbesaran visual: {zoom.toFixed(1)}×</span>
                <button type="button" onClick={() => setZoom((current) => Math.max(1, Number((current - .2).toFixed(1))))} disabled={zoom <= 1} aria-label="Perkecil visual">−</button>
                <input type="range" min="1" max="1.8" step=".2" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} aria-label="Atur perbesaran visual" />
                <button type="button" onClick={() => setZoom((current) => Math.min(1.8, Number((current + .2).toFixed(1))))} disabled={zoom >= 1.8} aria-label="Perbesar visual">+</button>
              </div>
              <div className="lab-tools" aria-label="Peralatan virtual">
                <div><span>⚗</span><strong>Gelas beker</strong><small>{volume} mL</small></div>
                <div><span>◉</span><strong>Sensor</strong><small>Konduktivitas</small></div>
                <div><span>⌁</span><strong>Spatula</strong><small>{mass.toFixed(2)} g zat</small></div>
                <div><span>↻</span><strong>Pengaduk</strong><small>{stirred ? 'Sudah diaduk' : 'Belum diaduk'}</small></div>
                <div><span>↕</span><strong>Elektrode</strong><small>Jarak {distance} cm</small></div>
              </div>
              <p className="lab-model-note">Skema alat dibuat untuk simulasi kelas. Sumber tegangan, arus, gelembung, dan sensor adalah keluaran model; bukan alat ukur atau hasil eksperimen nyata.</p>
            </section>

            <aside className="lab-control-panel" aria-label="Kontrol praktikum">
              <div className="lab-panel-title">
                <div><span className="lab-mini-label">PROSEDUR TERBIMBING</span><h2>Rancang percobaan</h2></div>
                <span className="lab-step-badge">{activeStage + 1}/8</span>
              </div>
              <div className="lab-stage-track" aria-label="Tahapan praktikum">
                {stages.map((stage, index) => (
                  <button type="button" className={index === activeStage ? 'active' : index < activeStage ? 'done' : ''} key={stage} onClick={() => setActiveStage(index)}>
                    <i>{index < activeStage ? '✓' : index + 1}</i><span>{stage}</span>
                  </button>
                ))}
              </div>

              <label className="lab-field">
                <span>Pilih zat / sampel</span>
                <select value={solutionId} onChange={(event) => selectSolution(event.target.value)}>
                  <optgroup label="Elektrolit kuat">{laboratorySolutions.filter((item) => item.category === 'kuat').map((item) => <option key={item.id} value={item.id}>{item.name} ({item.formula})</option>)}</optgroup>
                  <optgroup label="Elektrolit lemah">{laboratorySolutions.filter((item) => item.category === 'lemah').map((item) => <option key={item.id} value={item.id}>{item.name} ({item.formula})</option>)}</optgroup>
                  <optgroup label="Nonelektrolit">{laboratorySolutions.filter((item) => item.category === 'none').map((item) => <option key={item.id} value={item.id}>{item.name} ({item.formula})</option>)}</optgroup>
                  <optgroup label="Sampel air">{laboratorySolutions.filter((item) => item.category === 'air').map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</optgroup>
                </select>
              </label>

              <div className="lab-chemical-info">
                <div><span>{solution.formula}</span><b className={`lab-category ${solution.category}`}>{categoryLabels[solution.category]}</b></div>
                <p>{solution.description}</p>
                <small>{solution.molarMass ? `Massa molar: ${solution.molarMass} g/mol • ` : ''}{solution.kind === 'salt' ? 'Senyawa ionik' : solution.category === 'none' ? 'Kovalen molekuler' : 'Karakteristik sesuai model sampel'}</small>
              </div>

              <label className="lab-field">
                <span>Hipotesis: larutan ini termasuk …</span>
                <select value={prediction} onChange={(event) => { setPrediction(event.target.value); setNotes((current) => ({ ...current, hypothesis: event.target.value ? `Saya memprediksi ${solution.name} termasuk ${categoryLabels[event.target.value]}.` : '' })) }}>
                  <option value="">Pilih prediksi awal</option>
                  <option value="kuat">Elektrolit kuat</option>
                  <option value="lemah">Elektrolit lemah</option>
                  <option value="none">Nonelektrolit</option>
                  <option value="air">Sampel air (komposisi bervariasi)</option>
                </select>
              </label>
              {powered && prediction && (
                <p className={`lab-hypothesis-feedback ${prediction === solution.category ? 'correct' : 'incorrect'}`} role="status">
                  {prediction === solution.category
                    ? 'Prediksimu sesuai dengan klasifikasi sampel dalam model.'
                    : `Prediksimu berbeda dari model. Sampel ini dikategorikan sebagai ${categoryLabels[solution.category]}. Amati data, lalu perbaiki kesimpulanmu.`}
                </p>
              )}

              <div className="lab-fields-grid">
                <label className="lab-field">
                  <span>Konsentrasi awal</span>
                  <select value={concentration} onChange={(event) => prepareConcentration(Number(event.target.value))} disabled={solution.category === 'air'}>
                    {concentrationChoices.map((value) => <option value={value} key={value}>{value.toFixed(2)} mol/L</option>)}
                  </select>
                </label>
                <label className="lab-field">
                  <span>Volume: {volume} mL</span>
                  <input type="range" min="50" max="250" step="50" value={volume} onChange={(event) => changeVolume(Number(event.target.value))} />
                  <small>Jumlah mol zat dipertahankan saat volume digeser.</small>
                </label>
                <label className="lab-field">
                  <span>Suhu larutan</span>
                  <select value={temperature} onChange={(event) => setTemperature(Number(event.target.value))}>
                    {temperatureChoices.map((value) => <option value={value} key={value}>{value} °C</option>)}
                  </select>
                </label>
                <label className="lab-field">
                  <span>Tegangan sumber</span>
                  <select value={voltage} onChange={(event) => { setVoltage(Number(event.target.value)); setPowered(false) }}>
                    {voltageChoices.map((value) => <option value={value} key={value}>{value.toFixed(1)} V</option>)}
                  </select>
                </label>
                <label className="lab-field">
                  <span>Jarak elektroda</span>
                  <select value={distance} onChange={(event) => { setDistance(Number(event.target.value)); setPowered(false) }}>
                    {distanceChoices.map((value) => <option value={value} key={value}>{value} cm</option>)}
                  </select>
                </label>
              </div>

              <div className="lab-action-grid">
                <button type="button" className="lab-tool-button" onClick={addSolute}>＋ Tambah zat</button>
                <button type="button" className="lab-tool-button" onClick={stirSolution}>↻ Aduk / larutkan</button>
              </div>
              <div className="lab-run-controls">
                <button type="button" className="lab-primary-button" onClick={startExperiment} disabled={powered}>⚡ Mulai uji</button>
                <button type="button" className="lab-secondary-button" onClick={() => { setPowered(false); setNotification('Rangkaian dijeda; data pengaturan tetap tersimpan.') }} disabled={!powered}>Ⅱ Jeda</button>
              </div>
              <div className="lab-feedback-line" role="status">{notification || 'Pilih sampel, siapkan larutan, lalu jalankan uji.'}</div>
            </aside>

            <section className="lab-results">
              <div className="lab-results-heading">
                <div><span className="lab-mini-label">SENSOR DIGITAL • KELUARAN MODEL</span><h2>Hasil simulasi</h2></div>
                <button type="button" className="lab-secondary-button" onClick={recordObservation} disabled={!powered}>Catat hasil ↓</button>
              </div>
              <div className="lab-measurements">
                <Measurement label="Tegangan" value={formatMeasurement(voltage, 2)} unit="V" />
                <Measurement label="Arus model" value={formatMeasurement(result.current, 4)} unit="A" accent={result.lampLevel > 1 ? 'highlight' : ''} />
                <Measurement label="Konduktansi sel" value={formatMeasurement(result.conductance, 4)} unit="S" />
                <Measurement label="Konduktivitas spesifik" value={formatMeasurement(result.conductivity, 4)} unit="S/m" accent="teal" />
                <Measurement label="Konsentrasi analitik" value={formatMeasurement(actualConcentration, 3)} unit="mol/L" />
                <Measurement label="Jumlah ion model" value={formatMeasurement(result.ionConcentration, 3)} unit="mol/L" />
                <Measurement label="Suhu" value={String(temperature)} unit="°C" />
                <Measurement label="Konstanta sel (L/A)" value={formatMeasurement(cellConstant, 3)} unit="m⁻¹" />
              </div>
              <div className="lab-mode-tabs" role="tablist" aria-label="Tingkat representasi kimia">
                <button type="button" role="tab" aria-selected={mode === 'macro'} className={mode === 'macro' ? 'active' : ''} onClick={() => setMode('macro')}>Makroskopik</button>
                <button type="button" role="tab" aria-selected={mode === 'micro'} className={mode === 'micro' ? 'active' : ''} onClick={() => setMode('micro')}>Submikroskopik</button>
                <button type="button" role="tab" aria-selected={mode === 'symbolic'} className={mode === 'symbolic' ? 'active' : ''} onClick={() => setMode('symbolic')}>Simbolik</button>
              </div>
              <ModeContent mode={mode} solution={solution} result={result} particles={particles} isPowered={powered} />
              <p className="lab-caveat">Konduktivitas spesifik κ (S/m) adalah sifat larutan; konduktansi G (S) sel bergantung geometri. Model memakai mobilitas ion pembatas, koreksi suhu pendekatan 2%/°C, luas elektrode efektif 1 mm², dan faktor sel d/A. Pada larutan pekat interaksi ion, aktivitas, elektrode, serta kimia gas tidak dimodelkan secara rinci.</p>
            </section>
          </div>
          </>
        )}

        {activeTab === 'compare' && (
          <LabComparison settings={{ concentration: actualConcentration, volume, temperature, voltage, distance, dissolved: true }} />
        )}
        {activeTab === 'worksheet' && (
          <DigitalWorksheet notes={notes} setNotes={setNotes} observations={observations} studentName={studentName} onClearObservations={clearObservations} onOpenJournal={onOpenJournal} />
        )}
      </main>
    </div>
  )
}
