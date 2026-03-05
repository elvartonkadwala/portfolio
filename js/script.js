/**
 * ELVARTON KADWALA — PORTFOLIO SCRIPT
 * ─────────────────────────────────────
 * 1. Loader
 * 2. Nav sticky behaviour
 * 3. Ticker
 * 4. Scroll reveal (IntersectionObserver)
 * 5. Skill bar animations
 * 6. Animated counters
 * 7. Contact form + localStorage inbox
 * 8. Footer year
 */

'use strict';

/* ══════════════════════════════════════════════════════════
   1. LOADER
   ══════════════════════════════════════════════════════════ */
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
    bar.style.width      = p + '%';
    pctEl.textContent    = Math.floor(p) + '%';
  }, 70);
})();

/** Runs once the loader finishes */
function onBoot() {
  // Animate mini bars inside the hero card
  document.querySelectorAll('.mbar-fill').forEach(b => b.classList.add('go'));
  // Animate hero project counter
  animCount(document.getElementById('heroNum'), 80, 1400);
}

/* ══════════════════════════════════════════════════════════
   2. NAV — sticky on scroll
   ══════════════════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('stuck', window.scrollY > 60);
});

/* ══════════════════════════════════════════════════════════
   3. TICKER — build and inject items
   ══════════════════════════════════════════════════════════ */
(function () {
  const el    = document.getElementById('tickerEl');
  const words = [
    'Logo Design', 'Brand Identity', 'Motion Graphics',
    'Social Media', 'Print Design', 'Visual Identity',
    'Poster Design', 'After Effects'
  ];
  let html = '';
  // Duplicate for seamless loop
  for (let i = 0; i < 2; i++) {
    words.forEach(w => {
      html += `<span class="t-item"><span class="t-dot"></span>${w}</span>`;
    });
  }
  el.innerHTML = html;
})();

/* ══════════════════════════════════════════════════════════
   4. SCROLL REVEAL
   ══════════════════════════════════════════════════════════ */
const revealObs = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); }),
  { threshold: 0.12 }
);
document.querySelectorAll('.rv, .rl, .rr').forEach(el => revealObs.observe(el));

/* ══════════════════════════════════════════════════════════
   5. SKILL BARS — animate when scrolled into view
   ══════════════════════════════════════════════════════════ */
const skillObs = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.sk-fill').forEach(b => b.classList.add('go'));
    }
  }),
  { threshold: 0.3 }
);
document.querySelectorAll('.skills-grid > div').forEach(g => skillObs.observe(g));

/* ══════════════════════════════════════════════════════════
   6. ANIMATED COUNTERS
   ══════════════════════════════════════════════════════════ */

/**
 * Animate a number from 0 → target over `dur` ms.
 * @param {HTMLElement} el
 * @param {number}      target
 * @param {number}      dur    duration in ms
 */
function animCount(el, target, dur) {
  dur = dur || 1100;
  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    el.textContent = Math.round(p * p * target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

// Fire counters when the about stats enter view
const cntObs = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      animCount(e.target, Number(e.target.dataset.count));
      cntObs.unobserve(e.target);
    }
  }),
  { threshold: 0.6 }
);
document.querySelectorAll('[data-count]').forEach(el => cntObs.observe(el));

/* ══════════════════════════════════════════════════════════
   7. CONTACT FORM + localStorage INBOX
   ══════════════════════════════════════════════════════════ */
const STORAGE_KEY = 'ek_portfolio_msgs';

/** Read all messages from localStorage */
function getMessages() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

/** Save messages array to localStorage */
function saveMessages(msgs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
}

/** Escape HTML to prevent XSS in the inbox */
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Re-render the inbox from localStorage */
function renderInbox() {
  const msgs  = getMessages();
  const badge = document.getElementById('iBadge');
  const list  = document.getElementById('iList');

  badge.textContent = msgs.length;

  if (!msgs.length) {
    list.innerHTML = '<div class="no-msg">No messages yet — send one above!</div>';
    return;
  }

  list.innerHTML = msgs.map((m, i) => `
    <div class="msg" style="animation-delay:${i * 0.06}s">
      <div class="msg-head">
        <span class="msg-from">${esc(m.name)}</span>
        <span class="msg-time">${m.time}</span>
      </div>
      ${m.subject ? `<div class="msg-email">Re: ${esc(m.subject)}</div>` : ''}
      <div class="msg-body">${esc(m.msg)}</div>
      <div class="msg-email">${esc(m.email)}</div>
    </div>
  `).join('');
}

// Handle form submission
document.getElementById('cForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const btn    = document.getElementById('fBtn');
  const status = document.getElementById('fStatus');

  // Loading state
  btn.disabled    = true;
  btn.textContent = 'Sending…';
  status.textContent  = '';
  status.className    = 'fstatus';

  // Simulate async send (replace with real fetch() to a backend if needed)
  setTimeout(() => {
    const msg = {
      name:    document.getElementById('fName').value.trim(),
      email:   document.getElementById('fEmail').value.trim(),
      subject: document.getElementById('fSubject').value.trim(),
      msg:     document.getElementById('fMsg').value.trim(),
      time:    new Date().toLocaleString('en-GB', {
        day: '2-digit', month: 'short',
        hour: '2-digit', minute: '2-digit'
      }),
    };

    // Prepend to inbox, keep last 20
    const all = getMessages();
    all.unshift(msg);
    saveMessages(all.slice(0, 20));

    // Reset UI
    e.target.reset();
    btn.disabled    = false;
    btn.textContent = 'Send Message ↗';

    status.textContent = "✓ Sent! I'll get back to you soon.";
    status.className   = 'fstatus ok';

    renderInbox();

    // Clear status after 5 s
    setTimeout(() => {
      status.textContent = '';
      status.className   = 'fstatus';
    }, 5000);
  }, 900);
});

// Render inbox on page load
renderInbox();

/* ══════════════════════════════════════════════════════════
   8. FOOTER YEAR
   ══════════════════════════════════════════════════════════ */
const yearEl = document.getElementById('yr');
if (yearEl) yearEl.textContent = new Date().getFullYear();
