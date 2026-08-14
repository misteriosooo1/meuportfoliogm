const cleanPath = () => location.pathname.replace(/index\.html$/i, '') || '/';
const cleanUrl = () => cleanPath() + location.search;

if (/\/index\.html$/i.test(location.pathname) || location.hash) {
  history.replaceState(null, '', cleanUrl());
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', cleanUrl());
  });
});

const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

themeToggle?.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';

  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

const burgerBtn = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');

burgerBtn?.addEventListener('click', () => {
  mobileMenu?.classList.toggle('open');
  burgerBtn.classList.toggle('open');
});

mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burgerBtn?.classList.remove('open');
  });
});

const revealEls = document.querySelectorAll('.reveal');
const staggerCount = new Map();

revealEls.forEach(el => {
  const parent = el.parentElement;
  const index = staggerCount.get(parent) || 0;

  el.style.transitionDelay = Math.min(index * 90, 450) + 'ms';
  staggerCount.set(parent, index + 1);
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: .15 });

revealEls.forEach(el => observer.observe(el));

const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const html = document.documentElement;
  const total = html.scrollHeight - html.clientHeight;
  const scrolled = total > 0 ? (html.scrollTop / total) * 100 : 0;

  if (scrollProgress) scrollProgress.style.width = scrolled + '%';
  backToTop?.classList.toggle('show', html.scrollTop > 500);
}, { passive: true });

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  history.replaceState(null, '', cleanUrl());
});

document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);

    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
    ripple.style.top = e.clientY - rect.top - size / 2 + 'px';

    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });
});

const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (hasMouse) {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - .5;
      const y = (e.clientY - rect.top) / rect.height - .5;

      card.style.transform = `
        perspective(900px)
        rotateX(${y * -6}deg)
        rotateY(${x * 6}deg)
        translateY(-6px)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  document.querySelectorAll('.skill-card,.about-card,.tl-card,.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });

  const heroSection = document.getElementById('hero');
  const heroBlob = heroSection?.querySelector('.hero-blob');

  if (heroSection && heroBlob) {
    heroSection.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth - .5) * 34;
      const y = (e.clientY / window.innerHeight - .5) * 34;

      heroBlob.style.transform = `translate(${x}px,${y}px)`;
    });

    heroSection.addEventListener('mouseleave', () => {
      heroBlob.style.transform = 'translate(0,0)';
    });
  }
}

function animateCount(el) {
  const original = el.textContent.trim();
  const match = original.match(/^(\+?)(\d+)$/);

  if (!match) return;

  const prefix = match[1];
  const target = Number(match[2]);
  const duration = 900;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    el.textContent = prefix + Math.round(target * eased);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = original;
    }
  }

  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    animateCount(entry.target);
    statObserver.unobserve(entry.target);
  });
}, { threshold: .6 });

document.querySelectorAll('.stat b').forEach(el => {
  statObserver.observe(el);
});

const navLinksAll = document.querySelectorAll('.nav-links a,.mobile-menu a');

const navSections = [
  ...new Set(
    [...navLinksAll].map(link => link.getAttribute('href'))
  )
]
  .map(id => document.querySelector(id))
  .filter(Boolean);

const navSpyObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const id = '#' + entry.target.id;

    navLinksAll.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === id);
    });
  });
}, {
  rootMargin: '-45% 0px -45% 0px',
  threshold: 0
});

navSections.forEach(section => {
  navSpyObserver.observe(section);
});

document.addEventListener('contextmenu', e => {
  e.preventDefault();
});

document.addEventListener('keydown', e => {
  const key = e.key.toUpperCase();
  const ctrlOrCmd = e.ctrlKey || e.metaKey;

  if (
    e.key === 'F12' ||
    (ctrlOrCmd && e.shiftKey && ['I', 'J', 'C'].includes(key)) ||
    (ctrlOrCmd && key === 'U')
  ) {
    e.preventDefault();
    e.stopPropagation();
  }
});