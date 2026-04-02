/* ============================================
   ELVA RTON — PORTFOLIO 2026 · main.js
   ============================================ */

(function () {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
  const isMobile = () => window.innerWidth <= 768;

  /* ─── EMAILJS INIT (deferred, safe) ─── */
  window.addEventListener('load', () => {
    if (typeof emailjs !== 'undefined') {
      emailjs.init({ publicKey: 'qDPANAa2__TIHugj4' });
    }
  });

  /* ─── PAGE LOADER ─── */
  const loader = $('#loader');
  function dismissLoader() {
    if (!loader) return;
    loader.classList.add('done');
  }
  if (document.readyState === 'complete') {
    setTimeout(dismissLoader, 900);
  } else {
    window.addEventListener('load', () => setTimeout(dismissLoader, 900));
  }

  /* ─── CURSOR ─── */
  if (!isMobile()) {
    const blob  = $('#cursor-blob');
    const dot   = $('#cursor-dot');
    const label = $('#cursor-label');
    let mx = -200, my = -200, bx = -200, by = -200;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    });

    function rafCursor() {
      bx = lerp(bx, mx, 0.1);
      by = lerp(by, my, 0.1);
      blob.style.transform  = `translate(${bx}px,${by}px) translate(-50%,-50%)`;
      label.style.transform = `translate(${bx + 28}px,${by - 28}px) translate(-50%,-50%)`;
      requestAnimationFrame(rafCursor);
    }
    rafCursor();

    $$('.wb-card, .hm-card, .about-photo-wrap').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cs-view'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cs-view'));
    });
    $$('a, button, .fchip, .sk-item, .sg-card').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cs-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cs-hover'));
    });
  }

  /* ─── 3D TILT ─── */
  if (!isMobile()) {
    function applyTilt(el) {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        const rX = clamp(-y * 18, -11, 11);
        const rY = clamp( x * 18, -11, 11);
        el.style.transform = `perspective(850px) rotateX(${rX}deg) rotateY(${rY}deg) scale(1.03) translateY(-6px)`;
        el.style.transition = 'transform .05s';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
        el.style.transition = 'transform .55s cubic-bezier(.17,.67,.24,1.2)';
      });
    }
    $$('.tilt-card, .hm-card, .wb-card, .sg-card').forEach(applyTilt);
  }

  /* ─── NAVBAR ─── */
  const nav = $('#site-nav');
  const navLinks = $$('.nav-link');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  const sections = $$('section[id]');
  const secObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id);
      });
    });
  }, { threshold: 0.4 });
  sections.forEach(s => secObs.observe(s));

  /* ─── HAMBURGER + DRAWER ─── */
  const burger   = $('#burger');
  const drawer   = $('#drawer');
  const backdrop = $('#drawerBackdrop');
  let drawerOpen = false;

  function openDrawer() {
    drawerOpen = true;
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    drawer.classList.add('open');
    backdrop.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawerOpen = false;
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (burger) burger.addEventListener('click', () => drawerOpen ? closeDrawer() : openDrawer());
  if (backdrop) backdrop.addEventListener('click', closeDrawer);
  $$('.dn-link').forEach(a => a.addEventListener('click', closeDrawer));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawerOpen) closeDrawer(); });

  /* ─── SCROLL REVEAL ─── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        revealObs.unobserve(en.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  $$('.reveal').forEach(el => revealObs.observe(el));

  /* Stagger reveal-card per section */
  const cardSecObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      $$('.reveal-card', en.target).forEach((card, i) => {
        setTimeout(() => card.classList.add('in'), i * 70);
      });
      cardSecObs.unobserve(en.target);
    });
  }, { threshold: 0.05 });
  $$('#work, #services').forEach(s => cardSecObs.observe(s));

  /* ─── COUNTER ─── */
  function animCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const dur = 1600;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(ease * target) + '+';
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const heroEl = $('#hero');
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      $$('[data-count]', en.target).forEach(animCount);
      countObs.unobserve(en.target);
    });
  }, { threshold: 0.5 });
  if (heroEl) countObs.observe(heroEl);

  /* ─── PORTFOLIO FILTER ─── */
  const filterBtns = $$('.fchip');
  const wbCards    = $$('.wb-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.f;
      wbCards.forEach((card, i) => {
        const match = f === 'all' || card.dataset.cat === f;
        if (match) {
          card.style.display = '';
          card.classList.remove('in');
          setTimeout(() => card.classList.add('in'), i * 55);
        } else {
          card.style.display = 'none';
          card.classList.remove('in');
        }
      });
    });
  });

  /* ─── MOUSE PARALLAX — mesh orbs ─── */
  if (!isMobile()) {
    const orbs = $$('.mesh-orb');
    const factors = [0.02, -0.015, 0.01];
    document.addEventListener('mousemove', e => {
      const cx = (e.clientX / window.innerWidth  - 0.5) * 2;
      const cy = (e.clientY / window.innerHeight - 0.5) * 2;
      orbs.forEach((orb, i) => {
        const f = factors[i] || 0.01;
        orb.style.transform = `translate(${cx * window.innerWidth * f}px, ${cy * window.innerHeight * f}px)`;
      });
    }, { passive: true });
  }

  /* ─── SCROLL PARALLAX — hero cards ─── */
  if (!isMobile()) {
    const hmCards = $$('.hm-card');
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (!heroEl || y > heroEl.offsetHeight) return;
      hmCards.forEach((card, i) => {
        const dir = i % 2 === 0 ? -1 : 1;
        const speed = 0.04 + i * 0.01;
        card.style.transform = `translateY(${dir * y * speed}px)`;
      });
    }, { passive: true });
  }

  /* ─── TICKER PAUSE ─── */
  const track = $('.ticker-track');
  if (track) {
    track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
    track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
  }

  /* ─── FUTURISTIC GLITCH — random flicker on title ─── */
  const heroTitle = $('.hero-title');
  if (heroTitle) {
    function scheduleGlitch() {
      const delay = 5000 + Math.random() * 5000;
      setTimeout(() => {
        heroTitle.style.filter = 'brightness(1.2) contrast(1.08)';
        setTimeout(() => {
          heroTitle.style.filter = '';
          scheduleGlitch();
        }, 90);
      }, delay);
    }
    scheduleGlitch();
  }

  /* ─── EMAILJS FORM ─── */
  const form    = $('#contactForm');
  const submit  = $('#cfSubmit');
  const formMsg = $('#form-msg');

  if (form && submit) {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const name  = $('#cf-name').value.trim();
      const email = $('#cf-email').value.trim();
      const msg   = $('#cf-msg').value.trim();

      if (!name || !email || !msg) {
        showMsg('Please fill in your name, email, and message.', 'error');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showMsg('Please enter a valid email address.', 'error');
        return;
      }

      const btnText = $('.cf-submit-text', submit);
      const btnIcon = $('.cf-submit-icon', submit);
      const origText = btnText.textContent;
      submit.disabled = true;
      btnText.textContent = 'Sending…';
      btnIcon.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
      if (formMsg) formMsg.style.display = 'none';

      try {
        if (typeof emailjs === 'undefined') throw new Error('EmailJS not loaded');
        await emailjs.send('service_7w40u1f', 'template_200d822', {
          from_name:    name,
          reply_to:     email,
          project_type: $('#cf-project').value.trim() || 'Not specified',
          message:      msg,
          to_name:      'Elva Rton',
        });
        showMsg("✓ Message sent! I'll get back to you soon.", 'success');
        form.reset();
      } catch (err) {
        console.error('EmailJS error:', err);
        showMsg('Something went wrong. Try reaching me on WhatsApp instead.', 'error');
      } finally {
        submit.disabled = false;
        btnText.textContent = origText;
        btnIcon.innerHTML = '<i class="fas fa-paper-plane"></i>';
      }
    });
  }

  function showMsg(text, type) {
    if (!formMsg) return;
    formMsg.textContent = text;
    formMsg.className = 'form-msg ' + type;
    formMsg.style.display = 'block';
    formMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    if (type === 'success') setTimeout(() => { formMsg.style.display = 'none'; }, 6000);
  }

  /* ─── CLOSE DRAWER ON NAV CLICK ─── */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', () => { if (drawerOpen) closeDrawer(); });
  });

  /* ─── PROJECT MODAL ─── */
  const modal     = $('#projectModal');
  const pmClose   = $('#pmClose');
  const pmImg     = $('#pmImg');
  const pmCat     = $('#pmCat');
  const pmYear    = $('#pmYear');
  const pmTitle   = $('#pmTitle');
  const pmDesc    = $('#pmDesc');
  const pmToolsList = $('#pmToolsList');
  const pmDate    = $('#pmDate');

  function openModal(card) {
    pmImg.src           = card.dataset.img   || '';
    pmImg.alt           = card.dataset.title || '';
    pmCat.textContent   = card.dataset.label || '';
    pmYear.textContent  = card.dataset.year  || '';
    pmTitle.textContent = card.dataset.title || '';
    pmDesc.textContent  = card.dataset.desc  || '';
    pmDate.textContent  = card.dataset.year ? `Completed ${card.dataset.year}` : '';

    const tools = (card.dataset.tools || '').split(',').filter(Boolean);
    pmToolsList.innerHTML = tools.map(t =>
      `<span class="pm-tool">${t.trim()}</span>`
    ).join('');

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (modal) {
    $$('.wb-card[data-title]').forEach(card => {
      card.addEventListener('click', () => openModal(card));
    });
    if (pmClose) pmClose.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
  }

})();
