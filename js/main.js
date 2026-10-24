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
  'modal-ssb': {
    title: 'Sugar-Sweetened Beverage (SSB) Taxation & Policy Initiative',
    tag: 'Flagship Health Policy Research • ARK Foundation',
    content: `
      <p class="modal-body-text">
        At <strong>ARK Foundation</strong> (serving as Research Assistant from Oct 2025 to Present), I conduct empirical research evaluating fiscal taxation, front-of-pack labeling (FoPL), and consumer behavioral demand across sugar-sweetened beverages in Bangladesh.
      </p>
      <h4 class="modal-section-title">The Three Core Workstreams</h4>
      <ul class="track-list" style="margin-bottom: 20px;">
        <li><strong>1. National Household Survey:</strong> Designing, auditing, and executing structured digital survey questionnaires via KoboToolbox to estimate consumer purchasing habits and household demand elasticities.</li>
        <li><strong>2. Food-EPI Policy Review Paper:</strong> Evaluating government implementation benchmarks against international Food-EPI standards. <em>(Full paper currently in progress)</em>.</li>
        <li><strong>3. Nutritional Pack Analysis Paper:</strong> Comprehensive laboratory and packaging compliance evaluation assessing nutrient declaration fidelity and health risk scores. <em>(Full paper currently in progress)</em>.</li>
      </ul>
      <h4 class="modal-section-title">Publications & Policy Impact</h4>
      <p class="modal-body-text">
        One national policy brief has been successfully published, with a second policy brief in active preparation, directly informing legislative stakeholders on tiered excise taxation.
      </p>
    `
  },
  'modal-bdepaper': {
    title: 'BD E-Paper Hub (Runner E-Paper)',
    tag: 'Production Mobile Architecture • Flutter & Dart',
    content: `
      <p class="modal-body-text">
        <strong>BD E-Paper Hub</strong> is a dedicated mobile application engineered to provide seamless, centralized access to daily editions of prominent national and regional newspapers across Bangladesh.
      </p>
      <h4 class="modal-section-title">Architectural Features</h4>
      <ul class="track-list" style="margin-bottom: 20px;">
        <li><strong>Layered Clean Architecture:</strong> Clean separation between UI screens, domain models, network repositories, and local storage services.</li>
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
  'modal-child-nutrition': {
    title: 'Child Undernutrition Anthropometric Modeling (BDHS 2022)',
    tag: "Master's Thesis Research • North South University (NSU)",
    content: `
      <p class="modal-body-text">
        Developed as my <strong>Master's Thesis Project</strong> under the Computational Sciences program at North South University.
      </p>
      <h4 class="modal-section-title">Analytical Pipeline & Methods</h4>
      <ul class="track-list" style="margin-bottom: 20px;">
        <li><strong>Sample Harmonization:</strong> Processed and standardized individual microdata records for 8,500+ children under five years of age from the 2022 Bangladesh Demographic and Health Survey.</li>
        <li><strong>WHO Growth Standards:</strong> Calculated anthropometric Z-scores for Height-for-Age (HAZ - Stunting), Weight-for-Age (WAZ - Underweight), and Weight-for-Height (WHZ - Wasting).</li>
        <li><strong>Econometric Modeling:</strong> Employed multivariate regression controlling for mother's educational attainment, WASH infrastructure, household wealth indices, and geographical divisions.</li>
        <li><strong>Reproducible Codebook:</strong> Implemented with an isolated R environment (<code>renv</code>) ensuring 100% computational reproducibility.</li>
      </ul>
    `
  },
  'modal-hpc': {
    title: 'Parallel Simulated Annealing on HPC & GPU Architectures',
    tag: 'High-Performance Computing • North South University',
    content: `
      <p class="modal-body-text">
        Conducted under the <strong>HPC Project</strong> within the graduate Computational Sciences program at North South University.
      </p>
      <h4 class="modal-section-title">Technical Implementation</h4>
      <ul class="track-list" style="margin-bottom: 20px;">
        <li><strong>Combinatorial Search Parallelization:</strong> Overcame traditional sequential dependencies of Markov chain annealing by parallelizing candidate neighborhood evaluations in C and OpenMP.</li>
        <li><strong>CUDA Kernel Acceleration:</strong> Offloaded matrix cost calculations to CUDA threads, achieving substantial execution speedup over serial baselines.</li>
        <li><strong>Benchmarking:</strong> Profiled memory throughput, thread synchronization overheads, and convergence accuracy on compute clusters.</li>
      </ul>
    `
  },
  'modal-steps': {
    title: 'STEPS 2022 Physical Activity & NCD Risk Analysis',
    tag: 'Epidemiological Surveillance • Paper in Progress',
    content: `
      <p class="modal-body-text">
        Quantitative public health analysis evaluating population-level physical activity patterns, sedentary lifestyles, and cardiometabolic risk factors using the official <strong>STEPS 2022</strong> national survey dataset in Bangladesh. <em>(Full paper currently in preparation)</em>.
      </p>
    `
  },
  'modal-minitablets': {
    title: 'Pediatric Mini-Tablets Formulation Acceptability Study',
    tag: 'Clinical Pharmacology & Compliance • Paper in Progress',
    content: `
      <p class="modal-body-text">
        Investigating age-stratified swallowability, compliance, and clinical acceptability of oral mini-tablet formulations among pediatric and juvenile patient cohorts adhering to international ICH E11 guidelines. <em>(Full paper currently in preparation)</em>.
      </p>
    `
  },
  'modal-climate': {
    title: "Digital Inequality & Climate Hazard Warnings in Bangladesh",
    tag: 'Climate Resilience & Demography • Research Abstract',
    content: `
      <p class="modal-body-text">
        An exploratory research inquiry analyzing structural gender disparities in mobile phone ownership, literacy, and early warning broadcast dissemination across coastal districts during tropical cyclones and storm surges.
      </p>
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
