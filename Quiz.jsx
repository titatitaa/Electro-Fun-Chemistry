import { useEffect, useMemo, useRef, useState } from 'react'
import { courseModules, quizQuestions } from './src/data/database.js'
import { TEACHER_CONFIG } from './src/config/teacherConfig.js'
import './src/components/Quiz.css'

export function getSavedQuizState(moduleId) {
  if (!moduleId) return null
  try {
    const raw = localStorage.getItem(`quiz_${moduleId}`) || localStorage.getItem(`quiz-${moduleId}`)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object') {
        return parsed
      }
    }
  } catch {
    // Ignore error
  }
  return null
}

function getQuestionText(q) {
  return q?.question || q?.pertanyaan || ''
}

function getQuestionOptions(q) {
  const raw = q?.options || q?.opsi || []
  return raw.map((opt, idx) => {
    if (typeof opt === 'string') {
      const id = String.fromCharCode(65 + idx)
      return { id, text: opt }
    }
    return {
      id: opt.id || String.fromCharCode(65 + idx),
      text: opt.text || opt.teks || opt.label || '',
    }
  })
}

function getCorrectAnswer(q) {
  return q?.answer || q?.jawabanBenar || ''
}

function getExplanation(q) {
  return q?.explanation || q?.pembahasan || ''
}

/**
 * 2. SANITIZE: Menghapus jawabanBenar, answer, pembahasan, caraPengerjaan, rumus
 * sebelum soal dipakai saat siswa mengerjakan kuis.
 * Yang boleh dipakai saat mengerjakan hanya: id, soal, pilihan jawaban, modulId.
 */
export function sanitizeQuestion(q) {
  if (!q) return null
  return {
    id: q.id,
    modulId: q.modulId,
    pertanyaan: q.pertanyaan || q.question || '',
    question: q.question || q.pertanyaan || '',
    opsi: q.opsi || q.options || [],
    options: q.options || q.opsi || [],
  }
}

export default function Quiz({
  moduleId = null,
  questions: propQuestions = null,
  onSelectModule = null,
  onClose = null,
  onComplete = null,
}) {
  const module = courseModules.find((item) => item.id === moduleId)

  // 1. FILTER DRAF: Filter hanya soal yang status === 'published'.
  // Soal draft tidak boleh tampil dan tidak boleh masuk ke daftar soal aktif.
  const publishedQuestions = useMemo(() => {
    let rawList = []
    if (Array.isArray(propQuestions) && propQuestions.length > 0) {
      rawList = propQuestions
    } else if (moduleId) {
      rawList = quizQuestions.filter((q) => q.modulId === moduleId)
    }
    return rawList.filter((q) => q.status === 'published')
  }, [propQuestions, moduleId])

  // 2. SANITIZE: Gunakan versi tersanitasi untuk pengerjaan aktif
  const sanitizedQuestions = useMemo(() => {
    return publishedQuestions.map(sanitizeQuestion)
  }, [publishedQuestions])

  const questionsList = sanitizedQuestions

  const savedState = getSavedQuizState(moduleId)

  const [questionIndex, setQuestionIndex] = useState(() => {
    const idx = savedState?.questionIndex
    return typeof idx === 'number' && !isNaN(idx) && idx >= 0 ? idx : 0
  })

  // 3. LOCALSTORAGE: Hanya simpan { questionId, selectedAnswerId }
  const [selectedAnswers, setSelectedAnswers] = useState(() => {
    const map = {}
    if (Array.isArray(savedState?.answers)) {
      savedState.answers.forEach((item) => {
        if (item?.questionId && item?.selectedAnswerId) {
          map[item.questionId] = item.selectedAnswerId
        }
      })
    } else if (savedState?.userAnswers && typeof savedState.userAnswers === 'object') {
      // Dukungan kompatibilitas backward dari state lama jika ada
      Object.entries(savedState.userAnswers).forEach(([k, v]) => {
        if (v?.selectedOptionId) {
          map[k] = v.selectedOptionId
        }
      })
    }
    return map
  })

  const [finished, setFinished] = useState(() => {
    return Boolean(savedState?.finished)
  })

  const [saveError, setSaveError] = useState('')
  const completionReported = useRef(false)

  // 3. LOCALSTORAGE: Jangan pernah simpan correctAnswerId, pembahasan, rumus, caraPengerjaan ke localStorage.
  // Yang boleh disimpan hanya: { questionId, selectedAnswerId } beserta index progres.
  useEffect(() => {
    if (!moduleId) return
    try {
      const answersToSave = Object.entries(selectedAnswers).map(([qId, ansId]) => ({
        questionId: qId,
        selectedAnswerId: ansId,
      }))
      const stateToSave = {
        questionIndex,
        answers: answersToSave,
        finished,
      }
      localStorage.setItem(`quiz_${moduleId}`, JSON.stringify(stateToSave))
      localStorage.setItem(`quiz-${moduleId}`, JSON.stringify(stateToSave))
    } catch {
      // Ignore error
    }
  }, [moduleId, questionIndex, selectedAnswers, finished])

  // 4. PEMBAHASAN DITUNDA: Evaluasi dan pembahasan HANYA dihitung saat kuis telah disubmit (finished === true).
  // Selama pengerjaan berlangsung, correctAnswer tidak pernah dihitung di memori komponen.
  // TODO Tahap 3: pindahkan kunci jawaban ke Firebase / server agar tidak ter-bundle ke client
  const evaluatedData = useMemo(() => {
    if (!finished || publishedQuestions.length === 0) {
      return { score: 0, answers: {} }
    }
    let calculatedScore = 0
    const evaluated = {}

    publishedQuestions.forEach((q, idx) => {
      const qId = q.id || `question-${idx}`
      const chosenOptionId = selectedAnswers[qId] || null
      const qOptions = getQuestionOptions(q)
      const chosenOptionObj = qOptions.find((opt) => opt.id === chosenOptionId)
      const correctKey = getCorrectAnswer(q)
      const isCorrect = Boolean(chosenOptionId && chosenOptionId === correctKey)

      if (isCorrect) {
        calculatedScore += 1
      }

      evaluated[qId] = {
        questionId: qId,
        questionText: getQuestionText(q),
        selectedOptionId: chosenOptionId,
        selectedOptionText: chosenOptionObj?.text || chosenOptionId || '',
        optionsSnapshot: qOptions.map((opt) => ({ id: opt.id, teks: opt.text })),
        correctAnswerId: correctKey,
        isCorrect,
        pembahasan: getExplanation(q),
        caraPengerjaan: q.caraPengerjaan || '',
        rumus: q.rumus || '',
        questionVersion: TEACHER_CONFIG.activeQuestionVersion,
      }
    })

    return { score: calculatedScore, answers: evaluated }
  }, [finished, publishedQuestions, selectedAnswers])

  const score = evaluatedData.score
  const evaluatedResults = evaluatedData.answers

  // Laporkan hasil ke handler onComplete (sinkronisasi nilai ke Firebase/guru)
  useEffect(() => {
    if (finished && typeof onComplete === 'function' && !completionReported.current && publishedQuestions.length > 0) {
      completionReported.current = true
      Promise.resolve().then(() => onComplete({
        moduleId,
        moduleTitle: module?.title || moduleId,
        score: evaluatedData.score,
        total: publishedQuestions.length,
        questionVersion: TEACHER_CONFIG.activeQuestionVersion,
        attemptType: 'evaluation',
        answers: evaluatedData.answers,
      })).catch((error) => {
        setSaveError(error instanceof Error ? error.message : 'Hasil kuis tidak dapat disimpan.')
      })
    }
  }, [finished, onComplete, moduleId, module?.title, publishedQuestions.length, evaluatedData])

  // 4. PEMBAHASAN DITUNDA: Selama mengerjakan, jangan hitung correctAnswer di memori komponen.
  // currentQuestion adalah sanitizedQuestion (tanpa kunci jawaban & tanpa pembahasan)
  const currentQuestion = questionsList[questionIndex]
  const options = getQuestionOptions(currentQuestion)
  const currentSelected = currentQuestion ? selectedAnswers[currentQuestion.id] : null
  const isLastQuestion = questionIndex === questionsList.length - 1
  const isFinished = finished || (questionsList.length > 0 && questionIndex >= questionsList.length)

  const handleSelectOption = (optionId) => {
    if (!currentQuestion) return
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }))
  }

  const handleNext = () => {
    if (!isLastQuestion) {
      setQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (questionIndex > 0) {
      setQuestionIndex((prev) => prev - 1)
    }
  }

  // 4. PEMBAHASAN DITUNDA: Tombol Submit / Lihat Hasil memicu status finished
  const handleSubmitQuiz = () => {
    setFinished(true)
  }

  const handleRestart = () => {
    try {
      if (moduleId) {
        localStorage.removeItem(`quiz_${moduleId}`)
        localStorage.removeItem(`quiz-${moduleId}`)
      }
    } catch {
      // Ignore error
    }
    setQuestionIndex(0)
    setSelectedAnswers({})
    setFinished(false)
    setSaveError('')
    completionReported.current = false
  }

  if (!module && (!propQuestions || propQuestions.length === 0)) {
    return (
      <div className="quiz-page" role="dialog" aria-modal="true" aria-labelledby="quiz-picker-title">
        <header className="quiz-page-header">
          {onClose && (
            <button type="button" className="quiz-close-button" onClick={onClose}>
              ← Kembali ke beranda
            </button>
          )}
          <span>Pilih modul untuk mulai mengerjakan</span>
        </header>
        <main className="quiz-page-content">
          <div className="quiz-picker-heading">
            <span className="apparatus-status-pill weak">Evaluasi Mandiri</span>
            <h1 id="quiz-picker-title">Kuis Tiap Modul</h1>
            <p>Pilih modul. Setiap kuis berisi soal khusus dan pembahasan sesuai materi modul tersebut.</p>
          </div>
          <div className="quiz-module-grid">
            {courseModules.map((courseModule) => (
              <button
                type="button"
                className="quiz-module-card"
                key={courseModule.id}
                onClick={() => onSelectModule?.(courseModule.id)}
              >
                <span>
                  {courseModule.number} • {quizQuestions.filter((item) => item.modulId === courseModule.id && item.status === 'published').length} soal
                </span>
                <strong>{courseModule.title}</strong>
                <span className="quiz-module-action">Mulai kuis →</span>
              </button>
            ))}
          </div>
        </main>
      </div>
    )
  }

  if (questionsList.length === 0) {
    return (
      <div className="quiz-page" role="dialog" aria-modal="true" aria-labelledby="quiz-empty-title">
        <header className="quiz-page-header">
          {onSelectModule && (
            <button type="button" className="quiz-close-button" onClick={() => onSelectModule(null)}>
              ← Pilih modul
            </button>
          )}
          {onClose && (
            <button type="button" className="quiz-close-button" onClick={onClose}>
              Tutup kuis
            </button>
          )}
        </header>
        <main className="quiz-page-content">
          <h1 id="quiz-empty-title">Soal kuis belum tersedia</h1>
          <p>Silakan pilih modul lain atau kembali ke beranda.</p>
        </main>
      </div>
    )
  }

  // 4. PEMBAHASAN DITUNDA: Tampilan hasil dan pembahasan HANYA muncul SETELAH kuis selesai disubmit
  if (isFinished) {
    const total = publishedQuestions.length
    return (
      <div className="quiz-page" role="dialog" aria-modal="true" aria-labelledby="quiz-title">
        <header className="quiz-page-header">
          {onClose && (
            <button type="button" className="quiz-close-button" onClick={onClose}>
              ← Kembali ke beranda
            </button>
          )}
          <span>{module?.number || 'Kuis'} • Hasil & Pembahasan</span>
          {onSelectModule && (
            <button type="button" className="quiz-close-button" onClick={() => onSelectModule(null)}>
              Pilih modul lain
            </button>
          )}
        </header>
        <main className="quiz-page-content">
          <section className="quiz" aria-labelledby="quiz-title">
            <div className="quiz-heading">
              <span className="apparatus-status-pill weak">{module?.number || 'Kuis'} • Selesai</span>
              <h1 id="quiz-title">Kuis Selesai!</h1>
              <p>
                Skor kamu <strong>{score} dari {total}</strong> ({total > 0 ? Math.round((score / total) * 100) : 0}%).
              </p>
            </div>

            <div className="quiz-completion" role="status">
              {score === total
                ? 'Luar biasa, semua soal berhasil dijawab dengan benar!'
                : 'Terus berlatih untuk memperdalam pemahaman konsep kimia! Pelajari pembahasan di bawah ini.'}
            </div>

            {saveError && <p className="quiz-save-error" role="alert">{saveError}</p>}

            <div className="quiz-actions" style={{ justifyContent: 'center', marginBottom: '2.5rem' }}>
              <button type="button" className="btn-primary" onClick={handleRestart}>
                Ulangi Kuis
              </button>
            </div>

            {/* Rincian Jawaban & Pembahasan Mendalam (Hanya tampil setelah submit) */}
            <div className="quiz-review-section">
              <h2 style={{ color: 'var(--color-navy)', fontSize: '1.3rem', marginBottom: '1.2rem', fontWeight: 800 }}>
                Rincian Jawaban & Pembahasan
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {publishedQuestions.map((q, idx) => {
                  const evalData = evaluatedResults[q.id] || {}
                  const isCorrect = Boolean(evalData.isCorrect)
                  const qOptions = getQuestionOptions(q)
                  const chosenId = evalData.selectedOptionId
                  const correctKey = evalData.correctAnswerId || getCorrectAnswer(q)
                  const explanation = evalData.pembahasan || getExplanation(q)
                  const cara = evalData.caraPengerjaan || q.caraPengerjaan
                  const rumus = evalData.rumus || q.rumus

                  return (
                    <div
                      key={q.id || idx}
                      className="quiz-question-card"
                      style={{ borderLeft: `5px solid ${isCorrect ? 'var(--color-green-feedback, #22c55e)' : 'var(--color-coral, #f26b5b)'}` }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                        <span style={{ fontWeight: 800, color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                          Soal #{idx + 1} • {q.konsep ? `Konsep: ${q.konsep}` : ''}
                        </span>
                        <span
                          className={`apparatus-status-pill ${isCorrect ? 'strong' : 'weak'}`}
                          style={{
                            background: isCorrect ? 'var(--color-green-feedback)' : 'var(--color-coral-light)',
                            color: isCorrect ? '#14532d' : '#8b2f26',
                            fontWeight: 700,
                            padding: '0.25rem 0.65rem',
                            borderRadius: '999px',
                            fontSize: '0.8rem',
                          }}
                        >
                          {isCorrect ? '✓ Benar' : '✗ Salah'}
                        </span>
                      </div>

                      <p className="quiz-question" style={{ fontSize: '1.05rem', marginBottom: '1rem' }}>
                        {getQuestionText(q)}
                      </p>

                      <div className="quiz-options" style={{ marginBottom: '1rem' }}>
                        {qOptions.map((opt) => {
                          const isChosen = chosenId === opt.id
                          const isRight = opt.id === correctKey
                          let optClass = 'quiz-option'
                          if (isRight) {
                            optClass += ' correct'
                          } else if (isChosen && !isCorrect) {
                            optClass += ' wrong'
                          }

                          return (
                            <div
                              key={opt.id}
                              className={optClass}
                              style={{ cursor: 'default' }}
                            >
                              <span className="quiz-option-id">{opt.id}</span>
                              <span className="quiz-option-text">
                                {opt.text}
                                {isChosen && ' — (Jawaban Siswa)'}
                                {isRight && ' — (Kunci Jawaban)'}
                              </span>
                            </div>
                          )
                        })}
                      </div>

                      {/* Pembahasan, Cara Pengerjaan, dan Rumus */}
                      <div className="quiz-feedback-container" style={{ marginTop: '0.8rem' }}>
                        {explanation && (
                          <div className="quiz-explanation">
                            <div>
                              <h2>Pembahasan</h2>
                              <p>{explanation}</p>
                            </div>
                            {(cara || rumus) && (
                              <div className="quiz-solution">
                                {cara && (
                                  <>
                                    <h2>Cara pengerjaan</h2>
                                    <p>{cara}</p>
                                  </>
                                )}
                                {rumus && <p className="quiz-formula">{rumus}</p>}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="quiz-actions" style={{ justifyContent: 'center', marginTop: '2rem' }}>
                <button type="button" className="btn-primary" onClick={handleRestart}>
                  Ulangi Kuis
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    )
  }

  // Tampilan saat pengerjaan kuis aktif (soal tersanitasi, tanpa kunci jawaban di memori)
  const answeredCount = Object.keys(selectedAnswers).length

  return (
    <div className="quiz-page" role="dialog" aria-modal="true" aria-labelledby="quiz-title">
      <header className="quiz-page-header">
        {onClose && (
          <button type="button" className="quiz-close-button" onClick={onClose}>
            ← Kembali ke beranda
          </button>
        )}
        <span>{module?.number || 'Kuis'} • Evaluasi Mandiri</span>
        {onSelectModule && (
          <button type="button" className="quiz-close-button" onClick={() => onSelectModule(null)}>
            Pilih modul lain
          </button>
        )}
      </header>
      <main className="quiz-page-content">
        <section className="quiz" aria-labelledby="quiz-title">
          <div className="quiz-heading">
            <span className="apparatus-status-pill weak">{module?.number || 'Kuis'} • Soal Konseptual</span>
            <h1 id="quiz-title">{module?.title || 'Evaluasi Pembelajaran'}</h1>
            <p>Pilih salah satu jawaban yang paling tepat untuk setiap pertanyaan.</p>
          </div>

          <div className="quiz-progress" aria-label={`Soal ${questionIndex + 1} dari ${questionsList.length}`}>
            <div className="quiz-progress-label">
              <span>Soal {questionIndex + 1} dari {questionsList.length}</span>
              <span>Terjawab: {answeredCount} dari {questionsList.length}</span>
            </div>
            <div
              className="quiz-progress-track"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={questionsList.length}
              aria-valuenow={questionIndex + 1}
            >
              <div
                className="quiz-progress-fill"
                style={{ width: `${((questionIndex + 1) / questionsList.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="quiz-question-card">
            <p className="quiz-question">{getQuestionText(currentQuestion)}</p>
            <div className="quiz-options quiz-options-list" role="group" aria-label="Pilihan Jawaban">
              {options.map((option) => {
                const isSelected = currentSelected === option.id
                let btnClass = 'quiz-option'
                if (isSelected) {
                  btnClass += ' selected'
                }

                return (
                  <button
                    type="button"
                    key={option.id}
                    className={btnClass}
                    onClick={() => handleSelectOption(option.id)}
                  >
                    <span className="quiz-option-id">{option.id}</span>
                    <span className="quiz-option-text">{option.text}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="quiz-actions">
            {questionIndex > 0 ? (
              <button
                type="button"
                className="btn-secondary"
                onClick={handlePrev}
              >
                ← Soal Sebelumnya
              </button>
            ) : (
              <div />
            )}

            <div className="quiz-actions-right">
              {!isLastQuestion ? (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleNext}
                  disabled={!currentSelected}
                >
                  Soal Berikutnya →
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleSubmitQuiz}
                  disabled={!currentSelected}
                >
                  Submit / Lihat Hasil
                </button>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
