import { useState } from 'react'
import { courseModules, quizQuestions } from '../data/database.js'
import './Quiz.css'

export default function Quiz({ moduleId, onSelectModule, onClose }) {
  const module = courseModules.find((item) => item.id === moduleId)
  const questions = quizQuestions.filter((question) => question.modulId === moduleId)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState('')
  const [checkedOption, setCheckedOption] = useState('')
  const [score, setScore] = useState(0)

  const question = questions[questionIndex]
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

  const handleSelectOption = (optionId) => {
    setSelectedOption(optionId)
    setCheckedOption('')
  }

  const handleNextQuestion = () => {
    setQuestionIndex((currentIndex) => currentIndex + 1)
    setSelectedOption('')
    setCheckedOption('')
  }

  const handleRestart = () => {
    setQuestionIndex(0)
    setSelectedOption('')
    setCheckedOption('')
    setScore(0)
  }

  if (!module) {
    return (
      <div className="quiz-page" role="dialog" aria-modal="true" aria-labelledby="quiz-picker-title">
        <header className="quiz-page-header">
          <button type="button" className="quiz-close-button" onClick={onClose}>
            ← Kembali ke beranda
          </button>
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
            <div className="quiz-actions">
              <button type="button" className="btn-primary" onClick={handleRestart}>
                Ulangi Kuis
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
        </section>
      </main>
    </div>
  )
}
