import React, { useState } from 'react'

export default function Navbar({ activeNav = 'beranda', onNavigate, onStartLearning }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNavClick = (id, e) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    if (onNavigate) {
      onNavigate(id)
    } else {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleStartClick = (e) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    if (onStartLearning) {
      onStartLearning()
    } else if (onNavigate) {
      onNavigate('materi')
    }
  }

  return (
    <header className="navbar-header" id="navbar">
      <div className="container navbar-container">
        {/* Brand Logo & Name */}
        <a 
          href="#beranda" 
          className="navbar-brand"
          onClick={(e) => handleNavClick('beranda', e)}
          aria-label="ElectroFun Chemistry Beranda"
        >
          <div className="navbar-logo-wrap" aria-hidden="true">
            {/* Custom Chemistry Icon: Erlenmeyer with spark */}
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 2v5.5L4.4 17.5A2.1 2.1 0 0 0 6.2 21h11.6a2.1 2.1 0 0 0 1.8-3.5L14 7.5V2" />
              <path d="M8.5 2h7" />
              <path d="M7 16h10" />
              {/* Electric spark inside flask */}
              <path d="M12 9l-1 3.5h2l-1 3.5" stroke="#F4A340" strokeWidth="2.2" strokeLinejoin="bevel" />
            </svg>
          </div>
          <div className="navbar-brand-text">
            <span className="navbar-title">
              <span className="brand-electro">Electro</span>
              <span className="brand-fun">Fun</span>
              <span className="brand-chem">Chemistry</span>
            </span>
            <span className="navbar-tagline">SMA Kelas X • Fase E</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="navbar-nav-wrap" aria-label="Navigasi Utama">
          <ul className="navbar-nav">
            <li>
              <a
                href="#beranda"
                id="nav-link-beranda"
                className={`nav-link ${activeNav === 'beranda' ? 'active' : ''}`}
                onClick={(e) => handleNavClick('beranda', e)}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Beranda
              </a>
            </li>
            <li>
              <a
                href="#materi"
                id="nav-link-materi"
                className={`nav-link ${activeNav === 'materi' ? 'active' : ''}`}
                onClick={(e) => handleNavClick('materi', e)}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                  <path d="M6 6h10" />
                  <path d="M6 10h10" />
                </svg>
                Materi
              </a>
            </li>
            <li>
              <a
                href="#laboratorium"
                id="nav-link-laboratorium"
                className={`nav-link ${activeNav === 'laboratorium' ? 'active' : ''}`}
                onClick={(e) => handleNavClick('laboratorium', e)}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5V2" />
                  <path d="M8.5 2h7" />
                  <path d="M14.5 16h-5" />
                </svg>
                Laboratorium Mini
              </a>
            </li>
            <li>
              <a
                href="#kuis"
                id="nav-link-kuis"
                className={`nav-link ${activeNav === 'kuis' ? 'active' : ''}`}
                onClick={(e) => handleNavClick('kuis', e)}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                Kuis
              </a>
            </li>
          </ul>
        </nav>

        {/* CTA Button & Mobile Hamburger */}
        <div className="navbar-actions">
          <button
            type="button"
            id="nav-btn-mulai-belajar"
            className="btn-primary"
            onClick={handleStartClick}
          >
            <span>Mulai Belajar</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>

          {/* Hamburger Button for mobile */}
          <button
            type="button"
            id="mobile-menu-toggle"
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-menu-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-list">
          <li>
            <a
              href="#beranda"
              className={`mobile-nav-link ${activeNav === 'beranda' ? 'active' : ''}`}
              onClick={(e) => handleNavClick('beranda', e)}
            >
              Beranda
            </a>
          </li>
          <li>
            <a
              href="#materi"
              className={`mobile-nav-link ${activeNav === 'materi' ? 'active' : ''}`}
              onClick={(e) => handleNavClick('materi', e)}
            >
              Materi
            </a>
          </li>
          <li>
            <a
              href="#laboratorium"
              className={`mobile-nav-link ${activeNav === 'laboratorium' ? 'active' : ''}`}
              onClick={(e) => handleNavClick('laboratorium', e)}
            >
              Laboratorium Mini
            </a>
          </li>
          <li>
            <a
              href="#kuis"
              className={`mobile-nav-link ${activeNav === 'kuis' ? 'active' : ''}`}
              onClick={(e) => handleNavClick('kuis', e)}
            >
              Kuis
            </a>
          </li>
          <li style={{ marginTop: '0.5rem' }}>
            <button
              type="button"
              className="btn-primary"
              style={{ width: '100%' }}
              onClick={handleStartClick}
            >
              Mulai Belajar Sekarang →
            </button>
          </li>
        </ul>
      </div>
    </header>
  )
}
