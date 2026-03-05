/* ============================================================
   ELVARTON KADWALA — Portfolio Script
   Features: Custom Cursor · Scroll Reveal · Nav · Portfolio Filter · Form
   ============================================================ */

'use strict';

/* ── Utility ────────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ── DOM Ready ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNav();
  initScrollReveal();
  initPortfolioFilter();
  initContactForm();
  initBackToTop();
  setFooterYear();
});

/* ── Custom Cursor ──────────────────────────────────────────── */
function initCursor() {
  const cursor   = $('#cursor');
  const follower = $('#cursor-follower');
  if (!cursor || !follower) return;

  // Skip on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth follower via rAF
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Scale up on interactive elements
  const hoverEls = $$('a, button, .portfolio-card, .skill-card, .filter-btn, .tag');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width   = '14px';
      cursor.style.height  = '14px';
      follower.style.width  = '56px';
      follower.style.height = '56px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width   = '8px';
      cursor.style.height  = '8px';
      follower.style.width  = '36px';
      follower.style.height = '36px';
    });
  });
}

/* ── Navigation ─────────────────────────────────────────────── */
function initNav() {
  const nav     = $('#nav');
  const toggle  = $('#nav-toggle');
  const menu    = $('#mobile-menu');
  const mLinks  = $$('.mobile-link');

  // Scroll-based nav style
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile toggle
  let open = false;
  toggle.addEventListener('click', () => {
    open = !open;
    menu.classList.toggle('open', open);
    // Animate hamburger to X
    const spans = toggle.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
      spans[1].style.transform = 'rotate(-45deg) translate(4px, -4px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.transform = '';
    }
  });

  // Close menu on link click
  mLinks.forEach(link => {
    link.addEventListener('click', () => {
      open = false;
      menu.classList.remove('open');
      toggle.querySelectorAll('span').forEach(s => s.style.transform = '');
    });
  });

  // Active nav link on scroll
  const sections = $$('section[id]');
  const navLinks  = $$('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => sectionObserver.observe(s));
}

/* ── Scroll Reveal ──────────────────────────────────────────── */
function initScrollReveal() {
  const revealEls = $$('.reveal-up');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));

  // Hero reveals on load
  $$('.hero .reveal-up').forEach(el => {
    // Allow CSS delay to handle it naturally
    setTimeout(() => el.classList.add('visible'), 100);
  });
}

/* ── Portfolio Filter ───────────────────────────────────────── */
function initPortfolioFilter() {
  const filterBtns  = $$('.filter-btn');
  const cards       = $$('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const category = card.dataset.category;
        const show = filter === 'all' || category === filter;

        if (show) {
          card.classList.remove('hidden');
          // Re-trigger reveal animation
          card.classList.remove('visible');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => card.classList.add('visible'));
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ── Contact Form Validation ────────────────────────────────── */
function initContactForm() {
  const form    = $('#contact-form');
  const success = $('#form-success');
  if (!form) return;

  // Helper: show/clear error
  const setError = (fieldId, msg) => {
    const input = $(`#${fieldId}`, form);
    const errEl = $(`#${fieldId}-error`);
    if (msg) {
      input.classList.add('error');
      errEl.textContent = msg;
    } else {
      input.classList.remove('error');
      errEl.textContent = '';
    }
  };

  const validate = () => {
    let valid = true;

    const name    = $('#name', form).value.trim();
    const email   = $('#email', form).value.trim();
    const subject = $('#subject', form).value.trim();
    const message = $('#message', form).value.trim();

    // Name
    if (!name) {
      setError('name', 'Please enter your name.');
      valid = false;
    } else if (name.length < 2) {
      setError('name', 'Name must be at least 2 characters.');
      valid = false;
    } else {
      setError('name', '');
    }

    // Email
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError('email', 'Please enter your email.');
      valid = false;
    } else if (!emailRe.test(email)) {
      setError('email', 'Please enter a valid email address.');
      valid = false;
    } else {
      setError('email', '');
    }

    // Subject
    if (!subject) {
      setError('subject', 'Please enter a subject.');
      valid = false;
    } else {
      setError('subject', '');
    }

    // Message
    if (!message) {
      setError('message', 'Please enter your message.');
      valid = false;
    } else if (message.length < 20) {
      setError('message', 'Message should be at least 20 characters.');
      valid = false;
    } else {
      setError('message', '');
    }

    return valid;
  };

  // Live validation on blur
  $$('.form-input', form).forEach(input => {
    input.addEventListener('blur', validate);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Simulate submission (replace with real API call)
    const btn = $('button[type="submit"]', form);
    const btnText = btn.querySelector('.btn-text');
    btnText.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      success.classList.add('visible');
    }, 1400);
  });
}

/* ── Back To Top ────────────────────────────────────────────── */
function initBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Footer Year ────────────────────────────────────────────── */
function setFooterYear() {
  const el = $('#footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ── Parallax on hero orbs (subtle) ────────────────────────── */
(function heroParallax() {
  const orb1 = $('.hero-orb--1');
  const orb2 = $('.hero-orb--2');
  if (!orb1 || !orb2) return;

  window.addEventListener('mousemove', (e) => {
    const cx = (e.clientX / window.innerWidth - 0.5);
    const cy = (e.clientY / window.innerHeight - 0.5);
    orb1.style.transform = `translate(${cx * 30}px, ${cy * 20}px)`;
    orb2.style.transform = `translate(${cx * -20}px, ${cy * 15}px)`;
  }, { passive: true });
})();
