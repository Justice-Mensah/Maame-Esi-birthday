(() => {
  'use strict';

  /* ----------------------------------------------------------
     Intro curtain — unwrap the gift
     ---------------------------------------------------------- */
  const curtain = document.getElementById('curtain');
  const openBtn = document.getElementById('openGift');
  const page    = document.getElementById('page');

  const openPage = () => {
    curtain.classList.add('is-open');
    page.classList.add('is-visible');
    page.setAttribute('aria-hidden', 'false');
    setTimeout(() => curtain.remove(), 1200);
    // trigger confetti burst on opening
    burstConfetti(90);
  };

  openBtn.addEventListener('click', openPage);
  // Also allow Enter/Space on the whole curtain
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
     Hero stats — age & days since she was born
     Edit this date to match her actual birthday
     ---------------------------------------------------------- */
  const BIRTHDAY = new Date('2000-04-18'); // <- update to her real DOB if known
  const today = new Date();
  const diffMs = today - BIRTHDAY;
  const years  = Math.max(1, Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000)));
  const days   = Math.max(1, Math.floor(diffMs / (24 * 60 * 60 * 1000)));

  animateCount(document.getElementById('years'), years, 1400);
  animateCount(document.getElementById('days'),  days,  1800);

  function animateCount(el, target, duration) {
    if (!el) return;
    const start = performance.now();
    const from  = 0;
    const step  = (t) => {
      const p  = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(from + (target - from) * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    };
    requestAnimationFrame(step);
  }

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
     Gallery — lightbox + video preview on hover
     ---------------------------------------------------------- */
  const gallery = document.getElementById('gallery');
  const frames  = Array.from(gallery.querySelectorAll('.frame'));

  // Hover-play videos. On mouseleave we seek back to the poster frame (0.5s)
  // rather than 0, so the tile keeps showing a meaningful thumbnail.
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

  // Lightbox
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
      // Strip any "#t=" fragment so the lightbox plays from the start.
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
     Candle — tap to blow out + confetti
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
     Floating petals (ambient background)
     ---------------------------------------------------------- */
  const petalCanvas = document.getElementById('petals');
  const pctx = petalCanvas.getContext('2d');
  let petals = [];
  let W, H;

  const sizePetals = () => {
    W = petalCanvas.width  = window.innerWidth;
    H = petalCanvas.height = window.innerHeight;
  };
  sizePetals();
  window.addEventListener('resize', sizePetals);

  const PETAL_COUNT = window.matchMedia('(max-width: 640px)').matches ? 14 : 26;
  for (let i = 0; i < PETAL_COUNT; i++) petals.push(makePetal());

  function makePetal() {
    return {
      x: Math.random() * W,
      y: Math.random() * H - H,
      r: 4 + Math.random() * 6,
      vy: 0.3 + Math.random() * 0.6,
      vx: -0.3 + Math.random() * 0.6,
      spin: Math.random() * Math.PI * 2,
      vs: -0.02 + Math.random() * 0.04,
      hue: Math.random() > 0.5 ? 'rgba(232,180,188,' : 'rgba(212,175,122,',
      alpha: 0.35 + Math.random() * 0.35,
    };
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function drawPetals() {
    pctx.clearRect(0, 0, W, H);
    petals.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.spin += p.vs;
      if (p.y > H + 20) {
        p.y = -20;
        p.x = Math.random() * W;
      }
      if (p.x < -20) p.x = W + 20;
      if (p.x > W + 20) p.x = -20;

      pctx.save();
      pctx.translate(p.x, p.y);
      pctx.rotate(p.spin);
      pctx.fillStyle = p.hue + p.alpha + ')';
      pctx.beginPath();
      pctx.ellipse(0, 0, p.r, p.r * 0.45, 0, 0, Math.PI * 2);
      pctx.fill();
      pctx.restore();
    });
    if (!reduced) requestAnimationFrame(drawPetals);
  }
  if (!reduced) requestAnimationFrame(drawPetals);

  /* ----------------------------------------------------------
     Confetti — on unwrap & candle blow-out
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
    const colors = ['#d4af7a', '#f2d8a7', '#e8b4bc', '#c97b8a', '#fbf4e8'];
    for (let i = 0; i < count; i++) {
      confetti.push({
        x: cW / 2 + (Math.random() - 0.5) * 120,
        y: cH / 2 - 40,
        vx: (Math.random() - 0.5) * 14,
        vy: -6 - Math.random() * 10,
        g: 0.25 + Math.random() * 0.2,
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 10,
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
     Smooth scroll for internal anchors
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
