/**
 * Ibrahim Hasan — Portfolio Application Logic
 * Pure Vanilla JavaScript — High-Performance, Zero External Runtime Dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initProjectFilters();
  initProjectReveals();
  initModals();
  initClipboardButtons();
  initScrollSpy();
  initNextPageDock();
  updateCurrentYear();
  initAmbientSpotlight();
  initScrollReveals();
  initPointerLighting();
  initNavIndicator();
  initCursorHalo();
});

/* Keep the next-page action within reach after its hero link scrolls away. */
function initNextPageDock() {
  const source = document.querySelector('[data-next-page]');
  if (!source) return;

  const dock = document.createElement('div');
  dock.className = 'page-step-dock';
  dock.setAttribute('aria-hidden', 'true');
  document.body.append(dock);

  let placeholder = null;
  let isDocked = false;
  let observer = null;

  const dockSource = () => {
    if (isDocked || !source.parentElement) return;
    const rect = source.getBoundingClientRect();
    const style = getComputedStyle(source);
    placeholder = document.createElement('span');
    placeholder.className = 'page-step-placeholder';
    Object.assign(placeholder.style, {
      display: 'block',
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      marginTop: style.marginTop,
      marginRight: style.marginRight,
      marginBottom: style.marginBottom,
      marginLeft: style.marginLeft,
      gridColumn: style.gridColumn,
      gridRow: style.gridRow,
      justifySelf: style.justifySelf,
      alignSelf: style.alignSelf,
      visibility: 'hidden',
      pointerEvents: 'none'
    });
    source.before(placeholder);
    dock.append(source);
    isDocked = true;
    dock.setAttribute('aria-hidden', 'false');
    dock.classList.add('is-visible');
    observer?.unobserve(source);
    observer?.observe(placeholder);
  };

  const restoreSource = () => {
    if (!isDocked || !placeholder?.isConnected) return;
    const oldPlaceholder = placeholder;
    dock.classList.remove('is-visible');
    dock.setAttribute('aria-hidden', 'true');
    observer?.unobserve(oldPlaceholder);
    oldPlaceholder.before(source);
    oldPlaceholder.remove();
    placeholder = null;
    isDocked = false;
    observer?.observe(source);
  };

  const setDockState = () => {
    const target = isDocked ? placeholder : source;
    if (!target) return;
    const passedTop = target.getBoundingClientRect().bottom <= 0;
    if (!isDocked && passedTop) dockSource();
    else if (isDocked && !passedTop) restoreSource();
  };

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(setDockState, { threshold: 0, rootMargin: '0px' });
    observer.observe(source);
    return;
  }

  const update = () => setDockState();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}

/* --- Gentle entrance motion that stays out of the way of reduced-motion users --- */
function initScrollReveals() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) return;

  const targets = document.querySelectorAll(
    '.page-intro, .about-intro, .ssb-feature, .work-index-heading, .trajectory-item, .channel-row, .contact-section'
  );
  targets.forEach(item => item.classList.add('scroll-reveal'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

  targets.forEach(item => observer.observe(item));
}

/* --- Pointer-reactive color glow on desktop project artwork --- */
function initPointerLighting() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return;

  document.querySelectorAll('.ssb-feature').forEach(card => {
    let frame = 0;
    card.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse') return;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = card.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width) * 100;
        const y = ((event.clientY - bounds.top) / bounds.height) * 100;
        card.style.setProperty('--pointer-x', `${x}%`);
        card.style.setProperty('--pointer-y', `${y}%`);
      });
    });
    card.addEventListener('pointerleave', () => {
      if (frame) cancelAnimationFrame(frame);
      card.style.setProperty('--pointer-x', '90%');
      card.style.setProperty('--pointer-y', '8%');
    });
  });
}

/* A single highlight follows focus or mouse hover, then returns to the current page. */
function initNavIndicator() {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;

  const links = [...nav.querySelectorAll('.site-nav-link')];
  const current = nav.querySelector('[aria-current="page"]');
  if (!current || links.length !== 5) return;

  const pointTo = link => nav.style.setProperty('--nav-slot', links.indexOf(link));
  const restore = () => pointTo(nav.querySelector('.site-nav-link:focus-visible') || current);
  restore();
  nav.classList.add('has-nav-indicator');

  nav.addEventListener('pointerover', event => {
    const link = event.target.closest('.site-nav-link');
    if (event.pointerType === 'mouse' && link) pointTo(link);
  });
  nav.addEventListener('pointerleave', restore);
  nav.addEventListener('focusin', restore);
  nav.addEventListener('focusout', () => queueMicrotask(restore));
}

/* Keep the native cursor and draw a halo that responds to clickable targets. */
function initCursorHalo() {
  const motion = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  const halo = document.createElement('span');
  halo.className = 'cursor-halo';
  halo.setAttribute('aria-hidden', 'true');
  document.body.append(halo);

  let frame = 0;
  let pointer;
  const hide = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    halo.classList.remove('is-visible');
  };

  document.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || !motion.matches) return hide();
    if (event.target.closest('input, textarea, [contenteditable]')) return hide();

    pointer = event;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      const target = pointer.target;
      halo.style.translate = `${pointer.clientX}px ${pointer.clientY}px`;
      halo.classList.toggle('is-interactive', Boolean(target?.closest('a[href], button:enabled, summary, [role="button"]')));
      halo.classList.add('is-visible');
      frame = 0;
    });
  }, { passive: true });

  document.documentElement.addEventListener('pointerleave', hide);
  window.addEventListener('blur', hide);
  motion.addEventListener('change', hide);
}

/* --- Click or keyboard activation reveals one project at a time --- */
function initProjectReveals() {
  const entries = [...document.querySelectorAll('[data-work-reveal]')];

  const setExpanded = (entry, expanded) => {
    if (expanded) {
      entries.forEach(other => {
        if (other !== entry) {
          other.open = false;
          other.querySelector('summary')?.setAttribute('aria-expanded', 'false');
        }
      });
    }
    entry.open = expanded;
    entry.querySelector('summary')?.setAttribute('aria-expanded', String(expanded));
  };

  entries.forEach(entry => {
    const trigger = entry.querySelector('summary');
    if (!trigger) return;
    trigger.setAttribute('aria-expanded', 'false');

    trigger.addEventListener('click', event => {
      event.preventDefault();
      setExpanded(entry, !entry.open);
    });
  });
}

/* --- 1. Theme Management (Dark / Light) --- */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  const savedTheme = localStorage.getItem('ih_theme') || 'light';
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
        const category = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || category.split(' ').includes(filterValue)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });

      const quietListPill = document.querySelector('.quiet-list .sliding-hover-pill');
      if (quietListPill) quietListPill.style.opacity = '0';
    });
  });
}

/* --- 4. Interactive Project & Research Modals with Publication Diagrams --- */
const modalData = {
  'modal-ssb': {
    title: 'Sugar-Sweetened Beverages: Research & Policy',
    tag: 'Flagship research initiative • ARK Foundation',
    content: `
      <p class="modal-body-text">The sugar-sweetened beverages project brings together three connected strands of work on food policy and consumer evidence in Bangladesh.</p>
      <div class="ssb-stream-grid">
        <article class="ssb-stream"><span>01 / POLICY REVIEW</span><h4>Food-EPI review</h4><p>Reviewing food-policy implementation against international Food-EPI benchmarks. The review paper is in progress.</p></article>
        <article class="ssb-stream"><span>02 / PACK ANALYSIS</span><h4>Nutritional pack analysis</h4><p>Assessing product packaging, nutrition declarations, and compliance relevant to sugar-sweetened beverages. The analysis paper is in progress.</p></article>
        <article class="ssb-stream"><span>03 / HOUSEHOLD SURVEY</span><h4>Consumer &amp; household evidence</h4><p>Conducting a digital household survey to understand beverage purchasing and demand, alongside consumer research on front-of-pack labelling.</p></article>
      </div>
      <h4 class="modal-section-title">Read on ResearchGate</h4>
      <ul class="modal-bullets research-publications">
        <li><a href="https://www.researchgate.net/publication/417086923_Designed_to_Appeal_Child-Focused_Packaging_of_Sugary_Beverages_in_Bangladesh" target="_blank" rel="noopener noreferrer">Designed to Appeal: Child-Focused Packaging of Sugary Beverages in Bangladesh</a></li>
        <li><a href="https://www.researchgate.net/publication/414490438_Beyond_the_Barcode_Strengthening_digital_verification_of_sugar-sweetened_beverages_in_Bangladesh" target="_blank" rel="noopener noreferrer">Beyond the Barcode: Strengthening digital verification of sugar-sweetened beverages in Bangladesh</a></li>
      </ul>
      <h4 class="modal-section-title">Policy engagement</h4>
      <p class="modal-body-text">One national policy brief has been published, with a second in preparation to support policy discussion on tiered excise taxation.</p>
    `
  },
  'modal-bdepaper': {
    title: 'BD E-Paper Hub (Runner E-Paper)',
    tag: 'Production Mobile Architecture • Flutter & Dart',
    content: `
      <p class="modal-body-text">
        <strong>BD E-Paper Hub</strong> is a dedicated mobile application engineered to provide seamless, centralized access to daily editions of prominent national and regional newspapers across Bangladesh.
      </p>

      <!-- Diagram Design: Mobile Architecture -->
      <div class="methodology-diagram-wrap">
        <div class="diagram-header">
          <span class="diagram-header-tag">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            Mobile Architecture &amp; Delivery
          </span>
          <span>Flutter &amp; Dart</span>
        </div>
        <svg class="diagram-svg" viewBox="0 0 520 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <marker id="marker-arrow-flutter" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="rgba(148, 163, 184, 0.6)"/>
            </marker>
          </defs>
          <!-- Stage 1 -->
          <rect x="10" y="40" width="120" height="80" rx="6" fill="var(--bg-surface-elevated)" stroke="var(--border-subtle)" vector-effect="non-scaling-stroke"/>
          <text x="22" y="60" font-family="var(--font-mono)" font-size="9" fill="var(--accent-blue)" font-weight="600">01 / MANIFESTS</text>
          <text x="22" y="78" font-family="var(--font-sans)" font-size="11" fill="var(--ink-primary)" font-weight="600">Multi-Publisher</text>
          <text x="22" y="94" font-family="var(--font-mono)" font-size="8.5" fill="var(--ink-muted)">National &amp; Regional</text>
          <text x="22" y="108" font-family="var(--font-mono)" font-size="8.5" fill="var(--ink-muted)">Newspaper Feeds</text>

          <!-- Connector 1->2 -->
          <path d="M 130 80 L 160 80" stroke="rgba(148, 163, 184, 0.45)" stroke-width="1.5" marker-end="url(#marker-arrow-flutter)"/>

          <!-- Stage 2 -->
          <rect x="165" y="40" width="145" height="80" rx="6" fill="var(--bg-surface-elevated)" stroke="var(--border-subtle)" vector-effect="non-scaling-stroke"/>
          <text x="178" y="60" font-family="var(--font-mono)" font-size="9" fill="var(--accent-emerald)" font-weight="600">02 / ARCHITECTURE</text>
          <text x="178" y="78" font-family="var(--font-sans)" font-size="11" fill="var(--ink-primary)" font-weight="600">Clean Architecture</text>
          <text x="178" y="94" font-family="var(--font-mono)" font-size="8.5" fill="var(--ink-muted)">Raster WebView Engine</text>
          <text x="178" y="108" font-family="var(--font-mono)" font-size="8.5" fill="var(--ink-muted)">Disk &amp; Memory Cache</text>

          <!-- Connector 2->3 -->
          <path d="M 310 80 L 340 80" stroke="rgba(148, 163, 184, 0.45)" stroke-width="1.5" marker-end="url(#marker-arrow-flutter)"/>

          <!-- Stage 3 -->
          <rect x="345" y="40" width="165" height="80" rx="6" fill="var(--bg-surface-elevated)" stroke="var(--accent-blue)" stroke-width="1.2" vector-effect="non-scaling-stroke"/>
          <text x="358" y="60" font-family="var(--font-mono)" font-size="9" fill="var(--accent-blue)" font-weight="600">03 / ARTIFACTS</text>
          <text x="358" y="78" font-family="var(--font-sans)" font-size="11" fill="var(--ink-primary)" font-weight="600">Production Build</text>
          <text x="358" y="94" font-family="var(--font-mono)" font-size="8.5" fill="var(--ink-muted)">Release APK &amp; AAB</text>
          <text x="358" y="108" font-family="var(--font-mono)" font-size="8.5" fill="var(--ink-muted)">Automated Gradle</text>
        </svg>
      </div>

      <h4 class="modal-section-title">Architectural Features</h4>
      <ul class="track-list" style="margin-bottom: 20px;">
        <li><strong>Layered Clean Architecture:</strong> Clean separation between UI screens, domain models, network repositories, and local storage services.</li>
        <li><strong>Native WebView &amp; Raster Pipeline:</strong> Optimized memory allocation handling multi-megabyte daily newspaper graphics and touch pan-and-zoom gestures.</li>
        <li><strong>Offline Bookmarking:</strong> Integrated shared preferences and local disk cache allowing users to save and revisit specific editions without recurring data fetches.</li>
        <li><strong>Production Artifacts:</strong> Deployed as signed release APKs and Android App Bundles (AAB) with automated Gradle builds.</li>
      </ul>
      <h4 class="modal-section-title">Open Source Repository</h4>
      <p class="modal-body-text">
        Public codebase and release details available at: <br>
        <a href="https://github.com/ibrahimhasan0012/runner-epaper" target="_blank" rel="noopener noreferrer" style="color: var(--accent-blue); font-weight: 600;">
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

      <!-- Diagram Design: Econometric Pipeline -->
      <div class="methodology-diagram-wrap">
        <div class="diagram-header">
          <span class="diagram-header-tag">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            Econometric Pipeline
          </span>
          <span>NSU Computational Sciences</span>
        </div>
        <svg class="diagram-svg" viewBox="0 0 520 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <marker id="marker-arrow-bdhs" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="rgba(148, 163, 184, 0.6)"/>
            </marker>
          </defs>
          <!-- Stage 1 -->
          <rect x="10" y="40" width="115" height="80" rx="6" fill="var(--bg-surface-elevated)" stroke="var(--border-subtle)" vector-effect="non-scaling-stroke"/>
          <text x="22" y="60" font-family="var(--font-mono)" font-size="9" fill="var(--accent-blue)" font-weight="600">01 / MICRODATA</text>
          <text x="22" y="78" font-family="var(--font-sans)" font-size="11" fill="var(--ink-primary)" font-weight="600">BDHS 2022</text>
          <text x="22" y="94" font-family="var(--font-mono)" font-size="8.5" fill="var(--ink-muted)">N = 8,500+ Children</text>
          <text x="22" y="108" font-family="var(--font-mono)" font-size="8.5" fill="var(--ink-muted)">KR Microdata Files</text>

          <!-- Connector 1->2 -->
          <path d="M 125 80 L 155 80" stroke="rgba(148, 163, 184, 0.45)" stroke-width="1.5" marker-end="url(#marker-arrow-bdhs)"/>

          <!-- Stage 2 -->
          <rect x="160" y="40" width="130" height="80" rx="6" fill="var(--bg-surface-elevated)" stroke="var(--border-subtle)" vector-effect="non-scaling-stroke"/>
          <text x="172" y="60" font-family="var(--font-mono)" font-size="9" fill="var(--accent-emerald)" font-weight="600">02 / STANDARDS</text>
          <text x="172" y="78" font-family="var(--font-sans)" font-size="11" fill="var(--ink-primary)" font-weight="600">WHO Anthro 2006</text>
          <text x="172" y="94" font-family="var(--font-mono)" font-size="8.5" fill="var(--ink-muted)">HAZ, WAZ, WHZ</text>
          <text x="172" y="108" font-family="var(--font-mono)" font-size="8.5" fill="var(--ink-muted)">Z-score &lt; -2 SD</text>

          <!-- Connector 2->3 -->
          <path d="M 290 80 L 320 80" stroke="rgba(148, 163, 184, 0.45)" stroke-width="1.5" marker-end="url(#marker-arrow-bdhs)"/>

          <!-- Stage 3 -->
          <rect x="325" y="40" width="185" height="80" rx="6" fill="var(--bg-surface-elevated)" stroke="var(--accent-blue)" stroke-width="1.2" vector-effect="non-scaling-stroke"/>
          <text x="338" y="60" font-family="var(--font-mono)" font-size="9" fill="var(--accent-blue)" font-weight="600">03 / ESTIMATION &amp; CODE</text>
          <text x="338" y="78" font-family="var(--font-sans)" font-size="11" fill="var(--ink-primary)" font-weight="600">Multivariate Logit</text>
          <text x="338" y="94" font-family="var(--font-mono)" font-size="8.5" fill="var(--ink-muted)">Maternal / WASH Covariates</text>
          <text x="338" y="108" font-family="var(--font-mono)" font-size="8.5" fill="var(--ink-muted)">R / renv Reproducible</text>
        </svg>
      </div>

      <h4 class="modal-section-title">Analytical Pipeline &amp; Methods</h4>
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

      <!-- Diagram Design: HPC Architecture -->
      <div class="methodology-diagram-wrap">
        <div class="diagram-header">
          <span class="diagram-header-tag">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            Parallel Compute Architecture
          </span>
          <span>NSU HPC Project</span>
        </div>
        <svg class="diagram-svg" viewBox="0 0 520 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <marker id="marker-arrow-hpc" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="rgba(148, 163, 184, 0.6)"/>
            </marker>
          </defs>
          <!-- Stage 1 -->
          <rect x="10" y="45" width="125" height="90" rx="6" fill="var(--bg-surface-elevated)" stroke="var(--border-subtle)" vector-effect="non-scaling-stroke"/>
          <text x="22" y="66" font-family="var(--font-mono)" font-size="9" fill="var(--ink-faint)" font-weight="600">01 / SERIAL BASELINE</text>
          <text x="22" y="84" font-family="var(--font-sans)" font-size="11" fill="var(--ink-primary)" font-weight="600">Markov Annealing</text>
          <text x="22" y="100" font-family="var(--font-mono)" font-size="8.5" fill="var(--ink-muted)">Sequential Chain</text>
          <text x="22" y="116" font-family="var(--font-mono)" font-size="8.5" fill="var(--ink-muted)">Cost Evaluation Bottleneck</text>

          <!-- Connectors 1 -> 2 -->
          <path d="M 135 70 L 175 55" stroke="rgba(148, 163, 184, 0.45)" stroke-width="1.5" marker-end="url(#marker-arrow-hpc)"/>
          <path d="M 135 110 L 175 125" stroke="rgba(148, 163, 184, 0.45)" stroke-width="1.5" marker-end="url(#marker-arrow-hpc)"/>

          <!-- Stage 2 Split -->
          <rect x="180" y="20" width="165" height="60" rx="6" fill="var(--bg-surface-elevated)" stroke="var(--border-subtle)" vector-effect="non-scaling-stroke"/>
          <text x="194" y="38" font-family="var(--font-mono)" font-size="9" fill="var(--accent-blue)" font-weight="600">02 / HOST (CPU / OpenMP)</text>
          <text x="194" y="54" font-family="var(--font-sans)" font-size="11" fill="var(--ink-primary)" font-weight="600">Candidate Search</text>
          <text x="194" y="68" font-family="var(--font-mono)" font-size="8.5" fill="var(--ink-muted)">Multi-core Thread Pool</text>

          <rect x="180" y="100" width="165" height="60" rx="6" fill="var(--bg-surface-elevated)" stroke="var(--border-subtle)" vector-effect="non-scaling-stroke"/>
          <text x="194" y="118" font-family="var(--font-mono)" font-size="9" fill="var(--accent-emerald)" font-weight="600">02 / DEVICE (GPU / CUDA)</text>
          <text x="194" y="134" font-family="var(--font-sans)" font-size="11" fill="var(--ink-primary)" font-weight="600">Matrix Cost Kernels</text>
          <text x="194" y="148" font-family="var(--font-mono)" font-size="8.5" fill="var(--ink-muted)">Massive Thread Grids</text>

          <!-- Connectors 2 -> 3 -->
          <path d="M 345 50 L 385 75" stroke="rgba(148, 163, 184, 0.45)" stroke-width="1.5" marker-end="url(#marker-arrow-hpc)"/>
          <path d="M 345 130 L 385 105" stroke="rgba(148, 163, 184, 0.45)" stroke-width="1.5" marker-end="url(#marker-arrow-hpc)"/>

          <!-- Stage 3 Output -->
          <rect x="390" y="45" width="120" height="90" rx="6" fill="var(--bg-surface-elevated)" stroke="var(--accent-blue)" stroke-width="1.2" vector-effect="non-scaling-stroke"/>
          <text x="404" y="66" font-family="var(--font-mono)" font-size="9" fill="var(--accent-blue)" font-weight="600">03 / RESULTS</text>
          <text x="404" y="84" font-family="var(--font-sans)" font-size="11.5" fill="var(--ink-primary)" font-weight="600">Profiling</text>
          <text x="404" y="100" font-family="var(--font-mono)" font-size="8.5" fill="var(--ink-muted)">Substantial Speedup</text>
          <text x="404" y="116" font-family="var(--font-mono)" font-size="8.5" fill="var(--ink-muted)">Overhead Analysis</text>
        </svg>
      </div>
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
  },
  'modal-findly': {
    title: 'Findly BD — Automated Tech Deals Aggregator',
    tag: 'Web Platform & Automation • JavaScript',
    content: `
      <p class="modal-body-text">
        <strong>Findly BD</strong> is a minimalist web aggregator monitoring real-time price drops, promotions, and product availability across top consumer technology vendors in Bangladesh (Star Tech, Ryans, TechLand BD, Computer Village).
      </p>
      <h4 class="modal-section-title">Automated Data Pipeline</h4>
      <ul class="track-list" style="margin-bottom: 20px;">
        <li><strong>Scheduled Ingestion:</strong> Daily automated scraping workflows scheduled via GitHub Actions fetching updated retail pricing without manual intervention.</li>
        <li><strong>Static High-Speed Delivery:</strong> Zero hosting overhead, built for fast mobile browsing with clean typography and instant search.</li>
      </ul>
      <h4 class="modal-section-title">Open Source Repository</h4>
      <p class="modal-body-text">
        Explore source code and workflow files at: <br>
        <a href="https://github.com/ibrahimhasan0012/findly" target="_blank" rel="noopener noreferrer" style="color: var(--accent-text); font-weight: 600;">
          github.com/ibrahimhasan0012/findly
        </a>
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

/* --- 5. Clipboard Copy with Tactile Morph Feedback --- */
function initClipboardButtons() {
  const emailButtons = document.querySelectorAll('.copy-email-btn');
  emailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'ibrahimhasanzafar@gmail.com';
      copyToClipboard(email, 'Email copied to clipboard!', btn);
    });
  });

  const citationButtons = document.querySelectorAll('.copy-citation-btn');
  citationButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const citation = btn.getAttribute('data-cite');
      if (citation) {
        copyToClipboard(citation, 'APA citation copied to clipboard!', btn);
      }
    });
  });
}

function copyToClipboard(text, successMessage, triggerBtn) {
  const onCopiedSuccess = () => {
    showToast(successMessage);
    if (triggerBtn) {
      triggerBtn.classList.add('copied');
      const textSpan = triggerBtn.querySelector('.copy-btn-text');
      const originalText = textSpan ? textSpan.textContent : '';
      if (textSpan) textSpan.textContent = 'Copied!';

      setTimeout(() => {
        triggerBtn.classList.remove('copied');
        if (textSpan) textSpan.textContent = originalText;
      }, 2000);
    }
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(onCopiedSuccess).catch(() => fallbackCopy(text, successMessage, triggerBtn));
  } else {
    fallbackCopy(text, successMessage, triggerBtn);
  }
}

function fallbackCopy(text, successMessage, triggerBtn) {
  const tempInput = document.createElement('textarea');
  tempInput.value = text;
  tempInput.style.position = 'fixed';
  tempInput.style.opacity = '0';
  document.body.appendChild(tempInput);
  tempInput.select();
  try {
    document.execCommand('copy');
    showToast(successMessage);
    if (triggerBtn) {
      triggerBtn.classList.add('copied');
      const textSpan = triggerBtn.querySelector('.copy-btn-text');
      const originalText = textSpan ? textSpan.textContent : '';
      if (textSpan) textSpan.textContent = 'Copied!';

      setTimeout(() => {
        triggerBtn.classList.remove('copied');
        if (textSpan) textSpan.textContent = originalText;
      }, 2000);
    }
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

/* --- 8. Ambient Desktop Spotlight (Emil Kowalski Widescreen Atmosphere) --- */
function initAmbientSpotlight() {
  const spotlight = document.getElementById('ambient-spotlight');
  if (!spotlight) return;

  if (window.matchMedia('(pointer: coarse)').matches) return;

  let rafId = null;

  window.addEventListener('mousemove', (e) => {
    if (!rafId) {
      rafId = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
        rafId = null;
      });
    }
  }, { passive: true });
}
