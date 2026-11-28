import React, { useEffect, useState } from 'react'
import { auth } from '../firebase.js'
import { getStudentSubmissions } from '../auth.js'
import './Quiz.css'

function formatTanggal(raw) {
  if (!raw) return '-'
  try {
    let date
    if (typeof raw === 'object' && raw?.toDate) {
      date = raw.toDate()
    } else if (typeof raw === 'object' && raw?.seconds) {
      date = new Date(raw.seconds * 1000)
    } else {
      date = new Date(raw)
    }

    if (isNaN(date.getTime())) return String(raw)

    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  } catch {
    return String(raw)
  }
}

export default function RiwayatNilai({ user, onClose, onStartQuiz }) {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const isGuest = user?.isGuest || user?.role === 'guest'

  useEffect(() => {
    let isMounted = true

    async function fetchSubmissions() {
      setLoading(true)
      setError('')

      if (isGuest) {
        if (isMounted) {
          setSubmissions([])
          setLoading(false)
        }
        return
      }

      try {
        const currentUid = auth.currentUser?.uid || user?.uid || user?.id

        if (!currentUid) {
          if (isMounted) {
            setSubmissions([])
            setLoading(false)
          }
          return
        }

        // Ambil riwayat khusus siswa bersangkutan menggunakan fungsi resmi dari auth.js
        const list = await getStudentSubmissions(currentUid)

        if (isMounted) {
          setSubmissions(list || [])
          setLoading(false)
        }
      } catch (err) {
        console.error('Gagal mengambil data riwayat kuis:', err)
        if (isMounted) {
          setError('Gagal memuat riwayat kuis dari server.')
          setLoading(false)
        }
      }
    }

    fetchSubmissions()

    return () => {
      isMounted = false
    }
  }, [user, isGuest])

  return (
    <div className="quiz-page" role="dialog" aria-modal="true" aria-labelledby="riwayat-title">
      <header className="quiz-page-header">
        {onClose && (
          <button type="button" className="quiz-close-button" onClick={onClose}>
            ← Kembali ke beranda
          </button>
        )}
        <span>Riwayat Pembelajaran • Evaluasi Mandiri</span>
      </header>

      <main className="quiz-page-content">
        <section className="quiz" aria-labelledby="riwayat-title">
          <div className="quiz-heading">
            <span className="apparatus-status-pill weak">Progres Belajar</span>
            <h1 id="riwayat-title">Riwayat Nilai Kuis</h1>
            <p>Daftar seluruh riwayat pengerjaan kuis evaluasi yang telah kamu selesaikan.</p>
          </div>

          {loading && (
            <div className="quiz-question-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', margin: 0 }}>
                Memuat riwayat kuis...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="quiz-question-card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
              <p className="quiz-save-error" role="alert" style={{ marginBottom: '1rem' }}>
                {error}
              </p>
              {onClose && (
                <button type="button" className="btn-secondary" onClick={onClose}>
                  Kembali ke Beranda
                </button>
              )}
            </div>
          )}

          {!loading && !error && isGuest && (
            <div className="quiz-question-card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }} aria-hidden="true">
                👤
              </div>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--color-navy)', marginBottom: '0.4rem', fontWeight: 800 }}>
                Akun Tamu (Mode Latihan Bebas)
              </h2>
              <p style={{ color: 'var(--color-text-muted)', maxWidth: '440px', margin: '0 auto 1.5rem', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Hasil pengerjaan kuis untuk akun tamu tidak disimpan ke server cloud. Silakan masuk atau daftar akun resmi agar seluruh riwayat nilai dan evaluasimu tercatat secara permanen.
              </p>
              <div className="quiz-actions" style={{ justifyContent: 'center' }}>
                {onStartQuiz && (
                  <button type="button" className="btn-primary" onClick={onStartQuiz}>
                    Mulai Kerjakan Kuis
                  </button>
                )}
                {onClose && (
                  <button type="button" className="btn-secondary" onClick={onClose}>
                    Kembali ke Beranda
                  </button>
                )}
              </div>
            </div>
          )}

          {!loading && !error && !isGuest && submissions.length === 0 && (
            <div className="quiz-question-card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }} aria-hidden="true">
                📝
              </div>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--color-navy)', marginBottom: '0.4rem', fontWeight: 800 }}>
                Belum ada riwayat kuis
              </h2>
              <p style={{ color: 'var(--color-text-muted)', maxWidth: '420px', margin: '0 auto 1.5rem', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Kamu belum pernah mengerjakan kuis evaluasi. Yuk, pelajari materi dan uji pemahamanmu dengan kuis interaktif!
              </p>
              <div className="quiz-actions" style={{ justifyContent: 'center' }}>
                {onStartQuiz && (
                  <button type="button" className="btn-primary" onClick={onStartQuiz}>
                    Mulai Kerjakan Kuis Sekarang
                  </button>
                )}
              </div>
            </div>
          )}

          {!loading && !error && !isGuest && submissions.length > 0 && (
            <>
              {/* Ringkasan Skor Terkini */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div
                  className="quiz-question-card"
                  style={{
                    padding: '1.2rem',
                    marginBottom: 0,
                    borderLeft: '4px solid var(--color-teal)',
                  }}
                >
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                    Total Percobaan Kuis
                  </span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-navy)', marginTop: '0.2rem' }}>
                    {submissions.length} kali
                  </div>
                </div>

                <div
                  className="quiz-question-card"
                  style={{
                    padding: '1.2rem',
                    marginBottom: 0,
                    borderLeft: '4px solid var(--color-orange, #F4A340)',
                  }}
                >
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                    Pengerjaan Terbaru
                  </span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-navy)', marginTop: '0.4rem' }}>
                    {submissions[0]?.moduleTitle || submissions[0]?.moduleId || 'Kuis'}
                  </div>
                </div>
              </div>

              {/* Tabel Riwayat Nilai - Desktop */}
              <div className="history-desktop quiz-question-card">
                <div className="history-table-wrapper">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Nama Kuis</th>
                        <th>Skor</th>
                        <th>Total Soal</th>
                        <th>Tanggal Mengerjakan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((sub, idx) => {
                        const totalSoal = sub.totalQuestions || sub.total || 10
                        const skor = sub.score ?? 0
                        const isHigh = skor >= totalSoal * 0.75

                        return (
                          <tr key={sub.id || idx}>
                            <td>{idx + 1}</td>
                            <td>
                              <strong className="history-title">
                                {sub.moduleTitle || sub.moduleId || 'Kuis Kimia'}
                              </strong>
                              {sub.questionVersion && (
                                <span className="history-version">
                                  {sub.questionVersion}
                                </span>
                              )}
                            </td>
                            <td className="history-score-cell">
                              <span className={`history-score ${isHigh ? 'high' : 'low'}`}>
                                {skor}
                              </span>
                            </td>
                            <td className="history-total">{totalSoal}</td>
                            <td className="history-date">
                              {formatTanggal(sub.serverReceivedAt || sub.clientFinishedAt || sub.submittedAt)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Kartu Riwayat Nilai - Mobile */}
              <div className="history-mobile">
                {submissions.map((sub, idx) => {
                  const totalSoal = sub.totalQuestions || sub.total || 10
                  const skor = sub.score ?? 0
                  const isHigh = skor >= totalSoal * 0.75

                  return (
                    <article className="history-mobile-card" key={sub.id || idx}>
                      <div className="history-mobile-top">
                        <span className="history-attempt">
                          Percobaan #{idx + 1}
                        </span>
                        <span className={`history-score ${isHigh ? 'high' : 'low'}`}>
                          {skor} / {totalSoal}
                        </span>
                      </div>

                      <h3 className="history-mobile-title">
                        {sub.moduleTitle || sub.moduleId || 'Kuis Kimia'}
                      </h3>

                      {sub.questionVersion && (
                        <span className="history-version">
                          {sub.questionVersion}
                        </span>
                      )}

                      <div className="history-mobile-date">
                        <span aria-hidden="true">📅</span>
                        {formatTanggal(sub.serverReceivedAt || sub.clientFinishedAt || sub.submittedAt)}
                      </div>
                    </article>
                  )
                })}
              </div>
              <div className="quiz-actions" style={{ justifyContent: 'center', marginTop: '2rem' }}>
                {onStartQuiz && (
                  <button type="button" className="btn-primary" onClick={onStartQuiz}>
                    Kerjakan Kuis Lainnya
                  </button>
                )}
                {onClose && (
                  <button type="button" className="btn-secondary" onClick={onClose}>
                    Kembali ke Beranda
                  </button>
                )}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  )
}
