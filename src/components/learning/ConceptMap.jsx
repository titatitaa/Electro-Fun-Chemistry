import { useMemo, useRef, useState } from 'react'
import { readLearningData, writeLearningData, recordLearningActivity } from '../../data/learningStore.js'
import './ConceptMap.css'

const INITIAL_NODES = [
  { id: 'solution', label: 'Larutan', x: 500, y: 80 },
  { id: 'electrolyte', label: 'Elektrolit', x: 275, y: 210 },
  { id: 'nonelectrolyte', label: 'Nonelektrolit', x: 725, y: 210 },
  { id: 'ions', label: 'Ion bergerak', x: 170, y: 370 },
  { id: 'molecules', label: 'Molekul netral', x: 820, y: 370 },
  { id: 'conductivity', label: 'Daya hantar listrik', x: 390, y: 520 },
  { id: 'ionization', label: 'Derajat ionisasi', x: 600, y: 370 },
]

const VALID_RELATIONS = [
  { from: 'solution', to: 'electrolyte', label: 'dapat berupa' },
  { from: 'solution', to: 'nonelectrolyte', label: 'dapat berupa' },
  { from: 'electrolyte', to: 'ions', label: 'menghasilkan' },
  { from: 'nonelectrolyte', to: 'molecules', label: 'tetap berupa' },
  { from: 'ions', to: 'conductivity', label: 'menghantarkan muatan sehingga berkontribusi pada' },
  { from: 'electrolyte', to: 'ionization', label: 'diklasifikasikan berdasarkan' },
]

const PRACTICE = [
  { from: 'electrolyte', to: 'ions', label: 'menghasilkan' },
  { from: 'nonelectrolyte', to: 'molecules', label: 'tetap berupa' },
  { from: 'ions', to: 'conductivity', label: 'menghantarkan muatan sehingga berkontribusi pada' },
  { from: 'solution', to: 'electrolyte', label: 'dapat berupa' },
  { from: 'electrolyte', to: 'ionization', label: 'diklasifikasikan berdasarkan' },
]

const RELATION_CHOICES = [...new Set(VALID_RELATIONS.map((relation) => relation.label))]

function createInitialMap() {
  return {
    nodes: INITIAL_NODES.map((node) => ({ ...node })),
    edges: VALID_RELATIONS.map((edge, index) => ({ ...edge, id: `seed-${index + 1}` })),
    practice: { attempts: 0, correct: 0, index: 0 },
  }
}

function normalizeMap(value) {
  if (!value || !Array.isArray(value.nodes) || !Array.isArray(value.edges)) return createInitialMap()
  const nodes = value.nodes.filter((node) =>
    typeof node.id === 'string' && typeof node.label === 'string' &&
    Number.isFinite(node.x) && Number.isFinite(node.y),
  )
  const ids = new Set(nodes.map((node) => node.id))
  const edges = value.edges.filter((edge) =>
    typeof edge.id === 'string' && ids.has(edge.from) && ids.has(edge.to) &&
    typeof edge.label === 'string',
  )
  const practice = value.practice && Number.isFinite(value.practice.attempts) &&
    Number.isFinite(value.practice.correct) && Number.isFinite(value.practice.index)
    ? value.practice
    : { attempts: 0, correct: 0, index: 0 }
  return { nodes, edges, practice }
}

function svgMarkup(map) {
  const nodeById = new Map(map.nodes.map((node) => [node.id, node]))
  const edges = map.edges.map((edge) => {
    const from = nodeById.get(edge.from)
    const to = nodeById.get(edge.to)
    if (!from || !to) return ''
    const mx = (from.x + to.x) / 2
    const my = (from.y + to.y) / 2
    return `<g><line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="#16A6A1" stroke-width="3" marker-end="url(#arrow)"/><text x="${mx}" y="${my - 10}" text-anchor="middle" fill="#203864" font-size="16">${escapeXml(edge.label)}</text></g>`
  }).join('')
  const nodes = map.nodes.map((node) =>
    `<g><rect x="${node.x - 86}" y="${node.y - 28}" width="172" height="56" rx="18" fill="#DCEEFF" stroke="#203864" stroke-width="2"/><text x="${node.x}" y="${node.y + 6}" text-anchor="middle" fill="#203864" font-size="16">${escapeXml(node.label)}</text></g>`,
  ).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 600"><defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#16A6A1"/></marker></defs><rect width="1000" height="600" fill="#FFF9EF"/>${edges}${nodes}</svg>`
}

function escapeXml(value) {
  return value.replace(/[<>&'"]/g, (character) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;',
  })[character])
}

function ConceptMapInstance({ userId, onActivity }) {
  const [map, setMap] = useState(() => normalizeMap(readLearningData(userId, 'concept-map', createInitialMap())))
  const [selectedNode, setSelectedNode] = useState('')
  const [newConcept, setNewConcept] = useState('')
  const [fromNode, setFromNode] = useState('')
  const [toNode, setToNode] = useState('')
  const [relation, setRelation] = useState('')
  const [practiceTarget, setPracticeTarget] = useState('')
  const [practiceRelation, setPracticeRelation] = useState('')
  const [notice, setNotice] = useState('')
  const [drag, setDrag] = useState(null)
  const svgRef = useRef(null)
  const dragStart = useRef(null)
  const nodeById = useMemo(() => new Map(map.nodes.map((node) => [node.id, node])), [map.nodes])
  const availableChallenges = PRACTICE.filter((item) => nodeById.has(item.from) && nodeById.has(item.to))
  const challenge = availableChallenges.length
    ? availableChallenges[map.practice.index % availableChallenges.length]
    : null

  function recordActivity(activity) {
    try {
      const activities = recordLearningActivity(userId, { feature: 'concept-map', ...activity })
      try {
        onActivity?.(activities)
      } catch (error) {
        return `Aktivitas tersimpan, tetapi pembaruan ringkasan gagal: ${error instanceof Error ? error.message : 'kesalahan callback.'}`
      }
      return ''
    } catch (error) {
      return `Aktivitas belum tersimpan: ${error instanceof Error ? error.message : 'kesalahan penyimpanan.'}`
    }
  }

  function persist(nextMap, activity) {
    try {
      writeLearningData(userId, 'concept-map', nextMap)
      setMap(nextMap)
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Peta tidak dapat disimpan.')
      return false
    }
    const activityNotice = activity ? recordActivity(activity) : ''
    setNotice(`Peta berhasil disimpan di perangkat ini.${activityNotice ? ` ${activityNotice}` : ''}`)
    return true
  }

  function addConcept(event) {
    event.preventDefault()
    const label = newConcept.trim()
    if (!label) {
      setNotice('Masukkan nama konsep terlebih dahulu.')
      return
    }
    if (map.nodes.some((node) => node.label.toLocaleLowerCase() === label.toLocaleLowerCase())) {
      setNotice('Konsep tersebut sudah ada di peta.')
      return
    }
    const angle = map.nodes.length * 2.4
    const node = {
      id: `concept-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      label,
      x: Math.max(100, Math.min(900, 500 + Math.cos(angle) * 280)),
      y: Math.max(70, Math.min(530, 300 + Math.sin(angle) * 190)),
    }
    if (persist({ ...map, nodes: [...map.nodes, node] }, { action: 'concept-added', concept: label })) {
      setNewConcept('')
      setSelectedNode(node.id)
    }
  }

  function removeSelected() {
    const node = nodeById.get(selectedNode)
    if (!node) {
      setNotice('Pilih konsep yang ingin dihapus.')
      return
    }
    const nextMap = {
      ...map,
      nodes: map.nodes.filter((item) => item.id !== selectedNode),
      edges: map.edges.filter((edge) => edge.from !== selectedNode && edge.to !== selectedNode),
    }
    if (persist(nextMap, { action: 'concept-removed', concept: node.label })) setSelectedNode('')
  }

  function addConnection(event) {
    event.preventDefault()
    const label = relation.trim()
    if (!fromNode || !toNode || !label) {
      setNotice('Pilih konsep asal, tujuan, dan isi label hubungan.')
      return
    }
    if (fromNode === toNode) {
      setNotice('Hubungan harus menghubungkan dua konsep yang berbeda.')
      return
    }
    if (map.edges.some((edge) => edge.from === fromNode && edge.to === toNode && edge.label.toLocaleLowerCase() === label.toLocaleLowerCase())) {
      setNotice('Hubungan tersebut sudah ada.')
      return
    }
    const edge = { id: `edge-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, from: fromNode, to: toNode, label }
    if (persist({ ...map, edges: [...map.edges, edge] }, { action: 'connection-added', relation: label })) setRelation('')
  }

  function removeConnection(edgeId) {
    const edge = map.edges.find((item) => item.id === edgeId)
    if (!edge) return
    persist(
      { ...map, edges: map.edges.filter((item) => item.id !== edgeId) },
      { action: 'connection-removed', relation: edge.label },
    )
  }

  function pointFromEvent(event) {
    const svg = svgRef.current
    if (!svg) return null
    const point = svg.createSVGPoint()
    point.x = event.clientX
    point.y = event.clientY
    const transformed = point.matrixTransform(svg.getScreenCTM().inverse())
    return { x: Math.max(50, Math.min(950, transformed.x)), y: Math.max(45, Math.min(555, transformed.y)) }
  }

  function startDrag(event, nodeId) {
    if (event.button !== 0) return
    event.preventDefault()
    event.stopPropagation()
    const svg = svgRef.current
    const node = nodeById.get(nodeId)
    if (!svg || !node) return
    dragStart.current = map
    svg.setPointerCapture(event.pointerId)
    setSelectedNode(nodeId)
    setDrag({ pointerId: event.pointerId, nodeId })
    setNotice('Geser simpul; posisi akan disimpan saat dilepas.')
  }

  function moveDrag(event) {
    if (!drag || drag.pointerId !== event.pointerId) return
    const point = pointFromEvent(event)
    if (!point) return
    setMap((current) => ({
      ...current,
      nodes: current.nodes.map((node) => node.id === drag.nodeId ? { ...node, ...point } : node),
    }))
    setNotice('Posisi belum disimpan. Lepaskan simpul untuk menyimpan perubahan.')
  }

  function finishDrag(event) {
    if (!drag || drag.pointerId !== event.pointerId) return
    const finalMap = map
    const previousMap = dragStart.current
    setDrag(null)
    dragStart.current = null
    if (previousMap && finalMap.nodes.some((node, index) =>
      node.x !== previousMap.nodes[index]?.x || node.y !== previousMap.nodes[index]?.y,
    )) {
      if (!persist(finalMap, { action: 'concept-moved' })) setMap(previousMap)
    } else setNotice('Posisi konsep tidak berubah.')
  }

  function moveSelectedByKey(event, node) {
    const deltas = {
      ArrowLeft: [-10, 0], ArrowRight: [10, 0], ArrowUp: [0, -10], ArrowDown: [0, 10],
    }
    const delta = deltas[event.key]
    if (!delta) return
    event.preventDefault()
    const nextMap = {
      ...map,
      nodes: map.nodes.map((item) => item.id === node.id ? {
        ...item,
        x: Math.max(50, Math.min(950, item.x + delta[0])),
        y: Math.max(45, Math.min(555, item.y + delta[1])),
      } : item),
    }
    persist(nextMap, { action: 'concept-moved', concept: node.label })
  }

  function evaluateMap() {
    const possible = VALID_RELATIONS
    const correct = possible.filter((valid) => map.edges.some((edge) =>
      edge.from === valid.from && edge.to === valid.to &&
      edge.label.trim().toLocaleLowerCase() === valid.label.toLocaleLowerCase(),
    ))
    const incorrect = map.edges.filter((edge) => !VALID_RELATIONS.some((valid) =>
      edge.from === valid.from && edge.to === valid.to &&
      edge.label.trim().toLocaleLowerCase() === valid.label.toLocaleLowerCase(),
    ))
    const percent = Math.round((correct.length / possible.length) * 100)
    const activityNotice = recordActivity({ action: 'map-evaluated', score: percent })
    setNotice(`Evaluasi peta: ${correct.length} dari ${possible.length} hubungan inti tepat (${percent}%).${incorrect.length ? ` ${incorrect.length} hubungan lain belum cocok dengan kunci konsep.` : ''}${activityNotice ? ` ${activityNotice}` : ''}`)
  }

  function checkPractice() {
    if (!challenge) {
      setNotice('Tambahkan kembali konsep inti untuk melanjutkan latihan.')
      return
    }
    if (!practiceTarget || !practiceRelation) {
      setNotice('Pilih konsep tujuan dan hubungan untuk menjawab tantangan.')
      return
    }
    const isCorrect = practiceTarget === challenge.to && practiceRelation === challenge.label
    const nextPractice = {
      attempts: map.practice.attempts + 1,
      correct: map.practice.correct + Number(isCorrect),
      index: map.practice.index + 1,
    }
    const nextMap = { ...map, practice: nextPractice }
    const feedback = isCorrect
      ? 'Tepat! Hubungan tersebut sesuai dengan konsep kimia.'
      : `Belum tepat. Hubungan yang benar: “${nodeById.get(challenge.from)?.label} ${challenge.label} ${nodeById.get(challenge.to)?.label}”.`
    if (persist(nextMap)) {
      const activityNotice = recordActivity({ action: 'practice-answered', correct: isCorrect })
      setNotice(`${feedback}${activityNotice ? ` ${activityNotice}` : ''}`)
      setPracticeTarget('')
      setPracticeRelation('')
    }
  }

  function exportSvg() {
    const blob = new Blob([svgMarkup(map)], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'peta-konsep-elektrolit.svg'
    document.body.append(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setNotice('File SVG peta konsep telah diunduh.')
  }

  function printMap() {
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      setNotice('Jendela cetak diblokir browser. Izinkan pop-up lalu coba lagi.')
      return
    }
    printWindow.document.write(`<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Peta Konsep Kimia</title><style>body{font-family:Arial,sans-serif;margin:24px}svg{width:100%;height:auto}</style></head><body><h1>Peta Konsep Larutan Elektrolit</h1>${svgMarkup(map)}</body></html>`)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  function resetMap() {
    const confirmed = window.confirm('Kembalikan peta ke konsep awal? Perubahan peta saat ini akan diganti.')
    if (confirmed && persist(createInitialMap())) {
      setSelectedNode('')
      const activityNotice = recordActivity({ action: 'map-reset' })
      setNotice(`Peta konsep dikembalikan ke susunan awal dan tersimpan.${activityNotice ? ` ${activityNotice}` : ''}`)
    }
  }

  return (
    <section className="learning-tool learning-tool-concept" aria-labelledby="concept-map-title">
      <header className="learning-tool__header">
        <div>
          <p className="learning-tool__eyebrow">Ruang belajar interaktif</p>
          <h2 id="concept-map-title">Penyusun Peta Konsep</h2>
          <p>Hubungkan konsep larutan elektrolit dengan panah berlabel. Geser simpul untuk menata peta.</p>
        </div>
        <div className="learning-tool__actions">
          <button type="button" className="learning-tool__button learning-tool__button--secondary" onClick={exportSvg}>Unduh SVG</button>
          <button type="button" className="learning-tool__button learning-tool__button--secondary" onClick={printMap}>Cetak</button>
        </div>
      </header>

      <p className="learning-tool__notice" role="status" aria-live="polite">{notice || 'Perubahan disimpan saat Anda menambahkan, menghapus, atau menata konsep.'}</p>

      <div className="learning-tool__map-layout">
        <div className="learning-tool__canvas-wrap">
          <svg
            ref={svgRef}
            className="learning-tool__canvas"
            viewBox="0 0 1000 600"
            role="group"
            aria-label="Peta konsep yang dapat diedit. Gunakan tombol panah saat simpul dipilih untuk menatanya."
            onPointerMove={moveDrag}
            onPointerUp={finishDrag}
            onPointerCancel={finishDrag}
          >
            <defs>
              <marker id="learning-concept-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                <path d="M0,0 L0,6 L9,3 z" fill="#16A6A1" />
              </marker>
            </defs>
            {map.edges.map((edge) => {
              const from = nodeById.get(edge.from)
              const to = nodeById.get(edge.to)
              if (!from || !to) return null
              const mx = (from.x + to.x) / 2
              const my = (from.y + to.y) / 2
              return (
                <g key={edge.id} className="learning-tool__edge">
                  <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} markerEnd="url(#learning-concept-arrow)" />
                  <rect x={mx - Math.min(edge.label.length * 3.2, 130) - 7} y={my - 17} width={Math.min(edge.label.length * 6.4, 260) + 14} height="26" rx="9" />
                  <text x={mx} y={my + 1}>{edge.label}</text>
                </g>
              )
            })}
            {map.nodes.map((node) => (
              <g
                key={node.id}
                data-node-id={node.id}
                className={`learning-tool__node${node.id === selectedNode ? ' is-selected' : ''}`}
                role="button"
                tabIndex="0"
                aria-label={`${node.label}. Pilih dan seret untuk memindahkan; gunakan tombol panah untuk mengatur posisi.`}
                aria-pressed={node.id === selectedNode}
                transform={`translate(${node.x} ${node.y})`}
                onPointerDown={(event) => startDrag(event, node.id)}
                onClick={() => setSelectedNode(node.id)}
                onFocus={() => setSelectedNode(node.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setSelectedNode(node.id)
                  }
                  moveSelectedByKey(event, node)
                }}
              >
                <rect x="-86" y="-28" width="172" height="56" rx="18" />
                <text x="0" y="5">{node.label}</text>
              </g>
            ))}
          </svg>
        </div>

        <aside className="learning-tool__panel" aria-label="Kontrol peta konsep">
          <form className="learning-tool__form" onSubmit={addConcept}>
            <h3>Tambah konsep</h3>
            <label htmlFor="concept-map-new">Nama konsep</label>
            <div className="learning-tool__inline">
              <input id="concept-map-new" value={newConcept} onChange={(event) => setNewConcept(event.target.value)} maxLength="36" placeholder="Contoh: Disosiasi" />
              <button className="learning-tool__button" type="submit">Tambah</button>
            </div>
            <label htmlFor="concept-map-selected">Konsep dipilih</label>
            <select id="concept-map-selected" value={selectedNode} onChange={(event) => setSelectedNode(event.target.value)}>
              <option value="">Pilih simpul…</option>
              {map.nodes.map((node) => <option key={node.id} value={node.id}>{node.label}</option>)}
            </select>
            <button type="button" className="learning-tool__button learning-tool__button--danger" onClick={removeSelected} disabled={!selectedNode}>Hapus konsep terpilih</button>
          </form>

          <form className="learning-tool__form" onSubmit={addConnection}>
            <h3>Buat hubungan berarah</h3>
            <label htmlFor="concept-map-from">Dari konsep</label>
            <select id="concept-map-from" value={fromNode} onChange={(event) => setFromNode(event.target.value)}>
              <option value="">Pilih konsep asal…</option>
              {map.nodes.map((node) => <option key={node.id} value={node.id}>{node.label}</option>)}
            </select>
            <label htmlFor="concept-map-relation">Label hubungan</label>
            <input id="concept-map-relation" value={relation} onChange={(event) => setRelation(event.target.value)} maxLength="72" placeholder="Contoh: menghasilkan" />
            <label htmlFor="concept-map-to">Menuju konsep</label>
            <select id="concept-map-to" value={toNode} onChange={(event) => setToNode(event.target.value)}>
              <option value="">Pilih konsep tujuan…</option>
              {map.nodes.map((node) => <option key={node.id} value={node.id}>{node.label}</option>)}
            </select>
            <button className="learning-tool__button" type="submit">Tambah hubungan</button>
          </form>

          <div className="learning-tool__form">
            <h3>Hubungan pada peta ({map.edges.length})</h3>
            <ul className="learning-tool__edge-list">
              {map.edges.map((edge) => (
                <li key={edge.id}>
                  <span>{nodeById.get(edge.from)?.label} <strong>{edge.label}</strong> {nodeById.get(edge.to)?.label}</span>
                  <button type="button" className="learning-tool__icon-button" aria-label={`Hapus hubungan ${edge.label}`} onClick={() => removeConnection(edge.id)}>Hapus</button>
                </li>
              ))}
              {!map.edges.length && <li>Belum ada hubungan. Tambahkan hubungan berlabel.</li>}
            </ul>
          </div>
        </aside>
      </div>

      <div className="learning-tool__bottom-grid">
        <section className="learning-tool__card">
          <div className="learning-tool__card-heading">
            <div><p className="learning-tool__eyebrow">Uji pemahaman</p><h3>Evaluasi peta</h3></div>
            <button type="button" className="learning-tool__button" onClick={evaluateMap}>Periksa hubungan inti</button>
          </div>
          <p>Kecocokan diukur dari hubungan inti yang tersedia pada peta (arah dan label harus tepat). Hubungan tambahan tetap dipertahankan, tetapi tidak menambah skor jika tidak ada dalam kunci konsep.</p>
        </section>

        <section className="learning-tool__card">
          <div className="learning-tool__card-heading">
            <div>
              <p className="learning-tool__eyebrow">Latihan singkat · {map.practice.correct}/{map.practice.attempts} benar</p>
              <h3>Lengkapi hubungan</h3>
            </div>
          </div>
          <p className="learning-tool__challenge">
            <strong>{challenge ? `${nodeById.get(challenge.from)?.label ?? 'Konsep'} … ?` : 'Belum ada tantangan yang tersedia.'}</strong>
          </p>
          <div className="learning-tool__practice-controls">
            <label htmlFor="concept-practice-relation">Hubungan</label>
            <select id="concept-practice-relation" value={practiceRelation} onChange={(event) => setPracticeRelation(event.target.value)}>
              <option value="">Pilih label…</option>
              {RELATION_CHOICES.map((choice) => <option key={choice} value={choice}>{choice}</option>)}
            </select>
            <label htmlFor="concept-practice-target">Konsep tujuan</label>
            <select id="concept-practice-target" value={practiceTarget} onChange={(event) => setPracticeTarget(event.target.value)}>
              <option value="">Pilih konsep…</option>
              {map.nodes.filter((node) => node.id !== challenge?.from).map((node) => <option key={node.id} value={node.id}>{node.label}</option>)}
            </select>
            <button type="button" className="learning-tool__button" onClick={checkPractice} disabled={!challenge}>Periksa jawaban</button>
          </div>
        </section>
      </div>

      <footer className="learning-tool__footer">
        <button type="button" className="learning-tool__button learning-tool__button--text" onClick={resetMap}>Kembalikan peta awal</button>
        <span>Peta disimpan per pengguna pada penyimpanan browser perangkat ini.</span>
      </footer>
    </section>
  )
}

export default function ConceptMap(props) {
  return <ConceptMapInstance key={String(props.userId || 'anonymous')} {...props} />
}
