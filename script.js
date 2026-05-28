/* ============================================
   CONSCIOUS FAMILY CENTRE — script.js
   Cinematic 3D Animations & Interactions
   ============================================ */

'use strict';

/* ===== CUSTOM CURSOR ===== */
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateCursor() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top  = followerY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

/* ===== STAR CANVAS ===== */
(function () {
  const canvas = document.getElementById('starCanvas');
  const ctx = canvas.getContext('2d');

  // Brand accent colors
  const COLORS = [
    '#4CAF50', '#1F6B3A', '#8BC34A',
    '#F4C542', '#F28C28',
    '#E94E77',
    '#8E44AD',
    '#3498DB',
    '#ffffff',
    '#a8ffb8',
  ];

  let W, H, stars = [], sparks = [], nebulas = [];
  let time = 0;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  // ---- STARS ----
  class Star {
    constructor() { this.init(); }
    init() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.z = Math.random() * 1 + 0.3;       // depth
      this.baseR = Math.random() * 1.5 + 0.4;
      this.r = this.baseR * this.z;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.twinkleSpeed = Math.random() * 0.04 + 0.01;
      this.twinkleOffset = Math.random() * Math.PI * 2;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.glowRadius = this.r * (Math.random() * 4 + 3);
    }
    update(t) {
      const tw = Math.sin(t * this.twinkleSpeed * 60 + this.twinkleOffset);
      this.currentOpacity = this.opacity * (0.6 + 0.4 * tw);
      this.currentR = this.r * (0.85 + 0.15 * tw);
    }
    draw() {
      // Glow
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.glowRadius);
      grad.addColorStop(0, this.color + Math.floor(this.currentOpacity * 255).toString(16).padStart(2,'0'));
      grad.addColorStop(0.4, this.color + '18');
      grad.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.glowRadius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      // Core
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.currentR, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.currentOpacity;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  // ---- SPARKLES (shooting sparks) ----
  class Spark {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H * 0.7;
      this.len = Math.random() * 80 + 30;
      this.speed = Math.random() * 2 + 0.5;
      this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.5;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.opacity = 0;
      this.life = 0;
      this.maxLife = Math.random() * 80 + 40;
      this.active = false;
      this.delay = Math.random() * 600;
    }
    update() {
      if (this.delay > 0) { this.delay--; return; }
      this.active = true;
      this.life++;
      const progress = this.life / this.maxLife;
      this.opacity = progress < 0.3 ? progress / 0.3 : 1 - (progress - 0.3) / 0.7;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      if (this.life >= this.maxLife) this.reset();
    }
    draw() {
      if (!this.active) return;
      const tx = this.x - Math.cos(this.angle) * this.len;
      const ty = this.y - Math.sin(this.angle) * this.len;
      const grad = ctx.createLinearGradient(tx, ty, this.x, this.y);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(1, this.color);
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = grad;
      ctx.globalAlpha = this.opacity * 0.8;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.globalAlpha = 1;
      // tip dot
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  // ---- NEBULA CLOUDS ----
  class Nebula {
    constructor() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r  = Math.random() * 250 + 100;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.opacity = Math.random() * 0.03 + 0.01;
      this.dx = (Math.random() - 0.5) * 0.15;
      this.dy = (Math.random() - 0.5) * 0.08;
    }
    update() {
      this.x += this.dx;
      this.y += this.dy;
      if (this.x < -this.r) this.x = W + this.r;
      if (this.x > W + this.r) this.x = -this.r;
      if (this.y < -this.r) this.y = H + this.r;
      if (this.y > H + this.r) this.y = -this.r;
    }
    draw() {
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
      grad.addColorStop(0, this.color + Math.floor(this.opacity * 255).toString(16).padStart(2,'0'));
      grad.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }

  // ---- FLOATING BUBBLES ----
  const bubbles = [];
  class Bubble {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = H + 100;
      this.r = Math.random() * 18 + 6;
      this.vy = -(Math.random() * 0.6 + 0.2);
      this.vx = (Math.random() - 0.5) * 0.4;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.opacity = Math.random() * 0.18 + 0.04;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = Math.random() * 0.02 + 0.005;
    }
    update() {
      this.y += this.vy;
      this.wobble += this.wobbleSpeed;
      this.x += Math.sin(this.wobble) * 0.5 + this.vx;
      if (this.y < -50) this.reset();
    }
    draw() {
      const grad = ctx.createRadialGradient(
        this.x - this.r * 0.3, this.y - this.r * 0.3, 0,
        this.x, this.y, this.r
      );
      grad.addColorStop(0, 'rgba(255,255,255,0.3)');
      grad.addColorStop(0.5, this.color + '44');
      grad.addColorStop(1, this.color + '11');
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.globalAlpha = this.opacity * 2;
      ctx.fill();
      ctx.strokeStyle = this.color + '55';
      ctx.lineWidth = 1;
      ctx.globalAlpha = this.opacity;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  function init() {
    resize();
    stars   = Array.from({ length: 260 }, () => new Star());
    sparks  = Array.from({ length: 14  }, () => new Spark());
    nebulas = Array.from({ length: 8   }, () => new Nebula());
    for (let i = 0; i < 35; i++) bubbles.push(new Bubble());
  }

  function loop() {
    time += 0.016;
    ctx.clearRect(0, 0, W, H);

    // Deep space gradient
    const bg = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W,H) * 0.8);
    bg.addColorStop(0,   '#0d2b1f');
    bg.addColorStop(0.4, '#071812');
    bg.addColorStop(1,   '#030a08');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Nebulas
    nebulas.forEach(n => { n.update(); n.draw(); });

    // Stars
    stars.forEach(s => { s.update(time); s.draw(); });

    // Sparks / shooting stars
    sparks.forEach(sp => { sp.update(); sp.draw(); });

    // Bubbles
    bubbles.forEach(b => { b.update(); b.draw(); });

    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); stars.forEach(s => { s.x = Math.random()*W; s.y = Math.random()*H; }); });
  init();
  loop();
})();

/* ===== HERO PARTICLE EMITTER ===== */
(function () {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  const COLORS = ['#4CAF50','#F4C542','#E94E77','#8E44AD','#3498DB','#F28C28','#ffffff'];
  function createParticle() {
    const p = document.createElement('div');
    p.classList.add('hero-particle');
    const size = Math.random() * 10 + 3;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const left = Math.random() * 100;
    const dur  = Math.random() * 12 + 8;
    const delay = Math.random() * 8;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      background:${color};
      left:${left}%;
      animation-duration:${dur}s;
      animation-delay:${delay}s;
      opacity:0;
      box-shadow: 0 0 ${size*2}px ${color}88;
    `;
    container.appendChild(p);
    setTimeout(() => { if (p.parentNode) p.parentNode.removeChild(p); }, (dur + delay) * 1000 + 1000);
  }
  setInterval(createParticle, 600);
  for (let i = 0; i < 12; i++) createParticle();
})();

/* ===== NAVBAR SCROLL BEHAVIOUR ===== */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Scrolled class
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');

  // Active nav link
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });

  // Back to top
  const btt = document.getElementById('backToTop');
  if (window.scrollY > 500) btt.classList.add('visible');
  else btt.classList.remove('visible');
});

/* ===== HAMBURGER ===== */
const hamburger = document.getElementById('hamburger');
const navLinksMenu = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinksMenu.classList.toggle('open');
  hamburger.classList.toggle('active');
});
navLinksMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinksMenu.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

/* ===== SCROLL REVEAL ===== */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

/* ===== COUNTER ANIMATION ===== */
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);
  const update = () => {
    start = Math.min(start + step, target);
    el.textContent = Math.round(start);
    if (start < target) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('.stat-num, .n-num');
      counters.forEach(c => {
        const target = parseInt(c.dataset.target);
        animateCounter(c, target);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.hero-stats, .numbers-row').forEach(el => counterObserver.observe(el));

/* ===== 3D TILT EFFECT ===== */
function initTilt(el) {
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    const tiltX = dy * -12;
    const tiltY = dx *  12;
    el.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(6px)`;
    el.style.transition = 'transform 0.1s ease';
    const shine = el.querySelector('.tilt-shine');
    if (shine) {
      shine.style.background = `radial-gradient(circle at ${(dx+0.5)*100}% ${(dy+0.5)*100}%, rgba(255,255,255,0.15), transparent)`;
    }
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
    el.style.transition = 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)';
  });
}
document.querySelectorAll('.tilt-card').forEach(initTilt);

/* ===== FAQ ACCORDION ===== */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item.open').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });
    // Open clicked (if it was closed)
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ===== BACK TO TOP ===== */
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===== PARALLAX HERO SHAPES ===== */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  document.querySelectorAll('.floating-shape').forEach((shape, i) => {
    const speed = (i + 1) * 0.08;
    shape.style.transform = `translateY(${scrollY * speed}px)`;
  });
});

/* ===== SOCIAL CARD PULSE ===== */
document.querySelectorAll('.social-glow-card').forEach(card => {
  const color = card.dataset.glow;
  setInterval(() => {
    card.style.boxShadow = `0 0 ${30 + Math.random() * 20}px ${color}55`;
  }, 1200);
});

/* ===== ACTIVE SECTION HIGHLIGHT (nav dots could go here) ===== */
/* ===== PAGE LOAD ANIMATION ===== */
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});
