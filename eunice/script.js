(() => {
  'use strict';

  /* ----------------------------------------------------------
     Curtain
     ---------------------------------------------------------- */
  const curtain = document.getElementById('curtain');
  const openBtn = document.getElementById('openGift');
  const page    = document.getElementById('page');

  const openPage = () => {
    curtain.classList.add('is-open');
    page.classList.add('is-visible');
    page.setAttribute('aria-hidden', 'false');
    setTimeout(() => curtain.remove(), 1200);
    burstConfetti(80);
  };

  openBtn.addEventListener('click', openPage);
  curtain.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') openPage();
  });

  /* ----------------------------------------------------------
     Reveal on scroll
     ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  revealEls.forEach((el, i) => el.style.setProperty('--i', i % 7));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach((el) => io.observe(el));

  /* ----------------------------------------------------------
     Footer year + copy link
     ---------------------------------------------------------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  document.getElementById('copyLink').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      const btn = document.getElementById('copyLink');
      const prev = btn.textContent;
      btn.textContent = 'copied ✓';
      setTimeout(() => (btn.textContent = prev), 1800);
    } catch (_) {}
  });

  /* ----------------------------------------------------------
     Gallery + lightbox
     ---------------------------------------------------------- */
  const gallery = document.getElementById('gallery');
  const frames  = Array.from(gallery.querySelectorAll('.frame'));

  frames
    .filter((f) => f.dataset.video)
    .forEach((f) => {
      const v = f.querySelector('video');
      if (!v) return;
      f.addEventListener('mouseenter', () => v.play().catch(() => {}));
      f.addEventListener('mouseleave', () => {
        v.pause();
        try { v.currentTime = 0.5; } catch (_) {}
      });
    });

  const lb      = document.getElementById('lightbox');
  const lbStage = document.getElementById('lbStage');
  const lbCap   = document.getElementById('lbCap');
  const lbClose = document.getElementById('lbClose');
  const lbPrev  = document.getElementById('lbPrev');
  const lbNext  = document.getElementById('lbNext');

  let lbIndex = 0;

  const openLightbox = (i) => {
    lbIndex = i;
    renderLightbox();
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    lbStage.innerHTML = '';
    document.body.style.overflow = '';
  };

  const renderLightbox = () => {
    const frame = frames[lbIndex];
    lbStage.innerHTML = '';

    if (frame.dataset.video) {
      const vid = document.createElement('video');
      vid.src = frame.querySelector('video').src.replace(/#t=.*$/, '');
      vid.controls = true;
      vid.autoplay = true;
      vid.playsInline = true;
      lbStage.appendChild(vid);
    } else {
      const img = document.createElement('img');
      img.src = frame.querySelector('img').src;
      img.alt = frame.querySelector('img').alt;
      lbStage.appendChild(img);
    }

    const cap = frame.querySelector('.frame__cap');
    lbCap.textContent = cap ? cap.textContent : '';
  };

  frames.forEach((f, i) => f.addEventListener('click', () => openLightbox(i)));
  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => {
    lbIndex = (lbIndex - 1 + frames.length) % frames.length;
    renderLightbox();
  });
  lbNext.addEventListener('click', () => {
    lbIndex = (lbIndex + 1) % frames.length;
    renderLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') lbNext.click();
    if (e.key === 'ArrowLeft')  lbPrev.click();
  });

  lb.addEventListener('click', (e) => {
    if (e.target === lb) closeLightbox();
  });

  /* ----------------------------------------------------------
     Candle
     ---------------------------------------------------------- */
  const flame = document.getElementById('flame');
  const blow  = document.getElementById('blowCandle');
  const hint  = document.getElementById('candleHint');

  blow.addEventListener('click', () => {
    if (flame.classList.contains('out')) return;
    flame.classList.add('out');
    hint.textContent = 'wish received ✨';
    burstConfetti(220);
  });

  /* ----------------------------------------------------------
     Drifting gold dust (ambient)
     ---------------------------------------------------------- */
  const dust = document.getElementById('dust');
  const dctx = dust.getContext('2d');
  let W, H, particles = [];

  const sizeDust = () => {
    W = dust.width  = window.innerWidth;
    H = dust.height = window.innerHeight;
  };
  sizeDust();
  window.addEventListener('resize', sizeDust);

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const COUNT = window.matchMedia('(max-width: 640px)').matches ? 18 : 32;

  for (let i = 0; i < COUNT; i++) particles.push(makeParticle());

  function makeParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0.6 + Math.random() * 1.6,
      vy: 0.15 + Math.random() * 0.4,
      vx: -0.15 + Math.random() * 0.3,
      alpha: 0.25 + Math.random() * 0.4,
      hue: Math.random() > 0.4 ? 'rgba(184,151,88,' : 'rgba(232,211,166,',
    };
  }

  function drawDust() {
    dctx.clearRect(0, 0, W, H);
    particles.forEach((p) => {
      p.y += p.vy;
      p.x += p.vx;
      if (p.y > H + 4) { p.y = -4; p.x = Math.random() * W; }
      if (p.x < -4) p.x = W + 4;
      if (p.x > W + 4) p.x = -4;

      dctx.fillStyle = p.hue + p.alpha + ')';
      dctx.beginPath();
      dctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      dctx.fill();
    });
    if (!reduced) requestAnimationFrame(drawDust);
  }
  if (!reduced) requestAnimationFrame(drawDust);

  /* ----------------------------------------------------------
     Confetti
     ---------------------------------------------------------- */
  const confettiCanvas = document.getElementById('confetti');
  const cctx = confettiCanvas.getContext('2d');
  let confetti = [];
  let cW, cH;

  const sizeConfetti = () => {
    cW = confettiCanvas.width  = window.innerWidth;
    cH = confettiCanvas.height = window.innerHeight;
  };
  sizeConfetti();
  window.addEventListener('resize', sizeConfetti);

  function burstConfetti(count) {
    const colors = ['#b89758', '#e9d3a6', '#d8be8a', '#2d5a44', '#fffcf6'];
    for (let i = 0; i < count; i++) {
      confetti.push({
        x: cW / 2 + (Math.random() - 0.5) * 120,
        y: cH / 2 - 40,
        vx: (Math.random() - 0.5) * 14,
        vy: -6 - Math.random() * 10,
        g: 0.25 + Math.random() * 0.2,
        w: 5 + Math.random() * 6,
        h: 7 + Math.random() * 10,
        rot: Math.random() * Math.PI,
        vrot: (Math.random() - 0.5) * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
      });
    }
    if (confetti.length && !rafRunning) {
      rafRunning = true;
      requestAnimationFrame(tickConfetti);
    }
  }

  let rafRunning = false;
  function tickConfetti() {
    cctx.clearRect(0, 0, cW, cH);
    confetti = confetti.filter((c) => c.y < cH + 40 && c.life < 400);
    confetti.forEach((c) => {
      c.vy += c.g;
      c.x  += c.vx;
      c.y  += c.vy;
      c.rot += c.vrot;
      c.life++;
      cctx.save();
      cctx.translate(c.x, c.y);
      cctx.rotate(c.rot);
      cctx.fillStyle = c.color;
      cctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
      cctx.restore();
    });
    if (confetti.length) requestAnimationFrame(tickConfetti);
    else {
      rafRunning = false;
      cctx.clearRect(0, 0, cW, cH);
    }
  }

  /* ----------------------------------------------------------
     Smooth scroll
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ----------------------------------------------------------
   Visitor logging — silently records the visitor's IP and
   approximate (city-level) location to a Google Sheet via an
   Apps Script Web App. 100% client-side, fail-soft, no popup.
   Configure window.LOG_ENDPOINT in index.html.
   ---------------------------------------------------------- */
(function () {
  var ENDPOINT = window.LOG_ENDPOINT;
  if (!ENDPOINT || ENDPOINT.indexOf('PASTE') !== -1) return; // not configured yet

  function send(payload) {
    try {
      fetch(ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(function () {});
    } catch (e) {}
  }

  var base = {
    page: location.href,
    referrer: document.referrer || '',
    user_agent: navigator.userAgent,
    language: navigator.language || '',
    screen: (screen.width + 'x' + screen.height),
    timezone: '',
    visited_at: new Date().toISOString()
  };
  try { base.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}

  // Primary: ipwho.is (HTTPS, CORS, no key). Fallback: ipapi.co.
  fetch('https://ipwho.is/')
    .then(function (r) { return r.json(); })
    .then(function (d) {
      if (!d || d.success === false) throw new Error('ipwho');
      var conn = d.connection || {};
      send(Object.assign({}, base, {
        ip: d.ip || '',
        city: d.city || '',
        region: d.region || '',
        country: d.country || '',
        latitude: d.latitude || '',
        longitude: d.longitude || '',
        isp: conn.isp || conn.org || ''
      }));
    })
    .catch(function () {
      fetch('https://ipapi.co/json/')
        .then(function (r) { return r.json(); })
        .then(function (d) {
          send(Object.assign({}, base, {
            ip: d.ip || '',
            city: d.city || '',
            region: d.region || '',
            country: d.country_name || '',
            latitude: d.latitude || '',
            longitude: d.longitude || '',
            isp: d.org || ''
          }));
        })
        .catch(function () { send(base); }); // log the visit even if geo fails
    });
})();
