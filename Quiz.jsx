import { useEffect, useMemo, useState } from 'react'
import { courseModules, quizQuestions } from './src/data/database.js'
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

export default function Quiz({
  moduleId = null,
  questions: propQuestions = null,
  onSelectModule = null,
  onClose = null,
  onComplete = null,
}) {
  const module = courseModules.find((item) => item.id === moduleId)

  const questionsList = useMemo(() => {
    if (Array.isArray(propQuestions) && propQuestions.length > 0) {
      return propQuestions
    }
    if (moduleId) {
      return quizQuestions.filter((q) => q.modulId === moduleId)
    }
    return []
  }, [propQuestions, moduleId])

  const savedState = getSavedQuizState(moduleId)

  const [questionIndex, setQuestionIndex] = useState(() => {
    const idx = savedState?.questionIndex
    return typeof idx === 'number' && !isNaN(idx) && idx >= 0 ? idx : 0
  })

  const [selectedOption, setSelectedOption] = useState(() => {
    return savedState?.selectedOption ?? null
  })

  const [isChecked, setIsChecked] = useState(() => {
    return Boolean(savedState?.isChecked)
  })

  const [isCorrect, setIsCorrect] = useState(() => {
    return Boolean(savedState?.isCorrect)
  })

  const [score, setScore] = useState(() => {
    const s = savedState?.score
    return typeof s === 'number' && !isNaN(s) && s >= 0 ? s : 0
  })

  const [finished, setFinished] = useState(() => {
    return Boolean(savedState?.finished)
  })

  // Simpan ke localStorage dengan key `quiz_${moduleId}` setiap kali state berubah
  useEffect(() => {
    if (!moduleId) return
    try {
      const stateToSave = {
        questionIndex,
        selectedOption,
        isChecked,
        isCorrect,
        score,
        finished,
      }
      localStorage.setItem(`quiz_${moduleId}`, JSON.stringify(stateToSave))
      localStorage.setItem(`quiz-${moduleId}`, JSON.stringify(stateToSave))
    } catch {
      // Ignore error
    }
  }, [moduleId, questionIndex, selectedOption, isChecked, isCorrect, score, finished])

  const currentQuestion = questionsList[questionIndex]
  const options = getQuestionOptions(currentQuestion)
  const correctAnswer = getCorrectAnswer(currentQuestion)
  const explanation = getExplanation(currentQuestion)
  const isLastQuestion = questionIndex === questionsList.length - 1
  const isFinished = finished || (questionsList.length > 0 && questionIndex >= questionsList.length)

  const handleCheckAnswer = () => {
    if (!selectedOption || !currentQuestion) return

    const correct = selectedOption === correctAnswer
    setIsChecked(true)
    setIsCorrect(correct)

    if (correct) {
      setScore((prev) => prev + 1)
    }
  }

  const handleNext = () => {
    if (!isLastQuestion) {
      setQuestionIndex((prev) => prev + 1)
      setSelectedOption(null)
      setIsChecked(false)
      setIsCorrect(false)
    } else {
      const finalScore = score
      setFinished(true)
      if (typeof onComplete === 'function') {
        const scoreWrapper = new Number(finalScore)
        scoreWrapper.score = finalScore
        scoreWrapper.total = questionsList.length
        scoreWrapper.moduleId = moduleId
        scoreWrapper.moduleTitle = module?.title || moduleId
        onComplete(scoreWrapper)
      }
    }
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
    setSelectedOption(null)
    setIsChecked(false)
    setIsCorrect(false)
    setScore(0)
    setFinished(false)
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
                  {courseModule.number} • {quizQuestions.filter((item) => item.modulId === courseModule.id).length} soal
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

  if (isFinished) {
    return (
      <div className="quiz-page" role="dialog" aria-modal="true" aria-labelledby="quiz-title">
        <header className="quiz-page-header">
          {onClose && (
            <button type="button" className="quiz-close-button" onClick={onClose}>
              ← Kembali ke beranda
            </button>
          )}
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
                Skor kamu <strong>{score} dari {questionsList.length}</strong>. Ulangi kuis untuk berlatih lagi.
              </p>
            </div>
            <div className="quiz-completion" role="status">
              {score === questionsList.length
                ? 'Luar biasa, semua soal berhasil dijawab dengan benar!'
                : 'Terus berlatih untuk memperdalam pemahaman konsep kimia!'}
            </div>
            <div className="quiz-actions" style={{ justifyContent: 'center' }}>
              <button type="button" className="btn-primary" onClick={handleRestart}>
                Ulangi Kuis
              </button>
            </div>
          </section>
        </main>
      </div>
    )
  }

  const completedCount = Math.min(questionIndex + (isChecked ? 1 : 0), questionsList.length)

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
            <p>Jawab pertanyaan dan periksa jawaban untuk melihat pembahasan mendalam.</p>
          </div>

          <div className="quiz-progress" aria-label={`Soal ${questionIndex + 1} dari ${questionsList.length}`}>
            <div className="quiz-progress-label">
              <span>Soal {questionIndex + 1} dari {questionsList.length}</span>
              <span>Skor: {score}</span>
            </div>
            <div
              className="quiz-progress-track"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={questionsList.length}
              aria-valuenow={completedCount}
            >
              <div
                className="quiz-progress-fill"
                style={{ width: `${(completedCount / questionsList.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="quiz-question-card">
            <p className="quiz-question">{getQuestionText(currentQuestion)}</p>
            <div className="quiz-options quiz-options-list" role="group" aria-label="Pilihan Jawaban">
              {options.map((option) => {
                const isSelected = selectedOption === option.id
                let btnClass = 'quiz-option'
                if (isSelected) {
                  btnClass += ' selected'
                }
                if (isChecked) {
                  if (option.id === correctAnswer) {
                    btnClass += ' correct'
                  } else if (isSelected && !isCorrect) {
                    btnClass += ' wrong'
                  }
                }

                return (
                  <button
                    type="button"
                    key={option.id}
                    className={btnClass}
                    onClick={() => setSelectedOption(option.id)}
                    disabled={isChecked}
                  >
                    <span className="quiz-option-id">{option.id}</span>
                    <span className="quiz-option-text">{option.text}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {isChecked && (
            <div className="quiz-feedback-container">
              <div
                className={`quiz-feedback ${isCorrect ? 'success' : 'error'}`}
                role="status"
                aria-live="polite"
              >
                <strong>{isCorrect ? (currentQuestion?.feedbackBenar || 'Benar!') : (currentQuestion?.feedbackSalah || 'Salah!')}</strong>
                {!isCorrect && (
                  <p style={{ marginTop: '0.4rem' }}>
                    Jawaban yang benar: <strong>{correctAnswer}</strong>
                  </p>
                )}
              </div>

              {explanation && (
                <div className="quiz-explanation">
                  <div>
                    <h2>Pembahasan</h2>
                    <p>{explanation}</p>
                  </div>
                  {(currentQuestion?.caraPengerjaan || currentQuestion?.rumus) && (
                    <div className="quiz-solution">
                      {currentQuestion.caraPengerjaan && (
                        <>
                          <h2>Cara pengerjaan</h2>
                          <p>{currentQuestion.caraPengerjaan}</p>
                        </>
                      )}
                      {currentQuestion.rumus && <p className="quiz-formula">{currentQuestion.rumus}</p>}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="quiz-actions">
            {!isChecked ? (
              <button
                type="button"
                className="btn-primary"
                onClick={handleCheckAnswer}
                disabled={!selectedOption}
              >
                Periksa Jawaban
              </button>
            ) : (
              <button
                type="button"
                className="btn-primary"
                onClick={handleNext}
              >
                {isLastQuestion ? 'Lihat Hasil' : 'Soal Berikutnya →'}
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
