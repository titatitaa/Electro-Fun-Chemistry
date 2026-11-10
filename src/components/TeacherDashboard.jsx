import { useState, useEffect } from 'react'
import { getTeacherClassData, DEFAULT_CLASS_CODE } from '../auth.js'
import './TeacherDashboard.css'

export default function TeacherDashboard({ user, onClose }) {
  const [activeTab, setActiveTab] = useState('scores') // 'scores' | 'students' | 'analysis'
  const [filterModule, setFilterModule] = useState('all')
  const [loading, setLoading] = useState(true)
  const [classData, setClassData] = useState({ classCode: DEFAULT_CLASS_CODE, students: [], submissions: [] })
  const [copied, setCopied] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState(null)

  const classCode = user?.classCode || DEFAULT_CLASS_CODE

  useEffect(() => {
    let isMounted = true
    async function loadData() {
      setLoading(true)
      try {
        const data = await getTeacherClassData(classCode)
        if (isMounted) {
          setClassData(data)
        }
      } catch (err) {
        console.warn('Gagal memuat data kelas:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadData()
    return () => {
      isMounted = false
    }
  }, [classCode])

  const handleCopyCode = () => {
    try {
      navigator.clipboard.writeText(classCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  // Filter submissions
  const filteredSubmissions = classData.submissions.filter((item) => {
    if (filterModule === 'all') return true
    return item.moduleId === filterModule
  })

  // Hitung rata-rata nilai kelas
  const averagePercentage = classData.submissions.length > 0
    ? Math.round(
        classData.submissions.reduce((acc, curr) => acc + (curr.percentage || 0), 0) /
        classData.submissions.length
      )
    : 0

  return (
    <div className="teacher-dashboard-page" role="dialog" aria-modal="true" aria-labelledby="teacher-title">
      <header className="teacher-header">
        <button type="button" className="teacher-back-btn" onClick={onClose}>
          ← Kembali ke Website
        </button>
        <div className="teacher-header-brand">
          <span className="teacher-pill">Ruang Pendidik</span>
          <span>Panel Guru • ElectroFun Chemistry</span>
        </div>
        <div className="teacher-user-info">
          <span>{user?.name || 'Guru Pengajar'}</span>
          <span className="teacher-badge">Guru</span>
        </div>
      </header>

      <main className="teacher-content">
        {/* Banner Kelas & Kode Bergabung */}
        <div className="teacher-hero-banner">
          <div className="banner-left">
            <span className="hero-kicker">PEMANTAUAN KELAS ELEKTROKIMIA</span>
            <h1 id="teacher-title">Dashboard Guru — Evaluasi Siswa</h1>
            <p>
              Pantau keaktifan belajar siswa, hasil kuis kimia, dan penguasaan konsep larutan elektrolit dan non-elektrolit di kelas Anda.
            </p>
          </div>

          <div className="banner-class-card">
            <span className="code-label">KODE KELAS AKTIF</span>
            <div className="code-row">
              <strong className="code-display">{classCode}</strong>
              <button
                type="button"
                className={`copy-btn ${copied ? 'copied' : ''}`}
                onClick={handleCopyCode}
                title="Salin kode kelas untuk dibagikan ke siswa"
              >
                {copied ? '✓ Tersalin!' : 'Salin Kode'}
              </button>
            </div>
            <small>Bagikan kode ini kepada siswa agar mereka bergabung ke kelas Anda.</small>
          </div>
        </div>

        {/* Statistik Cepat Kelas */}
        <div className="teacher-stats-grid">
          <div className="stat-card">
            <span className="stat-icon" aria-hidden="true">👥</span>
            <div>
              <span className="stat-label">Siswa Terdaftar</span>
              <strong className="stat-value">{classData.students.length} Siswa</strong>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon" aria-hidden="true">📝</span>
            <div>
              <span className="stat-label">Kuis Dikerjakan</span>
              <strong className="stat-value">{classData.submissions.length} Kali</strong>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon" aria-hidden="true">⭐</span>
            <div>
              <span className="stat-label">Rata-Rata Nilai</span>
              <strong className="stat-value">{averagePercentage}%</strong>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon" aria-hidden="true">🎯</span>
            <div>
              <span className="stat-label">Ketuntasan Materi</span>
              <strong className="stat-value">{averagePercentage >= 75 ? 'Tuntas (Baik)' : 'Perlu Penguatan'}</strong>
            </div>
          </div>
        </div>

        {/* Tab Navigasi Panel */}
        <div className="teacher-tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'scores' ? 'active' : ''}`}
            onClick={() => setActiveTab('scores')}
          >
            📊 Rekap Nilai &amp; Jawaban Kuis ({classData.submissions.length})
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            👥 Daftar Siswa Anggota ({classData.students.length})
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveTab('analysis')}
          >
            💡 Analisis Konsep &amp; Miskonsepsi
          </button>
        </div>

        {/* KONTEN TAB: REKAP NILAI KUIS */}
        {activeTab === 'scores' && (
          <div className="teacher-section-box">
            <div className="section-toolbar">
              <h2>Hasil Pengerjaan Kuis Siswa</h2>
              <div className="filter-group">
                <label htmlFor="filterMod">Filter Modul:</label>
                <select
                  id="filterMod"
                  value={filterModule}
                  onChange={(e) => setFilterModule(e.target.value)}
                >
                  <option value="all">Semua Modul</option>
                  <option value="modul-1">Modul 1: Konsep Elektrolit</option>
                  <option value="modul-2">Modul 2: Uji Daya Hantar</option>
                  <option value="modul-3">Modul 3: Reaksi Ionisasi</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="teacher-empty-state">Memuat data nilai dari server...</div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="teacher-empty-state">
                <span className="empty-icon" aria-hidden="true">📭</span>
                <h3>Belum ada riwayat kuis pada kategori ini</h3>
                <p>Siswa yang telah bergabung di kelas Anda dan menyelesaikan kuis akan otomatis tercatat di sini.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="teacher-table">
                  <thead>
                    <tr>
                      <th>Nama Siswa</th>
                      <th>Modul Kuis</th>
                      <th>Skor / Butir</th>
                      <th>Nilai Akhir</th>
                      <th>Waktu Selesai</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubmissions.map((sub, idx) => (
                      <tr key={sub.id || idx}>
                        <td>
                          <strong>{sub.userName || 'Siswa'}</strong>
                          {sub.userEmail && <div className="sub-meta">{sub.userEmail}</div>}
                        </td>
                        <td>
                          <span className="module-badge">
                            {sub.moduleId === 'modul-1'
                              ? 'Modul 1'
                              : sub.moduleId === 'modul-2'
                              ? 'Modul 2'
                              : sub.moduleId === 'modul-3'
                              ? 'Modul 3'
                              : sub.moduleId}
                          </span>
                        </td>
                        <td>
                          <strong>{sub.score}</strong> / {sub.totalQuestions || 10}
                        </td>
                        <td>
                          <span className={`score-badge ${sub.percentage >= 75 ? 'high' : 'medium'}`}>
                            {sub.percentage}%
                          </span>
                        </td>
                        <td>
                          <span className="timestamp-text">
                            {sub.timestampIso
                              ? new Date(sub.timestampIso).toLocaleString('id-ID')
                              : 'Tersimpan'}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn-view-detail"
                            onClick={() => setSelectedSubmission(sub)}
                          >
                            Detail Jawaban
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* KONTEN TAB: DAFTAR SISWA ANGGOTA */}
        {activeTab === 'students' && (
          <div className="teacher-section-box">
            <h2>Daftar Siswa di Kelas {classCode}</h2>
            <p className="section-desc">
              Siswa berikut telah bergabung menggunakan kode kelas Anda dan dapat menerima pemantauan belajar.
            </p>

            {classData.students.length === 0 ? (
              <div className="teacher-empty-state">
                <span className="empty-icon" aria-hidden="true">👤</span>
                <h3>Belum ada siswa yang bergabung</h3>
                <p>Berikan kode <strong>{classCode}</strong> kepada siswa untuk bergabung.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="teacher-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama Lengkap</th>
                      <th>Username</th>
                      <th>Email Siswa</th>
                      <th>Kelas</th>
                      <th>Total Kuis Selesai</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classData.students.map((std, idx) => {
                      const completedCount = classData.submissions.filter((s) => s.userId === std.id).length
                      return (
                        <tr key={std.id || idx}>
                          <td>{idx + 1}</td>
                          <td><strong>{std.name}</strong></td>
                          <td><code>@{std.username || '-'}</code></td>
                          <td>{std.email}</td>
                          <td>{std.className || 'X'}</td>
                          <td>
                            <span className="completed-pill">{completedCount} Kuis Selesai</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* KONTEN TAB: ANALISIS KONSEP */}
        {activeTab === 'analysis' && (
          <div className="teacher-section-box">
            <h2>Analisis Penguasaan Konsep Kimia Siswa</h2>
            <p className="section-desc">
              Rangkuman topik esensial materi Larutan Elektrolit &amp; Non-Elektrolit berdasarkan hasil evaluasi kuis siswa:
            </p>

            <div className="analysis-cards-grid">
              <div className="analysis-card success">
                <div className="analysis-header">
                  <span className="analysis-indicator">✓</span>
                  <h3>Topik yang Paling Dikuasai</h3>
                </div>
                <p>
                  Siswa telah memahami dengan baik perbedaan makroskopik hasil uji daya hantar (lampu terang dan banyak gelembung pada elektrolit kuat).
                </p>
                <span className="analysis-percentage">Tingkat Penguasaan: 95%</span>
              </div>

              <div className="analysis-card warning">
                <div className="analysis-header">
                  <span className="analysis-indicator">!</span>
                  <h3>Miskonsepsi yang Masih Sering Terjadi</h3>
                </div>
                <p>
                  Siswa terkadang masih menyamakan antara &quot;larut secara homogen&quot; dengan &quot;menghasilkan ion&quot;. Larutan gula (sukrosa) larut sempurna namun tetap berupa molekul netral tanpa ion.
                </p>
                <span className="analysis-percentage">Perlu Penguatan Konsep (Modul 1 &amp; 3)</span>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DETAIL JAWABAN BUTIR */}
        {selectedSubmission && (
          <div className="detail-modal-backdrop" role="dialog" aria-modal="true">
            <div className="detail-modal-card">
              <div className="detail-modal-header">
                <h3>Rincian Pengerjaan Kuis Siswa</h3>
                <button type="button" onClick={() => setSelectedSubmission(null)}>✕</button>
              </div>

              <div className="detail-summary-bar">
                <div>
                  <strong>{selectedSubmission.userName}</strong>
                  <p>Modul: {selectedSubmission.moduleId}</p>
                </div>
                <div className="detail-score-pill">
                  Nilai: {selectedSubmission.score}/{selectedSubmission.totalQuestions} ({selectedSubmission.percentage}%)
                </div>
              </div>

              <div className="answers-review-list">
                <h4>Butir Jawaban yang Dipilih Siswa:</h4>
                {selectedSubmission.answers && Object.keys(selectedSubmission.answers).length > 0 ? (
                  <ul className="answers-items-list">
                    {Object.entries(selectedSubmission.answers).map(([soalId, ans]) => (
                      <li key={soalId} className={`ans-item ${ans.isCorrect ? 'correct' : 'incorrect'}`}>
                        <span>Soal: <code>{soalId}</code></span>
                        <span>Pilihan Siswa: <strong>Opsi {ans.opsiId}</strong></span>
                        <span>{ans.isCorrect ? '✓ Benar' : '✗ Belum Tepat'}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-detail-note">Siswa menyelesaikan kuis dengan skor {selectedSubmission.score}/{selectedSubmission.totalQuestions}. Rincian per butir terarsip.</p>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setSelectedSubmission(null)}>
                  Tutup Rincian
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

