import { useMemo, useState } from 'react'
import { getUserLabLogKey, LEGACY_LAB_LOG_KEY, readLearningData, recordLearningActivity, writeLearningData } from '../../data/learningStore.js'
import './DigitalChemistryJournal.css'

const JOURNAL_KEY = 'digital-journal'
const JOURNAL_SECTIONS = [
  { key: 'title', label: 'Judul praktikum', prompt: 'Tuliskan judul praktikum.', rows: 2 },
  { key: 'objective', label: 'Tujuan praktikum', prompt: 'Apa yang ingin kamu selidiki?', rows: 2 },
  { key: 'theory', label: 'Dasar teori', prompt: 'Catat konsep dan sumber teori yang kamu gunakan.', rows: 4 },
  { key: 'question', label: 'Rumusan masalah', prompt: 'Tuliskan pertanyaan penyelidikan.', rows: 2 },
  { key: 'hypothesis', label: 'Hipotesis', prompt: 'Tuliskan prediksi dan alasanmu sebelum eksperimen.', rows: 3 },
  { key: 'variables', label: 'Variabel percobaan', prompt: 'Variabel bebas, terikat, dan kontrol yang kamu tentukan.', rows: 3 },
  { key: 'materials', label: 'Alat dan bahan', prompt: 'Catat alat dan bahan yang kamu pilih.', rows: 2 },
  { key: 'procedure', label: 'Prosedur praktikum', prompt: 'Catat urutan prosedur yang kamu lakukan atau modifikasi.', rows: 4 },
  { key: 'analysis', label: 'Analisis data', prompt: 'Jelaskan pola pada data yang kamu catat.', rows: 4 },
  { key: 'discussion', label: 'Pertanyaan diskusi', prompt: 'Tuliskan pertanyaan dan jawaban diskusimu.', rows: 3 },
  { key: 'conclusion', label: 'Kesimpulan', prompt: 'Simpulkan hasil dengan merujuk pada bukti.', rows: 3 },
  { key: 'reflection', label: 'Refleksi', prompt: 'Apa yang kamu pahami, dan apa yang masih ingin kamu pelajari?', rows: 3 },
]

function readLabObservations(userId) {
  try {
    const stored = JSON.parse(window.localStorage.getItem(getUserLabLogKey(userId)) || '[]')
    const legacy = JSON.parse(window.localStorage.getItem(LEGACY_LAB_LOG_KEY) || '[]')
    return {
      observations: Array.isArray(stored) ? stored.filter((entry) => entry.studentId === userId) : [],
      hasUnassignedData: Array.isArray(legacy) && legacy.length > 0,
    }
  } catch (error) {
    console.error('Unable to read virtual laboratory observations for journal import.', error)
    throw new Error('Data pengamatan laboratorium tidak dapat dibaca.')
  }
}

function createJournal(user) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fields: Object.fromEntries(JOURNAL_SECTIONS.map(({ key }) => [key, ''])),
    linkedObservations: [],
    author: { name: user?.name || '', className: user?.className || '' },
  }
}

export default function DigitalChemistryJournal({ userId, user, onActivity }) {
  const [entries, setEntries] = useState(() => readLearningData(userId, JOURNAL_KEY, []))
  const [activeId, setActiveId] = useState(entries[0]?.id || '')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const activeEntry = entries.find((entry) => entry.id === activeId)
  const otherEntries = useMemo(() => entries.filter((entry) => entry.id !== activeId), [entries, activeId])

  const persistEntries = (next, message) => {
    setEntries(next)
    setNotice(message)
    try {
      setError('')
      writeLearningData(userId, JOURNAL_KEY, next)
      return true
    } catch (saveError) {
      setError(saveError.message)
      return false
    }
  }

  const addJournal = () => {
    const next = createJournal(user)
    const saved = persistEntries([next, ...entries], 'Jurnal baru dibuat. Isian ilmiah tetap kosong sampai kamu mengerjakannya.')
    setActiveId(next.id)
    if (saved) {
      recordLearningActivity(userId, {
        type: 'journal',
        title: 'Membuat jurnal praktikum',
        detail: 'Jurnal baru siap diisi.',
      }, onActivity)
    }
  }

  const updateEntry = (update) => {
    const next = entries.map((entry) => (
      entry.id === activeId
        ? { ...update(entry), updatedAt: new Date().toISOString() }
        : entry
    ))
    persistEntries(next, 'Perubahan tersimpan otomatis di browser ini.')
  }

  const importLabData = () => {
    try {
      const { observations, hasUnassignedData } = readLabObservations(userId)
      if (observations.length === 0) {
        setNotice(hasUnassignedData
          ? 'Belum ada data lab untuk akun ini. Catatan lama yang tidak memiliki identitas akun tetap tersimpan di browser, tetapi tidak diimpor agar data antar akun tidak tercampur.'
          : 'Belum ada data. Jalankan uji di Laboratorium Mini dengan akun ini dan pilih “Catat hasil” terlebih dahulu.')
        return
      }
      const next = entries.map((entry) => entry.id === activeId ? ({
        ...entry,
        linkedObservations: observations.slice(0, 30),
        updatedAt: new Date().toISOString(),
      }) : entry)
      const saved = persistEntries(next, `${Math.min(observations.length, 30)} pengamatan dari Laboratorium Mini ditautkan.`)
      if (saved) {
        recordLearningActivity(userId, {
          type: 'journal',
          title: 'Menautkan hasil laboratorium ke jurnal',
          detail: `${Math.min(observations.length, 30)} pengamatan nyata dari aktivitas tersimpan.`,
        }, onActivity)
      }
    } catch (importError) {
      setError(importError.message)
    }
  }

  const removeJournal = () => {
    const remaining = entries.filter((entry) => entry.id !== activeId)
    persistEntries(remaining, 'Jurnal yang dipilih telah dihapus dari akun lokal ini.')
    setActiveId(remaining[0]?.id || '')
  }

  return (
    <section className="learning-tool digital-journal" aria-labelledby="digital-journal-title">
      <header className="digital-journal-heading">
        <div><span className="digital-journal-kicker">EKSPERIMEN • CATATAN ILMIAH</span><h1 id="digital-journal-title">Jurnal praktikum digital</h1><p>Buat beberapa jurnal, tulis jawabanmu sendiri, lalu tautkan data hasil uji yang benar-benar kamu catat.</p></div>
        <button type="button" className="digital-journal-primary" onClick={addJournal}>＋ Jurnal baru</button>
      </header>

      <div className="digital-journal-layout">
        <aside className="digital-journal-list" aria-label="Daftar jurnal tersimpan">
          <h2>Jurnal tersimpan ({entries.length})</h2>
          {entries.length === 0
            ? <p>Belum ada jurnal. Pilih “Jurnal baru” untuk memulai.</p>
            : <ul>{[...entries.filter((entry) => entry.id === activeId), ...otherEntries].map((entry) => (
              <li key={entry.id}><button type="button" className={entry.id === activeId ? 'active' : ''} onClick={() => { setActiveId(entry.id); setNotice('Jurnal dibuka kembali.') }}>
                <strong>{entry.fields.title || 'Jurnal tanpa judul'}</strong>
                <span>Diperbarui {new Date(entry.updatedAt).toLocaleString('id-ID')}</span>
              </button></li>
            ))}</ul>}
        </aside>

        {!activeEntry
          ? <section className="digital-journal-empty" aria-live="polite"><span aria-hidden="true">▤</span><h2>Jurnalmu menunggu untuk diisi</h2><p>Buat jurnal baru untuk mencatat penyelidikan. Jawaban tidak akan diisi otomatis.</p><button type="button" className="digital-journal-primary" onClick={addJournal}>Buat jurnal pertama</button></section>
          : <article className="digital-journal-editor">
            <div className="digital-journal-identity">
              <span><small>Nama peserta didik</small><strong>{activeEntry.author?.name || user?.name || '—'}</strong></span>
              <span><small>Kelas</small><strong>{activeEntry.author?.className || user?.className || '—'}</strong></span>
              <span><small>Tanggal dibuat</small><strong>{new Date(activeEntry.createdAt).toLocaleDateString('id-ID')}</strong></span>
            </div>
            <div className="digital-journal-sections">
              {JOURNAL_SECTIONS.map((section) => (
                <label key={section.key}>
                  <span>{section.label}</span>
                  <textarea rows={section.rows} value={activeEntry.fields?.[section.key] || ''} placeholder={section.prompt} onChange={(event) => updateEntry((entry) => ({ ...entry, fields: { ...entry.fields, [section.key]: event.target.value } }))} />
                </label>
              ))}
            </div>

            <section className="digital-journal-observations" aria-labelledby="journal-lab-data-title">
              <div><div><span className="digital-journal-kicker">INTEGRASI LABORATORIUM MINI</span><h2 id="journal-lab-data-title">Data hasil pengamatan</h2></div><button type="button" className="digital-journal-secondary" onClick={importLabData}>Tautkan data lab terbaru</button></div>
              {activeEntry.linkedObservations?.length
                ? <div className="digital-journal-table-scroll"><table><thead><tr><th>Waktu</th><th>Sampel</th><th>Konsentrasi</th><th>Variabel</th><th>Arus</th><th>Konduktivitas</th><th>Lampu</th></tr></thead><tbody>{activeEntry.linkedObservations.map((observation) => <tr key={observation.id}><td>{observation.time}</td><td>{observation.solution} ({observation.formula})</td><td>{observation.concentration} M</td><td>{observation.temperature}°C · {observation.voltage} V · {observation.distance} cm</td><td>{observation.current} A</td><td>{observation.conductivity} S/m</td><td>{observation.lamp}</td></tr>)}</tbody></table></div>
                : <p className="digital-journal-empty-data">Belum ada data yang ditautkan. Tidak ada hasil simulasi yang dibuat atau ditambahkan otomatis.</p>}
            </section>
            <footer className="digital-journal-actions">
              <span role="status">{error || notice || 'Penyimpanan otomatis aktif.'}</span>
              <button type="button" className="digital-journal-secondary" onClick={() => window.print()}>Cetak / Simpan PDF</button>
              <button type="button" className="digital-journal-delete" onClick={removeJournal}>Hapus jurnal</button>
            </footer>
          </article>}
      </div>
    </section>
  )
}
