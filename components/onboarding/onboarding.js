/**
 * ==========================================================================
 * ElectroFun Chemistry - Onboarding Controller (onboarding.js)
 * Logika JavaScript Mandiri untuk Welcome Pop-up & Guided Tour 6 Langkah
 * Sesuai Standar Mutlak Front-End & Aturan Dosen
 * ==========================================================================
 */

(function () {
  'use strict';

  // Konfigurasi Kunci LocalStorage
  const STORAGE_KEY_BASE = 'electrofun_onboarding_done';

  // Definisi 6 Langkah Guided Tour Sesuai Spesifikasi Mutlak
  const TOUR_STEPS = [
    {
      step: 1,
      targetId: 'nav-beranda',
      fallbackSelector: '#nav-beranda, #nav-link-beranda, a[href="#beranda"]',
      icon: '🏠',
      title: 'Kenali Halaman Beranda',
      desc: 'Ini adalah halaman utama ElectroFun Chemistry. Di sini kamu dapat menemukan pengenalan website, informasi pembelajaran, dan akses menuju berbagai fitur kimia yang tersedia.',
    },
    {
      step: 2,
      targetId: 'nav-materi',
      fallbackSelector: '#nav-materi, #nav-link-materi, a[href="#materi"]',
      icon: '📚',
      title: 'Pelajari Materi Kimia',
      desc: 'Menu Materi berisi pembelajaran tentang Larutan Elektrolit dan Non-Elektrolit. Pelajari konsep, karakteristik, jenis larutan, serta perbedaan elektrolit kuat, elektrolit lemah, dan nonelektrolit.',
    },
    {
      step: 3,
      targetId: 'nav-lab',
      fallbackSelector: '#nav-lab, #nav-link-laboratorium, a[href="#laboratorium"]',
      icon: '🧪',
      title: 'Eksplorasi Laboratorium Virtual',
      desc: 'Di Laboratorium Mini, kamu dapat mencoba simulasi uji daya hantar listrik berbagai larutan. Amati pergerakan ion, nyala lampu, dan perbedaan sifat larutan elektrolit kuat, elektrolit lemah, serta nonelektrolit.',
    },
    {
      step: 4,
      targetId: 'nav-kuis',
      fallbackSelector: '#nav-kuis, #nav-link-kuis, a[href="#kuis"]',
      icon: '✏️',
      title: 'Uji Pemahamanmu!',
      desc: 'Setelah mempelajari materi, kerjakan kuis untuk menguji pemahamanmu tentang Larutan Elektrolit dan Non-Elektrolit. Perhatikan setiap pertanyaan dan pilih jawaban yang paling tepat.',
    },
    {
      step: 5,
      targetId: 'nav-fitur',
      fallbackSelector: '#nav-fitur, #nav-link-learning-features, a[href="#fitur-belajar"]',
      icon: '✨',
      title: 'Manfaatkan Fitur Belajar',
      desc: 'Jelajahi fitur tambahan yang tersedia untuk mendukung proses belajarmu. Gunakan fitur-fitur ini untuk memperdalam pemahaman konsep kimia.',
    },
    {
      step: 6,
      targetId: 'btn-mulai-belajar',
      fallbackSelector: '#btn-mulai-belajar, #nav-btn-mulai-belajar, #hero-btn-mulai, .navbar-actions .btn-primary',
      icon: '🚀',
      title: 'Saatnya Mulai Belajar!',
      desc: 'Sekarang kamu sudah mengenal fitur-fitur ElectroFun Chemistry. Yuk, mulai perjalanan belajarmu dan eksplorasi dunia Larutan Elektrolit dan Non-Elektrolit!',
    },
  ];

  // State Controller
  let currentStepIndex = -1;
  let isTourActive = false;
  let previouslyHighlightedElement = null;

  // Helper: Deteksi Session Login untuk Penyimpanan per-User
  function getActiveUserStorageKey() {
    try {
      const sessionRaw =
        localStorage.getItem('chemistry_lab_session') ||
        sessionStorage.getItem('chemistry_lab_temporary_session');
      if (sessionRaw) {
        const user = JSON.parse(sessionRaw);
        if (user && (user.id || user.uid || user.username)) {
          const userId = user.id || user.uid || user.username;
          return `${STORAGE_KEY_BASE}_${userId}`;
        }
      }
    } catch {
      // Abaikan error parsing JSON
    }
    return STORAGE_KEY_BASE;
  }

  // Helper: Cek apakah onboarding sudah pernah diselesaikan
  function isOnboardingDone() {
    try {
      const userKey = getActiveUserStorageKey();
      if (localStorage.getItem(userKey) === '1') return true;
      if (localStorage.getItem(STORAGE_KEY_BASE) === '1') return true;
    } catch (err) {
      console.warn('[Onboarding] Gagal membaca localStorage:', err);
    }
    return false;
  }

  // Helper: Simpan status selesai
  function markOnboardingDone() {
    try {
      const userKey = getActiveUserStorageKey();
      localStorage.setItem(userKey, '1');
      localStorage.setItem(STORAGE_KEY_BASE, '1');
    } catch (err) {
      console.warn('[Onboarding] Gagal menyimpan ke localStorage:', err);
    }
  }

  // Helper: Reset status onboarding (untuk tombol Panduan Penggunaan)
  function resetOnboardingStatus() {
    try {
      const userKey = getActiveUserStorageKey();
      localStorage.removeItem(userKey);
      localStorage.removeItem(STORAGE_KEY_BASE);
    } catch (err) {
      console.warn('[Onboarding] Gagal menghapus localStorage:', err);
    }
  }

  // Helper: Dapatkan Target Elemen Langkah Tour
  function getStepTarget(stepConfig) {
    if (!stepConfig) return null;
    let el = document.getElementById(stepConfig.targetId);
    if (!el && stepConfig.fallbackSelector) {
      el = document.querySelector(stepConfig.fallbackSelector);
    }
    return el;
  }

  // Template HTML cadangan jika fetch gagal (misal pada protokol file://)
  const FALLBACK_HTML_TEMPLATE = `
<div id="onboarding-welcome-overlay" class="onboarding-overlay onboarding-hidden" aria-hidden="true">
  <div class="onboarding-modal onboarding-welcome-card" role="dialog" aria-modal="true" aria-labelledby="onboarding-welcome-title">
    <div class="onboarding-badge-pill">
      <span class="onboarding-badge-icon" aria-hidden="true">⚗️</span>
      <span>Panduan Interaktif</span>
    </div>
    <div class="onboarding-welcome-icon-wrap" aria-hidden="true">
      <span class="onboarding-emoji-large">🧪</span>
      <span class="onboarding-emoji-sparkle">✨</span>
      <span class="onboarding-emoji-beaker">⚗️</span>
    </div>
    <h2 id="onboarding-welcome-title" class="onboarding-title">Selamat Datang di ElectroFun Chemistry!</h2>
    <p class="onboarding-desc">
      Hallo, Sobat Kimia! Selamat datang di ElectroFun Chemistry. Di sini kamu akan menjelajahi dunia Larutan Elektrolit dan Non-Elektrolit melalui materi interaktif, laboratorium virtual, simulasi, dan kuis yang menyenangkan. Sebelum mulai belajar, yuk kenali fitur-fitur yang tersedia agar kamu dapat menggunakan website ini dengan mudah!
    </p>
    <div class="onboarding-welcome-actions">
      <button type="button" id="onboarding-btn-start" class="onboarding-btn onboarding-btn-primary">
        <span>Mulai Panduan</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>
      <button type="button" id="onboarding-btn-skip-welcome" class="onboarding-btn onboarding-btn-secondary">
        Lewati
      </button>
    </div>
  </div>
</div>
<div id="onboarding-tour-backdrop" class="onboarding-tour-backdrop onboarding-hidden" aria-hidden="true"></div>
<div id="onboarding-tour-spotlight" class="onboarding-tour-spotlight onboarding-hidden" aria-hidden="true"></div>
<div id="onboarding-tour-tooltip" class="onboarding-tooltip onboarding-hidden" role="dialog" aria-modal="true" aria-labelledby="onboarding-step-title">
  <div class="onboarding-tooltip-arrow" id="onboarding-tooltip-arrow"></div>
  <div class="onboarding-tooltip-header">
    <div class="onboarding-step-badge">
      <span id="onboarding-step-icon" class="onboarding-step-icon" aria-hidden="true">🏠</span>
      <span id="onboarding-step-indicator" class="onboarding-step-indicator">Langkah 1 dari 6</span>
    </div>
    <button type="button" id="onboarding-tour-close-btn" class="onboarding-close-btn" aria-label="Tutup panduan" title="Tutup Panduan">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </div>
  <div class="onboarding-progress-wrapper">
    <div class="onboarding-progress-track">
      <div id="onboarding-progress-fill" class="onboarding-progress-fill" style="width: 16.66%;"></div>
    </div>
    <div class="onboarding-step-dots" id="onboarding-step-dots" aria-label="Progres langkah tour">
      <span class="onboarding-dot active" data-step="1"></span>
      <span class="onboarding-dot" data-step="2"></span>
      <span class="onboarding-dot" data-step="3"></span>
      <span class="onboarding-dot" data-step="4"></span>
      <span class="onboarding-dot" data-step="5"></span>
      <span class="onboarding-dot" data-step="6"></span>
    </div>
  </div>
  <div class="onboarding-tooltip-body">
    <h3 id="onboarding-step-title" class="onboarding-step-title">Kenali Halaman Beranda</h3>
    <p id="onboarding-step-desc" class="onboarding-step-desc">
      Ini adalah halaman utama ElectroFun Chemistry. Di sini kamu dapat menemukan pengenalan website, informasi pembelajaran, dan akses menuju berbagai fitur kimia yang tersedia.
    </p>
  </div>
  <div class="onboarding-tooltip-footer">
    <button type="button" id="onboarding-btn-skip-tour" class="onboarding-btn-link" title="Lewati panduan">
      Lewati
    </button>
    <div class="onboarding-nav-group">
      <button type="button" id="onboarding-btn-prev" class="onboarding-btn onboarding-btn-secondary onboarding-btn-sm" disabled>
        Kembali
      </button>
      <button type="button" id="onboarding-btn-next" class="onboarding-btn onboarding-btn-primary onboarding-btn-sm">
        <span>Selanjutnya</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  </div>
</div>
`;

  // Mount Elemen Onboarding ke DOM
  async function ensureOnboardingMounted() {
    let mountRoot = document.getElementById('onboarding-root');
    if (!mountRoot) {
      mountRoot = document.createElement('div');
      mountRoot.id = 'onboarding-root';
      document.body.appendChild(mountRoot);
    }

    if (mountRoot.children.length === 0) {
      try {
        const response = await fetch('/components/onboarding/onboarding.html');
        if (response.ok) {
          const html = await response.text();
          mountRoot.innerHTML = html;
        } else {
          mountRoot.innerHTML = FALLBACK_HTML_TEMPLATE;
        }
      } catch {
        // Fallback jika fetch offline / CORS / local file protocol
        mountRoot.innerHTML = FALLBACK_HTML_TEMPLATE;
      }
    }

    attachEventListeners();
  }

  // Tampilkan Pop-up Selamat Datang
  function showWelcomeModal() {
    closeTour();
    const overlay = document.getElementById('onboarding-welcome-overlay');
    if (overlay) {
      overlay.classList.remove('onboarding-hidden');
      overlay.setAttribute('aria-hidden', 'false');
    }
  }

  // Tutup Pop-up Selamat Datang
  function hideWelcomeModal() {
    const overlay = document.getElementById('onboarding-welcome-overlay');
    if (overlay) {
      overlay.classList.add('onboarding-hidden');
      overlay.setAttribute('aria-hidden', 'true');
    }
  }

  // Bersihkan Highlight pada Elemen Sebelumnya
  function clearPreviousHighlight() {
    if (previouslyHighlightedElement) {
      try {
        previouslyHighlightedElement.style.position = '';
        previouslyHighlightedElement.style.zIndex = '';
        previouslyHighlightedElement.style.pointerEvents = '';
      } catch {
        // Abaikan error cleanup
      }
      previouslyHighlightedElement = null;
    }
  }

  // Posisi Spotlight dan Tooltip ke Target
  function positionTourStep(stepIndex) {
    if (stepIndex < 0 || stepIndex >= TOUR_STEPS.length) return;

    const stepConfig = TOUR_STEPS[stepIndex];
    const target = getStepTarget(stepConfig);
    const spotlight = document.getElementById('onboarding-tour-spotlight');
    const tooltip = document.getElementById('onboarding-tour-tooltip');
    const arrow = document.getElementById('onboarding-tooltip-arrow');
    const backdrop = document.getElementById('onboarding-tour-backdrop');

    if (!spotlight || !tooltip) return;

    clearPreviousHighlight();

    if (!target) {
      // Jika target belum ditemukan di DOM, posisikan tooltip di tengah layar
      spotlight.classList.add('onboarding-hidden');
      tooltip.style.top = '50%';
      tooltip.style.left = '50%';
      tooltip.style.transform = 'translate(-50%, -50%)';
      if (arrow) arrow.className = 'onboarding-tooltip-arrow onboarding-hidden';
      return;
    }

    // Sorot target elemen dan pastikan ia tetap dapat diklik di atas backdrop
    target.style.position = 'relative';
    target.style.zIndex = '99996';
    target.style.pointerEvents = 'auto';
    previouslyHighlightedElement = target;

    const rect = target.getBoundingClientRect();
    const isMobile = window.innerWidth <= 600;

    // 1. Atur Posisi & Ukuran Spotlight
    spotlight.classList.remove('onboarding-hidden');
    backdrop.classList.remove('onboarding-hidden');

    const padding = 6;
    spotlight.style.top = `${Math.max(0, rect.top - padding)}px`;
    spotlight.style.left = `${Math.max(0, rect.left - padding)}px`;
    spotlight.style.width = `${rect.width + padding * 2}px`;
    spotlight.style.height = `${rect.height + padding * 2}px`;

    // Ambil border-radius asli elemen jika ada
    const computedRadius = window.getComputedStyle(target).borderRadius;
    spotlight.style.borderRadius = computedRadius && computedRadius !== '0px' ? computedRadius : '12px';

    // 2. Atur Posisi Tooltip
    tooltip.classList.remove('onboarding-hidden');
    tooltip.style.transform = 'none';

    if (isMobile) {
      // Tampilan HP: Full width di bawah, aman dari tepi layar
      tooltip.style.top = 'auto';
      tooltip.style.bottom = '14px';
      tooltip.style.left = '12px';
      tooltip.style.right = '12px';
      tooltip.style.width = 'calc(100% - 24px)';
      if (arrow) arrow.className = 'onboarding-tooltip-arrow onboarding-hidden';
      return;
    }

    // Tampilan Laptop / Desktop
    tooltip.style.bottom = 'auto';
    tooltip.style.right = 'auto';
    const tooltipWidth = tooltip.offsetWidth || 360;
    const tooltipHeight = tooltip.offsetHeight || 240;

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const gap = 14;

    let tooltipTop = 0;
    let placeBelow = true;

    if (spaceBelow >= tooltipHeight + gap + 10 || spaceBelow >= spaceAbove) {
      // Posisikan di bawah target
      tooltipTop = rect.bottom + gap;
      placeBelow = true;
    } else {
      // Posisikan di atas target
      tooltipTop = Math.max(12, rect.top - tooltipHeight - gap);
      placeBelow = false;
    }

    // Hitung posisi horizontal (tengah terhadap target)
    let tooltipLeft = rect.left + rect.width / 2 - tooltipWidth / 2;
    const screenMargin = 16;
    if (tooltipLeft < screenMargin) {
      tooltipLeft = screenMargin;
    } else if (tooltipLeft + tooltipWidth > window.innerWidth - screenMargin) {
      tooltipLeft = window.innerWidth - tooltipWidth - screenMargin;
    }

    tooltip.style.top = `${tooltipTop}px`;
    tooltip.style.left = `${tooltipLeft}px`;

    // Atur Pointer Arrow
    if (arrow) {
      arrow.classList.remove('onboarding-hidden');
      if (placeBelow) {
        arrow.className = 'onboarding-tooltip-arrow arrow-top';
      } else {
        arrow.className = 'onboarding-tooltip-arrow arrow-bottom';
      }

      // Arahkan panah ke bagian tengah target elemen
      const targetCenterX = rect.left + rect.width / 2;
      const arrowX = targetCenterX - tooltipLeft;
      const clampedArrowX = Math.max(20, Math.min(tooltipWidth - 28, arrowX));
      arrow.style.left = `${clampedArrowX}px`;
    }
  }

  // Tampilkan Langkah Tour Tertentu
  function goToStep(stepIndex) {
    if (stepIndex < 0 || stepIndex >= TOUR_STEPS.length) return;

    currentStepIndex = stepIndex;
    isTourActive = true;
    hideWelcomeModal();

    const stepConfig = TOUR_STEPS[stepIndex];
    const stepNumber = stepConfig.step;

    // Update Text & Icon
    const iconEl = document.getElementById('onboarding-step-icon');
    const indicatorEl = document.getElementById('onboarding-step-indicator');
    const titleEl = document.getElementById('onboarding-step-title');
    const descEl = document.getElementById('onboarding-step-desc');
    const progressFill = document.getElementById('onboarding-progress-fill');
    const btnPrev = document.getElementById('onboarding-btn-prev');
    const btnNext = document.getElementById('onboarding-btn-next');

    if (iconEl) iconEl.textContent = stepConfig.icon;
    if (indicatorEl) indicatorEl.textContent = `Langkah ${stepNumber} dari ${TOUR_STEPS.length}`;
    if (titleEl) titleEl.textContent = stepConfig.title;
    if (descEl) descEl.textContent = stepConfig.desc;

    // Update Progress Bar
    if (progressFill) {
      const pct = (stepNumber / TOUR_STEPS.length) * 100;
      progressFill.style.width = `${pct}%`;
    }

    // Update Progress Dots
    const dots = document.querySelectorAll('#onboarding-step-dots .onboarding-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === stepIndex);
      dot.classList.toggle('completed', idx < stepIndex);
    });

    // Atur Tombol Navigasi
    if (btnPrev) {
      btnPrev.disabled = stepIndex === 0;
    }

    if (btnNext) {
      if (stepIndex === TOUR_STEPS.length - 1) {
        // Langkah Terakhir: Ubah menjadi Mulai Belajar
        btnNext.innerHTML = `
          <span>Mulai Belajar</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        `;
      } else {
        btnNext.innerHTML = `
          <span>Selanjutnya</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        `;
      }
    }

    // Gulir ke elemen target agar terlihat
    const target = getStepTarget(stepConfig);
    if (target) {
      try {
        target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      } catch {
        // Abaikan error scroll
      }
    }

    // Beri waktu browser menyelesaikan reflow/scroll sebelum menempatkan posisi
    setTimeout(() => {
      positionTourStep(stepIndex);
    }, 120);
  }

  // Mulai Panduan Tour dari Langkah 1
  function startTour() {
    hideWelcomeModal();

    // Sesuai Aturan: Jika user sedang tidak di Beranda, arahkan dulu ke Beranda / scroll ke atas
    const berandaTarget = document.getElementById('nav-beranda') || document.getElementById('beranda');
    if (berandaTarget) {
      try {
        berandaTarget.scrollIntoView({ behavior: 'smooth' });
      } catch {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Mulai Langkah 1 setelah 400ms
    setTimeout(() => {
      goToStep(0);
    }, 400);
  }

  // Tutup Semua Komponen Tour & Selesaikan
  function closeTour(shouldMarkDone = false) {
    if (shouldMarkDone) {
      markOnboardingDone();
    }

    isTourActive = false;
    currentStepIndex = -1;
    clearPreviousHighlight();

    const backdrop = document.getElementById('onboarding-tour-backdrop');
    const spotlight = document.getElementById('onboarding-tour-spotlight');
    const tooltip = document.getElementById('onboarding-tour-tooltip');

    if (backdrop) backdrop.classList.add('onboarding-hidden');
    if (spotlight) spotlight.classList.add('onboarding-hidden');
    if (tooltip) tooltip.classList.add('onboarding-hidden');

    hideWelcomeModal();
  }

  // Pasang Event Listeners ke Tombol & Interaksi
  function attachEventListeners() {
    // 1. Pop-up Selamat Datang: Mulai Panduan
    const btnStart = document.getElementById('onboarding-btn-start');
    if (btnStart && !btnStart.dataset.bound) {
      btnStart.dataset.bound = 'true';
      btnStart.addEventListener('click', (e) => {
        e.preventDefault();
        startTour();
      });
    }

    // 2. Pop-up Selamat Datang: Lewati
    const btnSkipWelcome = document.getElementById('onboarding-btn-skip-welcome');
    if (btnSkipWelcome && !btnSkipWelcome.dataset.bound) {
      btnSkipWelcome.dataset.bound = 'true';
      btnSkipWelcome.addEventListener('click', (e) => {
        e.preventDefault();
        closeTour(true);
      });
    }

    // 3. Tour Tooltip: Tombol Selanjutnya / Mulai Belajar
    const btnNext = document.getElementById('onboarding-btn-next');
    if (btnNext && !btnNext.dataset.bound) {
      btnNext.dataset.bound = 'true';
      btnNext.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentStepIndex >= TOUR_STEPS.length - 1) {
          // Selesai Tour pada Langkah 6
          closeTour(true);

          // Memicu tombol Mulai Belajar asli atau arahkan ke materi
          const realBtn =
            document.getElementById('btn-mulai-belajar') ||
            document.getElementById('hero-btn-mulai') ||
            document.getElementById('nav-materi');
          if (realBtn) {
            try {
              realBtn.click();
            } catch {
              // Abaikan error klik
            }
          }
        } else {
          goToStep(currentStepIndex + 1);
        }
      });
    }

    // 4. Tour Tooltip: Tombol Kembali
    const btnPrev = document.getElementById('onboarding-btn-prev');
    if (btnPrev && !btnPrev.dataset.bound) {
      btnPrev.dataset.bound = 'true';
      btnPrev.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentStepIndex > 0) {
          goToStep(currentStepIndex - 1);
        }
      });
    }

    // 5. Tour Tooltip: Tombol Lewati
    const btnSkipTour = document.getElementById('onboarding-btn-skip-tour');
    if (btnSkipTour && !btnSkipTour.dataset.bound) {
      btnSkipTour.dataset.bound = 'true';
      btnSkipTour.addEventListener('click', (e) => {
        e.preventDefault();
        closeTour(true);
      });
    }

    // 6. Tour Tooltip: Tombol Tutup (X)
    const btnClose = document.getElementById('onboarding-tour-close-btn');
    if (btnClose && !btnClose.dataset.bound) {
      btnClose.dataset.bound = 'true';
      btnClose.addEventListener('click', (e) => {
        e.preventDefault();
        closeTour(true);
      });
    }
  }

  // Delegasi Klik untuk Tombol "Panduan Penggunaan" (#btn-panduan)
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('#btn-panduan, [data-trigger="onboarding-guide"]');
    if (trigger) {
      e.preventDefault();
      resetOnboardingStatus();
      ensureOnboardingMounted().then(() => {
        showWelcomeModal();
      });
    }
  });

  // Listener untuk Resize & Scroll: Hitung Ulang Posisi Highlight & Tooltip
  let resizeTimeout = null;
  window.addEventListener('resize', () => {
    if (isTourActive && currentStepIndex >= 0) {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        positionTourStep(currentStepIndex);
      }, 50);
    }
  });

  window.addEventListener(
    'scroll',
    () => {
      if (isTourActive && currentStepIndex >= 0) {
        positionTourStep(currentStepIndex);
      }
    },
    { passive: true }
  );

  // Inisialisasi Otomatis Saat Halaman Dimuat
  async function init() {
    await ensureOnboardingMounted();

    // Cek status LocalStorage
    if (!isOnboardingDone()) {
      // Munculkan pop-up selamat datang setelah 600ms
      setTimeout(() => {
        if (!isOnboardingDone()) {
          showWelcomeModal();
        }
      }, 600);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Ekspor API Global Bersih untuk Akses Terkontrol
  window.ElectroFunOnboarding = {
    start: startTour,
    openWelcome: showWelcomeModal,
    close: closeTour,
    reset: resetOnboardingStatus,
    isDone: isOnboardingDone,
  };
})();
