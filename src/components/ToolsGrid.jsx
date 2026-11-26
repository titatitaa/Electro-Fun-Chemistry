import React from 'react'
import { Link } from 'react-router-dom'

const tools = [
  {
    title: 'Materi',
    desc: 'Makro - Partikel - Simbol',
    icon: '📚',
    color: '#4f46e5',
    to: '/materi',
  },
  {
    title: 'Virtual Lab',
    desc: '15 Larutan & Sensor',
    icon: '🧪',
    color: '#059669',
    to: '/lab',
  },
  {
    title: 'Kuis',
    desc: '10 Soal + Pembahasan',
    icon: '📝',
    color: '#d97706',
    to: '/kuis',
  },
  {
    title: 'LKPD',
    desc: 'Catatan Lab',
    icon: '📋',
    color: '#dc2626',
    to: '/lkpd',
  },
  {
    title: 'Simulasi Ion',
    desc: 'Visualisasi Partikel',
    icon: '⚡',
    color: '#0891b2',
    to: '/simulasi',
  },
  {
    title: 'Grafik',
    desc: 'Konduktivitas',
    icon: '📊',
    color: '#7c3aed',
    to: '/grafik',
  },
  {
    title: 'Video',
    desc: 'Konsep Elektrolit',
    icon: '🎬',
    color: '#db2777',
    to: '/video',
  },
  {
    title: 'Panel Guru',
    desc: 'Rekap & Analisis',
    icon: '👩‍🏫',
    color: '#475569',
    to: '/guru',
  },
]

export default function ToolsGrid() {
  return (
    <div className="tools-grid">
      {tools.map((tool) => (
        <Link key={tool.to} to={tool.to} className="tool-card">
          <div className="tool-shape" style={{ backgroundColor: tool.color }}>
            {tool.icon}
          </div>
          <h3>{tool.title}</h3>
          <p>{tool.desc}</p>
        </Link>
      ))}
    </div>
  )
}
