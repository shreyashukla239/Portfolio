/* =============================================================
   PORTFOLIO – script.js
   Smooth scrolling, typed text, navbar, skills animation,
   project filtering, scroll-reveal, and contact form validation
   ============================================================= */

'use strict';

// ── Typed text effect ──────────────────────────────────────────
const roles = [
  'Front-End Developer',
  'UI/UX Enthusiast',
  'JavaScript Developer',
  'Open-Source Contributor',
];

let roleIndex  = 0;
let charIndex  = 0;
let isDeleting = false;

function typeEffect() {
  const typedEl = document.getElementById('typed-text');
  if (!typedEl) return;

  const currentRole = roles[roleIndex];

  if (isDeleting) {
    typedEl.textContent = currentRole.slice(0, --charIndex);
  } else {
    typedEl.textContent = currentRole.slice(0, ++charIndex);
  }

  let typingDelay = isDeleting ? 60 : 100;

  if (!isDeleting && charIndex === currentRole.length) {
    typingDelay = 1800;    // pause before deleting
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex  = (roleIndex + 1) % roles.length;
    typingDelay = 400;     // pause before typing next
  }

  setTimeout(typeEffect, typingDelay);
}

// ── Navbar: scroll styling + active link ──────────────────────
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

function updateNavbar() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Highlight the active nav link based on scroll position
  let currentId = '';
  sections.forEach(section => {
    const top = section.offsetTop - 90;
    if (window.scrollY >= top) {
      currentId = section.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
  });
}

// ── Hamburger menu ─────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-links');

function toggleMenu() {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', navMenu.classList.contains('open'));
}

function closeMenu() {
  hamburger.classList.remove('open');
  navMenu.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}

hamburger.addEventListener('click', toggleMenu);

// Close menu when a nav link is clicked
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// ── Skill bar animation (triggered when section enters view) ───
const skillBars = document.querySelectorAll('.bar-fill');

function animateSkillBars() {
  skillBars.forEach(bar => {
    const width = bar.getAttribute('data-width');
    bar.style.width = `${width}%`;
  });
}

// ── Scroll-reveal: fade-in elements as they enter the viewport ─
function initReveal() {
  // Add 'reveal' class to all major child elements in sections
  document.querySelectorAll(
    '.about-grid, .skill-category, .project-card, .contact-item, .contact-form'
  ).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 3) * 0.1}s`;
  });
}

function onScroll() {
  const viewportBottom = window.scrollY + window.innerHeight;

  // Reveal elements
  document.querySelectorAll('.reveal').forEach(el => {
    if (el.getBoundingClientRect().top + window.scrollY < viewportBottom - 60) {
      el.classList.add('visible');
    }
  });

  // Animate skill bars when the skills section is visible
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    const top = skillsSection.getBoundingClientRect().top;
    if (top < window.innerHeight * 0.85 && !skillsSection.dataset.animated) {
      skillsSection.dataset.animated = 'true';
      animateSkillBars();
    }
  }

  updateNavbar();
}

// ── Project filter ─────────────────────────────────────────────
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards  = document.querySelectorAll('.project-card');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const show = filter === 'all' || category === filter;
      card.classList.toggle('hidden', !show);
    });
  });
});

// ── Contact form validation ────────────────────────────────────
const form        = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

function getFieldEl(id)    { return document.getElementById(id); }
function getErrorEl(id)    { return document.getElementById(`${id}-error`); }

function validateName(v)    { return v.trim().length >= 2  ? '' : 'Please enter your full name (min. 2 characters).'; }
function validateEmail(v)   { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.'; }
function validateSubject(v) { return v.trim().length >= 3  ? '' : 'Please enter a subject (min. 3 characters).'; }
function validateMessage(v) { return v.trim().length >= 10 ? '' : 'Please enter a message (min. 10 characters).'; }

const fields = {
  name:    { el: getFieldEl('name'),    error: getErrorEl('name'),    validate: validateName },
  email:   { el: getFieldEl('email'),   error: getErrorEl('email'),   validate: validateEmail },
  subject: { el: getFieldEl('subject'), error: getErrorEl('subject'), validate: validateSubject },
  message: { el: getFieldEl('message'), error: getErrorEl('message'), validate: validateMessage },
};

function validateField(field) {
  const msg = field.validate(field.el.value);
  field.error.textContent = msg;
  field.el.classList.toggle('error', msg !== '');
  return msg === '';
}

// Live validation on blur
Object.values(fields).forEach(field => {
  field.el.addEventListener('blur', () => validateField(field));
  field.el.addEventListener('input', () => {
    if (field.el.classList.contains('error')) validateField(field);
  });
});

form.addEventListener('submit', e => {
  e.preventDefault();

  const allValid = Object.values(fields).map(f => validateField(f)).every(Boolean);
  if (!allValid) return;

  // Simulate form submission (replace with real fetch/API call)
  const submitBtn = form.querySelector('[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-text').textContent = 'Sending…';

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn-text').textContent = 'Send Message';
    formSuccess.hidden = false;
    form.reset();
    setTimeout(() => { formSuccess.hidden = true; }, 5000);
  }, 1200);
});

// ── Footer year ────────────────────────────────────────────────
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Initialise ─────────────────────────────────────────────────
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('load', () => {
  initReveal();
  onScroll();     // run once immediately so above-fold items are visible
  typeEffect();
});
