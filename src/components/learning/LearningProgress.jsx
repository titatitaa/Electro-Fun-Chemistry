import { useState } from 'react'
import { expandedChapters } from '../../data/expandedCourse.js'
import { getUserLabLogKey, LEGACY_LAB_LOG_KEY, readLearningActivities, readLearningData } from '../../data/learningStore.js'
import './LearningProgress.css'

const MODULES_KEY = 'electrofun_progress'
function readArray(key) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || '[]')
    return Array.isArray(value) ? value : []
  } catch (error) {
    console.error(`Unable to read existing learning progress (${key}).`, error)
    return []
  }
}

export default function LearningProgress({ userId, user }) {
  const [refresh, setRefresh] = useState(0)
  const completedModules = readArray(MODULES_KEY).filter((id) => ['modul-1', 'modul-2', 'modul-3'].includes(id))
  const labObservations = readArray(getUserLabLogKey(userId))
  const legacyLabObservations = readArray(LEGACY_LAB_LOG_KEY)
  const quizResults = readLearningData(userId, 'quiz-results', [])
  const diagnostics = readLearningData(userId, 'diagnostic', { reports: [] })
  const missions = readLearningData(userId, 'mission', { levels: {}, points: 0 })
  const map = readLearningData(userId, 'concept-map', null)
  const journals = readLearningData(userId, 'digital-journal', [])
  const readChapters = readLearningData(userId, 'course-reading', [])
  const activities = readLearningActivities(userId)
  const completedChapterIds = new Set(completedModules)
  const latestQuiz = quizResults[0]
  const latestDiagnostic = diagnostics.reports?.[0]
  const missionLevels = Object.keys(missions.levels || {})
  const savedMapCount = map && Array.isArray(map.nodes) && map.nodes.length > 0 ? 1 : 0
  const completionPercent = Math.round((completedChapterIds.size / 3) * 100)
  const progressBars = [
    { label: 'Bab materi dibuka', value: readChapters.length, total: 8, unit: 'bab' },
    { label: 'Modul ditandai selesai', value: completedChapterIds.size, total: 3, unit: 'modul' },
    { label: 'Pengamatan laboratorium', value: labObservations.length, total: 5, unit: 'catatan', empty: labObservations.length === 0 },
    { label: 'Level misi terbuka', value: missionLevels.length, total: 5, unit: 'level' },
    { label: 'Kuis terbaru', value: latestQuiz?.score ?? 0, total: latestQuiz?.total ?? 0, unit: 'benar', empty: !latestQuiz },
    { label: 'Tes diagnostik terbaru', value: latestDiagnostic?.score ?? 0, total: latestDiagnostic?.total ?? 0, unit: 'benar', empty: !latestDiagnostic },
  ]
  const competencyItems = [
    { title: 'Konsep dasar larutan', mastered: completedChapterIds.has('modul-1') },
    { title: 'Praktikum daya hantar', mastered: completedChapterIds.has('modul-2') || labObservations.length > 0 },
    { title: 'Jenis elektrolit dan ion', mastered: completedChapterIds.has('modul-3') },
    { title: 'Menganalisis bukti eksperimen', mastered: labObservations.length >= 2 || missionLevels.length >= 4 },
  ]

  const metrics = [
    { label: 'Modul selesai', value: `${completedChapterIds.size}/3`, detail: 'penanda penyelesaian yang tersimpan' },
    { label: 'Bab materi dibuka', value: `${readChapters.length}/8`, detail: 'bab yang pernah dibuka pada profil ini' },
    { label: 'Kuis selesai', value: String(quizResults.length), detail: latestQuiz ? `terakhir ${latestQuiz.score}/${latestQuiz.total}` : 'belum ada hasil kuis' },
    { label: 'Tes diagnostik', value: latestDiagnostic ? latestDiagnostic.category : 'Belum ada', detail: latestDiagnostic ? 'hasil terbaru' : 'selesaikan tes untuk melihat hasil' },
    { label: 'Uji virtual', value: String(labObservations.length), detail: 'pengamatan yang benar-benar dicatat' },
    { label: 'Misi terbuka', value: `${missionLevels.length}/5`, detail: `${missions.points || 0} poin tersimpan` },
    { label: 'Peta konsep', value: String(savedMapCount), detail: 'peta dengan konsep tersimpan' },
    { label: 'Jurnal', value: String(journals.length), detail: 'jurnal yang tersimpan' },
  ]

  return (
    <section className="learning-tool learning-progress" aria-labelledby="learning-progress-title">
      <header className="learning-progress-heading">
        <span className="learning-progress-kicker">PERKEMBANGAN BELAJAR</span>
        <h1 id="learning-progress-title">Progres belajar {user?.name || 'siswa'}</h1>
        <p>{user?.className ? `Kelas ${user.className} · ` : ''}Ringkasan ini menampilkan aktivitas yang tersimpan, bukan data contoh.</p>
        <button type="button" className="learning-progress-refresh" onClick={() => setRefresh((value) => value + 1)}>Perbarui ringkasan</button>
      </header>

      <section className="learning-progress-card" aria-label="Penyelesaian modul">
        <div className="learning-progress-card-title">
          <div><h2>Penyelesaian modul utama</h2><p>{completedChapterIds.size} dari 3 modul ditandai selesai di browser ini.</p></div>
          <strong>{completionPercent}%</strong>
        </div>
        <div className="learning-progress-track" role="progressbar" aria-valuenow={completionPercent} aria-valuemin={0} aria-valuemax={100}>
          <i style={{ width: `${completionPercent}%` }} />
        </div>
        <div className="learning-progress-module-list">
          {['modul-1', 'modul-2', 'modul-3'].map((id, index) => (
            <span className={completedChapterIds.has(id) ? 'complete' : ''} key={id}>
              <i aria-hidden="true">{completedChapterIds.has(id) ? '✓' : index + 1}</i>{`Modul ${index + 1}`}
            </span>
          ))}
        </div>
        <p className="learning-progress-caveat">Status modul utama masih menggunakan penanda lokal lama yang berlaku pada browser ini. Aktivitas fitur baru dan catatan laboratorium yang dibuat sekarang dipisahkan berdasarkan akun. {legacyLabObservations.length > 0 ? 'Catatan laboratorium lama tanpa identitas akun tetap tersimpan, tetapi tidak dimasukkan ke progres akun agar tidak tertukar.' : ''}</p>
      </section>

      <div className="learning-progress-metrics">
        {metrics.map((metric) => (
          <article className="learning-progress-metric" key={metric.label}>
            <span>{metric.label}</span><strong>{metric.value}</strong><small>{metric.detail}</small>
          </article>
        ))}
      </div>

      <section className="learning-progress-card" aria-labelledby="learning-progress-chart-title">
        <h2 id="learning-progress-chart-title">Grafik aktivitas belajar tersimpan</h2>
        <div className="learning-progress-chart">
          {progressBars.map((bar) => {
            const percent = bar.total ? Math.min(100, Math.round((bar.value / bar.total) * 100)) : 0
            return <div className="learning-progress-chart-row" key={bar.label}>
              <span>{bar.label}</span>
              <div role="img" aria-label={bar.empty ? `${bar.label}: belum ada data` : `${bar.label}: ${bar.value} dari ${bar.total}`}>
                <i style={{ width: `${percent}%` }} />
              </div>
              <strong>{bar.empty ? 'Belum ada data' : `${bar.value}/${bar.total} ${bar.unit}`}</strong>
            </div>
          })}
        </div>
      </section>

      <div className="learning-progress-grid">
        <section className="learning-progress-card">
          <h2>Kompetensi</h2>
          <ul className="learning-competency-list">
            {competencyItems.map((item) => <li className={item.mastered ? 'mastered' : ''} key={item.title}><i>{item.mastered ? '✓' : '○'}</i>{item.title}<small>{item.mastered ? 'Ada bukti aktivitas tersimpan' : 'Belum ada bukti aktivitas tersimpan'}</small></li>)}
          </ul>
        </section>
        <section className="learning-progress-card">
          <h2>Aktivitas terakhir</h2>
          {activities.length === 0
            ? <p className="learning-progress-empty">Belum ada aktivitas pada fitur pembelajaran baru. Selesaikan kuis, susun peta konsep, atau simpan jurnal untuk mengisi riwayat.</p>
            : <ol className="learning-activity-list">{activities.slice(0, 6).map((activity) => (
              <li key={activity.id}><strong>{activity.title}</strong><span>{activity.detail}</span><time dateTime={activity.at}>{new Date(activity.at).toLocaleString('id-ID')}</time></li>
            ))}</ol>}
        </section>
      </div>

      <section className="learning-progress-card">
        <h2>Materi dan rekomendasi</h2>
        <div className="learning-recommendations">
          {expandedChapters.map((chapter, index) => {
            const isRead = readChapters.includes(chapter.id)
            return <article key={chapter.id}><span>{isRead ? 'SUDAH DIBUKA' : `BAB ${index + 1}`}</span><strong>{chapter.title}</strong><p>{isRead ? 'Kamu sudah membuka bab ini; lanjutkan dengan latihan atau ulangi materi.' : `Rekomendasi berikutnya: pelajari bab “${chapter.title}”.`}</p></article>
          })}
        </div>
      </section>
      <span className="learning-progress-refresh-state" aria-live="polite">{refresh > 0 ? 'Ringkasan diperbarui.' : ''}</span>
    </section>
  )
}
