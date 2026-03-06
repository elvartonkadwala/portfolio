/**
 * ELVARTON KADWALA — PORTFOLIO SCRIPT
 * 1. Loader
 * 2. Nav — sticky + hamburger menu
 * 3. Ticker
 * 4. Animated greeting (time-based)
 * 5. Carousel slider (Recent Projects)
 * 6. Scroll reveal
 * 7. Skill bar animations
 * 8. Animated counters
 * 9. Contact form (clean, no inbox)
 * 10. Gallery filter + lightbox
 * 11. Footer year
 */

'use strict';

/* ══════════════════════════════════════════════════════════════
   1. LOADER
   ══════════════════════════════════════════════════════════════ */
(function () {
  let p = 0;
  const bar    = document.getElementById('lBar');
  const pctEl  = document.getElementById('lPct');
  const loader = document.getElementById('loader');

  const iv = setInterval(() => {
    p += Math.random() * 16 + 5;
    if (p >= 100) {
      p = 100;
      clearInterval(iv);
      setTimeout(() => {
        loader.classList.add('done');
        onBoot();
      }, 280);
    }
    bar.style.width   = p + '%';
    pctEl.textContent = Math.floor(p) + '%';
  }, 70);
})();

function onBoot() {
  document.querySelectorAll('.mbar-fill').forEach(b => b.classList.add('go'));
  animCount(document.getElementById('heroNum'), 80, 1400);
  buildGreeting();
}

/* ══════════════════════════════════════════════════════════════
   2. NAV — sticky + hamburger
   ══════════════════════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('stuck', window.scrollY > 60);
});

const hamburger = document.getElementById('hamburger');
const mobMenu   = document.getElementById('mobMenu');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  mobMenu.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  mobMenu.setAttribute('aria-hidden', !isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });
});

/* ══════════════════════════════════════════════════════════════
   3. TICKER
   ══════════════════════════════════════════════════════════════ */
(function () {
  const el    = document.getElementById('tickerEl');
  const words = [
    'Logo Design', 'Brand Identity', 'Motion Graphics',
    'Print Design', 'Visual Identity', 'Poster Design',
    'After Effects', 'Canva Expert'
  ];
  let html = '';
  for (let i = 0; i < 2; i++) {
    words.forEach(w => {
      html += `<span class="t-item"><span class="t-dot"></span>${w}</span>`;
    });
  }
  el.innerHTML = html;
})();

/* ══════════════════════════════════════════════════════════════
   4. ANIMATED GREETING (time-based)
   ══════════════════════════════════════════════════════════════ */
function buildGreeting() {
  const hour = new Date().getHours();
  let greeting;

  if (hour >= 5 && hour < 12) {
    greeting = 'Good morning — welcome to my portfolio ☀️';
  } else if (hour >= 12 && hour < 17) {
    greeting = 'Good afternoon — glad you\'re here 🌤';
  } else if (hour >= 17 && hour < 21) {
    greeting = 'Good evening — let\'s create something 🌆';
  } else {
    greeting = 'Working late? Let\'s build something great 🌙';
  }

  const el = document.getElementById('heroGreeting');
  if (!el) return;

  // Animate each character with a stagger
  let html = '';
  [...greeting].forEach((char, i) => {
    const delay = (i * 0.03 + 0.5).toFixed(2);
    if (char === ' ') {
      html += ' ';
    } else {
      html += `<span class="gr-char" style="animation-delay:${delay}s">${char}</span>`;
    }
  });
  el.innerHTML = html;
}

/* ══════════════════════════════════════════════════════════════
   5. CAROUSEL SLIDER
   ══════════════════════════════════════════════════════════════ */
(function () {
  const carousel  = document.getElementById('carousel');
  if (!carousel) return;

  const slides    = Array.from(carousel.querySelectorAll('.carousel-slide'));
  const dotsWrap  = document.getElementById('carDots');
  const total     = slides.length;
  let current     = 0;
  let autoTimer   = null;
  let isDragging  = false;
  let dragStartX  = 0;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'car-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function getDots() { return dotsWrap.querySelectorAll('.car-dot'); }

  function goTo(index) {
    current = (index + total) % total;
    carousel.style.transform = `translateX(-${current * 100}%)`;
    getDots().forEach((d, i) => d.classList.toggle('active', i === current));
    // Re-trigger bar animations on the newly visible slide
    slides[current].querySelectorAll('.pv5-line').forEach(l => {
      l.style.animation = 'none';
      void l.offsetWidth;
      l.style.animation = '';
    });
  }

  // Apply CSS transform via inline style
  carousel.style.cssText = 'display:flex; transition: transform .55s cubic-bezier(.23,1,.32,1); will-change: transform;';

  // Auto-advance
  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }
  startAuto();

  // Touch / drag support
  carousel.addEventListener('mousedown',  e => { isDragging = true; dragStartX = e.clientX; carousel.style.transition = 'none'; });
  carousel.addEventListener('touchstart', e => { isDragging = true; dragStartX = e.touches[0].clientX; carousel.style.transition = 'none'; }, {passive:true});

  function dragEnd(endX) {
    if (!isDragging) return;
    isDragging = false;
    carousel.style.transition = '';
    const diff = dragStartX - endX;
    if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); }
    else { goTo(current); }
    resetAuto();
  }
  window.addEventListener('mouseup',   e => dragEnd(e.clientX));
  window.addEventListener('touchend',  e => dragEnd(e.changedTouches[0].clientX));

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { goTo(current - 1); resetAuto(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); resetAuto(); }
  });

  // Pause on hover
  carousel.addEventListener('mouseenter', () => clearInterval(autoTimer));
  carousel.addEventListener('mouseleave', startAuto);
})();

/* ══════════════════════════════════════════════════════════════
   6. SCROLL REVEAL
   ══════════════════════════════════════════════════════════════ */
const revealObs = new IntersectionObserver(
  entries => entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('on');
  }),
  { threshold: 0.12 }
);
document.querySelectorAll('.rv, .rl, .rr').forEach(el => revealObs.observe(el));

/* ══════════════════════════════════════════════════════════════
   7. SKILL BARS
   ══════════════════════════════════════════════════════════════ */
const skillObs = new IntersectionObserver(
  entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.sk-fill').forEach(b => b.classList.add('go'));
    }
  }),
  { threshold: 0.3 }
);
document.querySelectorAll('.skills-grid > div').forEach(g => skillObs.observe(g));

/* ══════════════════════════════════════════════════════════════
   8. ANIMATED COUNTERS
   ══════════════════════════════════════════════════════════════ */
function animCount(el, target, dur) {
  if (!el) return;
  dur = dur || 1100;
  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / dur, 1);
    el.textContent = Math.round(progress * progress * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const cntObs = new IntersectionObserver(
  entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      animCount(entry.target, Number(entry.target.dataset.count));
      cntObs.unobserve(entry.target);
    }
  }),
  { threshold: 0.6 }
);
document.querySelectorAll('[data-count]').forEach(el => cntObs.observe(el));

/* ══════════════════════════════════════════════════════════════
   9. CONTACT FORM — EmailJS → elvartonkadwala@gmail.com
   ══════════════════════════════════════════════════════════════
   Setup steps (free):
   1. Sign up at https://www.emailjs.com
   2. Add Gmail service → get YOUR_SERVICE_ID
   3. Create email template → get YOUR_TEMPLATE_ID
      Template variables: {{from_name}}, {{reply_to}}, {{subject}}, {{message}}
   4. Copy your Public Key → replace YOUR_PUBLIC_KEY in the <script> in <head>
   ══════════════════════════════════════════════════════════════ */
const cForm = document.getElementById('cForm');
if (cForm) {
  cForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn    = document.getElementById('fBtn');
    const status = document.getElementById('fStatus');

    // Basic validation
    const name  = document.getElementById('fName').value.trim();
    const email = document.getElementById('fEmail').value.trim();
    const msg   = document.getElementById('fMsg').value.trim();
    if (!name || !email || !msg) {
      status.textContent = '✗ Please fill in all required fields.';
      status.className   = 'fstatus err';
      return;
    }

    btn.disabled     = true;
    btn.textContent  = 'Sending…';
    status.textContent = '';
    status.className   = 'fstatus';

    // EmailJS send
    // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your real IDs
    emailjs.sendForm('service_7w40u1f', 'template_200d822', cForm)
      .then(() => {
        cForm.reset();
        btn.disabled    = false;
        btn.textContent = 'Send Message ↗';
        status.textContent = "✓ Message sent! I'll get back to you soon.";
        status.className   = 'fstatus ok';
        setTimeout(() => { status.textContent = ''; status.className = 'fstatus'; }, 6000);
      })
      .catch((err) => {
        console.error('EmailJS error:', err);
        btn.disabled    = false;
        btn.textContent = 'Send Message ↗';
        status.textContent = '✗ Something went wrong. Try emailing directly.';
        status.className   = 'fstatus err';
      });
  });
}

/* ══════════════════════════════════════════════════════════════
   10. PORTFOLIO GALLERY — filter + lightbox
   ══════════════════════════════════════════════════════════════ */
(function () {
  const filterBtns = document.querySelectorAll('.gal-btn');
  const galItems   = document.querySelectorAll('.gal-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      galItems.forEach(item => {
        const match = filter === 'all' || item.dataset.cat === filter;
        if (match) {
          item.classList.remove('hidden');
          item.style.animation = 'galIn .4s cubic-bezier(.23,1,.32,1) both';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  const ks = document.createElement('style');
  ks.textContent = '@keyframes galIn{from{opacity:0;transform:scale(.94) translateY(12px);}to{opacity:1;transform:none;}}';
  document.head.appendChild(ks);

  // Lightbox
  const lightbox   = document.getElementById('lightbox');
  const backdrop   = document.getElementById('lbBackdrop');
  const lbImg      = document.getElementById('lbImg');
  const lbPH       = document.getElementById('lbPlaceholder');
  const lbCat      = document.getElementById('lbCat');
  const lbTitle    = document.getElementById('lbTitle');
  const lbDesc     = document.getElementById('lbDesc');
  const lbClose    = document.getElementById('lbClose');
  const lbPrev     = document.getElementById('lbPrev');
  const lbNext     = document.getElementById('lbNext');

  let visibleItems = [];
  let currentIndex = 0;

  function getVisible() {
    return Array.from(galItems).filter(el => !el.classList.contains('hidden'));
  }

  function openLightbox(itemEl) {
    visibleItems = getVisible();
    currentIndex = visibleItems.indexOf(itemEl);
    renderLightbox(currentIndex);
    lightbox.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function renderLightbox(i) {
    const item    = visibleItems[i];
    const zoomBtn = item.querySelector('.gal-zoom');
    lbCat.textContent   = zoomBtn.dataset.cat;
    lbTitle.textContent = zoomBtn.dataset.title;
    lbDesc.textContent  = zoomBtn.dataset.desc;
    lbPH.textContent    = zoomBtn.dataset.title;
    lbImg.style.opacity = '0';
    lbImg.src = zoomBtn.dataset.src;
    lbImg.onload  = () => { lbImg.style.opacity = '1'; lbPH.style.display = 'none'; };
    lbImg.onerror = () => { lbImg.style.display = 'none'; lbPH.style.display = 'flex'; };
    lbPrev.style.visibility = i === 0                       ? 'hidden' : 'visible';
    lbNext.style.visibility = i === visibleItems.length - 1 ? 'hidden' : 'visible';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  document.querySelectorAll('.gal-zoom').forEach(btn => {
    btn.addEventListener('click', () => openLightbox(btn.closest('.gal-item')));
  });
  document.querySelectorAll('.gal-img-wrap img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openLightbox(img.closest('.gal-item')));
  });

  lbClose.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => { if (currentIndex > 0) { currentIndex--; renderLightbox(currentIndex); } });
  lbNext.addEventListener('click', () => { if (currentIndex < visibleItems.length - 1) { currentIndex++; renderLightbox(currentIndex); } });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  { if (currentIndex > 0) { currentIndex--; renderLightbox(currentIndex); } }
    if (e.key === 'ArrowRight') { if (currentIndex < visibleItems.length - 1) { currentIndex++; renderLightbox(currentIndex); } }
  });
})();

/* ══════════════════════════════════════════════════════════════
   11. FOOTER — current year
   ══════════════════════════════════════════════════════════════ */
const yearEl = document.getElementById('yr');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ══════════════════════════════════════════════════════════════
   12. MOUSE FOLLOW + GLOW EFFECTS
   ══════════════════════════════════════════════════════════════ */
(function () {

  /* ── 1. Custom cursor ── */
  const cursor     = document.createElement('div');
  const cursorDot  = document.createElement('div');
  cursor.id        = 'cursor-ring';
  cursorDot.id     = 'cursor-dot';
  document.body.appendChild(cursor);
  document.body.appendChild(cursorDot);

  let mx = -200, my = -200;   // mouse
  let cx = -200, cy = -200;   // ring (lerped)
  let visible = false;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (!visible) {
      visible = true;
      cursor.style.opacity    = '1';
      cursorDot.style.opacity = '1';
    }
    // Dot snaps instantly
    cursorDot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity    = '0';
    cursorDot.style.opacity = '0';
    visible = false;
  });

  // Smooth ring follow via rAF lerp
  function animCursor() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    cursor.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(animCursor);
  }
  animCursor();

  // Hover states — enlarge ring on interactive elements
  const hoverTargets = 'a, button, .ltile, .gal-item, .proj, .carousel-slide, .car-dot, .si, .foot-icon, input, textarea';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.add('cursor-hover');
      cursorDot.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.remove('cursor-hover');
      cursorDot.classList.remove('cursor-hover');
    }
  });

  /* ── 2. Global spotlight glow that follows mouse ── */
  const spotlight = document.createElement('div');
  spotlight.id = 'mouse-spotlight';
  document.body.appendChild(spotlight);

  document.addEventListener('mousemove', e => {
    spotlight.style.left = e.clientX + 'px';
    spotlight.style.top  = e.clientY + 'px';
  });

  /* ── 3. Per-card magnetic glow on hover ── */
  const glowTargets = document.querySelectorAll(
    '.ltile, .proj, .gal-item, .exp-side-card, .exp-item, .si, .foot-icon, .clink'
  );

  glowTargets.forEach(el => {
    el.addEventListener('mousemove', e => {
      const r  = el.getBoundingClientRect();
      const x  = ((e.clientX - r.left) / r.width)  * 100;
      const y  = ((e.clientY - r.top)  / r.height) * 100;
      el.style.setProperty('--gx', x + '%');
      el.style.setProperty('--gy', y + '%');
      el.classList.add('glow-active');
    });
    el.addEventListener('mouseleave', () => {
      el.classList.remove('glow-active');
    });
  });

  /* ── 4. Magnetic pull on social icons ── */
  document.querySelectorAll('.si, .foot-icon').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r  = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * 0.35;
      const dy = (e.clientY - (r.top  + r.height / 2)) * 0.35;
      el.style.transform = `translate(${dx}px, ${dy}px) scale(1.12)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });

})();

/* ══════════════════════════════════════════════════════════════
   13. WORK CAROUSEL — dots only, auto-advance, swipe support
   ══════════════════════════════════════════════════════════════ */
(function () {
  const track    = document.getElementById('wcarTrack');
  const dotsWrap = document.getElementById('wcarDots');
  if (!track || !dotsWrap) return;

  const cards = Array.from(track.querySelectorAll('.wcar-card'));
  const total = cards.length;
  let current = 0, autoTimer = null;

  // Build dots
  cards.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'wcar-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `Slide ${i + 1}`);
    d.addEventListener('click', () => { goTo(i); resetAuto(); });
    dotsWrap.appendChild(d);
  });

  function goTo(n) {
    current = (n + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsWrap.querySelectorAll('.wcar-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function startAuto() { autoTimer = setInterval(() => goTo(current + 1), 4500); }
  function resetAuto()  { clearInterval(autoTimer); startAuto(); }
  startAuto();

  // Swipe support
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 48) { goTo(dx < 0 ? current + 1 : current - 1); resetAuto(); }
  });

  // Mouse drag
  let dragStart = 0, dragging = false;
  track.addEventListener('mousedown', e => { dragging = true; dragStart = e.clientX; });
  window.addEventListener('mouseup',  e => {
    if (!dragging) return; dragging = false;
    const dx = e.clientX - dragStart;
    if (Math.abs(dx) > 48) { goTo(dx < 0 ? current + 1 : current - 1); resetAuto(); }
  });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { goTo(current - 1); resetAuto(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); resetAuto(); }
  });
})();
