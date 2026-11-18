import { lazy, Suspense, useState } from 'react'
import './LearningFeatureHub.css'

const ConceptMap = lazy(() => import('./ConceptMap.jsx'))
const DiagnosticTest = lazy(() => import('./DiagnosticTest.jsx'))
const ChemistryMission = lazy(() => import('./ChemistryMission.jsx'))
const RealLifeCases = lazy(() => import('./RealLifeCases.jsx'))
const MolecularExplorer = lazy(() => import('./MolecularExplorer.jsx'))
const LearningProgress = lazy(() => import('./LearningProgress.jsx'))
const FlashcardGlossary = lazy(() => import('./FlashcardGlossary.jsx'))
const DigitalChemistryJournal = lazy(() => import('./DigitalChemistryJournal.jsx'))

const featureGroups = [
  {
    label: 'Belajar',
    features: [
      { id: 'flashcards', title: 'Flashcard & Glosarium', description: 'Ulangi istilah inti, rumus, definisi, dan contoh.' },
      { id: 'molecular-explorer', title: 'Molecular Explorer', description: 'Jelajahi molekul, ion, hidrasi, dan representasi partikel.' },
      { id: 'concept-map', title: 'Concept Map', description: 'Susun, hubungkan, simpan, dan evaluasi peta konsep.' },
    ],
  },
  {
    label: 'Eksperimen',
    features: [
      { id: 'digital-journal', title: 'Jurnal Praktikum', description: 'Simpan catatan penyelidikan dan tautkan pengamatan laboratorium.' },
    ],
  },
  {
    label: 'Evaluasi',
    features: [
      { id: 'diagnostic', title: 'Tes Diagnostik', description: 'Kenali pemahaman dan miskonsepsi melalui tes tiga tingkat.' },
      { id: 'mission', title: 'Chemistry Mission', description: 'Selesaikan lima misi berbasis fenomena dan bukti.' },
    ],
  },
  {
    label: 'Perkembangan',
    features: [
      { id: 'progress', title: 'Progres Belajar', description: 'Lihat ringkasan hasil dan aktivitas yang benar-benar tersimpan.' },
      { id: 'real-life-cases', title: 'Studi Kasus', description: 'Analisis penerapan larutan elektrolit di kehidupan sehari-hari.' },
    ],
  },
]

const featureTitles = Object.fromEntries(featureGroups.flatMap((group) => group.features.map(({ id, title }) => [id, title])))

export default function LearningFeatureHub({ user, onClose, onActivity, initialFeature = '', activityVersion = 0 }) {
  const [activeFeature, setActiveFeature] = useState(initialFeature)
  const userId = user?.id || user?.email || 'anonymous'

  const componentProps = { userId, user, onActivity }
  const renderFeature = () => {
    switch (activeFeature) {
      case 'concept-map': return <ConceptMap {...componentProps} />
      case 'diagnostic': return <DiagnosticTest {...componentProps} />
      case 'mission': return <ChemistryMission {...componentProps} />
      case 'real-life-cases': return <RealLifeCases {...componentProps} />
      case 'molecular-explorer': return <MolecularExplorer {...componentProps} />
      case 'progress': return <LearningProgress {...componentProps} />
      case 'flashcards': return <FlashcardGlossary {...componentProps} />
      case 'digital-journal': return <DigitalChemistryJournal {...componentProps} />
      default: return null
    }
  }

  return (
    <div className="learning-feature-hub" data-activity-version={activityVersion} role="dialog" aria-modal="true" aria-labelledby="learning-feature-hub-title">
      <header className="learning-feature-hub-header">
        <button type="button" className="learning-feature-hub-back" onClick={activeFeature ? () => setActiveFeature('') : onClose}>
          {activeFeature ? '← Semua fitur' : '← Kembali'}
        </button>
        <div><span>ELECTROFUN CHEMISTRY • RUANG BELAJAR</span><strong id="learning-feature-hub-title">{activeFeature ? featureTitles[activeFeature] : 'Fitur Pembelajaran'}</strong></div>
        <button type="button" className="learning-feature-hub-close" onClick={onClose} aria-label="Tutup fitur pembelajaran">Tutup ×</button>
      </header>
      <main className="learning-feature-hub-content">
        {activeFeature
          ? <div className="learning-feature-view"><Suspense fallback={<p role="status">Menyiapkan fitur pembelajaran...</p>}>{renderFeature()}</Suspense></div>
          : <section className="learning-feature-catalog" aria-label="Daftar fitur pembelajaran">
            <div className="learning-feature-catalog-intro">
              <span>JELAJAHI • LATIH • REFLEKSIKAN</span>
              <h1>Ruang belajar ElectroFun</h1>
              <p>Pilih alat belajar. Setiap fitur mencatat aktivitas pada profil ini di penyimpanan lokal perangkat.</p>
            </div>
            {featureGroups.map((group) => (
              <section className="learning-feature-group" aria-labelledby={`learning-feature-group-${group.label}`} key={group.label}>
                <h2 id={`learning-feature-group-${group.label}`}>{group.label}</h2>
                <div className="learning-feature-cards">
                  {group.features.map((feature) => (
                    <button type="button" className="learning-feature-card" key={feature.id} onClick={() => setActiveFeature(feature.id)}>
                      <strong>{feature.title}</strong><span>{feature.description}</span><i aria-hidden="true">Buka fitur →</i>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </section>}
      </main>
    </div>
  )
}
