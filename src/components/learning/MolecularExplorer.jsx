import { useEffect, useState } from 'react'
import { readLearningData, writeLearningData, recordLearningActivity } from '../../data/learningStore.js'
import './MolecularExplorer.css'

const SPECIES = [
  {
    id: 'water', name: 'Air', formula: 'H₂O', type: 'Molekul netral', charge: 'netral',
    geometry: 'Bentuk molekul bengkok; sudut H–O–H sekitar 104,5°.', polarity: 'Polar: sisi O parsial negatif, sisi H parsial positif.',
    ionization: '2 H₂O(l) ⇌ H₃O⁺(aq) + OH⁻(aq)',
    ionizationNote: 'Autoionisasi air berlangsung sangat kecil pada kondisi biasa; sebagian besar partikel tetap berupa H₂O.',
    quiz: { question: 'Bentuk molekul H₂O?', choices: ['Linear', 'Bengkok', 'Segitiga planar'], correct: 1, explanation: 'Dua pasangan elektron bebas pada O membuat bentuk molekulnya bengkok.' },
  },
  {
    id: 'sodium', name: 'Ion natrium', formula: 'Na⁺', type: 'Kation', charge: '+1',
    geometry: 'Satu ion monoatomik; simbol tidak menyatakan ukuran bola sebenarnya.', polarity: 'Bermuatan positif; air menghidrasi ion dengan ujung O yang parsial negatif menghadap Na⁺.',
    ionization: 'NaCl(s) → Na⁺(aq) + Cl⁻(aq)',
    ionizationNote: 'Contoh sumber ion dalam larutan. Na⁺ sendiri sudah berupa ion, bukan molekul yang terionisasi lagi.',
    quiz: { question: 'Ujung molekul air mana yang cenderung menghadap Na⁺?', choices: ['Atom O yang parsial negatif', 'Atom H yang parsial positif', 'Orientasi tidak dipengaruhi muatan'], correct: 0, explanation: 'Ujung O pada H₂O memiliki muatan parsial negatif sehingga tertarik ke kation.' },
  },
  {
    id: 'chloride', name: 'Ion klorida', formula: 'Cl⁻', type: 'Anion', charge: '−1',
    geometry: 'Satu ion monoatomik; bola hanya lambang partikel, bukan model kulit elektron berskala.', polarity: 'Bermuatan negatif; H pada molekul air cenderung menghadap Cl⁻.',
    ionization: 'NaCl(s) → Na⁺(aq) + Cl⁻(aq)',
    ionizationNote: 'Persamaan memperlihatkan disosiasi garam ionik sebagai sumber Cl⁻; ion klorida bukan molekul netral yang terionisasi.',
    quiz: { question: 'Bagian H₂O yang cenderung menghadap Cl⁻?', choices: ['Ujung O parsial negatif', 'Ujung H parsial positif', 'Inti atom netral di luar air'], correct: 1, explanation: 'Ujung H yang parsial positif tertarik ke anion Cl⁻.' },
  },
  {
    id: 'calcium', name: 'Ion kalsium', formula: 'Ca²⁺', type: 'Kation', charge: '+2',
    geometry: 'Satu kation bermuatan +2; gambar tidak menyatakan jari-jari ion relatif yang presisi.', polarity: 'Ujung O parsial negatif pada air berorientasi ke Ca²⁺; susunan hidrasi nyata bersifat dinamis.',
    ionization: 'CaCl₂(s) → Ca²⁺(aq) + 2 Cl⁻(aq)',
    ionizationNote: 'Contoh disosiasi garam. Koefisien menunjukkan satu Ca²⁺ untuk dua Cl⁻, menjaga kenetralan muatan.',
    quiz: { question: 'Berapa ion Cl⁻ yang berpasangan secara stoikiometri dengan satu Ca²⁺ pada CaCl₂?', choices: ['Satu', 'Dua', 'Tiga'], correct: 1, explanation: 'Dua muatan −1 menyeimbangkan satu muatan +2 pada rumus netral CaCl₂.' },
  },
  {
    id: 'hydroxide', name: 'Ion hidroksida', formula: 'OH⁻', type: 'Anion poliatomik', charge: '−1',
    geometry: 'Dua atom tersambung; ion OH⁻ digambarkan linear sebagai kelompok diatomik.', polarity: 'Ion bermuatan −1. Air di sekitarnya dapat membentuk interaksi hidrasi dan ikatan hidrogen.',
    ionization: 'NaOH(s) → Na⁺(aq) + OH⁻(aq)',
    ionizationNote: 'Contoh disosiasi basa ionik. OH⁻ juga berperan dalam kesetimbangan asam-basa air.',
    quiz: { question: 'OH⁻ disebut anion karena…', choices: ['Muatan totalnya negatif', 'Memiliki dua atom', 'Tidak pernah berinteraksi dengan air'], correct: 0, explanation: 'Anion adalah ion bermuatan total negatif, terlepas dari jumlah atom penyusunnya.' },
  },
  {
    id: 'hydronium', name: 'Ion hidronium', formula: 'H₃O⁺', type: 'Kation poliatomik', charge: '+1',
    geometry: 'Geometri sekitar O mendekati piramida trigonal; gambar adalah skema ikatan 2D.', polarity: 'Kation dalam air; orientasi dan ikatan hidrogen dengan molekul air lain berlangsung dinamis.',
    ionization: 'H₂O(l) + H⁺(aq) → H₃O⁺(aq)',
    ionizationNote: 'Dalam air, proton terikat pada molekul air sebagai hidronium dan spesies terhidrasi lain; H⁺ bebas hanya notasi ringkas.',
    quiz: { question: 'Mengapa H₃O⁺ digunakan untuk mewakili proton dalam air?', choices: ['Proton berikatan dengan molekul air', 'Air berubah menjadi atom hidrogen', 'H₃O⁺ tidak memiliki muatan'], correct: 0, explanation: 'Proton tidak berada sebagai H⁺ bebas dalam air; ia berasosiasi dengan molekul air membentuk spesies seperti H₃O⁺.' },
  },
  {
    id: 'sucrose', name: 'Sukrosa', formula: 'C₁₂H₂₂O₁₁', type: 'Molekul netral', charge: 'netral',
    geometry: 'Dua unit cincin gula dihubungkan atom O; struktur ini skema ikatan, bukan bentuk 3D atau representasi stereokimia lengkap.', polarity: 'Banyak gugus –OH berinteraksi dengan air; sukrosa larut sebagai molekul dan tidak terdisosiasi menjadi ion pada pelarutan biasa.',
    ionization: 'C₁₂H₂₂O₁₁(s) → C₁₂H₂₂O₁₁(aq)',
    ionizationNote: 'Pelarutan tidak sama dengan ionisasi: sukrosa tetap berupa molekul netral di dalam air.',
    quiz: { question: 'Apa yang terutama terjadi saat sukrosa larut dalam air?', choices: ['Molekul netral terdispersi dalam air', 'Semua sukrosa terurai menjadi ion', 'Atom karbon berubah menjadi ion bebas'], correct: 0, explanation: 'Sukrosa merupakan nonelektrolit: molekulnya terdispersi, tetapi tidak terionisasi secara berarti.' },
  },
  {
    id: 'acetic-acid', name: 'Asam asetat', formula: 'CH₃COOH', type: 'Molekul; asam lemah', charge: 'netral (molekul)',
    geometry: 'Struktur mengandung ikatan C–C, C=O dan C–O; gambar tidak menunjukkan geometri 3D lengkap.', polarity: 'Sebagian kecil molekul berionisasi dalam air; kesetimbangan menghasilkan asetat dan hidronium.',
    ionization: 'CH₃COOH(aq) + H₂O(l) ⇌ CH₃COO⁻(aq) + H₃O⁺(aq)',
    ionizationNote: 'Asam asetat adalah asam lemah: reaksi merupakan kesetimbangan, bukan ionisasi lengkap.',
    quiz: { question: 'Apa ciri ionisasi asam asetat di air?', choices: ['Berlangsung sempurna untuk semua molekul', 'Hanya sebagian kecil terionisasi pada kesetimbangan', 'Asam asetat selalu tetap padat'], correct: 1, explanation: 'Asam asetat adalah elektrolit lemah, sehingga hanya sebagian molekul terionisasi pada kondisi tertentu.' },
  },
]

const REPRESENTATIONS = [
  { id: 'structure', label: 'Struktur' },
  { id: 'particles', label: 'Partikel dalam larutan' },
  { id: 'hydration', label: 'Hidrasi & interaksi' },
  { id: 'ionization', label: 'Ionisasi / disosiasi' },
]

const INITIAL_PROGRESS = { selected: 'water', representation: 'structure', read: [], completed: [], quizAnswers: {} }

function normalizeProgress(value) {
  if (!value || typeof value !== 'object') return INITIAL_PROGRESS
  const validIds = new Set(SPECIES.map((item) => item.id))
  return {
    selected: validIds.has(value.selected) ? value.selected : INITIAL_PROGRESS.selected,
    representation: REPRESENTATIONS.some((item) => item.id === value.representation) ? value.representation : INITIAL_PROGRESS.representation,
    read: Array.isArray(value.read) ? value.read.filter((id) => validIds.has(id)) : [],
    completed: Array.isArray(value.completed) ? value.completed.filter((id) => validIds.has(id)) : [],
    quizAnswers: value.quizAnswers && typeof value.quizAnswers === 'object' ? value.quizAnswers : {},
  }
}

function Atom({ x, y, label, fill = '#fff', stroke = '#203864', radius = 23, textColor = '#203864' }) {
  return (
    <g>
      <circle cx={x} cy={y} r={radius} fill={fill} stroke={stroke} strokeWidth="2.5" />
      <text x={x} y={y + 6} textAnchor="middle" fill={textColor} fontSize={label.length > 2 ? 14 : 18} fontWeight="800">{label}</text>
    </g>
  )
}

function WaterMolecule({ x, y, angle, toward = 'cation', scale = 1, faint = false }) {
  const radians = (angle * Math.PI) / 180
  const dx = Math.cos(radians)
  const dy = Math.sin(radians)
  const tx = -dy
  const ty = dx
  const o = toward === 'cation'
    ? { x: x - dx * 14, y: y - dy * 14 }
    : { x: x + dx * 14, y: y + dy * 14 }
  const hydrogens = toward === 'cation'
    ? [-1, 1].map((sign) => ({ x: x + dx * 11 + tx * sign * 11, y: y + dy * 11 + ty * sign * 11 }))
    : [-1, 1].map((sign) => ({ x: x - dx * 11 + tx * sign * 11, y: y - dy * 11 + ty * sign * 11 }))
  const opacity = faint ? 0.62 : 1
  return (
    <g opacity={opacity}>
      <line x1={o.x} y1={o.y} x2={hydrogens[0].x} y2={hydrogens[0].y} stroke="#8495ae" strokeWidth="2" />
      <line x1={o.x} y1={o.y} x2={hydrogens[1].x} y2={hydrogens[1].y} stroke="#8495ae" strokeWidth="2" />
      <circle cx={o.x} cy={o.y} r={7 * scale} fill="#f26b5b" stroke="#fff" strokeWidth="1.5" />
      {hydrogens.map((h, index) => <circle key={index} cx={h.x} cy={h.y} r={5 * scale} fill="#fff9ef" stroke="#203864" strokeWidth="1.5" />)}
    </g>
  )
}

function WaterStructure() {
  return (
    <g>
      <line x1="185" y1="135" x2="143" y2="202" stroke="#203864" strokeWidth="5" strokeLinecap="round" />
      <line x1="235" y1="135" x2="277" y2="202" stroke="#203864" strokeWidth="5" strokeLinecap="round" />
      <Atom x={210} y={128} label="O" fill="#f26b5b" textColor="#fff" radius={31} />
      <Atom x={135} y={215} label="H" fill="#dceeff" radius={24} />
      <Atom x={285} y={215} label="H" fill="#dceeff" radius={24} />
      <path d="M170 181 A48 48 0 0 1 250 181" fill="none" stroke="#16a6a1" strokeDasharray="4 4" strokeWidth="2" />
      <text x="210" y="188" textAnchor="middle" fill="#16a6a1" fontSize="13" fontWeight="700">≈104,5°</text>
      <text x="318" y="118" fill="#f26b5b" fontSize="15" fontWeight="700">δ−</text>
      <text x="113" y="263" fill="#203864" fontSize="14" fontWeight="700">δ+</text>
      <text x="297" y="263" fill="#203864" fontSize="14" fontWeight="700">δ+</text>
    </g>
  )
}

function IonStructure({ species }) {
  const isPositive = species.charge.startsWith('+')
  const charge = species.charge
  return (
    <g>
      <circle cx="210" cy="158" r="77" fill={isPositive ? '#fff0d6' : '#dcf5f2'} stroke={isPositive ? '#f4a340' : '#16a6a1'} strokeWidth="4" />
      <text x="210" y="168" textAnchor="middle" fill="#203864" fontSize={species.formula.length > 2 ? 39 : 52} fontWeight="800">{species.formula}</text>
      <text x="210" y="264" textAnchor="middle" fill="#5a6679" fontSize="14">muatan total {charge}</text>
    </g>
  )
}

function HydroxideStructure() {
  return (
    <g>
      <line x1="200" y1="157" x2="257" y2="157" stroke="#203864" strokeWidth="5" strokeLinecap="round" />
      <Atom x={185} y={157} label="O" fill="#f26b5b" textColor="#fff" radius={33} />
      <Atom x={270} y={157} label="H" fill="#dceeff" radius={28} />
      <text x="321" y="109" fill="#16a6a1" fontSize="24" fontWeight="800">−</text>
      <text x="210" y="243" textAnchor="middle" fill="#5a6679" fontSize="14">ikatan O–H • muatan total −1</text>
    </g>
  )
}

function HydroniumStructure() {
  return (
    <g>
      <line x1="210" y1="154" x2="210" y2="91" stroke="#203864" strokeWidth="4" />
      <line x1="190" y1="164" x2="138" y2="194" stroke="#203864" strokeWidth="4" />
      <line x1="230" y1="164" x2="282" y2="194" stroke="#203864" strokeWidth="4" />
      <Atom x={210} y={157} label="O" fill="#f26b5b" textColor="#fff" radius={33} />
      <Atom x={210} y={76} label="H" fill="#dceeff" radius={24} />
      <Atom x={125} y={202} label="H" fill="#dceeff" radius={24} />
      <Atom x={295} y={202} label="H" fill="#dceeff" radius={24} />
      <text x="320" y="99" fill="#f4a340" fontSize="24" fontWeight="800">+</text>
      <text x="210" y="267" textAnchor="middle" fill="#5a6679" fontSize="14">skema piramida trigonal • muatan +1</text>
    </g>
  )
}

function SucroseStructure() {
  const left = [[117, 126], [143, 82], [193, 82], [219, 126], [193, 170], [143, 170]]
  const right = [[254, 126], [280, 82], [330, 82], [356, 126], [330, 170], [280, 170]]
  const polygon = (points) => points.map(([x, y]) => `${x},${y}`).join(' ')
  return (
    <g>
      <polygon points={polygon(left)} fill="#fff9ef" stroke="#203864" strokeWidth="3" />
      <polygon points={polygon(right)} fill="#fff9ef" stroke="#203864" strokeWidth="3" />
      <text x="143" y="87" fill="#f26b5b" fontSize="19" fontWeight="800">O</text>
      <text x="330" y="87" fill="#f26b5b" fontSize="19" fontWeight="800">O</text>
      <line x1="219" y1="126" x2="236" y2="126" stroke="#203864" strokeWidth="3" />
      <line x1="237" y1="126" x2="254" y2="126" stroke="#203864" strokeWidth="3" />
      <text x="236" y="115" textAnchor="middle" fill="#f26b5b" fontSize="19" fontWeight="800">O</text>
      {[[117, 126], [193, 82], [193, 170], [280, 82], [356, 126], [330, 170]].map(([x, y], i) => <text key={i} x={x} y={y + 5} textAnchor="middle" fill="#203864" fontSize="13" fontWeight="700">C</text>)}
      <text x="210" y="224" textAnchor="middle" fill="#5a6679" fontSize="13">dua unit gula • ikatan glikosidik</text>
      <text x="210" y="249" textAnchor="middle" fill="#5a6679" fontSize="12">gugus –OH disederhanakan, stereokimia tidak ditampilkan</text>
    </g>
  )
}

function AceticAcidStructure() {
  return (
    <g>
      <text x="95" y="165" textAnchor="middle" fill="#203864" fontSize="25" fontWeight="800">CH₃</text>
      <line x1="126" y1="157" x2="180" y2="157" stroke="#203864" strokeWidth="4" />
      <Atom x={202} y={157} label="C" fill="#dceeff" radius={27} />
      <line x1="224" y1="145" x2="277" y2="112" stroke="#203864" strokeWidth="3" />
      <line x1="228" y1="153" x2="281" y2="120" stroke="#203864" strokeWidth="3" />
      <Atom x={297} y={106} label="O" fill="#f26b5b" textColor="#fff" radius={28} />
      <line x1="225" y1="170" x2="274" y2="202" stroke="#203864" strokeWidth="4" />
      <Atom x={294} y={215} label="O" fill="#f26b5b" textColor="#fff" radius={28} />
      <line x1="320" y1="215" x2="354" y2="215" stroke="#203864" strokeWidth="3" />
      <text x="370" y="222" fill="#203864" fontSize="20" fontWeight="800">H</text>
      <text x="210" y="267" textAnchor="middle" fill="#5a6679" fontSize="14">C=O dan C–O–H • struktur netral</text>
    </g>
  )
}

function StructureDiagram({ species }) {
  if (species.id === 'water') return <WaterStructure />
  if (species.id === 'sodium' || species.id === 'chloride' || species.id === 'calcium') return <IonStructure species={species} />
  if (species.id === 'hydroxide') return <HydroxideStructure />
  if (species.id === 'hydronium') return <HydroniumStructure />
  if (species.id === 'sucrose') return <SucroseStructure />
  return <AceticAcidStructure />
}

function ParticleDiagram({ species }) {
  const isIon = species.charge !== 'netral' && species.id !== 'acetic-acid'
  const ionText = species.charge === 'netral' ? species.formula : `${species.formula} ${species.charge}`
  const fillers = species.id === 'acetic-acid'
    ? ['CH₃COOH', 'CH₃COOH', 'CH₃COOH', 'H₂O', 'H₂O', 'CH₃COO⁻', 'H₃O⁺']
    : species.id === 'water'
    ? ['H₂O', 'H₂O', 'H₂O', 'H₂O', 'H₂O', 'H₂O']
    : isIon
      ? ['H₂O', 'H₂O', 'H₂O', 'H₂O', 'H₂O']
      : [species.formula, species.formula, species.formula, 'H₂O', 'H₂O']
  const positions = [[94, 103], [326, 101], [105, 220], [319, 220], [210, 73], [134, 270], [286, 270]]
  return (
    <g>
      {fillers.map((label, index) => {
        const [x, y] = positions[index]
        const weakAcidIon = label === 'CH₃COO⁻' || label === 'H₃O⁺'
        const water = label === 'H₂O'
        return (
          <g key={`${label}-${index}`}>
            <circle cx={x} cy={y} r="32" fill={weakAcidIon ? '#fff0d6' : water ? '#e5f7f5' : '#fff1df'} stroke={weakAcidIon ? '#f26b5b' : water ? '#16a6a1' : '#f4a340'} strokeWidth="2" />
            <text x={x} y={y + 5} textAnchor="middle" fill="#203864" fontSize={label.length > 6 ? 9 : 13} fontWeight="700">{label}</text>
            {isIon && water && <text x={x + 24} y={y - 19} fill="#5a6679" fontSize="10">δ±</text>}
          </g>
        )
      })}
      <circle cx="210" cy="158" r="53" fill={isIon ? '#fff0d6' : '#fff9ef'} stroke={isIon ? '#f26b5b' : '#203864'} strokeWidth="3" />
      <text x="210" y="165" textAnchor="middle" fill="#203864" fontSize={ionText.length > 8 ? 18 : 23} fontWeight="800">{ionText}</text>
      <text x="210" y="294" textAnchor="middle" fill="#5a6679" fontSize="12">
        {species.id === 'acetic-acid' ? 'ionisasi parsial ditunjukkan secara kualitatif' : 'contoh sebaran partikel • jumlah dan jarak tidak berskala'}
      </text>
    </g>
  )
}

function HydrationDiagram({ species }) {
  const anion = species.charge.startsWith('−') || species.id === 'hydroxide'
  const direction = anion ? 'anion' : 'cation'
  const isNeutral = species.charge === 'netral' || species.id === 'acetic-acid'
  const points = Array.from({ length: isNeutral ? 8 : 8 }, (_, index) => {
    const angle = index * 45
    const radius = isNeutral ? 105 : 106
    const radians = (angle * Math.PI) / 180
    return { x: 210 + Math.cos(radians) * radius, y: 158 + Math.sin(radians) * radius, angle }
  })
  return (
    <g>
      {points.map((point, index) => (
        <g key={index}>
          <line
            x1={isNeutral ? 210 : 210 + Math.cos(point.angle * Math.PI / 180) * 47}
            y1={isNeutral ? 158 : 158 + Math.sin(point.angle * Math.PI / 180) * 47}
            x2={isNeutral ? point.x : 210 + Math.cos(point.angle * Math.PI / 180) * 76}
            y2={isNeutral ? point.y : 158 + Math.sin(point.angle * Math.PI / 180) * 76}
            stroke="#16a6a1"
            strokeWidth="1.5"
            strokeDasharray="3 5"
          />
          <WaterMolecule x={point.x} y={point.y} angle={point.angle} toward={direction} faint={isNeutral} />
        </g>
      ))}
      <circle cx="210" cy="158" r="45" fill={isNeutral ? '#fff9ef' : '#fff0d6'} stroke={isNeutral ? '#203864' : '#f26b5b'} strokeWidth="3" />
      <text x="210" y="164" textAnchor="middle" fill="#203864" fontSize={species.formula.length > 7 ? 16 : 21} fontWeight="800">{species.formula}</text>
      <text x="210" y="292" textAnchor="middle" fill="#5a6679" fontSize="12">
        {isNeutral ? 'air sekitar: orientasi skematis, interaksi spesifik tidak lengkap' : anion ? 'ujung H δ+ mengarah ke anion' : 'ujung O δ− mengarah ke kation'}
      </text>
    </g>
  )
}

function IonizationDiagram({ species }) {
  const neutral = species.charge === 'netral' || species.id === 'acetic-acid'
  return (
    <g>
      <rect x="34" y="81" width="370" height="156" rx="20" fill="#fff" stroke="#dceeff" strokeWidth="2" />
      <text x="219" y="132" textAnchor="middle" fill="#203864" fontSize={species.ionization.length > 40 ? 14 : species.ionization.length > 30 ? 18 : 22} fontWeight="800">{species.ionization}</text>
      <text x="219" y="177" textAnchor="middle" fill="#5a6679" fontSize="13">
        {neutral ? 'spesies awal netral' : 'ion sudah bermuatan sebelum berada dalam larutan'}
      </text>
      <text x="219" y="204" textAnchor="middle" fill="#5a6679" fontSize="12">panah reaksi adalah skema konsep, bukan simulasi kesetimbangan</text>
    </g>
  )
}

function Diagram({ species, representation, rotation, zoom }) {
  const headings = {
    structure: 'Struktur atau bentuk partikel',
    particles: 'Partikel terlarut (skema)',
    hydration: 'Orientasi air dan interaksi hidrasi',
    ionization: 'Perubahan spesies dalam air',
  }
  return (
    <div className="learning-tool__diagram-wrap">
      <svg className="learning-tool__diagram" viewBox="0 0 420 320" role="img" aria-labelledby={`diagram-title-${species.id} diagram-desc-${species.id}`}>
        <title id={`diagram-title-${species.id}`}>{headings[representation]}: {species.formula}</title>
        <desc id={`diagram-desc-${species.id}`}>Ilustrasi skematis yang dapat diputar dan diperbesar. Jarak, ukuran, jumlah partikel dan geometri selain yang dijelaskan bukan representasi berskala.</desc>
        <rect x="1" y="1" width="418" height="318" rx="22" fill="#fff" />
        <g transform={`translate(210 158) rotate(${rotation}) scale(${zoom}) translate(-210 -158)`}>
          {representation === 'structure' && <StructureDiagram species={species} />}
          {representation === 'particles' && <ParticleDiagram species={species} />}
          {representation === 'hydration' && <HydrationDiagram species={species} />}
          {representation === 'ionization' && <IonizationDiagram species={species} />}
        </g>
      </svg>
      <p className="learning-tool__diagram-caption">{headings[representation]} • skema partikel, bukan geometri atau ukuran berskala</p>
    </div>
  )
}

export default function MolecularExplorer({ userId, onActivity }) {
  const [savedProgress, setSavedProgress] = useState(() => ({
    owner: userId,
    value: normalizeProgress(userId ? readLearningData(userId, 'molecular-explorer', INITIAL_PROGRESS) : INITIAL_PROGRESS),
  }))
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [notice, setNotice] = useState('')
  const storedProgress = savedProgress.owner === userId
    ? savedProgress.value
    : normalizeProgress(userId ? readLearningData(userId, 'molecular-explorer', INITIAL_PROGRESS) : INITIAL_PROGRESS)
  const progress = storedProgress.read.includes(storedProgress.selected)
    ? storedProgress
    : { ...storedProgress, read: [...storedProgress.read, storedProgress.selected] }
  const species = SPECIES.find((item) => item.id === progress.selected) ?? SPECIES[0]
  const selectedAnswer = progress.quizAnswers[species.id]

  useEffect(() => {
    if (!userId) return
    const stored = normalizeProgress(readLearningData(userId, 'molecular-explorer', INITIAL_PROGRESS))
    if (stored.read.includes(progress.selected)) return
    const next = { ...stored, read: [...stored.read, progress.selected] }
    try {
      writeLearningData(userId, 'molecular-explorer', next)
      recordLearningActivity(userId, { feature: 'molecular-explorer', action: 'species-opened', species: progress.selected }, onActivity)
    } catch (error) {
      console.error('Unable to record ElectroFun molecular progress.', error)
    }
  }, [onActivity, progress.selected, userId])

  function saveProgress(next, activity) {
    const updated = normalizeProgress(next)
    if (!updated.read.includes(updated.selected)) updated.read = [...updated.read, updated.selected]
    if (userId) {
      try {
        writeLearningData(userId, 'molecular-explorer', updated)
        if (activity) recordLearningActivity(userId, { feature: 'molecular-explorer', ...activity }, onActivity)
      } catch (error) {
        setNotice(error instanceof Error ? error.message : 'Progres tidak dapat disimpan.')
        return false
      }
    }
    setSavedProgress({ owner: userId, value: updated })
    setNotice(userId ? 'Progres tersimpan di perangkat ini.' : 'Masuk untuk menyimpan progres secara terpisah per akun.')
    return true
  }

  function selectSpecies(id) {
    setRotation(0)
    const next = { ...progress, selected: id }
    saveProgress(next, { action: 'species-selected', species: id })
  }

  function setRepresentation(id) {
    saveProgress({ ...progress, representation: id }, { action: 'representation-changed', representation: id, species: species.id })
  }

  function chooseAnswer(index) {
    saveProgress(
      { ...progress, quizAnswers: { ...progress.quizAnswers, [species.id]: index } },
      { action: 'species-quiz-answered', species: species.id, correct: index === species.quiz.correct },
    )
  }

  function markComplete() {
    const completed = progress.completed.includes(species.id) ? progress.completed : [...progress.completed, species.id]
    saveProgress({ ...progress, completed }, { action: 'species-completed', species: species.id })
  }

  return (
    <section className="learning-tool learning-tool--molecules" aria-labelledby="learning-molecules-title">
      <header className="learning-tool__hero">
        <div>
          <span className="learning-tool__eyebrow">MODEL PARTIKEL INTERAKTIF</span>
          <h1 id="learning-molecules-title">Molecular Explorer</h1>
          <p>Amati delapan molekul dan ion, jelajahi hidrasi, lalu bandingkan pelarutan dengan ionisasi.</p>
        </div>
        <div className="learning-tool__molecule-progress" aria-label={`${progress.completed.length} dari ${SPECIES.length} spesies dipelajari`}>
          <strong>{progress.completed.length}/{SPECIES.length}</strong><span>dipelajari</span>
        </div>
      </header>

      <div className="learning-tool__explorer">
        <aside className="learning-tool__species-panel" aria-label="Pilih molekul atau ion">
          <h2>Spesies kimia</h2>
          <p>Pilih spesies untuk membuka model dan aktivitasnya.</p>
          <div className="learning-tool__species-list">
            {SPECIES.map((item) => (
              <button
                className={`learning-tool__species-button${item.id === species.id ? ' is-active' : ''}`}
                key={item.id}
                onClick={() => selectSpecies(item.id)}
                aria-current={item.id === species.id ? 'true' : undefined}
              >
                <span className="learning-tool__species-formula">{item.formula}</span>
                <span className="learning-tool__species-info"><strong>{item.name}</strong><small>{item.type}</small></span>
                {progress.completed.includes(item.id) && <span className="learning-tool__species-check" aria-label="Sudah dipelajari">✓</span>}
              </button>
            ))}
          </div>
        </aside>

        <div className="learning-tool__explorer-main">
          <div className="learning-tool__molecule-heading">
            <div><span className="learning-tool__pill">{species.type}</span><h2>{species.name} <span>{species.formula}</span></h2></div>
            <span className="learning-tool__charge">Muatan {species.charge}</span>
          </div>
          <div className="learning-tool__representation" role="tablist" aria-label="Pilih jenis representasi">
            {REPRESENTATIONS.map((item) => (
              <button
                key={item.id}
                className={`learning-tool__representation-button${progress.representation === item.id ? ' is-active' : ''}`}
                onClick={() => setRepresentation(item.id)}
                role="tab"
                aria-selected={progress.representation === item.id}
                aria-controls="molecule-model-panel"
                id={`representation-${item.id}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="learning-tool__model-area" id="molecule-model-panel" role="tabpanel" aria-labelledby={`representation-${progress.representation}`}>
            <Diagram species={species} representation={progress.representation} rotation={rotation} zoom={zoom} />
            <div className="learning-tool__model-controls">
              <div className="learning-tool__rotation-controls" role="group" aria-label="Kontrol putar model">
                <button onClick={() => setRotation((value) => (value - 15 + 360) % 360)} aria-label="Putar model 15 derajat ke kiri">↶ 15°</button>
                <label htmlFor="learning-model-rotation">Rotasi <output>{rotation}°</output></label>
                <input id="learning-model-rotation" type="range" min="0" max="345" step="15" value={rotation} onChange={(event) => setRotation(Number(event.target.value))} aria-label="Sudut rotasi model" />
                <button onClick={() => setRotation((value) => (value + 15) % 360)} aria-label="Putar model 15 derajat ke kanan">15° ↷</button>
              </div>
              <div className="learning-tool__zoom-controls" role="group" aria-label="Kontrol perbesaran model">
                <button onClick={() => setZoom((value) => Math.max(0.75, Number((value - 0.1).toFixed(2))))} aria-label="Perkecil model">−</button>
                <label htmlFor="learning-model-zoom">Zoom <output>{Math.round(zoom * 100)}%</output></label>
                <input id="learning-model-zoom" type="range" min="0.75" max="1.5" step="0.05" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} aria-label="Tingkat perbesaran model" />
                <button onClick={() => setZoom((value) => Math.min(1.5, Number((value + 0.1).toFixed(2))))} aria-label="Perbesar model">+</button>
                <button onClick={() => { setZoom(1); setRotation(0) }}>Atur ulang</button>
              </div>
            </div>
          </div>

          <div className="learning-tool__molecule-facts">
            <div><span>Bentuk / struktur</span><p>{species.geometry}</p></div>
            <div><span>Muatan &amp; interaksi</span><p>{species.polarity}</p></div>
          </div>

          <section className="learning-tool__molecule-note" aria-labelledby="molecule-note-title">
            <h3 id="molecule-note-title">Apa yang ditunjukkan model ini?</h3>
            <p>
              {progress.representation === 'hydration'
                ? 'Pada ion positif, ujung O air mengarah ke ion; pada ion negatif, ujung H mengarah ke ion. Selubung hidrasi terus berubah dan gambar hanya menunjukkan orientasi umum.'
                : progress.representation === 'ionization'
                  ? species.ionizationNote
                  : 'Model adalah diagram 2D untuk belajar hubungan partikel dan muatan. Ikatan, ukuran relatif, jarak, jumlah partikel, gerak termal, dan geometri 3D tidak ditampilkan sepenuhnya.'}
            </p>
          </section>

          <section className="learning-tool__molecule-quiz" aria-labelledby={`molecule-quiz-${species.id}`}>
            <span className="learning-tool__quiz-label">CEK PEMAHAMAN</span>
            <h3 id={`molecule-quiz-${species.id}`}>{species.quiz.question}</h3>
            <div className="learning-tool__choices" role="group" aria-label="Pilihan jawaban">
              {species.quiz.choices.map((choice, index) => {
                const answered = selectedAnswer !== undefined
                const correct = index === species.quiz.correct
                return (
                  <button
                    className={`learning-tool__choice${answered && correct ? ' is-correct' : ''}${answered && selectedAnswer === index && !correct ? ' is-incorrect' : ''}`}
                    key={choice}
                    onClick={() => chooseAnswer(index)}
                    aria-pressed={selectedAnswer === index}
                  >
                    <span>{String.fromCharCode(65 + index)}</span>{choice}
                  </button>
                )
              })}
            </div>
            {selectedAnswer !== undefined && (
              <p className={`learning-tool__feedback${selectedAnswer === species.quiz.correct ? ' is-correct' : ' is-incorrect'}`} role="status">
                {selectedAnswer === species.quiz.correct ? 'Tepat. ' : 'Belum tepat. '}{species.quiz.explanation}
              </p>
            )}
          </section>

          <div className="learning-tool__molecule-actions">
            <button className="learning-tool__primary-button" onClick={markComplete} disabled={progress.completed.includes(species.id)}>
              {progress.completed.includes(species.id) ? 'Sudah dipelajari ✓' : 'Tandai dipelajari'}
            </button>
            <span className="learning-tool__save-notice" role="status">{notice}</span>
          </div>
        </div>
      </div>
      <p className="learning-tool__disclaimer">Seluruh gambar adalah skema konseptual, bukan hasil simulasi kuantum, model bola-ke-skala, atau representasi geometri 3D penuh. Orientasi hidrasi bersifat umum dan dinamis.</p>
    </section>
  )
}
