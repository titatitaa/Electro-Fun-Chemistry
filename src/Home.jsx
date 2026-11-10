import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import HeroSection from './components/HeroSection.jsx'
import TopicCards from './components/TopicCards.jsx'
import ModuleLesson from './components/ModuleLesson.jsx'
import Quiz from './components/Quiz.jsx'
import ExpandedCourse from './components/ExpandedCourse.jsx'
import VirtualLab from './components/VirtualLab.jsx'
import LearningFeatureHub from './components/learning/LearningFeatureHub.jsx'
import { readLearningData, recordLearningActivity, writeLearningData } from './data/learningStore.js'
import { submitQuizSubmission } from './auth.js'
import { quizQuestions } from './data/database.js'

export default function Home({ user }) {
  const [activeNav, setActiveNav] = useState('beranda')
  const [activeModal, setActiveModal] = useState(() => {
    try {
      const savedModal = localStorage.getItem('electrofun_active_modal')
      if (savedModal) return savedModal

      if (typeof window !== 'undefined' && window.location.hash.includes('kuis')) {
        return 'quiz-page'
      }

      const savedAnswers = localStorage.getItem('quiz-answers')
      const wasClosed = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('electrofun_modal_closed') : null
      if (savedAnswers && !wasClosed) {
        const parsed = JSON.parse(savedAnswers)
        if (parsed && Object.keys(parsed).length > 0) {
          return 'quiz-page'
        }
      }
    } catch {}
    return null
  })

  const [quizModuleId, setQuizModuleId] = useState(() => {
    try {
      const savedModuleId = localStorage.getItem('electrofun_quiz_module_id')
      if (savedModuleId) return savedModuleId

      const savedAnswers = localStorage.getItem('quiz-answers')
      if (savedAnswers) {
        const parsed = JSON.parse(savedAnswers)
        const answeredIds = Object.keys(parsed || {})
        if (answeredIds.length > 0) {
          const found = quizQuestions.find((q) => q.id === answeredIds[0])
          if (found) return found.modulId
        }
      }
    } catch {}
    return null
  })
  const [completedModules, setCompletedModules] = useState(() => {
    try {
      const saved = localStorage.getItem('electrofun_progress')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const handleToggleModuleProgress = (moduleId) => {
    try {
      let updated
      if (completedModules.includes(moduleId)) {
        updated = completedModules.filter((id) => id !== moduleId)
      } else {
        updated = [...completedModules, moduleId]
      }
      setCompletedModules(updated)
      localStorage.setItem('electrofun_progress', JSON.stringify(updated))
    } catch {
      // Handle silently
    }
  }

  const handleResetProgress = () => {
    try {
      localStorage.removeItem('electrofun_progress')
      setCompletedModules([])
    } catch {
      // Handle silently
    }
  }

  const handleNavigate = (targetId) => {
    setActiveNav(targetId)
    if (targetId === 'learning-tools') {
      setActiveModal('learning-tools')
      return
    }
    if (targetId === 'kuis') {
      setQuizModuleId(null)
      setActiveModal('quiz-page')
      return
    }
    if (targetId === 'laboratorium') {
      setActiveModal('virtual-lab')
      return
    }
    const elem = document.getElementById(targetId)
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleStartLearning = () => {
    setActiveModal('module-page:modul-1')
  }

  const handleOpenLab = () => {
    setActiveModal('virtual-lab')
  }

  const handleOpenLearningFeatures = (feature = '') => {
    setActiveNav('learning-tools')
    setLearningActivityVersion((value) => value + 1)
    setActiveModal(feature ? `learning-tools:${feature}` : 'learning-tools')
  }

  const handleLearningActivity = () => {
    setLearningActivityVersion((value) => value + 1)
  }

  const handleQuizComplete = (result) => {
    const userId = user?.id || user?.email || 'anonymous'
    const results = readLearningData(userId, 'quiz-results', [])
    const next = [{
      ...result,
      completedAt: new Date().toISOString(),
    }, ...results].slice(0, 100)
    writeLearningData(userId, 'quiz-results', next)
    recordLearningActivity(userId, {
      type: 'quiz',
      title: 'Menyelesaikan kuis',
      detail: `${result.moduleTitle}: ${result.score}/${result.total} jawaban benar.`,
    }, handleLearningActivity)

    // Jika akun terdaftar / siswa anggota kelas, kirim ke database Firestore agar terbaca di Panel Guru
    if (user && !user.isGuest && user.role !== 'guest') {
      submitQuizSubmission({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        classCode: user.classCode || null,
        moduleId: result.moduleId,
        score: result.score,
        totalQuestions: result.total,
        answers: result.answers || {}
      }).catch((err) => console.warn('Gagal sync ke cloud:', err))
    }
  }

  const handleOpenJournal = () => {
    handleOpenLearningFeatures('digital-journal')
  }

  const handleSelectModule = (modId) => {
    setActiveModal(`module-page:${modId}`)
  }

  const handleStartQuiz = (moduleId = null) => {
    setQuizModuleId(moduleId)
    setActiveModal('quiz-page')
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem('electrofun_modal_closed')
      }
    } catch {}
  }

  const closeModal = () => {
    setActiveModal(null)
    setQuizModuleId(null)
    try {
      localStorage.removeItem('electrofun_active_modal')
      localStorage.removeItem('electrofun_quiz_module_id')
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('electrofun_modal_closed', 'true')
      }
    } catch {}
  }

  useEffect(() => {
    try {
      if (activeModal) {
        localStorage.setItem('electrofun_active_modal', activeModal)
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.removeItem('electrofun_modal_closed')
        }
      } else {
        localStorage.removeItem('electrofun_active_modal')
      }
    } catch {}
  }, [activeModal])

  useEffect(() => {
    try {
      if (quizModuleId) {
        localStorage.setItem('electrofun_quiz_module_id', quizModuleId)
      } else {
        localStorage.removeItem('electrofun_quiz_module_id')
      }
    } catch {}
  }, [quizModuleId])

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="electrofun-home-page">
      {/* 1. Navbar */}
      <Navbar
        activeNav={activeNav}
        onNavigate={handleNavigate}
        onStartLearning={handleStartLearning}
        onOpenLearningFeatures={() => handleOpenLearningFeatures()}
      />

      {/* 2. Hero Section */}
      <HeroSection
        onStartLearning={handleStartLearning}
        onOpenLab={handleOpenLab}
      />

      {/* Anonymous Learning Progress Status Bar */}
      <section className="container" style={{ margin: '1rem auto 0' }} aria-label="Status Progres Belajar">
        <div
          style={{
            background: 'var(--color-white)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.15rem 1.75rem',
            boxShadow: 'var(--shadow-sm)',
            border: '1.5px solid rgba(32, 56, 100, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'var(--color-teal-light)',
                color: 'var(--color-teal)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '1rem'
              }}
            >
              {completedModules.length}/3
            </div>
            <div>
              <div style={{ fontSize: '0.94rem', fontWeight: '800', color: 'var(--color-navy)' }}>
                Progres Belajar Siswa (Tersimpan Lokal & Anonim)
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                {completedModules.length === 0
                  ? 'Kamu belum menyelesaikan modul. Ayo mulai perjalanan dari Modul 1!'
                  : completedModules.length === 3
                  ? '🎉 Luar biasa! Seluruh 3 modul konsep larutan telah kamu kuasai.'
                  : `Hebat! ${completedModules.length} modul telah dipelajari. Lanjutkan eksplorasi!`}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn-primary"
              style={{ padding: '0.45rem 1.15rem', fontSize: '0.88rem' }}
              onClick={handleStartLearning}
            >
              Lanjutkan Belajar
            </button>
            {completedModules.length > 0 && (
              <button
                type="button"
                onClick={handleResetProgress}
                style={{
                  fontSize: '0.82rem',
                  color: 'var(--color-text-muted)',
                  textDecoration: 'underline',
                  padding: '0.4rem'
                }}
              >
                Reset Progres
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 3. Three Topic Module Cards */}
      <TopicCards onSelectModule={handleSelectModule} />
      <div className="container">
        <ExpandedCourse userId={user?.id || user?.email || 'anonymous'} onActivity={handleLearningActivity} />
      </div>

      {/* Educational Concept Guide & Misconception Matrix */}
      <section className="container" style={{ marginBottom: '4rem' }} aria-labelledby="matrix-title">
        <div
          style={{
            background: 'var(--color-white)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem 2rem',
            boxShadow: 'var(--shadow-md)',
            border: '2px solid rgba(32, 56, 100, 0.08)'
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2rem' }}>
            <span
              style={{
                display: 'inline-block',
                fontSize: '0.8rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--color-coral)',
                marginBottom: '0.5rem'
              }}
            >
              Pencegahan Miskonsepsi Siswa
            </span>
            <h2 id="matrix-title" style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
              Memahami Fakta vs Miskonsepsi Kimia
            </h2>
            <p style={{ fontSize: '0.94rem', color: 'var(--color-text-muted)' }}>
              Berikut intisari ilmiah penting agar siswa SMA kelas X tidak terjebak dalam kesimpulan keliru:
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem'
            }}
          >
            {/* Fact Card 1 */}
            <div
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-teal-light)',
                borderLeft: '4px solid var(--color-teal)'
              }}
            >
              <div style={{ fontWeight: '800', color: '#0d7e7a', fontSize: '0.94rem', marginBottom: '0.4rem' }}>
                1. Larut ≠ Menghasilkan Ion
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-text-main)', lineHeight: '1.5' }}>
                Zat seperti gula pasir (sukrosa) dapat larut sangat baik dalam air karena kepolarannya, tetapi berada sebagai molekul netral utuh. Hanya zat yang menghasilkan <em>ion-ion bebas bergerak</em> yang dapat menghantarkan listrik.
              </p>
            </div>

            {/* Fact Card 2 */}
            <div
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-orange-light)',
                borderLeft: '4px solid var(--color-orange)'
              }}
            >
              <div style={{ fontWeight: '800', color: '#cc7814', fontSize: '0.94rem', marginBottom: '0.4rem' }}>
                2. Lampu Padam ≠ Otomatis Nonelektrolit
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-text-main)', lineHeight: '1.5' }}>
                Pada larutan elektrolit lemah yang sangat encer atau alat uji yang resistansinya tinggi, lampu mungkin tidak menyala. Selalu amati ada tidaknya gelembung gas di elektrode dan perhatikan sensitivitas alat.
              </p>
            </div>

            {/* Fact Card 3 */}
            <div
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-purple-light)',
                borderLeft: '4px solid var(--color-purple)'
              }}
            >
              <div style={{ fontWeight: '800', color: '#6a4da8', fontSize: '0.94rem', marginBottom: '0.4rem' }}>
                3. Elektrolit Kuat ≠ Selalu Larutan Pekat
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-text-main)', lineHeight: '1.5' }}>
                Kekuatan elektrolit ditentukan oleh derajat ionisasi (seberapa sempurna zat terurai menjadi ion), bukan oleh banyaknya gram zat yang dilarutkan ke dalam volume air.
              </p>
            </div>
          </div>
        </div>
      </section>

      {activeModal?.startsWith('module-page:') && (
        <ModuleLesson
          moduleId={activeModal.split(':')[1]}
          completedModules={completedModules}
          onClose={closeModal}
          onComplete={handleToggleModuleProgress}
          onSelectModule={handleSelectModule}
          onStartQuiz={handleStartQuiz}
          onOpenVirtualLab={handleOpenLab}
        />
      )}
      {activeModal === 'quiz-page' && (
        <Quiz
          key={quizModuleId || 'module-picker'}
          moduleId={quizModuleId}
          onSelectModule={setQuizModuleId}
          onClose={closeModal}
          onComplete={handleQuizComplete}
        />
      )}
      {activeModal === 'virtual-lab' && <VirtualLab user={user} onClose={closeModal} onOpenJournal={handleOpenJournal} />}
      {(activeModal === 'learning-tools' || activeModal?.startsWith('learning-tools:')) && (
        <LearningFeatureHub
          user={user}
          onClose={closeModal}
          onActivity={handleLearningActivity}
          initialFeature={activeModal.includes(':') ? activeModal.split(':')[1] : ''}
          activityVersion={learningActivityVersion}
        />
      )}

      {/* Legacy quick preview */}
      {activeModal && !activeModal.startsWith('module-page:') && !activeModal.startsWith('learning-tools') && activeModal !== 'quiz-page' && activeModal !== 'virtual-lab' && (
        <div
          className="modal-backdrop"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close-btn"
              onClick={closeModal}
              aria-label="Tutup dialog"
            >
              ✕
            </button>

            {/* Content for Modul 1 */}
            {activeModal === 'modul-1' && (
              <div>
                <span className="apparatus-status-pill strong" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>
                  Modul 1 • Pengenalan Konsep
                </span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-navy)', marginBottom: '0.75rem' }}>
                  Kenali Larutan di Sekitar Kita
                </h3>
                <p style={{ fontSize: '0.94rem', color: 'var(--color-text-main)', lineHeight: '1.6', marginBottom: '1rem' }}>
                  Larutan adalah campuran homogen dari dua atau lebih zat. Zat yang jumlahnya lebih sedikit disebut <strong>zat terlarut (solute)</strong>, sedangkan zat pendispersi disebut <strong>pelarut (solvent)</strong>, biasanya air (H₂O).
                </p>

                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: '700', color: 'var(--color-navy)', marginBottom: '0.4rem' }}>
                    Perbandingan Inti:
                  </div>
                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                    <li><strong>Larutan Garam (NaCl):</strong> Mengalami disosiasi sempurna menjadi ion Na⁺ dan Cl⁻. Menghantarkan arus listrik (Elektrolit).</li>
                    <li><strong>Larutan Gula (C₁₂H₂₂O₁₁):</strong> Larut sebagai molekul netral yang dikelilingi molekul air. Tidak ada ion bebas (Nonelektrolit).</li>
                  </ul>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => handleToggleModuleProgress('modul-1')}
                  >
                    {completedModules.includes('modul-1') ? '✓ Sudah Diselesaikan' : 'Tandai Selesai'}
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setActiveModal('modul-2')}
                  >
                    Lanjut Modul 2 →
                  </button>
                </div>
              </div>
            )}

            {/* Content for Modul 2 & Lab Guide */}
            {(activeModal === 'modul-2' || activeModal === 'lab-guide') && (
              <div>
                <span className="apparatus-status-pill weak" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>
                  Modul 2 • Panduan Laboratorium
                </span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-navy)', marginBottom: '0.75rem' }}>
                  Laboratorium Mini: Uji Daya Hantar Listrik
                </h3>
                <p style={{ fontSize: '0.94rem', color: 'var(--color-text-main)', lineHeight: '1.6', marginBottom: '1rem' }}>
                  Alat uji daya hantar listrik terdiri dari sumber arus searah (baterai), lampu indikator, kabel penghantar tembaga, dan dua batang elektrode yang dicelupkan ke dalam gelas kimia berisi larutan.
                </p>

                <div style={{ background: 'var(--color-blue-panel)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                  <div style={{ fontWeight: '700', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
                    Tabel Interpretasi Pengamatan:
                  </div>
                  <table style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(32,56,100,0.2)', textAlign: 'left' }}>
                        <th style={{ padding: '0.35rem 0.2rem' }}>Sampel</th>
                        <th style={{ padding: '0.35rem 0.2rem' }}>Lampu</th>
                        <th style={{ padding: '0.35rem 0.2rem' }}>Gelembung</th>
                        <th style={{ padding: '0.35rem 0.2rem' }}>Kategori</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '0.35rem 0.2rem' }}>NaCl / HCl</td>
                        <td style={{ padding: '0.35rem 0.2rem' }}>Terang</td>
                        <td style={{ padding: '0.35rem 0.2rem' }}>Banyak</td>
                        <td style={{ padding: '0.35rem 0.2rem', color: 'var(--color-teal)', fontWeight: '700' }}>Elektrolit Kuat</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '0.35rem 0.2rem' }}>CH₃COOH</td>
                        <td style={{ padding: '0.35rem 0.2rem' }}>Redup / Padam</td>
                        <td style={{ padding: '0.35rem 0.2rem' }}>Sedikit</td>
                        <td style={{ padding: '0.35rem 0.2rem', color: 'var(--color-orange)', fontWeight: '700' }}>Elektrolit Lemah</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '0.35rem 0.2rem' }}>Sukrosa / Urea</td>
                        <td style={{ padding: '0.35rem 0.2rem' }}>Padam</td>
                        <td style={{ padding: '0.35rem 0.2rem' }}>Tidak ada</td>
                        <td style={{ padding: '0.35rem 0.2rem', color: 'var(--color-purple)', fontWeight: '700' }}>Nonelektrolit</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => handleToggleModuleProgress('modul-2')}
                  >
                    {completedModules.includes('modul-2') ? '✓ Sudah Diselesaikan' : 'Tandai Selesai'}
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setActiveModal('modul-3')}
                  >
                    Lanjut Modul 3 →
                  </button>
                </div>
              </div>
            )}

            {/* Content for Modul 3 */}
            {activeModal === 'modul-3' && (
              <div>
                <span className="apparatus-status-pill non" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>
                  Modul 3 • Partikel Submikroskopik
                </span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-navy)', marginBottom: '0.75rem' }}>
                  Jelajahi Ion: Disosiasi vs Ionisasi
                </h3>
                <p style={{ fontSize: '0.94rem', color: 'var(--color-text-main)', lineHeight: '1.6', marginBottom: '1rem' }}>
                  Perbedaan mendasar antara senyawa ionik dan kovalen polar saat dilarutkan dalam air:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{ padding: '0.85rem', background: '#f8fafc', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: '700', color: 'var(--color-teal)', fontSize: '0.88rem' }}>
                      Disosiasi (Penguraian Ion):
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', margin: '0.2rem 0', color: 'var(--color-navy)' }}>
                      NaCl(s) → Na⁺(aq) + Cl⁻(aq)
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                      Terjadi pada senyawa ionik. Ion sudah ada di dalam kisi kristal padatan, lalu terpisah ketika dikelilingi molekul air.
                    </p>
                  </div>

                  <div style={{ padding: '0.85rem', background: '#f8fafc', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: '700', color: 'var(--color-orange)', fontSize: '0.88rem' }}>
                      Ionisasi Sebagian (Kesetimbangan):
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', margin: '0.2rem 0', color: 'var(--color-navy)' }}>
                      CH₃COOH(aq) + H₂O(l) ⇌ H₃O⁺(aq) + CH₃COO⁻(aq)
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                      Terjadi pada senyawa kovalen polar tertentu. Pembentukan ion hanya sebagian kecil dan membentuk sistem kesetimbangan kimia.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => handleToggleModuleProgress('modul-3')}
                  >
                    {completedModules.includes('modul-3') ? '✓ Sudah Diselesaikan' : 'Tandai Selesai'}
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => handleStartQuiz('modul-3')}
                  >
                    Uji Pemahaman di Kuis →
                  </button>
                </div>
              </div>
            )}

            {/* Content for Kuis */}
            {activeModal === 'kuis' && (
              <Quiz
                moduleId={quizModuleId}
                onSelectModule={setQuizModuleId}
                onClose={closeModal}
              />
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer-wrap">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-brand-title">
                ElectroFun Chemistry
              </div>
              <p className="footer-brand-desc">
                Media pembelajaran kimia materi Larutan Elektrolit dan Nonelektrolit untuk siswa SMA kelas X (Fase E).
                Dikembangkan dengan prinsip <em>colorful, joyful, and meaningful</em> untuk menghadirkan pemahaman sains yang mendalam dan bebas miskonsepsi.
              </p>
              <div className="footer-palette-dots" aria-label="Identitas Palet Warna">
                <span className="palette-dot" style={{ background: '#FFF9EF' }} title="Ivory (#FFF9EF)" />
                <span className="palette-dot" style={{ background: '#203864' }} title="Navy (#203864)" />
                <span className="palette-dot" style={{ background: '#16A6A1' }} title="Teal (#16A6A1)" />
                <span className="palette-dot" style={{ background: '#F4A340' }} title="Orange (#F4A340)" />
                <span className="palette-dot" style={{ background: '#8A6DCE' }} title="Purple (#8A6DCE)" />
                <span className="palette-dot" style={{ background: '#F26B5B' }} title="Coral (#F26B5B)" />
              </div>
            </div>

            <div>
              <div className="footer-col-title">Navigasi Materi</div>
              <ul className="footer-link-list">
                <li><a href="#beranda" onClick={(e) => { e.preventDefault(); handleNavigate('beranda'); }}>Beranda</a></li>
                <li><a href="#materi" onClick={(e) => { e.preventDefault(); handleNavigate('materi'); }}>Kenali Larutan (Modul 1)</a></li>
                <li><a href="#laboratorium" onClick={(e) => { e.preventDefault(); handleNavigate('laboratorium'); }}>Laboratorium Mini (Modul 2)</a></li>
                <li><a href="#materi" onClick={(e) => { e.preventDefault(); handleSelectModule('modul-3'); }}>Jelajahi Ion (Modul 3)</a></li>
                <li><a href="#kuis" onClick={(e) => { e.preventDefault(); handleStartQuiz(); }}>Kuis Evaluasi</a></li>
              </ul>
            </div>

            <div>
              <div className="footer-col-title">Standar Kurikulum</div>
              <p style={{ fontSize: '0.88rem', color: '#c0cee0', lineHeight: '1.6', marginBottom: '0.75rem' }}>
                Kurikulum Merdeka — Kimia SMA Fase E (Capaian Pembelajaran Pemahaman Kimia). Menghubungkan fenomena makroskopik, submikroskopik, dan representasi simbolik.
              </p>
              <div style={{ fontSize: '0.8rem', color: '#8da2be' }}>
                Privasi: Penyimpanan progres anonim melalui perangkat lokal tanpa pengumpulan data pribadi.
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div>
              © 2026 ElectroFun Chemistry. Hak Cipta Dilindungi. Media Edukasi Kimia SMA.
            </div>
            <div>
              Dirancang untuk Siswa SMA Kelas X • Ramah Seluler & Komputer
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
