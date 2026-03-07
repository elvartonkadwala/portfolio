'use strict';

/* ══ 1. LOADER ═════════════════════════════════════════════════ */
(function () {
  let p = 0;
  const bar    = document.getElementById('lBar');
  const pctEl  = document.getElementById('lPct');
  const loader = document.getElementById('loader');
  if (!loader) return;
  const iv = setInterval(() => {
    p += Math.random() * 16 + 5;
    if (p >= 100) {
      p = 100; clearInterval(iv);
      setTimeout(() => { loader.classList.add('done'); onBoot(); }, 280);
    }
    bar.style.width = p + '%';
    pctEl.textContent = Math.floor(p) + '%';
  }, 70);
})();

function onBoot() {
  document.querySelectorAll('.mbar-fill').forEach(b => b.classList.add('go'));
  animCount(document.getElementById('heroNum'), 80, 1400);
  buildGreeting();
}

/* ══ 2. FAB ════════════════════════════════════════════════════ */
const fab = document.getElementById('fab');
if (fab) {
  fab.addEventListener('click', () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }));
  window.addEventListener('scroll', () => {
    const contactEl = document.getElementById('contact');
    if (!contactEl) return;
    fab.classList.toggle('hidden', contactEl.getBoundingClientRect().top < window.innerHeight * 0.6);
  }, { passive: true });
}

/* ══ 3. NAV ════════════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('stuck', window.scrollY > 60);
}, { passive: true });

const hamburger = document.getElementById('hamburger');
const mobMenu   = document.getElementById('mobMenu');
if (hamburger && mobMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobMenu.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });
}

/* ══ 4. TICKER ═════════════════════════════════════════════════ */
(function () {
  const el = document.getElementById('tickerEl');
  if (!el) return;
  const items = ['Brand Identity','Logo Design','Motion Graphics','Social Media','Visual Design','Blantyre · Malawi','Freelance Designer','Adobe CC','Canva Pro'];
  let html = '';
  for (let i = 0; i < 3; i++) items.forEach(t => { html += `<span>${t}</span><span class="dot">·</span>`; });
  el.innerHTML = html;
})();

/* ══ 5. GREETING ═══════════════════════════════════════════════ */
function buildGreeting() {
  const el = document.getElementById('heroGreeting');
  if (!el) return;
  const h = new Date().getHours();
  el.textContent = `${h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'} — welcome to my portfolio`;
}

/* ══ 6. STACKED CARDS SLIDER ═══════════════════════════════════ */
(function () {
  const isMobile = () => window.innerWidth <= 768;
  const cards = Array.from(document.querySelectorAll('.stack-card'));
  if (!cards.length) return;
  let current = 0;
  let autoTimer = null;
  let progressEl = null;
  const STATES = ['sc-active','sc-behind1','sc-behind2','sc-behind3','sc-hidden'];

  function applyStates(idx) {
    if (isMobile()) return;
    cards.forEach((c, i) => {
      STATES.forEach(s => c.classList.remove(s));
      const diff = (i - idx + cards.length) % cards.length;
      if      (diff === 0) c.classList.add('sc-active');
      else if (diff === 1) c.classList.add('sc-behind1');
      else if (diff === 2) c.classList.add('sc-behind2');
      else if (diff === 3) c.classList.add('sc-behind3');
      else                 c.classList.add('sc-hidden');
    });
    current = idx;
    resetProgress();
  }

  function next() { applyStates((current + 1) % cards.length); }
  function prev() { applyStates((current - 1 + cards.length) % cards.length); }

  function resetProgress() {
    if (progressEl) progressEl.remove();
    const activeCard = cards.find(c => c.classList.contains('sc-active'));
    if (!activeCard) return;
    progressEl = document.createElement('div');
    progressEl.className = 'sc-progress';
    activeCard.appendChild(progressEl);
  }

  applyStates(0);

  function startAuto() { clearInterval(autoTimer); autoTimer = setInterval(next, 5000); }
  function stopAuto()  { clearInterval(autoTimer); }

  // Click active card to advance (not on CTA or stars)
  cards.forEach(card => {
    card.addEventListener('click', e => {
      if (!card.classList.contains('sc-active')) return;
      if (e.target.closest('.sc-cta') || e.target.closest('.star-widget')) return;
      stopAuto(); next(); startAuto();
    });
  });

  // Scroll-to-advance
  const slider = document.getElementById('stackSlider');
  let lastScrollY = window.scrollY;
  let scrollDelta = 0;

  window.addEventListener('scroll', () => {
    if (isMobile()) return;
    const rect = slider?.getBoundingClientRect();
    if (!rect) return;
    if (rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.3) {
      scrollDelta += window.scrollY - lastScrollY;
      if (scrollDelta > 100) { scrollDelta = 0; stopAuto(); next(); startAuto(); }
      else if (scrollDelta < -100) { scrollDelta = 0; stopAuto(); prev(); startAuto(); }
    } else { scrollDelta = 0; }
    lastScrollY = window.scrollY;
  }, { passive: true });

  // Touch swipe
  let txStart = 0;
  slider?.addEventListener('touchstart', e => { txStart = e.touches[0].clientX; }, { passive: true });
  slider?.addEventListener('touchend', e => {
    if (isMobile()) return;
    const dx = e.changedTouches[0].clientX - txStart;
    if (Math.abs(dx) > 40) { stopAuto(); dx < 0 ? next() : prev(); startAuto(); }
  });

  slider?.addEventListener('mouseenter', stopAuto);
  slider?.addEventListener('mouseleave', startAuto);

  window.addEventListener('resize', () => {
    if (isMobile()) cards.forEach(c => STATES.forEach(s => c.classList.remove(s)));
    else applyStates(current);
  });

  startAuto();
})();

/* ══ 7. STAR RATINGS ════════════════════════════════════════════ */
let ratings = {};
try { ratings = JSON.parse(localStorage.getItem('ek-ratings') || '{}'); } catch(e) {}

function initStarWidget(container, projectKey) {
  if (!container) return;
  const stars = Array.from(container.querySelectorAll('.star'));
  const saved = ratings[projectKey] || 0;
  const render = val => stars.forEach((s, i) => s.classList.toggle('lit', i < val));
  render(saved);
  stars.forEach((s, i) => {
    s.addEventListener('mouseenter', () => render(i + 1));
    s.addEventListener('mouseleave', () => render(ratings[projectKey] || 0));
    s.addEventListener('click', () => {
      ratings[projectKey] = i + 1;
      try { localStorage.setItem('ek-ratings', JSON.stringify(ratings)); } catch(e) {}
      render(i + 1);
      document.querySelectorAll(`[data-project="${projectKey}"] .star`).forEach((x, j) => x.classList.toggle('lit', j <= i));
    });
  });
}
document.querySelectorAll('.star-widget').forEach(w => initStarWidget(w, w.dataset.project));

/* ══ 8. PROJECT MODAL ══════════════════════════════════════════ */
const projectData = {
  'brand-identity': {
    title:'Brand Identity System', cat:'Brand Identity', year:'2024',
    subtitle:'Complete visual identity for a local Malawian retail business — from discovery workshops to final brand guidelines document.',
    stats:[{n:'100+',l:'Brand Assets'},{n:'6',l:'Weeks'},{n:'3×',l:'Social Growth'}],
    tools:['Adobe Illustrator','Adobe Photoshop','Adobe InDesign','6 Weeks'],
    steps:[
      {n:'01',h:'Discovery & Research',p:'Interviewed the client team, audited competitors, and mapped core brand values. Built a mood board to align direction before any design work.'},
      {n:'02',h:'Concept Development',p:'Sketched 3 distinct logo directions and presented refined versions digitally with rationale for each creative choice.'},
      {n:'03',h:'Identity System Build',p:'Developed the chosen concept into a full system: logo variants, colour palette, type hierarchy, iconography, and pattern assets.'},
      {n:'04',h:'Brand Guidelines',p:'Produced a 20-page guidelines document covering logo usage, colour codes (HEX/RGB/CMYK), typography rules, and do/don\'t examples.'}
    ],
    quote:'"Elvarton completely transformed how our business is perceived. The new brand feels professional, memorable, and exactly us."',
    quoteBy:'— Client, Blantyre Business Owner'
  },
  'motion-graphics': {
    title:'Promotional Motion Package', cat:'Motion Graphics', year:'2023',
    subtitle:'Animated intro, lower-thirds, and full promotional video package for a business launch campaign in Blantyre.',
    stats:[{n:'5',l:'Video Assets'},{n:'10K+',l:'Organic Views'},{n:'3×',l:'Launch Footfall'}],
    tools:['Adobe After Effects','Adobe Premiere Pro','Adobe Illustrator','3 Weeks'],
    steps:[
      {n:'01',h:'Brief & Storyboard',p:'Created a full storyboard mapping each scene, transition, and text moment before any animation started.'},
      {n:'02',h:'Motion Identity Design',p:'Designed static assets in Illustrator then brought them to life in After Effects with eased animations and kinetic typography.'},
      {n:'03',h:'Video Assembly',p:'Assembled raw footage with motion graphics in Premiere Pro. Added colour grading, sound design, and timing adjustments.'},
      {n:'04',h:'Asset Delivery',p:'Exported all 5 assets in multiple formats for Instagram, Facebook, YouTube, and WhatsApp Status with a reusable template.'}
    ],
    quote:'"The promo video looked like something from a big agency. People kept sharing it and asking who made it. Incredible work."',
    quoteBy:'— Client, Business Owner, Blantyre'
  },
  'social-media': {
    title:'Social Media Content Pack', cat:'Social Media', year:'2024',
    subtitle:'Consistent Instagram & Facebook design templates for a Malawian fashion brand — posts, stories, and reels covers.',
    stats:[{n:'40+',l:'Templates'},{n:'2×',l:'Follower Growth'},{n:'↑68%',l:'Engagement'}],
    tools:['Canva Pro','Adobe Photoshop','Adobe Illustrator','4 Weeks'],
    steps:[
      {n:'01',h:'Audit & Strategy',p:'Reviewed 3 months of past posts and mapped content categories. Created a posting strategy framework.'},
      {n:'02',h:'Style Direction',p:'Defined a visual language: curated palette, two font pairings, and graphic elements for consistency.'},
      {n:'03',h:'Template Design',p:'Designed 40+ editable Canva templates: feed posts, Stories, Facebook banners, and Reels covers.'},
      {n:'04',h:'Handover & Training',p:'Delivered all templates with a usage guide and content calendar so the team could stay consistent independently.'}
    ],
    quote:'"Our feed finally looks like a real brand. Customers started commenting on how professional we looked almost immediately."',
    quoteBy:'— Client, Fashion Brand Owner'
  },
  'logo-design': {
    title:'4NBuy E-Commerce Brand', cat:'Logo Design', year:'2024',
    subtitle:'Modern logo and visual mark for a growing Malawian e-commerce platform — bold, clean, and built to scale.',
    stats:[{n:'12',l:'Variations'},{n:'2',l:'Weeks'},{n:'5★',l:'Client Rating'}],
    tools:['Adobe Illustrator','Adobe Photoshop','2 Weeks'],
    steps:[
      {n:'01',h:'Brand Discovery',p:'Explored the platform\'s values — accessible, modern, trustworthy. Researched e-commerce logos to identify a distinct positioning.'},
      {n:'02',h:'Sketching & Concepts',p:'Generated 20+ rough sketches narrowed to 3 strong digital concepts: wordmark, icon mark, and combined lockup.'},
      {n:'03',h:'Refinement',p:'Refined the chosen direction through 2 revision rounds, testing across backgrounds, sizes, and print vs digital.'},
      {n:'04',h:'Delivery',p:'Delivered all files in AI, EPS, SVG, PNG, and PDF — with light, dark, and single-colour versions for every use case.'}
    ],
    quote:'"Exactly what we needed — clean, professional, and flexible enough for everything from app icons to billboard banners."',
    quoteBy:'— 4NBuy, Malawi'
  }
};

function openProject(key) {
  const d = projectData[key];
  if (!d) return;
  const modal = document.getElementById('projectModal');
  const body  = document.getElementById('projBody');
  const saved = ratings[key] || 0;

  body.innerHTML = `
    <div class="pm-hero-img" style="background:linear-gradient(135deg,#1a1a18,#0f0e0c);">
      <div class="pm-hero-ph">${d.cat} · ${d.year}</div>
    </div>
    <div class="pm-meta">
      <span class="pm-tag red">${d.cat}</span>
      <span class="pm-tag">${d.year}</span>
    </div>
    <div class="pm-title">${d.title}</div>
    <p class="pm-sub">${d.subtitle}</p>
    <div class="pm-stats">${d.stats.map(s=>`<div class="pm-stat"><div class="pm-stat-n">${s.n}</div><div class="pm-stat-l">${s.l}</div></div>`).join('')}</div>
    <div class="pm-section-lbl">Tools Used</div>
    <div class="pm-tools">${d.tools.map(t=>`<span class="pm-tool">${t}</span>`).join('')}</div>
    <div class="pm-section-lbl">Process</div>
    <div class="pm-steps">${d.steps.map(s=>`<div class="pm-step"><div class="pm-step-n">${s.n}</div><div><h4>${s.h}</h4><p>${s.p}</p></div></div>`).join('')}</div>
    <blockquote class="pm-quote">${d.quote}<cite>${d.quoteBy}</cite></blockquote>
    <div class="pm-rate">
      <div class="pm-rate-title">Rate this project</div>
      <div class="pm-star-row">${[1,2,3,4,5].map(v=>`<span class="pm-star${v<=saved?' lit':''}"data-v="${v}">★</span>`).join('')}</div>
    </div>`;

  const pmStars = Array.from(body.querySelectorAll('.pm-star'));
  pmStars.forEach((s, i) => {
    s.addEventListener('mouseenter', () => pmStars.forEach((x,j) => x.classList.toggle('lit', j<=i)));
    s.addEventListener('mouseleave', () => pmStars.forEach((x,j) => x.classList.toggle('lit', j<(ratings[key]||0))));
    s.addEventListener('click', () => {
      ratings[key] = i + 1;
      try { localStorage.setItem('ek-ratings', JSON.stringify(ratings)); } catch(e) {}
      pmStars.forEach((x,j) => x.classList.toggle('lit', j<=i));
      document.querySelectorAll(`[data-project="${key}"] .star`).forEach((x,j) => x.classList.toggle('lit', j<=i));
    });
  });

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProject() {
  document.getElementById('projectModal')?.classList.remove('open');
  document.body.style.overflow = '';
}

window.openProject  = openProject;
window.closeProject = closeProject;
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeProject(); });

/* ══ 9. SCROLL REVEAL ══════════════════════════════════════════ */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.rv').forEach(el => revealObs.observe(el));

// Skill bars
const skillBarObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.sk-fill').forEach(el => el.classList.add('go'));
    entry.target.querySelectorAll('.rb-fill').forEach(el => el.classList.add('go'));
    skillBarObs.unobserve(entry.target);
  });
}, { threshold: 0.25 });
document.querySelectorAll('#skills, #testimonials').forEach(s => skillBarObs.observe(s));

/* ══ 10. COUNTER — fires when about section enters view ═════════ */
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('[data-count]').forEach(el => {
      animCount(el, parseInt(el.dataset.count, 10), 1400);
    });
    counterObs.unobserve(entry.target);
  });
}, { threshold: 0.3 });
const aboutSec = document.getElementById('about');
if (aboutSec) counterObs.observe(aboutSec);

/* ══ 11. ANIMATED COUNTER ═══════════════════════════════════════ */
function animCount(el, target, duration) {
  if (!el) return;
  const start = performance.now();
  const step = now => {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor((1 - Math.pow(1-p, 3)) * target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

/* ══ 12. HERO PARALLAX ══════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const hero = document.getElementById('hero');
  if (!hero) return;
  const y = window.scrollY;
  hero.querySelectorAll('.orb').forEach((orb, i) => {
    orb.style.transform = `translateY(${y * (0.06 + i * 0.03)}px)`;
  });
}, { passive: true });

/* ══ 13. GALLERY FILTER ═════════════════════════════════════════ */
(function () {
  const btns = document.querySelectorAll('.gal-btn');
  const items = document.querySelectorAll('.gal-item');
  if (!btns.length) return;
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      items.forEach(item => item.classList.toggle('hidden', f !== 'all' && item.dataset.cat !== f));
    });
  });
})();

/* ══ 14. CONTACT FORM ═══════════════════════════════════════════ */
(function () {
  const form   = document.getElementById('cForm');
  const btn    = document.getElementById('fBtn');
  const status = document.getElementById('fStatus');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name  = document.getElementById('fName')?.value.trim();
    const email = document.getElementById('fEmail')?.value.trim();
    const msg   = document.getElementById('fMsg')?.value.trim();
    if (!name || !email || !msg) {
      status.textContent = 'Please fill in all required fields.';
      status.className = 'fstatus err'; return;
    }
    btn.disabled = true;
    const t = btn.querySelector('.gf-btn-text');
    if (t) t.textContent = 'Sending…';
    status.textContent = '';
    try {
      await emailjs.sendForm('service_ekportfolio', 'template_ekcontact', form);
      status.textContent = '✓ Message sent! I\'ll reply within 24 hours.';
      status.className = 'fstatus ok'; form.reset();
    } catch {
      status.textContent = 'Failed to send. Please email directly.';
      status.className = 'fstatus err';
    } finally {
      btn.disabled = false;
      if (t) t.textContent = 'Send Message';
    }
  });
})();

/* ══ 15. FOOTER YEAR ════════════════════════════════════════════ */
const yrEl = document.getElementById('yr');
if (yrEl) yrEl.textContent = new Date().getFullYear();
