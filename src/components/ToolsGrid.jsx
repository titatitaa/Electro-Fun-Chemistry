import React from 'react'
import './ToolsGrid.css'

const TOOLS = [
  {
    id: 'materi',
    title: 'Materi',
    desc: 'Makro - Partikel - Simbol',
    icon: '📚',
    color: '#4f46e5',
  },
  {
    id: 'virtual-lab',
    title: 'Virtual Lab',
    desc: '15 Larutan & Sensor',
    icon: '🧪',
    color: '#059669',
  },
  {
    id: 'kuis',
    title: 'Kuis',
    desc: '10 Soal + Pembahasan',
    icon: '📝',
    color: '#d97706',
  },
  {
    id: 'lkpd',
    title: 'LKPD',
    desc: 'Catatan Lab',
    icon: '📋',
    color: '#dc2626',
  },
  {
    id: 'simulasi-ion',
    title: 'Simulasi Ion',
    desc: 'Visualisasi Partikel',
    icon: '⚡',
    color: '#0891b2',
  },
  {
    id: 'grafik',
    title: 'Grafik',
    desc: 'Konduktivitas',
    icon: '📊',
    color: '#7c3aed',
  },
  {
    id: 'video',
    title: 'Video',
    desc: 'Konsep Elektrolit',
    icon: '🎬',
    color: '#db2777',
  },
  {
    id: 'panel-guru',
    title: 'Panel Guru',
    desc: 'Rekap & Analisis',
    icon: '👩‍🏫',
    color: '#475569',
    teacherOnly: true,
  },
]

export default function ToolsGrid({ user = null, onSelectTool }) {
  const displayedTools = TOOLS.filter(
    (tool) => !tool.teacherOnly || user?.role === 'teacher'
  )

  const handleSelect = (toolId) => {
    if (typeof onSelectTool === 'function') {
      onSelectTool(toolId)
    }
  }

  return (
    <div className="tools-grid">
      {displayedTools.map((tool) => (
        <button
          key={tool.id}
          type="button"
          className="tool-card"
          onClick={() => handleSelect(tool.id)}
          aria-label={`${tool.title}: ${tool.desc}`}
        >
          <div
            className="tool-shape"
            style={{ backgroundColor: tool.color }}
            aria-hidden="true"
          >
            {tool.icon}
          </div>
          <h3>{tool.title}</h3>
          <p>{tool.desc}</p>
        </button>
      ))}
    </div>
  )
}
