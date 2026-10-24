/**
 * Ibrahim Hasan — Portfolio Application Logic
 * Pure Vanilla JavaScript — High-Performance, Zero External Runtime Dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initProjectFilters();
  initModals();
  initClipboardButtons();
  initScrollSpy();
  updateCurrentYear();
});

/* --- 1. Theme Management (Dark / Light) --- */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or default to dark
  const savedTheme = localStorage.getItem('ih_theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('ih_theme', newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} theme`);
    });
  }
}

/* --- 2. Mobile Menu Navigation --- */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mainNav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuBtn && mainNav) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', false);
      });
    });
  }
}

/* --- 3. Interactive Project Filters --- */
function initProjectFilters() {
  const filterPills = document.querySelectorAll('.filter-pill');
  const projectCards = document.querySelectorAll('.project-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');

      const filterValue = pill.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --- 4. Interactive Project & Research Modals --- */
const modalData = {
  'modal-bdepaper': {
    title: 'BD E-Paper Hub (Runner E-Paper)',
    tag: 'Production Mobile Architecture • Flutter & Dart',
    content: `
      <p class="modal-body-text">
        <strong>BD E-Paper Hub</strong> is a dedicated mobile application engineered to provide seamless, centralized access to daily editions of prominent national and regional newspapers across Bangladesh.
      </p>
      <h4 class="modal-section-title">Key Architectural Features</h4>
      <ul class="track-list" style="margin-bottom: 20px;">
        <li><strong>Layered Clean Architecture:</strong> Clear separation between UI screens, domain models, network repositories, and local storage services.</li>
        <li><strong>Native WebView & Raster Pipeline:</strong> Optimized memory allocation handling multi-megabyte daily newspaper graphics and touch pan-and-zoom gestures.</li>
        <li><strong>Offline Bookmarking:</strong> Integrated shared preferences and local disk cache allowing users to save and revisit specific editions without recurring data fetches.</li>
        <li><strong>Production Artifacts:</strong> Deployed as signed release APKs and Android App Bundles (AAB) with automated Gradle builds.</li>
      </ul>
      <h4 class="modal-section-title">Open Source Repository</h4>
      <p class="modal-body-text">
        Public codebase and release details available at: <br>
        <a href="https://github.com/ibrahimhasan0012/runner-epaper" target="_blank" rel="noopener noreferrer" style="color: var(--accent-text); font-weight: 600;">
          github.com/ibrahimhasan0012/runner-epaper
        </a>
      </p>
    `
  },
  'modal-ssb': {
    title: 'Sugar-Sweetened Beverage (SSB) Packaging Risk & Compliance',
    tag: 'Empirical Health Economics • ARK Foundation & WHO',
    content: `
      <p class="modal-body-text">
        In collaboration with <strong>ARK Foundation</strong> and WHO non-communicable disease (NCD) initiatives, this research evaluates regulatory compliance, nutritional declaration fidelity, and health risk labeling across commercially sold sugar-sweetened beverages in Bangladesh.
      </p>
      <h4 class="modal-section-title">Methodological Highlights</h4>
      <ul class="track-list" style="margin-bottom: 20px;">
        <li><strong>Front-of-Pack Labeling (FoPL) Audit:</strong> Comprehensive product cataloging utilizing the international Food-EPI benchmark framework.</li>
        <li><strong>Risk Scoring & Association:</strong> Formulated compliance risk matrices evaluated via separate Ordinary Least Squares (OLS) regressions to estimate manufacturer non-adherence predictors.</li>
        <li><strong>Field Survey Protocol:</strong> Managed structured household survey design and digital questionnaire integration via KoboToolbox.</li>
      </ul>
      <h4 class="modal-section-title">Policy Relevance</h4>
      <p class="modal-body-text">
        Provides empirical support for tiered taxation policies on high-sugar beverages to curtail expanding cardiometabolic disease prevalence.
      </p>
    `
  },
  'modal-climate': {
    title: "Women's Digital Access & Last-Mile Climate Hazard Warnings",
    tag: 'Climate Resilience & Demography • Working Paper',
    content: `
      <p class="modal-body-text">
        This scholarly inquiry investigates the structural and socio-cultural barriers that restrict women's direct access to mobile phones and digital emergency broadcasts during tropical cyclones, storm surges, and riverine floods in rural Bangladesh.
      </p>
      <h4 class="modal-section-title">Empirical Evidence & Methods</h4>
      <ul class="track-list" style="margin-bottom: 20px;">
        <li><strong>Gender Digital Divide:</strong> Examines intra-household phone control and early warning reception asymmetry.</li>
        <li><strong>Spatial Disaster Vulnerability:</strong> Evaluates last-mile transmission efficacy across coastal districts vulnerable to climate shocks.</li>
        <li><strong>Typeset Manuscript:</strong> Fully prepared and documented with complete econometric specifications and LaTeX typesetting.</li>
      </ul>
      <h4 class="modal-section-title">Suggested Citation</h4>
      <div class="modal-cite-block">Hasan, I. (2026). Women's Digital Access and Last-Mile Climate Hazard Warnings in Bangladesh. Working Paper. Dhaka, Bangladesh.</div>
    `
  },
  'modal-child-nutrition': {
    title: 'Child Undernutrition Anthropometric Modeling (BDHS 2022)',
    tag: 'Demographic & Microdata Analysis • R & Econometrics',
    content: `
      <p class="modal-body-text">
        A rigorous microdata investigation examining the maternal, environmental, and socio-economic determinants of child undernutrition in Bangladesh using the 2022 Bangladesh Demographic and Health Survey (BDHS).
      </p>
      <h4 class="modal-section-title">Analytical Workflow</h4>
      <ul class="track-list" style="margin-bottom: 20px;">
        <li><strong>Sample Harmonization:</strong> Processed and standardized individual records for 8,500+ children under five years of age.</li>
        <li><strong>WHO Growth Standards:</strong> Calculated anthropometric Z-scores for Height-for-Age (HAZ - Stunting), Weight-for-Age (WAZ - Underweight), and Weight-for-Height (WHZ - Wasting).</li>
        <li><strong>Econometric Modeling:</strong> Employed multivariate regression controlling for mother's educational attainment, WASH infrastructure, household wealth indices, and geographical divisions.</li>
        <li><strong>Reproducible Codebook:</strong> Implemented with an isolated R environment (<code>renv</code>) ensuring 100% computational reproducibility.</li>
      </ul>
    `
  },
  'modal-hpc': {
    title: 'Parallel Simulated Annealing on HPC & GPU Architectures',
    tag: 'High-Performance Computing • C, OpenMP & CUDA',
    content: `
      <p class="modal-body-text">
        Exploration of algorithmic parallelization for combinatorial optimization problems using multi-core CPUs and GPU clusters.
      </p>
      <h4 class="modal-section-title">Technical Implementation</h4>
      <ul class="track-list" style="margin-bottom: 20px;">
        <li><strong>Asynchronous Cooling Schedules:</strong> Overcame traditional sequential dependencies of Markov chain annealing by parallelizing candidate neighborhood evaluations.</li>
        <li><strong>CUDA Kernel Acceleration:</strong> Offloaded matrix cost calculations to CUDA threads, achieving substantial execution speedup over serial C baselines.</li>
        <li><strong>Performance Benchmarks:</strong> Profiled memory throughput, synchronization overheads, and convergence accuracy.</li>
      </ul>
    `
  },
  'modal-regional-policy': {
    title: 'Comparative NCD Regulatory Frameworks Across South Asia',
    tag: 'Institutional Health Policy • South Asian Synthesis',
    content: `
      <p class="modal-body-text">
        Cross-national comparative policy matrix analyzing food marketing restrictions, nutritional labeling regulations, and fiscal taxation instruments across five South Asian economies: Bangladesh, India, Pakistan, Sri Lanka, and Nepal.
      </p>
      <h4 class="modal-section-title">Key Insights</h4>
      <ul class="track-list" style="margin-bottom: 20px;">
        <li>Identifies legislative bottlenecks in front-of-pack warning labels across SAARC nations.</li>
        <li>Compares enforcement mechanisms between federal and subnational regulatory agencies.</li>
        <li>Synthesizes multi-stakeholder policy priorities for non-communicable disease prevention.</li>
      </ul>
    `
  }
};

function initModals() {
  const backdrop = document.getElementById('modal-backdrop');
  const closeBtn = document.getElementById('modal-close-btn');
  const container = document.getElementById('modal-dynamic-content');
  const openButtons = document.querySelectorAll('.open-modal-btn');

  if (!backdrop || !container) return;

  openButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalKey = btn.getAttribute('data-modal');
      const data = modalData[modalKey];

      if (data) {
        container.innerHTML = `
          <div class="modal-tag">${data.tag}</div>
          <h3 class="modal-title" id="modal-title">${data.title}</h3>
          ${data.content}
        `;
        backdrop.classList.add('active');
        backdrop.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = () => {
    backdrop.classList.remove('active');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('active')) {
      closeModal();
    }
  });
}

/* --- 5. Clipboard Copy with Toast Feedback --- */
function initClipboardButtons() {
  const emailButtons = document.querySelectorAll('.copy-email-btn');
  emailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'ibrahimhasanzafar@gmail.com';
      copyToClipboard(email, 'Email copied to clipboard!');
    });
  });

  const citationButtons = document.querySelectorAll('.copy-citation-btn');
  citationButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const citation = btn.getAttribute('data-cite');
      if (citation) {
        copyToClipboard(citation, 'APA citation copied to clipboard!');
      }
    });
  });
}

function copyToClipboard(text, successMessage) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMessage);
    }).catch(() => fallbackCopy(text, successMessage));
  } else {
    fallbackCopy(text, successMessage);
  }
}

function fallbackCopy(text, successMessage) {
  const tempInput = document.createElement('textarea');
  tempInput.value = text;
  tempInput.style.position = 'fixed';
  tempInput.style.opacity = '0';
  document.body.appendChild(tempInput);
  tempInput.select();
  try {
    document.execCommand('copy');
    showToast(successMessage);
  } catch (err) {
    showToast('Failed to copy text.');
  }
  document.body.removeChild(tempInput);
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

/* --- 6. Scroll Spy for Active Navigation --- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPosition = window.pageYOffset + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* --- 7. Current Year --- */
function updateCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
