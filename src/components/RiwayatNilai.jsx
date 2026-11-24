import React, { useEffect, useState } from 'react'
import { auth, db, collection, query, where, getDocs, orderBy } from '../firebase.js'
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

  useEffect(() => {
    let isMounted = true

    async function fetchSubmissions() {
      setLoading(true)
      setError('')
      try {
        const currentUid = auth.currentUser?.uid || user?.uid || user?.id

        if (!currentUid) {
          if (isMounted) {
            setSubmissions([])
            setLoading(false)
          }
          return
        }

        // Data diambil dari Firestore collection 'quiz_submissions', filter 'userId == auth.currentUser.uid', urutkan dari yang terbaru
        const q = query(
          collection(db, 'quiz_submissions'),
          where('userId', '==', auth.currentUser?.uid || currentUid),
          orderBy('serverReceivedAt', 'desc')
        )

        const snapshot = await getDocs(q)
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        // Pastikan terurut dari yang paling baru
        list.sort((a, b) => {
          const timeA = new Date(a.serverReceivedAt || a.submittedAt || a.clientFinishedAt || 0).getTime()
          const timeB = new Date(b.serverReceivedAt || b.submittedAt || b.clientFinishedAt || 0).getTime()
          return timeB - timeA
        })

        if (isMounted) {
          setSubmissions(list)
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
  }, [user])

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
            <p>Daftar seluruh riwayat pengerjaan kuis yang telah kamu selesaikan.</p>
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

          {!loading && !error && submissions.length === 0 && (
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

          {!loading && !error && submissions.length > 0 && (
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

              {/* Tabel Riwayat Nilai */}
              <div className="quiz-question-card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      textAlign: 'left',
                      fontSize: '0.92rem',
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          background: 'var(--color-blue-panel, #F0F5FA)',
                          borderBottom: '2px solid rgba(32, 56, 100, 0.1)',
                        }}
                      >
                        <th style={{ padding: '0.95rem 1.25rem', color: 'var(--color-navy)', fontWeight: 800 }}>
                          No
                        </th>
                        <th style={{ padding: '0.95rem 1.25rem', color: 'var(--color-navy)', fontWeight: 800 }}>
                          Nama Kuis
                        </th>
                        <th style={{ padding: '0.95rem 1.25rem', color: 'var(--color-navy)', fontWeight: 800, textAlign: 'center' }}>
                          Skor
                        </th>
                        <th style={{ padding: '0.95rem 1.25rem', color: 'var(--color-navy)', fontWeight: 800, textAlign: 'center' }}>
                          Total Soal
                        </th>
                        <th style={{ padding: '0.95rem 1.25rem', color: 'var(--color-navy)', fontWeight: 800 }}>
                          Tanggal Mengerjakan
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((sub, idx) => {
                        const totalSoal = sub.totalQuestions || sub.total || 10
                        const skor = sub.score ?? 0
                        const isHigh = skor >= totalSoal * 0.75

                        return (
                          <tr
                            key={sub.id || idx}
                            style={{
                              borderBottom: '1px solid rgba(32, 56, 100, 0.08)',
                              transition: 'background 0.15s ease',
                            }}
                          >
                            <td style={{ padding: '1rem 1.25rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                              {idx + 1}
                            </td>
                            <td style={{ padding: '1rem 1.25rem' }}>
                              <strong style={{ color: 'var(--color-navy)', fontSize: '0.95rem' }}>
                                {sub.moduleTitle || sub.moduleId || 'Kuis Kimia'}
                              </strong>
                              {sub.questionVersion && (
                                <span
                                  style={{
                                    display: 'inline-block',
                                    marginLeft: '0.5rem',
                                    fontSize: '0.74rem',
                                    color: 'var(--color-text-muted)',
                                    background: 'rgba(32, 56, 100, 0.06)',
                                    padding: '1px 6px',
                                    borderRadius: '4px',
                                  }}
                                >
                                  {sub.questionVersion}
                                </span>
                              )}
                            </td>
                            <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '0.3rem 0.75rem',
                                  borderRadius: 'var(--radius-full, 999px)',
                                  background: isHigh
                                    ? 'var(--color-green-feedback, #dcfce7)'
                                    : 'var(--color-coral-light, #fee2e2)',
                                  color: isHigh ? '#14532d' : '#991b1b',
                                  fontWeight: 800,
                                  fontSize: '0.88rem',
                                }}
                              >
                                {skor}
                              </span>
                            </td>
                            <td style={{ padding: '1rem 1.25rem', textAlign: 'center', color: 'var(--color-text-main)', fontWeight: 600 }}>
                              {totalSoal}
                            </td>
                            <td style={{ padding: '1rem 1.25rem', color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>
                              {formatTanggal(sub.serverReceivedAt || sub.clientFinishedAt || sub.submittedAt)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
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
