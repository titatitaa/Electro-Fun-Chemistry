import { useState, useEffect, useMemo } from 'react'
import { getTeacherClassData, DEFAULT_CLASS_CODE } from '../auth.js'
import { TEACHER_CONFIG } from '../config/teacherConfig.js'
import './TeacherDashboard.css'

export default function TeacherDashboard({ user, onClose, onLogout }) {
  const [activeMenu, setActiveMenu] = useState('dashboard') // 'dashboard' | 'quiz-results' | 'students' | 'analysis'
  const [loading, setLoading] = useState(true)
  const [classData, setClassData] = useState({
    classCode: DEFAULT_CLASS_CODE,
    className: TEACHER_CONFIG.defaultClassName,
    students: [],
    submissions: [],
  })
  const [copied, setCopied] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Konfigurasi Dinamis Guru
  const [kkm, setKkm] = useState(TEACHER_CONFIG.defaultKKM)
  const [trialRule, setTrialRule] = useState(TEACHER_CONFIG.defaultTrialRule) // 'latest' | 'highest' | 'first'

  // Filter & Search untuk Menu 2 (Hasil Kuis Siswa)
  const [searchQuiz, setSearchQuiz] = useState('')
  const [filterModule, setFilterModule] = useState('all')
  const [filterAttemptType, setFilterAttemptType] = useState('all')
  const [filterVersion, setFilterVersion] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest') // 'highest' | 'lowest' | 'newest' | 'oldest'

  // Filter & Search untuk Menu 3 (Data Siswa)
  const [studentSearch, setStudentSearch] = useState('')
  const [studentClassFilter, setStudentClassFilter] = useState('all')
  const [studentSort, setStudentSort] = useState('name') // 'name' | 'score' | 'quizzes'

  // Modal State
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)

  const classCode = user?.classCode || DEFAULT_CLASS_CODE

  // Muat Data Aktual dari Database Cloud
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
      // Fallback
    }
  }

  // ---------------------------------------------------------------------------
  // PENGHITUNGAN HASIL BERDASARKAN ATURAN PERCOBAAN (TRIAL RULE)
  // Memastikan satu siswa dihitung 1 kali per modul sesuai aturan yang dipilih
  // ---------------------------------------------------------------------------
  const dedupedSubmissions = useMemo(() => {
    const map = new Map() // key: `${userId}_${moduleId}`

    // Urutkan submisi berdasarkan waktu
    const sorted = [...classData.submissions].sort((a, b) =>
      new Date(a.serverReceivedAt || 0) - new Date(b.serverReceivedAt || 0)
    )

    for (const sub of sorted) {
      const key = `${sub.userId}_${sub.moduleId}`
      if (!map.has(key)) {
        map.set(key, sub)
      } else {
        const current = map.get(key)
        if (trialRule === 'latest') {
          map.set(key, sub) // Timpa dengan percobaan terbaru
        } else if (trialRule === 'highest') {
          if ((sub.percentage || 0) > (current.percentage || 0)) {
            map.set(key, sub)
          }
        }
        // if trialRule === 'first', biarkan yang pertama masuk
      }
    }
    return Array.from(map.values())
  }, [classData.submissions, trialRule])

  // Rata-rata Nilai Kelas (dari data pengerjaan valid yang diterima)
  const averagePercentage = dedupedSubmissions.length > 0
    ? Math.round(
        dedupedSubmissions.reduce((acc, curr) => acc + (curr.percentage || 0), 0) /
        dedupedSubmissions.length
      )
    : 0

  // ---------------------------------------------------------------------------
  // FILTER MENU 2: HASIL KUIS SISWA
  // ---------------------------------------------------------------------------
  const filteredSubmissions = useMemo(() => {
    let list = [...classData.submissions]

    if (searchQuiz.trim()) {
      const q = searchQuiz.toLowerCase()
      list = list.filter((item) =>
        (item.userName && item.userName.toLowerCase().includes(q)) ||
        (item.userEmail && item.userEmail.toLowerCase().includes(q))
      )
    }

    if (filterModule !== 'all') {
      list = list.filter((item) => item.moduleId === filterModule)
    }

    if (filterAttemptType !== 'all') {
      list = list.filter((item) => (item.attemptType || 'evaluation') === filterAttemptType)
    }

    if (filterVersion !== 'all') {
      list = list.filter((item) => (item.questionVersion || 'v1.0') === filterVersion)
    }

    // Sorting
    list.sort((a, b) => {
      if (sortOrder === 'highest') return (b.percentage || 0) - (a.percentage || 0)
      if (sortOrder === 'lowest') return (a.percentage || 0) - (b.percentage || 0)
      if (sortOrder === 'oldest') return new Date(a.serverReceivedAt || 0) - new Date(b.serverReceivedAt || 0)
      // default 'newest'
      return new Date(b.serverReceivedAt || 0) - new Date(a.serverReceivedAt || 0)
    })

    return list
  }, [classData.submissions, searchQuiz, filterModule, filterAttemptType, filterVersion, sortOrder])

  // ---------------------------------------------------------------------------
  // FILTER MENU 3: DATA SISWA
  // ---------------------------------------------------------------------------
  const filteredStudents = useMemo(() => {
    let list = classData.students.map((student) => {
      const studentSubs = dedupedSubmissions.filter((s) => s.userId === student.id)
      const avg = studentSubs.length > 0
        ? Math.round(studentSubs.reduce((acc, s) => acc + (s.percentage || 0), 0) / studentSubs.length)
        : null
      return {
        ...student,
        completedCount: studentSubs.length,
        averageScore: avg,
      }
    })

    if (studentSearch.trim()) {
      const q = studentSearch.toLowerCase()
      list = list.filter((s) =>
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.username && s.username.toLowerCase().includes(q)) ||
        (s.email && s.email.toLowerCase().includes(q))
      )
    }

    if (studentClassFilter !== 'all') {
      list = list.filter((s) => s.className === studentClassFilter)
    }

    list.sort((a, b) => {
      if (studentSort === 'score') return (b.averageScore || 0) - (a.averageScore || 0)
      if (studentSort === 'quizzes') return b.completedCount - a.completedCount
      return (a.name || '').localeCompare(b.name || '')
    })

    return list
  }, [classData.students, dedupedSubmissions, studentSearch, studentClassFilter, studentSort])

  // ---------------------------------------------------------------------------
  // ANALISIS PEMBELAJARAN: KETUNTASAN KLASIKAL
  // ---------------------------------------------------------------------------
  const studentAverageScores = useMemo(() => {
    const studentMap = new Map()
    for (const sub of dedupedSubmissions) {
      if (!studentMap.has(sub.userId)) {
        studentMap.set(sub.userId, [])
      }
      studentMap.get(sub.userId).push(sub.percentage || 0)
    }

    const result = []
    for (const [userId, scores] of studentMap.entries()) {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length
      result.push({ userId, avg: Math.round(avg) })
    }
    return result
  }, [dedupedSubmissions])

  const masteryStats = useMemo(() => {
    const totalAssessed = studentAverageScores.length
    if (totalAssessed === 0) {
      return { total: 0, passed: 0, failed: 0, percentage: 0 }
    }
    const passed = studentAverageScores.filter((s) => s.avg >= kkm).length
    const failed = totalAssessed - passed
    const percentage = Math.round((passed / totalAssessed) * 100)
    return { total: totalAssessed, passed, failed, percentage }
  }, [studentAverageScores, kkm])

  // ---------------------------------------------------------------------------
  // ANALISIS PEMBELAJARAN: PERBANDINGAN NILAI PER MODUL
  // ---------------------------------------------------------------------------
  const moduleComparisons = useMemo(() => {
    const modules = [
      { id: 'modul-1', name: 'Modul 1: Kenali Larutan' },
      { id: 'modul-2', name: 'Modul 2: Lab Mini Uji Daya Hantar' },
      { id: 'modul-3', name: 'Modul 3: Jelajahi Reaksi Ionisasi' },
    ]

    return modules.map((m) => {
      const subs = dedupedSubmissions.filter((s) => s.moduleId === m.id)
      const avg = subs.length > 0
        ? Math.round(subs.reduce((acc, c) => acc + (c.percentage || 0), 0) / subs.length)
        : 0
      return { ...m, count: subs.length, avg }
    })
  }, [dedupedSubmissions])

  // ---------------------------------------------------------------------------
  // ANALISIS PEMBELAJARAN: ANALISIS BUTIR SOAL (ERROR RATE & DISTRAKTOR)
  // ---------------------------------------------------------------------------
  const itemAnalysis = useMemo(() => {
    const questionStats = new Map()

    for (const sub of dedupedSubmissions) {
      if (!sub.answers || typeof sub.answers !== 'object') continue

      for (const [qId, ans] of Object.entries(sub.answers)) {
        if (!questionStats.has(qId)) {
          questionStats.set(qId, {
            id: qId,
            questionText: ans.questionText || '',
            correctKey: ans.correctAnswerId || '',
            pembahasan: ans.pembahasan || '',
            questionVersion: ans.questionVersion || 'v1.0',
            totalAnswered: 0,
            correctCount: 0,
            wrongCount: 0,
            optionCounts: { A: 0, B: 0, C: 0, D: 0, E: 0 },
          })
        }

        const stat = questionStats.get(qId)
        stat.totalAnswered += 1
        if (ans.isCorrect) {
          stat.correctCount += 1
        } else {
          stat.wrongCount += 1
        }

        const chosen = String(ans.selectedOptionId || '').toUpperCase()
        if (stat.optionCounts[chosen] !== undefined) {
          stat.optionCounts[chosen] += 1
        }
      }
    }

    const list = Array.from(questionStats.values()).map((item) => {
      const errorRate = item.totalAnswered > 0
        ? Math.round((item.wrongCount / item.totalAnswered) * 100)
        : 0
      return { ...item, errorRate }
    })

    // Urutkan soal berdasarkan tingkat kesalahan tertinggi
    return list.sort((a, b) => b.errorRate - a.errorRate)
  }, [dedupedSubmissions])

  // ---------------------------------------------------------------------------
  // GRAFIK DISTRIBUSI NILAI (HISTOGRAM)
  // ---------------------------------------------------------------------------
  const scoreDistribution = useMemo(() => {
    const ranges = [
      { label: '< 60% (Perlu Bimbingan)', color: 'coral', count: 0 },
      { label: '60%–74% (Cukup)', color: 'orange', count: 0 },
      { label: '75%–84% (Baik)', color: 'blue', count: 0 },
      { label: '85%–100% (Sangat Baik)', color: 'teal', count: 0 },
    ]

    for (const sub of dedupedSubmissions) {
      const p = sub.percentage || 0
      if (p < 60) ranges[0].count += 1
      else if (p < 75) ranges[1].count += 1
      else if (p < 85) ranges[2].count += 1
      else ranges[3].count += 1
    }

    const maxCount = Math.max(...ranges.map((r) => r.count), 1)
    return { ranges, maxCount, total: dedupedSubmissions.length }
  }, [dedupedSubmissions])

  return (
    <div className="teacher-dashboard-wrapper" role="dialog" aria-modal="true" aria-labelledby="dashboard-heading">
      {/* -----------------------------------------------------------------------
          SIDEBAR NAVIGASI (6 MENU UTAMA)
          ----------------------------------------------------------------------- */}
      <aside className={`teacher-sidebar ${mobileSidebarOpen ? 'open' : ''}`} aria-label="Navigasi Panel Guru">
        <div className="teacher-sidebar-header">
          <div className="teacher-sidebar-logo">
            <div className="teacher-logo-badge" aria-hidden="true">⚛</div>
            <div>
              <span className="teacher-app-title">ElectroFun</span>
              <span className="teacher-app-sub">Panel Guru • Kimia SMA</span>
            </div>
          </div>
          <button
            type="button"
            className="teacher-sidebar-close"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Tutup menu navigasi"
          >
            ✕
          </button>
        </div>

        <nav className="teacher-sidebar-menu">
          <span className="teacher-menu-label">Menu Utama</span>

          {/* Menu 1: Dashboard Utama */}
          <button
            type="button"
            className={`teacher-nav-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setActiveMenu('dashboard'); setMobileSidebarOpen(false); }}
          >
            <span className="teacher-nav-icon" aria-hidden="true">📊</span>
            <span>Dashboard Utama</span>
          </button>

          {/* Menu 2: Hasil Kuis Siswa */}
          <button
            type="button"
            className={`teacher-nav-item ${activeMenu === 'quiz-results' ? 'active' : ''}`}
            onClick={() => { setActiveMenu('quiz-results'); setMobileSidebarOpen(false); }}
          >
            <span className="teacher-nav-icon" aria-hidden="true">📝</span>
            <span>Hasil Kuis Siswa</span>
          </button>

          {/* Menu 3: Data Siswa */}
          <button
            type="button"
            className={`teacher-nav-item ${activeMenu === 'students' ? 'active' : ''}`}
            onClick={() => { setActiveMenu('students'); setMobileSidebarOpen(false); }}
          >
            <span className="teacher-nav-icon" aria-hidden="true">👥</span>
            <span>Data Siswa ({classData.students.length})</span>
          </button>

          {/* Menu 4: Analisis Pembelajaran */}
          <button
            type="button"
            className={`teacher-nav-item ${activeMenu === 'analysis' ? 'active' : ''}`}
            onClick={() => { setActiveMenu('analysis'); setMobileSidebarOpen(false); }}
          >
            <span className="teacher-nav-icon" aria-hidden="true">🎯</span>
            <span>Analisis Pembelajaran</span>
          </button>

          <span className="teacher-menu-label" style={{ marginTop: '1rem' }}>Aksi Keluar</span>

          {/* Menu 5: Kembali ke Beranda */}
          <button
            type="button"
            className="teacher-nav-item"
            onClick={onClose}
            title="Kembali ke tampilan utama media tanpa mengakhiri sesi"
          >
            <span className="teacher-nav-icon" aria-hidden="true">←</span>
            <span>Kembali ke Beranda</span>
          </button>
        </nav>

        {/* Menu 6: Logout */}
        <div className="teacher-sidebar-footer">
          <button
            type="button"
            className="teacher-btn-logout-sidebar"
            onClick={onLogout}
            title="Keluar dari sesi Firebase Authentication"
          >
            <span aria-hidden="true">🚪</span>
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* -----------------------------------------------------------------------
          AREA KONTEN UTAMA
          ----------------------------------------------------------------------- */}
      <div className="teacher-main">
        {/* Topbar Header */}
        <header className="teacher-topbar">
          <div className="teacher-topbar-left">
            <button
              type="button"
              className="teacher-sidebar-toggle"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Buka menu navigasi"
            >
              ☰
            </button>
            <span className="teacher-page-breadcrumb" id="dashboard-heading">
              {activeMenu === 'dashboard' && 'Dashboard Kelas • Evaluasi Kimia'}
              {activeMenu === 'quiz-results' && 'Daftar Hasil & Rekapitulasi Kuis Siswa'}
              {activeMenu === 'students' && 'Data Anggota Siswa Kelas KIMIA-X1'}
              {activeMenu === 'analysis' && 'Analisis Ketuntasan & Analisis Butir Soal'}
            </span>
          </div>

          <div className="teacher-topbar-right">
            {loading && (
              <span className="status-badge pending" style={{ marginRight: '0.5rem' }}>
                Menyinkronkan data...
              </span>
            )}
            <div className="teacher-profile-badge">
              <div className="teacher-avatar" aria-hidden="true">
                {(user?.name || 'G').charAt(0).toUpperCase()}
              </div>
              <div className="teacher-name-box">
                <strong>{user?.name || 'Guru Pengajar'}</strong>
                <span className="teacher-role-tag">Guru Pengajar</span>
              </div>
            </div>
          </div>
        </header>

        {/* Konten Scrollable */}
        <main className="teacher-content-scroll">
          {/* Banner Informasi Kelas & Salin Kode */}
          <div className="teacher-hero-banner">
            <div className="banner-left">
              <span className="hero-kicker">KELAS ELEKTROKIMIA FASE E</span>
              <h1>Panel Pengawasan Kelas {classCode}</h1>
              <p>
                Pantau keaktifan belajar siswa, hasil kuis kimia, dan penguasaan konsep larutan elektrolit dan nonelektrolit secara aktual dari server.
              </p>
            </div>

            <div className="banner-class-card">
              <span className="code-label">KODE KELAS BERGABUNG</span>
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
              <small>Berikan kode ini kepada siswa agar mereka terhubung ke kelas Anda.</small>
            </div>
          </div>

          {/* ===================================================================
              MENU 1: DASHBOARD UTAMA
              =================================================================== */}
          {activeMenu === 'dashboard' && (
            <div>
              {/* 4 Kartu Statistik Utama */}
              <div className="teacher-stats-grid">
                <div className="stat-card">
                  <div className="stat-icon-wrap students" aria-hidden="true">👥</div>
                  <div className="stat-meta">
                    <span className="stat-label">Total Siswa</span>
                    <strong className="stat-value">{classData.students.length}</strong>
                    <span className="stat-sub">Siswa terdaftar di {classCode}</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrap submissions" aria-hidden="true">📝</div>
                  <div className="stat-meta">
                    <span className="stat-label">Pengerjaan Kuis</span>
                    <strong className="stat-value">{classData.submissions.length}</strong>
                    <span className="stat-sub">Hasil diterima server</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrap average" aria-hidden="true">⭐</div>
                  <div className="stat-meta">
                    <span className="stat-label">Rata-rata Nilai</span>
                    <strong className="stat-value">{averagePercentage}%</strong>
                    <span className="stat-sub">Dari data valid diterima</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrap modules" aria-hidden="true">📚</div>
                  <div className="stat-meta">
                    <span className="stat-label">Kuis Tersedia</span>
                    <strong className="stat-value">11 Modul</strong>
                    <span className="stat-sub">3 Inti + 8 Bab Lanjutan</span>
                  </div>
                </div>
              </div>

              {/* Grafik Distribusi Nilai Siswa (Histogram Batang) */}
              <div className="teacher-section-box">
                <div className="section-header-row">
                  <div>
                    <h2>Grafik Distribusi Nilai Siswa</h2>
                    <p>Pengelompokan capaian nilai hasil kuis siswa yang tersimpan di server.</p>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    Total Sampel: <strong>{scoreDistribution.total}</strong> pengerjaan
                  </div>
                </div>

                {scoreDistribution.total === 0 ? (
                  <div className="teacher-empty-state">
                    <span className="empty-icon" aria-hidden="true">📭</span>
                    <h3>Belum ada data pengerjaan</h3>
                    <p>Setelah siswa menyelesaikan kuis di kelas {classCode}, grafik distribusi nilai akan muncul secara otomatis.</p>
                  </div>
                ) : (
                  <div className="chart-container">
                    <div className="bar-chart-grid" role="img" aria-label="Grafik batang distribusi nilai siswa">
                      {scoreDistribution.ranges.map((r, i) => {
                        const heightPct = Math.round((r.count / scoreDistribution.maxCount) * 100)
                        return (
                          <div className="bar-chart-col" key={i}>
                            <div className="bar-fill-track">
                              <div
                                className={`bar-fill-value ${r.color}`}
                                style={{ height: `${Math.max(heightPct, 6)}%` }}
                              >
                                <span className="bar-count-tag">{r.count} siswa</span>
                              </div>
                            </div>
                            <span className="bar-label">{r.label}</span>
                          </div>
                        )
                      })}
                    </div>
                    <span className="chart-caption">
                      * Sumber data berasal dari seluruh submisi kuis yang terverifikasi dan diterima oleh server.
                    </span>
                  </div>
                )}
              </div>

              {/* Aktivitas Kuis Terbaru */}
              <div className="teacher-section-box">
                <div className="section-header-row">
                  <div>
                    <h2>Aktivitas Kuis Terbaru</h2>
                    <p>Catatan riwayat submisi kuis terbaru yang masuk dari siswa.</p>
                  </div>
                  <button
                    type="button"
                    className="btn-view-detail"
                    onClick={() => setActiveMenu('quiz-results')}
                  >
                    Lihat Semua Hasil →
                  </button>
                </div>

                {classData.submissions.length === 0 ? (
                  <div className="teacher-empty-state">
                    <span className="empty-icon" aria-hidden="true">⏱</span>
                    <h3>Belum ada data pengerjaan</h3>
                    <p>Belum ada aktivitas kuis terbaru dari siswa pada kelas ini.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="teacher-table">
                      <thead>
                        <tr>
                          <th>Nama / Alias Siswa</th>
                          <th>Modul Kuis</th>
                          <th>Nilai</th>
                          <th>Waktu Pengerjaan Siswa</th>
                          <th>Diterima Server</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classData.submissions.slice(0, 5).map((sub, idx) => (
                          <tr key={sub.id || idx}>
                            <td>
                              <strong>{sub.userName || 'Siswa'}</strong>
                              {sub.userEmail && <div className="sub-meta">{sub.userEmail}</div>}
                            </td>
                            <td>
                              <span className="module-badge">{sub.moduleTitle || sub.moduleId}</span>
                            </td>
                            <td>
                              <span className={`score-badge ${sub.percentage >= 75 ? 'high' : sub.percentage >= 60 ? 'medium' : 'low'}`}>
                                {sub.percentage}% ({sub.score}/{sub.totalQuestions})
                              </span>
                            </td>
                            <td>
                              <time dateTime={sub.clientFinishedAt}>
                                {sub.clientFinishedAt ? new Date(sub.clientFinishedAt).toLocaleString('id-ID') : '—'}
                              </time>
                            </td>
                            <td>
                              <span className="status-badge received">
                                ✓ {sub.serverReceivedAt ? new Date(sub.serverReceivedAt).toLocaleTimeString('id-ID') : 'Tersimpan'}
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
            </div>
          )}

          {/* ===================================================================
              MENU 2: HASIL KUIS SISWA
              =================================================================== */}
          {activeMenu === 'quiz-results' && (
            <div className="teacher-section-box">
              <div className="section-header-row">
                <div>
                  <h2>Daftar Hasil Pengerjaan Kuis Siswa</h2>
                  <p>Seluruh hasil pengerjaan kuis siswa yang berhasil diterima dan tersimpan di server.</p>
                </div>
              </div>

              {/* Toolbar Pencarian & Filter */}
              <div className="filter-bar" style={{ marginBottom: '1.25rem' }}>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="Cari nama atau email siswa..."
                  value={searchQuiz}
                  onChange={(e) => setSearchQuiz(e.target.value)}
                  style={{ minWidth: '220px' }}
                />

                <select
                  className="filter-select"
                  value={filterModule}
                  onChange={(e) => setFilterModule(e.target.value)}
                  aria-label="Filter berdasarkan modul"
                >
                  <option value="all">Semua Modul Kuis</option>
                  <option value="modul-1">Modul 1: Kenali Larutan</option>
                  <option value="modul-2">Modul 2: Uji Daya Hantar</option>
                  <option value="modul-3">Modul 3: Jelajahi Ion</option>
                </select>

                <select
                  className="filter-select"
                  value={filterAttemptType}
                  onChange={(e) => setFilterAttemptType(e.target.value)}
                  aria-label="Filter jenis pengerjaan"
                >
                  <option value="all">Semua Jenis Pengerjaan</option>
                  <option value="evaluation">Evaluasi Akhir</option>
                  <option value="practice">Latihan Mandiri</option>
                  <option value="diagnostic">Tes Diagnostik</option>
                </select>

                <select
                  className="filter-select"
                  value={filterVersion}
                  onChange={(e) => setFilterVersion(e.target.value)}
                  aria-label="Filter versi soal"
                >
                  <option value="all">Semua Versi Soal</option>
                  <option value="v1.0">Versi v1.0 (Aktif)</option>
                </select>

                <select
                  className="filter-select"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  aria-label="Pengurutan data"
                >
                  <option value="newest">Waktu: Terbaru ke Terlama</option>
                  <option value="oldest">Waktu: Terlama ke Terbaru</option>
                  <option value="highest">Nilai: Tertinggi ke Terendah</option>
                  <option value="lowest">Nilai: Terendah ke Tertinggi</option>
                </select>
              </div>

              {filteredSubmissions.length === 0 ? (
                <div className="teacher-empty-state">
                  <span className="empty-icon" aria-hidden="true">🔍</span>
                  <h3>Belum ada data pengerjaan</h3>
                  <p>Tidak ada hasil kuis yang cocok dengan kriteria pencarian atau filter yang dipilih.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="teacher-table">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Nama Siswa</th>
                        <th>Email Siswa</th>
                        <th>Modul</th>
                        <th>Jenis Pengerjaan</th>
                        <th>Versi Soal</th>
                        <th>Nilai</th>
                        <th>Benar</th>
                        <th>Salah</th>
                        <th>Diterima Server</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubmissions.map((sub, idx) => (
                        <tr key={sub.id || idx}>
                          <td>{idx + 1}</td>
                          <td><strong>{sub.userName || 'Siswa'}</strong></td>
                          <td><code>{sub.userEmail || '—'}</code></td>
                          <td><span className="module-badge">{sub.moduleTitle || sub.moduleId}</span></td>
                          <td><span style={{ fontSize: '0.78rem' }}>{sub.attemptType || 'Evaluasi'}</span></td>
                          <td><code>{sub.questionVersion || 'v1.0'}</code></td>
                          <td>
                            <span className={`score-badge ${sub.percentage >= 75 ? 'high' : sub.percentage >= 60 ? 'medium' : 'low'}`}>
                              {sub.percentage}%
                            </span>
                          </td>
                          <td style={{ color: '#15803d', fontWeight: '700' }}>{sub.score || 0}</td>
                          <td style={{ color: '#b91c1c', fontWeight: '700' }}>
                            {sub.wrongCount !== undefined ? sub.wrongCount : Math.max(0, (sub.totalQuestions || 10) - (sub.score || 0))}
                          </td>
                          <td>
                            <time dateTime={sub.serverReceivedAt}>
                              {sub.serverReceivedAt ? new Date(sub.serverReceivedAt).toLocaleString('id-ID') : '—'}
                            </time>
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

          {/* ===================================================================
              MENU 3: DATA SISWA
              =================================================================== */}
          {activeMenu === 'students' && (
            <div className="teacher-section-box">
              <div className="section-header-row">
                <div>
                  <h2>Data Siswa Anggota Kelas {classCode}</h2>
                  <p>Daftar seluruh siswa yang telah terdaftar dan tergabung dalam kelas kewenangan Anda.</p>
                </div>
              </div>

              {/* Toolbar Pencarian & Filter Siswa */}
              <div className="filter-bar" style={{ marginBottom: '1.25rem' }}>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="Cari nama, email, atau username..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  style={{ minWidth: '240px' }}
                />

                <select
                  className="filter-select"
                  value={studentClassFilter}
                  onChange={(e) => setStudentClassFilter(e.target.value)}
                  aria-label="Filter berdasarkan kelas asal"
                >
                  <option value="all">Semua Kelas Asal</option>
                  {Array.from(new Set(classData.students.map((s) => s.className).filter(Boolean))).map((cls) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>

                <select
                  className="filter-select"
                  value={studentSort}
                  onChange={(e) => setStudentSort(e.target.value)}
                  aria-label="Urutkan data siswa"
                >
                  <option value="name">Urutkan: Nama (A-Z)</option>
                  <option value="score">Urutkan: Rata-Rata Nilai Tertinggi</option>
                  <option value="quizzes">Urutkan: Total Kuis Selesai</option>
                </select>
              </div>

              {filteredStudents.length === 0 ? (
                <div className="teacher-empty-state">
                  <span className="empty-icon" aria-hidden="true">👥</span>
                  <h3>Belum ada siswa yang bergabung</h3>
                  <p>Bagikan kode kelas <strong>{classCode}</strong> kepada siswa untuk bergabung ke kelas ini.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="teacher-table">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Nama Lengkap</th>
                        <th>Email</th>
                        <th>Username</th>
                        <th>Kelas Asal</th>
                        <th>Tanggal Bergabung</th>
                        <th>Total Kuis Selesai</th>
                        <th>Rata-rata Nilai</th>
                        <th>Status Aktivitas</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((std, idx) => (
                        <tr key={std.id || idx}>
                          <td>{idx + 1}</td>
                          <td><strong>{std.name}</strong></td>
                          <td><code>{std.email}</code></td>
                          <td><code>@{std.username || '-'}</code></td>
                          <td>{std.className || 'X'}</td>
                          <td>
                            <time dateTime={std.joinedClassAt || std.createdAt}>
                              {std.joinedClassAt || std.createdAt
                                ? new Date(std.joinedClassAt || std.createdAt).toLocaleDateString('id-ID')
                                : '—'}
                            </time>
                          </td>
                          <td>
                            <span className="module-badge">
                              {std.completedCount} Kuis
                            </span>
                          </td>
                          <td>
                            {std.averageScore !== null ? (
                              <span className={`score-badge ${std.averageScore >= kkm ? 'high' : 'medium'}`}>
                                {std.averageScore}%
                              </span>
                            ) : (
                              <span style={{ color: '#94a3b8' }}>Belum Mengerjakan</span>
                            )}
                          </td>
                          <td>
                            <span className={`status-badge ${std.completedCount > 0 ? 'received' : 'pending'}`}>
                              {std.completedCount > 0 ? 'Aktif Belajar' : 'Baru Terdaftar'}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn-view-detail"
                              onClick={() => setSelectedStudent(std)}
                            >
                              Detail Profil
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

          {/* ===================================================================
              MENU 4: ANALISIS PEMBELAJARAN
              =================================================================== */}
          {activeMenu === 'analysis' && (
            <div>
              {/* Bar Pengaturan KKM & Aturan Percobaan */}
              <div className="kkm-setting-box">
                <div className="kkm-input-wrap">
                  <label htmlFor="kkmInput">
                    <strong>Kriteria Ketuntasan Minimal (KKM):</strong>
                  </label>
                  <input
                    id="kkmInput"
                    type="number"
                    min="1"
                    max="100"
                    className="kkm-input"
                    value={kkm}
                    onChange={(e) => setKkm(Number(e.target.value) || 75)}
                  />
                  <small style={{ color: '#64748b' }}>Skala 0–100</small>
                </div>

                <div className="kkm-input-wrap">
                  <label htmlFor="ruleSelect">
                    <strong>Aturan Rekap Percobaan:</strong>
                  </label>
                  <select
                    id="ruleSelect"
                    className="filter-select"
                    value={trialRule}
                    onChange={(e) => setTrialRule(e.target.value)}
                  >
                    <option value="latest">Percobaan Terakhir (Rekomendasi Pedagogis)</option>
                    <option value="highest">Nilai Tertinggi (Best Score)</option>
                    <option value="first">Percobaan Pertama (Diagnostik Murni)</option>
                  </select>
                </div>
              </div>

              {/* 1. Ketuntasan Klasikal */}
              <div className="teacher-section-box">
                <div className="section-header-row">
                  <div>
                    <h2>1. Ketuntasan Klasikal Siswa (KKM: {kkm})</h2>
                    <p>
                      Persentase ketuntasan belajar dihitung dari siswa yang memiliki nilai hasil kuis valid (n = {masteryStats.total} siswa).
                    </p>
                  </div>
                </div>

                {masteryStats.total === 0 ? (
                  <div className="teacher-empty-state">
                    <span className="empty-icon" aria-hidden="true">📈</span>
                    <h3>Belum ada data pengerjaan</h3>
                    <p>Statistik ketuntasan klasikal akan dihitung setelah siswa menyelesaikan evaluasi kuis.</p>
                  </div>
                ) : (
                  <div>
                    <div className="mastery-overview-grid">
                      <div className="mastery-card success">
                        <span style={{ fontSize: '0.82rem', fontWeight: '700' }}>Siswa Tuntas (≥ {kkm})</span>
                        <strong className="mastery-num">{masteryStats.passed} Siswa</strong>
                        <small>{Math.round((masteryStats.passed / masteryStats.total) * 100)}% dari total pengisi</small>
                      </div>

                      <div className="mastery-card warning">
                        <span style={{ fontSize: '0.82rem', fontWeight: '700' }}>Siswa Belum Tuntas (&lt; {kkm})</span>
                        <strong className="mastery-num">{masteryStats.failed} Siswa</strong>
                        <small>{Math.round((masteryStats.failed / masteryStats.total) * 100)}% memerlukan remedial</small>
                      </div>

                      <div className="mastery-card" style={{ background: '#eff6ff', borderColor: '#bfdbfe', color: '#1e40af' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: '700' }}>Persentase Ketuntasan Klasikal</span>
                        <strong className="mastery-num">{masteryStats.percentage}%</strong>
                        <small>{masteryStats.percentage >= 75 ? '✓ Target Klasikal Tercapai' : '⚠️ Belum Memenuhi Standar Klasikal'}</small>
                      </div>
                    </div>

                    {/* Progress Bar Visualisasi Ketuntasan */}
                    <div style={{ background: '#fee2e2', borderRadius: '10px', height: '22px', overflow: 'hidden', display: 'flex' }}>
                      <div
                        style={{
                          width: `${masteryStats.percentage}%`,
                          background: '#10b981',
                          height: '100%',
                          transition: 'width 0.4s ease',
                        }}
                        title={`Tuntas: ${masteryStats.percentage}%`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Perbandingan Rata-rata Nilai per Modul */}
              <div className="teacher-section-box">
                <div className="section-header-row">
                  <div>
                    <h2>2. Perbandingan Rata-rata Nilai per Modul</h2>
                    <p>Perbandingan pemahaman siswa antar topik materi larutan elektrolit dan nonelektrolit.</p>
                  </div>
                </div>

                <div className="chart-container">
                  <div className="bar-chart-grid" role="img" aria-label="Grafik perbandingan rata-rata per modul">
                    {moduleComparisons.map((m, i) => (
                      <div className="bar-chart-col" key={i}>
                        <div className="bar-fill-track">
                          <div
                            className="bar-fill-value teal"
                            style={{ height: `${Math.max(m.avg, 6)}%` }}
                          >
                            <span className="bar-count-tag">{m.avg}%</span>
                          </div>
                        </div>
                        <span className="bar-label">{m.name}</span>
                        <small style={{ fontSize: '0.7rem', color: '#94a3b8' }}>n = {m.count}</small>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Analisis Butir Soal (Tingkat Kesalahan Tertinggi) */}
              <div className="teacher-section-box">
                <div className="section-header-row">
                  <div>
                    <h2>3. Analisis Butir Soal: Peringkat Kesalahan Tertinggi</h2>
                    <p>
                      Mendeteksi butir soal yang paling banyak dijawab salah oleh siswa beserta sebaran pilihan jawaban (distraktor).
                    </p>
                  </div>
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    Total Butir Dianalisis: <strong>{itemAnalysis.length}</strong>
                  </span>
                </div>

                {itemAnalysis.length === 0 ? (
                  <div className="teacher-empty-state">
                    <span className="empty-icon" aria-hidden="true">📊</span>
                    <h3>Belum ada data butir soal</h3>
                    <p>Analisis butir soal memerlukan data jawaban siswa yang tersimpan di server.</p>
                  </div>
                ) : (
                  <div className="item-analysis-list">
                    {itemAnalysis.map((item, idx) => (
                      <div className="item-analysis-card" key={item.id}>
                        <div className="item-header">
                          <span className="item-rank-badge">Peringkat #{idx + 1} Kesalahan</span>
                          <span className="item-error-rate">Tingkat Kesalahan: {item.errorRate}%</span>
                        </div>

                        <p className="item-question-text">
                          <strong>[{item.id}]</strong> {item.questionText}
                        </p>

                        <div className="options-distractor-grid">
                          {['A', 'B', 'C', 'D', 'E'].map((opt) => {
                            const count = item.optionCounts[opt] || 0
                            const isKey = opt === item.correctKey
                            return (
                              <div className={`distractor-chip ${isKey ? 'is-key' : ''}`} key={opt}>
                                <span>Opsi <strong>{opt}</strong> {isKey && '(Kunci)'}</span>
                                <span>{count} siswa</span>
                              </div>
                            )
                          })}
                        </div>

                        <div className="item-explanation-box">
                          <strong>Pembahasan Ilmiah:</strong> {item.pembahasan || 'Pembahasan terarsip sesuai versi soal.'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. Interpretasi Hasil Belajar & Rekomendasi Pedagogis */}
              <div className="teacher-section-box">
                <div className="section-header-row">
                  <div>
                    <h2>4. Interpretasi Hasil Belajar & Rekomendasi Guru</h2>
                    <p>Temuan pola miskonsepsi dan saran tindak lanjut pembelajaran berdasarkan data aktual.</p>
                  </div>
                </div>

                {itemAnalysis.length > 0 && itemAnalysis[0].errorRate > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div style={{ padding: '1rem', background: '#fef2f2', borderLeft: '4px solid #ef4444', borderRadius: '8px' }}>
                      <strong style={{ color: '#991b1b', display: 'block', marginBottom: '0.3rem' }}>
                        ⚠️ Topik Paling Banyak Mengalami Miskonsepsi: Soal [{itemAnalysis[0].id}]
                      </strong>
                      <p style={{ fontSize: '0.86rem', color: '#334155', margin: 0, lineHeight: '1.5' }}>
                        Soal ini memiliki tingkat kesalahan tertinggi ({itemAnalysis[0].errorRate}% salah dari {itemAnalysis[0].totalAnswered} siswa).
                        Distraktor paling sering dipilih menunjukkan siswa masih mencampuradukkan antara fenomena makroskopik (nyala lampu) dan keberadaan ion submikroskopik.
                      </p>
                    </div>

                    <div style={{ padding: '1rem', background: '#f0fdf4', borderLeft: '4px solid #10b981', borderRadius: '8px' }}>
                      <strong style={{ color: '#166534', display: 'block', marginBottom: '0.3rem' }}>
                        💡 Rekomendasi Aktivitas Pembelajaran Lanjutan:
                      </strong>
                      <p style={{ fontSize: '0.86rem', color: '#334155', margin: 0, lineHeight: '1.5' }}>
                        Guru disarankan memfasilitasi sesi penguatan konsep menggunakan fitur <strong>Molecular Explorer</strong> atau demonstrasi ulang di <strong>Laboratorium Mini</strong> untuk membandingkan larutan gula (sukrosa) yang larut secara molekuler vs garam dapur (NaCl) yang terdisosiasi menjadi ion bebas bergerak.
                      </p>
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
                    Data pengerjaan siswa masih dalam tahap pengumpulan. Interpretasi pola jawaban akan otomatis digenerasi setelah data terkumpul.
                  </p>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* -----------------------------------------------------------------------
          MODAL DETAIL JAWABAN BUTIR SOAL SISWA
          ----------------------------------------------------------------------- */}
      {selectedSubmission && (
        <div className="detail-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-detail-title">
          <div className="detail-modal-card">
            <div className="detail-modal-header">
              <h3 id="modal-detail-title">Detail Jawaban Kuis Siswa</h3>
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                aria-label="Tutup detail jawaban"
              >
                ✕
              </button>
            </div>

            <div className="detail-modal-body">
              {/* Ringkasan Meta Pengerjaan */}
              <div className="detail-meta-grid">
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.74rem', display: 'block' }}>NAMA SISWA</span>
                  <strong>{selectedSubmission.userName}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.74rem', display: 'block' }}>MODUL / AKTIVITAS</span>
                  <strong>{selectedSubmission.moduleTitle || selectedSubmission.moduleId}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.74rem', display: 'block' }}>JENIS / VERSI SOAL</span>
                  <strong>{selectedSubmission.attemptType || 'Evaluasi'} ({selectedSubmission.questionVersion || 'v1.0'})</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.74rem', display: 'block' }}>NILAI AKHIR</span>
                  <strong style={{ color: selectedSubmission.percentage >= kkm ? '#15803d' : '#b91c1c' }}>
                    {selectedSubmission.score}/{selectedSubmission.totalQuestions} ({selectedSubmission.percentage}%)
                  </strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.74rem', display: 'block' }}>WAKTU SISWA</span>
                  <span>{selectedSubmission.clientFinishedAt ? new Date(selectedSubmission.clientFinishedAt).toLocaleString('id-ID') : '—'}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.74rem', display: 'block' }}>DITERIMA SERVER</span>
                  <span>{selectedSubmission.serverReceivedAt ? new Date(selectedSubmission.serverReceivedAt).toLocaleString('id-ID') : 'Tersimpan'}</span>
                </div>
              </div>

              {/* Rincian Jawaban Per Butir */}
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--teacher-navy)', marginBottom: '0.75rem' }}>
                Rincian Jawaban Asli Siswa:
              </h4>

              {selectedSubmission.answers && Object.keys(selectedSubmission.answers).length > 0 ? (
                <div className="detail-answers-list">
                  {Object.entries(selectedSubmission.answers).map(([soalId, ans], idx) => (
                    <div className={`detail-answer-item ${ans.isCorrect ? 'correct' : 'incorrect'}`} key={soalId}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <span style={{ fontWeight: '700', fontSize: '0.84rem', color: '#64748b' }}>
                          Butir #{idx + 1} • ID: <code>{soalId}</code>
                        </span>
                        <span className={`status-badge ${ans.isCorrect ? 'received' : 'pending'}`}>
                          {ans.isCorrect ? '✓ Benar' : '✗ Salah'}
                        </span>
                      </div>

                      <p style={{ fontSize: '0.9rem', color: 'var(--teacher-navy)', margin: '0 0 0.6rem', fontWeight: '600' }}>
                        {ans.questionText || `Pertanyaan [${soalId}]`}
                      </p>

                      <div style={{ fontSize: '0.84rem', marginBottom: '0.5rem' }}>
                        <span>Pilihan Siswa: </span>
                        <strong>Opsi {ans.selectedOptionId}</strong> — {ans.selectedOptionText || '(Teks jawaban)'}
                      </div>

                      {!ans.isCorrect && ans.correctAnswerId && (
                        <div style={{ fontSize: '0.84rem', color: '#15803d', fontWeight: '700', marginBottom: '0.5rem' }}>
                          Kunci Jawaban Seharusnya: Opsi {ans.correctAnswerId}
                        </div>
                      )}

                      {ans.pembahasan && (
                        <div className="item-explanation-box">
                          <strong>Pembahasan:</strong> {ans.pembahasan}
                          {ans.caraPengerjaan && <div style={{ marginTop: '0.25rem' }}><strong>Langkah:</strong> {ans.caraPengerjaan}</div>}
                          {ans.rumus && <div style={{ marginTop: '0.25rem', fontFamily: 'monospace' }}><strong>Rumus:</strong> {ans.rumus}</div>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', fontSize: '0.86rem', color: '#64748b' }}>
                  Siswa menyelesaikan kuis dengan total perolehan skor <strong>{selectedSubmission.score}/{selectedSubmission.totalQuestions}</strong>.
                  Data rincian per butir versi {selectedSubmission.questionVersion || 'v1.0'} terarsip secara ringkas.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* MODAL DETAIL PROFIL SISWA */}
      {selectedStudent && (
        <div className="detail-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-student-title">
          <div className="detail-modal-card" style={{ maxWidth: '600px' }}>
            <div className="detail-modal-header">
              <h3 id="modal-student-title">Detail Profil & Capaian Siswa</h3>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                aria-label="Tutup detail siswa"
              >
                ✕
              </button>
            </div>

            <div className="detail-modal-body">
              <div className="detail-meta-grid">
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.74rem', display: 'block' }}>NAMA LENGKAP</span>
                  <strong>{selectedStudent.name}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.74rem', display: 'block' }}>EMAIL</span>
                  <code>{selectedStudent.email}</code>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.74rem', display: 'block' }}>USERNAME</span>
                  <code>@{selectedStudent.username || '-'}</code>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.74rem', display: 'block' }}>KELAS ASAL</span>
                  <strong>{selectedStudent.className || 'X'}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.74rem', display: 'block' }}>KODE KELAS GURU</span>
                  <strong style={{ color: '#16a6a1' }}>{classCode}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.74rem', display: 'block' }}>RATA-RATA NILAI</span>
                  <strong>{selectedStudent.averageScore !== null ? `${selectedStudent.averageScore}%` : 'Belum Ada'}</strong>
                </div>
              </div>

              <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--teacher-navy)', marginBottom: '0.65rem' }}>
                Riwayat Kuis yang Telah Dikerjakan ({selectedStudent.completedCount}):
              </h4>
              {dedupedSubmissions.filter((s) => s.userId === selectedStudent.id).length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {dedupedSubmissions
                    .filter((s) => s.userId === selectedStudent.id)
                    .map((sub, i) => (
                      <li key={i} style={{ padding: '0.6rem 0.75rem', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span><strong>{sub.moduleTitle || sub.moduleId}</strong> ({sub.questionVersion || 'v1.0'})</span>
                        <span className={`score-badge ${sub.percentage >= kkm ? 'high' : 'medium'}`}>
                          {sub.percentage}% ({sub.score}/{sub.totalQuestions})
                        </span>
                      </li>
                    ))}
                </ul>
              ) : (
                <p style={{ fontSize: '0.84rem', color: '#64748b' }}>Siswa ini belum menyelesaikan kuis pada kelas ini.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
