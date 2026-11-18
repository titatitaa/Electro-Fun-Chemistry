export const concentrationChoices = [0.01, 0.05, 0.1, 0.25, 0.5, 1]
export const volumeChoices = [50, 100, 150, 200, 250]
export const temperatureChoices = [20, 25, 30, 40, 50]
export const voltageChoices = [0.5, 1, 1.5, 2, 2.5, 3]
export const distanceChoices = [0.5, 0.75, 1, 1.5, 2]

export const laboratorySolutions = [
  { id: 'nacl', name: 'Natrium klorida', formula: 'NaCl', molarMass: 58.44, category: 'kuat', kind: 'salt', ions: [['Na⁺', 50.1, 1], ['Cl⁻', 76.3, 1]], description: 'Senyawa ionik; terdisosiasi menjadi ion Na⁺ dan Cl⁻ terhidrasi.', equation: 'NaCl(s) → Na⁺(aq) + Cl⁻(aq)' },
  { id: 'kcl', name: 'Kalium klorida', formula: 'KCl', molarMass: 74.55, category: 'kuat', kind: 'salt', ions: [['K⁺', 73.5, 1], ['Cl⁻', 76.3, 1]], description: 'Senyawa ionik; menghasilkan kation K⁺ dan anion Cl⁻ yang bergerak.', equation: 'KCl(s) → K⁺(aq) + Cl⁻(aq)' },
  { id: 'cacl2', name: 'Kalsium klorida', formula: 'CaCl₂', molarMass: 110.98, category: 'kuat', kind: 'salt', ions: [['Ca²⁺', 119, 1], ['Cl⁻', 76.3, 2]], description: 'Senyawa ionik; setiap satu unit menghasilkan satu Ca²⁺ dan dua Cl⁻.', equation: 'CaCl₂(s) → Ca²⁺(aq) + 2Cl⁻(aq)' },
  { id: 'hcl', name: 'Asam klorida encer', formula: 'HCl', molarMass: 36.46, category: 'kuat', kind: 'strong-acid', ions: [['H₃O⁺', 349.6, 1], ['Cl⁻', 76.3, 1]], description: 'Asam kuat; bereaksi hampir sempurna dengan air membentuk H₃O⁺ dan Cl⁻.', equation: 'HCl(aq) + H₂O(l) → H₃O⁺(aq) + Cl⁻(aq)' },
  { id: 'naoh', name: 'Natrium hidroksida encer', formula: 'NaOH', molarMass: 40, category: 'kuat', kind: 'strong-base', ions: [['Na⁺', 50.1, 1], ['OH⁻', 198, 1]], description: 'Basa kuat; terdisosiasi menjadi Na⁺ dan OH⁻ dalam larutan.', equation: 'NaOH(s) → Na⁺(aq) + OH⁻(aq)' },
  { id: 'acetic', name: 'Asam asetat', formula: 'CH₃COOH', molarMass: 60.05, category: 'lemah', kind: 'weak-acid', ka: 1.8e-5, ions: [['H₃O⁺', 349.6, 1], ['CH₃COO⁻', 40.9, 1]], description: 'Senyawa kovalen polar; sebagian molekul bereaksi dengan air, sebagian tetap netral.', equation: 'CH₃COOH(aq) + H₂O(l) ⇌ H₃O⁺(aq) + CH₃COO⁻(aq)' },
  { id: 'ammonia', name: 'Amonia dalam air', formula: 'NH₃(aq)', molarMass: 17.03, category: 'lemah', kind: 'weak-base', kb: 1.8e-5, ions: [['NH₄⁺', 73.5, 1], ['OH⁻', 198, 1]], description: 'Molekul NH₃ menerima proton dari air secara sebagian membentuk NH₄⁺ dan OH⁻.', equation: 'NH₃(aq) + H₂O(l) ⇌ NH₄⁺(aq) + OH⁻(aq)' },
  { id: 'carbonic', name: 'Asam karbonat', formula: 'H₂CO₃', molarMass: 62.03, category: 'lemah', kind: 'weak-acid', ka: 4.3e-7, ions: [['H₃O⁺', 349.6, 1], ['HCO₃⁻', 44.5, 1]], description: 'Asam lemah diprotik; model ini hanya menghitung ionisasi tahap pertama.', equation: 'H₂CO₃(aq) + H₂O(l) ⇌ H₃O⁺(aq) + HCO₃⁻(aq)' },
  { id: 'sucrose', name: 'Sukrosa', formula: 'C₁₂H₂₂O₁₁', molarMass: 342.30, category: 'none', kind: 'none', ions: [], description: 'Molekul kovalen larut sebagai molekul utuh; tidak membentuk ion dari pelarutannya.', equation: 'C₁₂H₂₂O₁₁(s) → C₁₂H₂₂O₁₁(aq)' },
  { id: 'glucose', name: 'Glukosa', formula: 'C₆H₁₂O₆', molarMass: 180.16, category: 'none', kind: 'none', ions: [], description: 'Molekul kovalen polar; tersebar sebagai molekul netral ketika larut.', equation: 'C₆H₁₂O₆(s) → C₆H₁₂O₆(aq)' },
  { id: 'ethanol', name: 'Etanol', formula: 'C₂H₅OH', molarMass: 46.07, category: 'none', kind: 'none', ions: [], description: 'Senyawa kovalen molekuler; tidak menghasilkan ion dalam air pada kondisi model ini.', equation: 'C₂H₅OH(l) → C₂H₅OH(aq)' },
  { id: 'urea', name: 'Urea', formula: 'CO(NH₂)₂', molarMass: 60.06, category: 'none', kind: 'none', ions: [], description: 'Molekul kovalen larut dan tetap netral; tidak menghasilkan ion berarti.', equation: 'CO(NH₂)₂(s) → CO(NH₂)₂(aq)' },
  { id: 'distilled', name: 'Air suling', formula: 'H₂O', molarMass: 18.015, category: 'air', kind: 'water', ions: [['H₃O⁺', 349.6, 1], ['OH⁻', 198, 1]], baseConductivity: 0.0000055, description: 'Air sangat murni memiliki sangat sedikit ion; konduktivitasnya rendah, tetapi tidak nol mutlak.', equation: '2H₂O(l) ⇌ H₃O⁺(aq) + OH⁻(aq)' },
  { id: 'demineralized', name: 'Air demineralisasi', formula: 'H₂O', molarMass: 18.015, category: 'air', kind: 'water', ions: [['H₃O⁺', 349.6, 1], ['OH⁻', 198, 1]], baseConductivity: 0.00002, description: 'Kandungan ion mineralnya telah dikurangi; nilai aktual tergantung proses dan kontaminasi.', equation: 'Konduktivitas rendah; nilai aktual bergantung mutu proses demineralisasi.' },
  { id: 'mineral', name: 'Air mineral (model)', formula: 'H₂O + mineral', molarMass: null, category: 'air', kind: 'mineral', ions: [['Na⁺', 50.1, 1], ['Ca²⁺', 119, 1], ['Cl⁻', 76.3, 1]], baseConductivity: 0.025, description: 'Model air dengan campuran mineral terlarut; bukan komposisi merek atau data sampel nyata.', equation: 'Ion mineral terlarut → konduktivitas terukur (komposisi bervariasi)' },
]

function weakIonizationConcentration(concentration, equilibriumConstant) {
  if (!concentration || !equilibriumConstant) return 0
  const discriminant = Math.sqrt((equilibriumConstant ** 2) + (4 * equilibriumConstant * concentration))
  return Math.min(concentration, (-equilibriumConstant + discriminant) / 2)
}

export function calculateLabResult({ solution, concentration, volume, temperature, voltage, distance, dissolved }) {
  const preparedConcentration = dissolved ? concentration : 0
  const ions = []
  let ionization = 0

  if (solution.kind === 'water') {
    solution.ions.forEach(([formula, mobility, stoich]) => {
        ions.push({ formula, concentration: 1e-7 * stoich, mobility })
    })
  } else if (solution.category === 'kuat') {
    solution.ions.forEach(([formula, mobility, stoich]) => {
      ions.push({ formula, concentration: preparedConcentration * stoich, mobility })
    })
    ionization = dissolved ? 1 : 0
  } else if (solution.category === 'lemah') {
    const ionizedConcentration = weakIonizationConcentration(preparedConcentration, solution.ka || solution.kb)
    solution.ions.forEach(([formula, mobility]) => {
      ions.push({ formula, concentration: ionizedConcentration, mobility })
    })
    ionization = preparedConcentration ? ionizedConcentration / preparedConcentration : 0
  } else if (solution.kind === 'mineral') {
    const volumeFactor = volume ? 100 / volume : 0
    const formulaUnitConcentration = (solution.baseConductivity
      / (0.1 * solution.ions.reduce((sum, ion) => sum + ion[1] * ion[2], 0))) * volumeFactor
    solution.ions.forEach(([formula, mobility, stoich]) => {
      ions.push({ formula, concentration: formulaUnitConcentration * stoich, mobility })
    })
  }

  const temperatureFactor = Math.max(0.7, 1 + 0.02 * (temperature - 25))
  const conductivity = ions.reduce((sum, ion) => (
    sum + (ion.mobility * 1e-4 * ion.concentration * 1000)
  ), 0) * temperatureFactor
  const mineralDilutionFactor = solution.kind === 'mineral' && volume ? 100 / volume : 1
  const effectiveConductivity = solution.kind === 'water'
    ? solution.baseConductivity * temperatureFactor
    : solution.kind === 'mineral'
      ? solution.baseConductivity * mineralDilutionFactor * temperatureFactor
      : conductivity
  const area = 1e-5
  const conductance = effectiveConductivity * area / (distance / 100)
  const current = voltage * conductance
  const ionConcentration = ions.reduce((sum, ion) => sum + ion.concentration, 0)
  const lampLevel = current < 0.0002 ? 0 : current < 0.002 ? 1 : current < 0.012 ? 2 : 3

  return {
    conductivity: effectiveConductivity,
    conductance,
    current,
    ionConcentration,
    ionization,
    lampLevel,
    ions,
    dissolvedConcentration: preparedConcentration,
  }
}

export function createParticles(result, solution) {
  const particleTypes = result.ions.length
    ? result.ions.map((ion) => ({
      formula: ion.formula,
      type: ion.formula.includes('⁺') ? 'cation' : 'anion',
      count: Math.max(1, Math.min(7, Math.round(ion.concentration * 30))),
    }))
    : [{ formula: solution.kind === 'water' ? 'H₂O' : solution.formula, type: 'neutral', count: 10 }]

  if (solution.category === 'lemah' && result.ionization < 1) {
    particleTypes.push({ formula: solution.formula, type: 'neutral', count: Math.max(1, Math.min(8, Math.round((1 - result.ionization) * 10))) })
  }

  return particleTypes.flatMap((particle, typeIndex) => (
    Array.from({ length: particle.count }, (_, index) => ({
      id: `${particle.formula}-${typeIndex}-${index}`,
      formula: particle.formula,
      type: particle.type,
      x: 15 + ((index * 37 + typeIndex * 19) % 70),
      y: 25 + ((index * 53 + typeIndex * 31) % 60),
      delay: `${-((index * 0.37 + typeIndex * 0.21) % 4)}s`,
    }))
  ))
}

export function formatMeasurement(value, digits = 3) {
  if (!Number.isFinite(value)) return '—'
  if (value !== 0 && Math.abs(value) < 0.001) return value.toExponential(2)
  return Number(value.toPrecision(digits)).toString()
}
