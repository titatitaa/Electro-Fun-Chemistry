import { useState, useEffect } from 'react'
import { courseModules, quizQuestions } from '../data/database.js'
import './Quiz.css'

const STORAGE_KEY = 'quiz-answers'

// Safely get all saved answers from localStorage
function getStoredAnswers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

export default function Quiz({ moduleId = null, onSelectModule = () => {}, onClose = () => {} }) {
  const module = courseModules.find((item) => item.id === moduleId)
  const questions = quizQuestions.filter((question) => question.modulId === moduleId)

  // Initialize all answers from localStorage key 'quiz-answers'
  const [userAnswers, setUserAnswers] = useState(getStoredAnswers)

  // Initialize question index from localStorage if available
  const [questionIndex, setQuestionIndex] = useState(() => {
    try {
      const savedIndex = localStorage.getItem('electrofun_quiz_current_index')
      if (savedIndex !== null) {
        const idx = parseInt(savedIndex, 10)
        if (!isNaN(idx) && idx >= 0 && idx < questions.length) {
          return idx
        }
      }
    } catch {}
    return 0
  })

  const [checkedOption, setCheckedOption] = useState('')

  // Calculate score based on answers in localStorage
  const [score, setScore] = useState(() => {
    const answers = getStoredAnswers()
    return questions.reduce((acc, q) => {
      return acc + (answers[q.id] === q.jawabanBenar ? 1 : 0)
    }, 0)
  })

  // Current question and derived selectedOption
  const question = questions[questionIndex]
  const selectedOption = question ? userAnswers[question.id] || userAnswers[questionIndex] || userAnswers[String(questionIndex)] || '' : ''

  // Persist current question index
  useEffect(() => {
    try {
      if (moduleId) {
        localStorage.setItem('electrofun_quiz_current_index', String(questionIndex))
      }
    } catch {}
  }, [questionIndex, moduleId])

  const isCorrect = checkedOption === question?.jawabanBenar
  const isComplete = questions.length > 0 && questionIndex === questions.length
  const completedQuestions = Math.min(questionIndex + (isCorrect ? 1 : 0), questions.length)

  const handleCheckAnswer = () => {
    if (!selectedOption) return

    setCheckedOption(selectedOption)
    if (selectedOption === question.jawabanBenar) {
      setScore((currentScore) => currentScore + 1)
    }
  }

  // Setiap kali user memilih jawaban, langsung simpan ke localStorage dengan key quiz-answers
  const handleSelectOption = (optionId) => {
    setCheckedOption('')
    if (!question) return

    const newAnswers = { ...userAnswers, [question.id]: optionId }
    setUserAnswers(newAnswers)

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newAnswers))
    } catch (err) {
      console.error('Failed to save quiz answers to localStorage:', err)
    }
  }

  const handleNextQuestion = () => {
    setQuestionIndex((currentIndex) => currentIndex + 1)
    setCheckedOption('')
  }

  // Reset / Ulangi Kuis: hapus jawaban di localStorage dan reset state
  const handleRestart = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem('electrofun_quiz_current_index')
    } catch (err) {
      console.error('Failed to clear quiz answers:', err)
    }
    setUserAnswers({})
    setQuestionIndex(0)
    setCheckedOption('')
    setScore(0)
  }

  if (!module) {
    const answers = getStoredAnswers()
    const hasSavedAnswers = Object.keys(answers).length > 0

    return (
      <div className="quiz-page" role="dialog" aria-modal="true" aria-labelledby="quiz-picker-title">
        <header className="quiz-page-header">
          <button type="button" className="quiz-close-button" onClick={onClose}>
            ← Kembali ke beranda
          </button>
          <span>Pilih modul untuk mulai mengerjakan</span>
          {hasSavedAnswers && (
            <button
              type="button"
              className="quiz-close-button"
              onClick={handleRestart}
              title="Hapus semua jawaban tersimpan"
            >
              Reset / Ulangi Kuis
            </button>
          )}
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
                onClick={() => onSelectModule(courseModule.id)}
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

  if (questions.length === 0) {
    return (
      <div className="quiz-page" role="dialog" aria-modal="true" aria-labelledby="quiz-empty-title">
        <header className="quiz-page-header">
          <button type="button" className="quiz-close-button" onClick={() => onSelectModule(null)}>
            ← Pilih modul
          </button>
          <button type="button" className="quiz-close-button" onClick={onClose}>
            Tutup kuis
          </button>
        </header>
        <main className="quiz-page-content">
          <h1 id="quiz-empty-title">Soal kuis belum tersedia</h1>
          <p>Silakan pilih modul lain atau kembali ke beranda.</p>
        </main>
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="quiz-page" role="dialog" aria-modal="true" aria-labelledby="quiz-title">
        <header className="quiz-page-header">
          <button type="button" className="quiz-close-button" onClick={onClose}>
            ← Kembali ke beranda
          </button>
          <button type="button" className="quiz-close-button" onClick={() => onSelectModule(null)}>
            Pilih modul lain
          </button>
        </header>
        <main className="quiz-page-content">
          <section className="quiz" aria-labelledby="quiz-title">
            <div className="quiz-heading">
              <span className="apparatus-status-pill weak">{module.number} • Kuis selesai</span>
              <h1 id="quiz-title">Kuis Selesai!</h1>
              <p>
                Skor kamu <strong>{score} dari {questions.length}</strong>. Ulangi kuis untuk berlatih lagi.
              </p>
            </div>
            <div className="quiz-completion" role="status">
              {score === questions.length
                ? 'Luar biasa, semua soal berhasil dijawab dengan benar!'
                : 'Terus berlatih. Baca kembali cara pengerjaan pada setiap jawaban benar.'}
            </div>
            <div className="quiz-actions" style={{ justifyContent: 'center' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={handleRestart}
                id="btn-restart-quiz"
              >
                Reset / Ulangi Kuis
              </button>
            </div>
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="quiz-page" role="dialog" aria-modal="true" aria-labelledby="quiz-title">
      <header className="quiz-page-header">
        <button type="button" className="quiz-close-button" onClick={onClose}>
          ← Kembali ke beranda
        </button>
        <span>{module.number} • Evaluasi mandiri</span>
        <button type="button" className="quiz-close-button" onClick={() => onSelectModule(null)}>
          Pilih modul lain
        </button>
      </header>
      <main className="quiz-page-content">
        <section className="quiz" aria-labelledby="quiz-title">
          <div className="quiz-heading">
            <span className="apparatus-status-pill weak">{module.number} • Soal konseptual</span>
            <h1 id="quiz-title">{module.title}</h1>
            <p>Jawab semua soal dan pelajari pembahasan setelah jawabanmu benar.</p>
          </div>

          <div className="quiz-progress" aria-label={`Soal ${questionIndex + 1} dari ${questions.length}`}>
            <div className="quiz-progress-label">
              <span>Soal {questionIndex + 1} dari {questions.length}</span>
              <span>Skor: {score}</span>
            </div>
            <div
              className="quiz-progress-track"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={questions.length}
              aria-valuenow={completedQuestions}
            >
              <div
                className="quiz-progress-fill"
                style={{ width: `${(completedQuestions / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="quiz-question-card">
            <p className="quiz-question">{question.pertanyaan}</p>
            <fieldset className="quiz-options" disabled={isCorrect}>
              <legend className="sr-only">Pilih satu jawaban</legend>
              {question.opsi.map((option) => (
                <label
                  className={`quiz-option${selectedOption === option.id ? ' selected' : ''}${
                    isCorrect && option.id === question.jawabanBenar ? ' correct' : ''
                  }`}
                  key={option.id}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option.id}
                    checked={selectedOption === option.id}
                    onChange={() => handleSelectOption(option.id)}
                  />
                  <span className="quiz-option-id">{option.id}</span>
                  <span>{option.teks}</span>
                </label>
              ))}
            </fieldset>
          </div>

          {checkedOption && (
            <div
              className={`quiz-feedback ${isCorrect ? 'success' : 'error'}`}
              role="status"
              aria-live="polite"
            >
              <strong>{isCorrect ? question.feedbackBenar : 'Belum tepat.'}</strong>
              {!isCorrect && (
                <>
                  <p>{question.feedbackSalah}</p>
                  <p>Pilih jawaban lain, lalu periksa kembali.</p>
                </>
              )}
            </div>
          )}

          {isCorrect && (
            <div className="quiz-explanation">
              <div>
                <h2>Pembahasan</h2>
                <p>{question.pembahasan}</p>
              </div>
              <div className="quiz-solution">
                <h2>Cara pengerjaan</h2>
                <p>{question.caraPengerjaan}</p>
                {question.rumus && <p className="quiz-formula">{question.rumus}</p>}
              </div>
            </div>
          )}

          <div className="quiz-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleRestart}
              id="btn-reset-quiz"
            >
              Reset / Ulangi Kuis
            </button>
            <div className="quiz-actions-right">
              {isCorrect ? (
                <button type="button" className="btn-primary" onClick={handleNextQuestion}>
                  {questionIndex === questions.length - 1 ? 'Lihat Hasil' : 'Soal Berikutnya'}
                  <span aria-hidden="true"> →</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleCheckAnswer}
                  disabled={!selectedOption}
                >
                  Periksa Jawaban
                </button>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
