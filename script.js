/* ==========================================
   CONSCIOUS FAMILY CENTRE - MAIN SCRIPT
   Floating Bubble Canvas & Interactive Features
   ========================================== */

class FloatingBubbleCanvas {
  constructor() {
    this.canvas = document.getElementById('bubble-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.bubbles = [];
    this.resizeCanvas();
    this.createBubbles();
    this.animate();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createBubbles() {
    const bubbleCount = Math.max(3, Math.min(8, Math.floor(window.innerWidth / 200)));
    
    const colors = [
      'rgba(31, 107, 58, 0.08)',      // Primary Green
      'rgba(127, 169, 155, 0.08)',    // Sage Green
      'rgba(227, 146, 126, 0.06)',    // Coral
      'rgba(253, 251, 247, 0.1)',     // Cream
      'rgba(97, 90, 82, 0.05)',       // Earth
    ];

    for (let i = 0; i < bubbleCount; i++) {
      this.bubbles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 100 + 50,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.02 + 0.01,
      });
    }
  }

  animate() {
    // Clear canvas with gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
    gradient.addColorStop(0, '#fdfbf7');
    gradient.addColorStop(1, '#f9f7f3');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw bubbles
    this.bubbles.forEach((bubble) => {
      // Update position
      bubble.x += bubble.vx;
      bubble.y += bubble.vy;

      // Bounce off edges with smooth behavior
      if (bubble.x - bubble.radius < 0 || bubble.x + bubble.radius > this.canvas.width) {
        bubble.vx *= -0.8;
        bubble.x = Math.max(bubble.radius, Math.min(this.canvas.width - bubble.radius, bubble.x));
      }
      if (bubble.y - bubble.radius < 0 || bubble.y + bubble.radius > this.canvas.height) {
        bubble.vy *= -0.8;
        bubble.y = Math.max(bubble.radius, Math.min(this.canvas.height - bubble.radius, bubble.y));
      }

      // Add slight gravity and air resistance
      bubble.vy += 0.05;
      bubble.vx *= 0.99;
      bubble.vy *= 0.99;

      // Update wobble animation
      bubble.wobble += bubble.wobbleSpeed;

      // Draw bubble with glow effect
      this.drawBubble(bubble);
    });

    requestAnimationFrame(() => this.animate());
  }

  drawBubble(bubble) {
    // Create subtle shadow/glow
    const gradient = this.ctx.createRadialGradient(
      bubble.x, bubble.y, 0,
      bubble.x, bubble.y, bubble.radius
    );
    gradient.addColorStop(0, bubble.color);
    gradient.addColorStop(1, bubble.color.replace('0.', '0.0'));

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
    this.ctx.fill();

    // Add subtle border
    this.ctx.strokeStyle = bubble.color.replace(/[\d.]+\)$/g, '0.15)');
    this.ctx.lineWidth = 1;
    this.ctx.stroke();

    // Add inner highlight for depth
    const highlightGradient = this.ctx.createRadialGradient(
      bubble.x - bubble.radius * 0.3, bubble.y - bubble.radius * 0.3, 0,
      bubble.x, bubble.y, bubble.radius
    );
    highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
    highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
    this.ctx.fillStyle = highlightGradient;
    this.ctx.beginPath();
    this.ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
    this.ctx.fill();
  }
}

/* ==========================================
   MOBILE NAVIGATION
   ========================================== */

class MobileNav {
  constructor() {
    this.menuToggle = document.querySelector('.menu-toggle');
    this.nav = document.querySelector('nav');
    this.navLinks = document.querySelectorAll('nav a');
    
    if (this.menuToggle) {
      this.menuToggle.addEventListener('click', () => this.toggleMenu());
      this.navLinks.forEach(link => {
        link.addEventListener('click', () => this.closeMenu());
      });
    }
  }

  toggleMenu() {
    this.nav.classList.toggle('active');
    this.menuToggle.textContent = this.nav.classList.contains('active') ? '✕' : '☰';
  }

  closeMenu() {
    this.nav.classList.remove('active');
    this.menuToggle.textContent = '☰';
  }
}

/* ==========================================
   ACTIVE PAGE INDICATOR
   ========================================== */

class ActivePageIndicator {
  constructor() {
    this.updateActiveLink();
  }

  updateActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

/* ==========================================
   SCROLL ANIMATIONS
   ========================================== */

class ScrollAnimations {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      this.observerOptions
    );
    this.initializeObserver();
  }

  initializeObserver() {
    const elements = document.querySelectorAll(
      '.principle-card, .program-card, .about-block, .contact-card, .testimonial-card'
    );
    elements.forEach(el => this.observer.observe(el));
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
        entry.target.style.opacity = '0';
        const delay = Array.from(entry.target.parentElement.children).indexOf(entry.target);
        entry.target.style.animationDelay = `${delay * 0.1}s`;
        this.observer.unobserve(entry.target);
      }
    });
  }
}

/* ==========================================
   SMOOTH SCROLL BEHAVIOR
   ========================================== */

class SmoothScroll {
  constructor() {
    this.initializeLinks();
  }

  initializeLinks() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', (e) => this.handleClick(e));
    });
  }

  handleClick(e) {
    const href = e.currentTarget.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

/* ==========================================
   IMAGE OPTIMIZATION
   ========================================== */

class LazyImageLoader {
  constructor() {
    if ('IntersectionObserver' in window) {
      this.initializeLazyLoading();
    }
  }

  initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }
}

/* ==========================================
   CONTACT LINK HANDLERS
   ========================================== */

class ContactHandler {
  constructor() {
    this.initializeContactLinks();
  }

  initializeContactLinks() {
    // Mobile number click
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // Allow default behavior on mobile devices
        if (!this.isMobileDevice()) {
          e.preventDefault();
          this.copyToClipboard(link.textContent, 'Phone number copied!');
        }
      });
    });

    // Copy email functionality (if any)
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.copyToClipboard(link.getAttribute('href').replace('mailto:', ''), 'Email copied!');
      });
    });
  }

  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  copyToClipboard(text, message) {
    navigator.clipboard.writeText(text).then(() => {
      this.showNotification(message);
    }).catch(() => {
      console.log('Copy failed:', text);
    });
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #1f6b3a;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: 600;
      z-index: 1000;
      animation: slideInRight 0.3s ease-out;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.animation = 'slideInLeft 0.3s ease-out reverse';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

/* ==========================================
   PARALLAX EFFECT
   ========================================== */

class ParallaxEffect {
  constructor() {
    this.elements = document.querySelectorAll('[data-parallax]');
    if (this.elements.length > 0) {
      window.addEventListener('scroll', () => this.handleScroll());
    }
  }

  handleScroll() {
    const scrollY = window.scrollY;
    this.elements.forEach(el => {
      const speed = el.dataset.parallax || 0.5;
      const yPos = -(scrollY * speed);
      el.style.transform = `translateY(${yPos}px)`;
    });
  }
}

/* ==========================================
   INITIALIZATION
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all features
  new FloatingBubbleCanvas();
  new MobileNav();
  new ActivePageIndicator();
  new ScrollAnimations();
  new SmoothScroll();
  new LazyImageLoader();
  new ContactHandler();
  new ParallaxEffect();

  // Add loading animation removal
  document.body.style.opacity = '1';
  document.body.style.transition = 'opacity 0.3s ease-out';

  console.log('✨ Conscious Family Centre website loaded successfully');
});

/* ==========================================
   PERFORMANCE: Debounce utility
   ========================================== */

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/* ==========================================
   ACCESSIBILITY: Keyboard navigation
   ========================================== */

document.addEventListener('keydown', (e) => {
  // Close mobile menu on Escape
  if (e.key === 'Escape') {
    const nav = document.querySelector('nav');
    if (nav && nav.classList.contains('active')) {
      nav.classList.remove('active');
      const toggle = document.querySelector('.menu-toggle');
      if (toggle) toggle.textContent = '☰';
    }
  }

  // Skip to main content on Alt+1
  if (e.altKey && e.key === '1') {
    const main = document.querySelector('main');
    if (main) main.focus();
  }
});

/* ==========================================
   DARK MODE PREFERENCE (Optional Future Enhancement)
   ========================================== */

// Check for user's dark mode preference
const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
// Currently disabled - using light theme as per brand guidelines
// if (prefersDarkMode) {
//   document.documentElement.setAttribute('data-theme', 'dark');
// }
