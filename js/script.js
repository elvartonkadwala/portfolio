'use strict';
/* ═══════════════════════════════════════════════════════════
   ELVARTON KADWALA — PORTFOLIO SCRIPTS
   script.js
═══════════════════════════════════════════════════════════ */

/* ── CUSTOM CURSOR ────────────────────────────────────────── */
(function () {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function raf() {
    rx += (mx - rx) * .12;
    ry += (my - ry) * .12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(raf);
  })();

  document.addEventListener('mouseover', e => {
    const b = document.body, el = e.target;
    b.classList.remove('cur-hover', 'cur-link', 'cur-text');
    if (el.matches('button,.proj-cta,.fab,.sn-btn,.gal-btn,.nav-cta,.nav-link,.mob-link,.foot-icon,.btn,.proj-close,.hamburger'))
      b.classList.add('cur-link');
    else if (el.matches('input,textarea'))
      b.classList.add('cur-text');
    else if (el.matches('a,.proj-card,.ltile,.gal-item'))
      b.classList.add('cur-hover');
  });

  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '';  ring.style.opacity = ''; });
})();

/* ── LOADER ───────────────────────────────────────────────── */
(function () {
  const loader = document.getElementById('loader');
  if (!loader) return;
  setTimeout(() => { loader.classList.add('done'); onBoot(); }, 1400);
})();

function onBoot() {
  document.querySelectorAll('.mbar-fill').forEach(b => b.classList.add('go'));
  animCount(document.getElementById('heroNum'), 80, 1400);
  buildGreeting();
}

/* ── FAB ──────────────────────────────────────────────────── */
const fab = document.getElementById('fab');
if (fab) {
  fab.addEventListener('click', () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }));
  window.addEventListener('scroll', () => {
    const c = document.getElementById('contact');
    if (!c) return;
    fab.classList.toggle('hidden', c.getBoundingClientRect().top < window.innerHeight * .6);
  }, { passive: true });
}

/* ── NAV ──────────────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  document.getElementById('nav')?.classList.toggle('stuck', window.scrollY > 60);
}, { passive: true });

/* ── ADVANCED HAMBURGER ───────────────────────────────────── */
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

/* ── TICKER ───────────────────────────────────────────────── */
(function () {
  const el = document.getElementById('tickerEl');
  if (!el) return;
  const items = ['Brand Identity', 'Logo Design', 'Motion Graphics', 'Social Media', 'Visual Design', 'Blantyre · Malawi', 'Freelance Designer', 'Adobe CC', 'Canva Pro'];
  let html = '';
  for (let i = 0; i < 3; i++) items.forEach(t => { html += `<span>${t}</span><span class="dot">·</span>`; });
  el.innerHTML = html;
})();

/* ── GREETING ─────────────────────────────────────────────── */
function buildGreeting() {
  const el = document.getElementById('heroGreeting');
  if (!el) return;
  const h = new Date().getHours();
  el.textContent = h < 12 ? 'Good morning — welcome to my portfolio'
    : h < 18 ? 'Good afternoon — welcome to my portfolio'
    : 'Good evening — welcome to my portfolio';
}

/* ── SCROLL-DRIVEN PROJECT SLIDER (ALL SCREEN SIZES) ─────── */
(function () {
  const root    = document.getElementById('projScrollRoot');
  const sticky  = document.getElementById('projScrollSticky');
  const track   = document.getElementById('projTrack');
  const cards   = Array.from(track?.querySelectorAll('.proj-card') || []);
  const segs    = Array.from(document.querySelectorAll('.pp-seg'));
  const curEl   = document.getElementById('pcCur');
  const totalEl = document.getElementById('pcTotal');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const hint    = document.getElementById('projScrollHint');

  if (!root || !sticky || !track || !cards.length) return;

  const N = cards.length;
  let current = 0;

  if (totalEl) totalEl.textContent = String(N).padStart(2, '0');

  /* Set root height to give scroll budget: 1 viewport per card */
  function setRootHeight() {
    root.style.height = (sticky.offsetHeight * N) + 'px';
  }
  setRootHeight();
  window.addEventListener('resize', () => { setRootHeight(); goTo(current, false); }, { passive: true });

  /* Navigate to a card index */
  function goTo(idx, animate = true) {
    if (idx < 0) idx = 0;
    if (idx >= N) idx = N - 1;
    current = idx;

    const cardW = cards[0].offsetWidth + 24;
    track.style.transition = animate ? 'transform .65s cubic-bezier(.4,0,.2,1)' : 'none';
    track.style.transform  = `translateX(-${idx * cardW}px)`;

    /* Active / inactive classes */
    cards.forEach((c, i) => {
      c.classList.toggle('pc-active',   i === idx);
      c.classList.toggle('pc-inactive', i !== idx);
    });

    /* Progress segments */
    segs.forEach((s, i) => {
      s.classList.toggle('done',   i < idx);
      s.classList.toggle('active', i === idx);
      const fill = s.querySelector('.pp-seg-fill');
      if (fill && i > idx) fill.style.transform = '';
    });

    /* Counter */
    if (curEl) curEl.textContent = String(idx + 1).padStart(2, '0');

    /* Scroll hint vanishes after last card */
    if (hint) hint.style.opacity = idx === N - 1 ? '0' : '1';
  }

  goTo(0, false);

  /* ── Arrow buttons (desktop only — hidden via CSS on mobile) */
  prevBtn?.addEventListener('click', () => {
    goTo(current - 1);
    /* Nudge scroll position to match so scroll-driven stays in sync */
    syncScroll(current);
  });
  nextBtn?.addEventListener('click', () => {
    goTo(current + 1);
    syncScroll(current);
  });

  /* Sync page scroll to current card so scroll-driven picks up correctly */
  function syncScroll(idx) {
    const rootTop = root.getBoundingClientRect().top + window.scrollY;
    const budget  = root.offsetHeight - sticky.offsetHeight;
    const target  = rootTop + (idx / (N - 1)) * budget;
    window.scrollTo({ top: target, behavior: 'smooth' });
  }

  /* ── Scroll-driven advance (works on ALL screen sizes) ── */
  window.addEventListener('scroll', () => {
    const rootRect = root.getBoundingClientRect();
    const scrolled = -rootRect.top;            // px scrolled into section
    const budget   = root.offsetHeight - sticky.offsetHeight;

    if (scrolled < 0 || scrolled > budget) return;

    const pct      = scrolled / budget;        // 0 → 1
    const segment  = 1 / N;
    const newIdx   = Math.min(Math.floor(pct / segment), N - 1);
    const withinSeg = (pct - newIdx * segment) / segment; // progress inside card

    if (newIdx !== current) goTo(newIdx);

    /* Animate fill on active segment proportional to scroll */
    const activeFill = segs[current]?.querySelector('.pp-seg-fill');
    if (activeFill) activeFill.style.transform = `scaleX(${withinSeg})`;
  }, { passive: true });

  /* ── Touch swipe (horizontal) ── */
  let txStart = 0;
  track.addEventListener('touchstart', e => { txStart = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - txStart;
    if (Math.abs(dx) > 40) { goTo(dx < 0 ? current + 1 : current - 1); }
  });
})();

/* ── PROJECT MODAL ────────────────────────────────────────── */
const projectData = {
  'brand-identity': {
    title: 'Brand Identity System', cat: 'Brand Identity', year: '2024',
    subtitle: 'Complete visual identity for a local Malawian retail business — from discovery workshops to final brand guidelines.',
    stats: [{ n: '100+', l: 'Brand Assets' }, { n: '6', l: 'Weeks' }, { n: '3×', l: 'Social Growth' }],
    tools: ['Adobe Illustrator', 'Adobe Photoshop', 'Adobe InDesign'],
    steps: [
      { n: '01', h: 'Discovery & Research', p: 'Interviewed the client team, audited competitors, and mapped core brand values.' },
      { n: '02', h: 'Concept Development',  p: 'Sketched 3 distinct logo directions and presented refined versions digitally.' },
      { n: '03', h: 'Identity System Build', p: 'Full system: logo variants, colour palette, type hierarchy.' },
      { n: '04', h: 'Brand Guidelines',     p: '20-page guidelines covering logo usage, colour codes and typography rules.' }
    ],
    quote: '"Elvarton completely transformed how our business is perceived. The new brand feels professional, memorable, and exactly us."',
    quoteBy: '— Client, Blantyre Business Owner'
  },
  'motion-graphics': {
    title: 'Promotional Motion Package', cat: 'Motion Graphics', year: '2023',
    subtitle: 'Animated intro, lower-thirds, and full promo video for a business launch in Blantyre.',
    stats: [{ n: '5', l: 'Video Assets' }, { n: '10K+', l: 'Organic Views' }, { n: '3×', l: 'Launch Footfall' }],
    tools: ['Adobe After Effects', 'Adobe Premiere Pro', 'Adobe Illustrator'],
    steps: [
      { n: '01', h: 'Brief & Storyboard',    p: 'Full storyboard mapping each scene before animation started.' },
      { n: '02', h: 'Motion Identity Design', p: 'Static assets in Illustrator brought to life in After Effects.' },
      { n: '03', h: 'Video Assembly',         p: 'Assembled raw footage with motion graphics in Premiere Pro.' },
      { n: '04', h: 'Asset Delivery',         p: '5 assets exported for Instagram, Facebook, YouTube and WhatsApp.' }
    ],
    quote: '"The promo video looked like something from a big agency. People kept sharing it and asking who made it."',
    quoteBy: '— Client, Business Owner, Blantyre'
  },
  'social-media': {
    title: 'Social Media Content Pack', cat: 'Social Media', year: '2024',
    subtitle: 'Consistent Instagram & Facebook design templates for a Malawian fashion brand.',
    stats: [{ n: '40+', l: 'Templates' }, { n: '2×', l: 'Follower Growth' }, { n: '↑68%', l: 'Engagement' }],
    tools: ['Canva Pro', 'Adobe Photoshop', 'Adobe Illustrator'],
    steps: [
      { n: '01', h: 'Audit & Strategy', p: 'Reviewed 3 months of posts and mapped content categories.' },
      { n: '02', h: 'Style Direction',  p: 'Defined palette, font pairings, and graphic elements.' },
      { n: '03', h: 'Template Design',  p: '40+ editable templates: feed posts, Stories, banners, Reels.' },
      { n: '04', h: 'Handover',         p: 'Templates with usage guide and content calendar.' }
    ],
    quote: '"Our feed finally looks like a real brand. Customers started commenting on how professional we looked."',
    quoteBy: '— Client, Fashion Brand Owner'
  },
  'logo-design': {
    title: '4NBuy E-Commerce Brand', cat: 'Logo Design', year: '2024',
    subtitle: 'Modern logo and visual mark for a growing Malawian e-commerce platform.',
    stats: [{ n: '12', l: 'Variations' }, { n: '2', l: 'Weeks' }, { n: '5★', l: 'Client Rating' }],
    tools: ['Adobe Illustrator', 'Adobe Photoshop'],
    steps: [
      { n: '01', h: 'Brand Discovery', p: "Explored platform values — accessible, modern, trustworthy." },
      { n: '02', h: 'Sketching',       p: '20+ sketches narrowed to 3 strong digital concepts.' },
      { n: '03', h: 'Refinement',      p: '2 revision rounds testing across all sizes.' },
      { n: '04', h: 'Delivery',        p: 'All files in AI, EPS, SVG, PNG, PDF.' }
    ],
    quote: '"Exactly what we needed — clean, professional, and flexible for everything from icons to billboard banners."',
    quoteBy: '— 4NBuy, Malawi'
  }
};

function openProject(key) {
  const d = projectData[key];
  if (!d) return;
  const modal = document.getElementById('projectModal');
  const body  = document.getElementById('projBody');
  body.innerHTML = `
    <div class="pm-hero-img" style="background:linear-gradient(135deg,#1a1a18,#0f0e0c)">
      <div class="pm-hero-ph">${d.cat} · ${d.year}</div>
    </div>
    <div class="pm-meta"><span class="pm-tag red">${d.cat}</span><span class="pm-tag">${d.year}</span></div>
    <div class="pm-title">${d.title}</div>
    <p class="pm-sub">${d.subtitle}</p>
    <div class="pm-stats">${d.stats.map(s => `<div><div class="pm-stat-n">${s.n}</div><div class="pm-stat-l">${s.l}</div></div>`).join('')}</div>
    <div class="pm-section-lbl">Tools Used</div>
    <div class="pm-tools">${d.tools.map(t => `<span class="pm-tool">${t}</span>`).join('')}</div>
    <div class="pm-section-lbl">Process</div>
    <div class="pm-steps">${d.steps.map(s => `<div class="pm-step"><div class="pm-step-n">${s.n}</div><div><h4>${s.h}</h4><p>${s.p}</p></div></div>`).join('')}</div>
    <blockquote class="pm-quote">${d.quote}<cite>${d.quoteBy}</cite></blockquote>
  `;
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

/* ── SCROLL REVEAL ────────────────────────────────────────── */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visible');
    revObs.unobserve(e.target);
  });
}, { threshold: .1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.rv').forEach(el => revObs.observe(el));

/* ── SKILL BARS ───────────────────────────────────────────── */
const skObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.sk-fill').forEach(f => f.classList.add('go'));
    skObs.unobserve(e.target);
  });
}, { threshold: .25 });
const skillsSec = document.getElementById('skills');
if (skillsSec) skObs.observe(skillsSec);

/* ── COUNTERS ─────────────────────────────────────────────── */
const cntObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('[data-count]').forEach(el => animCount(el, parseInt(el.dataset.count, 10), 1400));
    cntObs.unobserve(e.target);
  });
}, { threshold: .3 });
const aboutSec = document.getElementById('about');
if (aboutSec) cntObs.observe(aboutSec);

function animCount(el, target, dur) {
  if (!el) return;
  const s = performance.now();
  const step = now => {
    const p = Math.min((now - s) / dur, 1);
    el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

/* ── HERO PARALLAX ────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  const hero = document.getElementById('hero');
  if (!hero) return;
  const y = window.scrollY;
  hero.querySelectorAll('.orb').forEach((o, i) => {
    o.style.transform = `translateY(${y * (0.06 + i * .03)}px)`;
  });
}, { passive: true });

/* ── GALLERY FILTER ───────────────────────────────────────── */
(function () {
  const btns  = document.querySelectorAll('.gal-btn');
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

/* ── CONTACT FORM ─────────────────────────────────────────── */
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
      if (typeof emailjs === 'undefined') throw new Error();
      await emailjs.sendForm('service_ekportfolio', 'template_ekcontact', form);
      status.textContent = "✓ Message sent! I'll reply within 24 hours.";
      status.className = 'fstatus ok';
      form.reset();
    } catch {
      status.textContent = 'Failed to send. Please email directly.';
      status.className = 'fstatus err';
    } finally {
      btn.disabled = false;
      if (t) t.textContent = 'Send Message';
    }
  });
})();

/* ── FOOTER YEAR ──────────────────────────────────────────── */
const yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();
