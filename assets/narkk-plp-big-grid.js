class NarkkBigGridSlider {
  constructor(section) {
    this.section = section;
    this.slider = section.querySelector('[data-slider]');
    if (!this.slider) return;

    this.track = this.slider.querySelector('[data-track]');
    this.total = parseInt(this.slider.dataset.total, 10);
    this.btnPrev = section.querySelector('.narkk-plp-big-grid__nav-btn--prev');
    this.btnNext = section.querySelector('.narkk-plp-big-grid__nav-btn--next');

    // 2rem gap — matches CSS (Dawn base: 1rem = 10px)
    this.gap = 20;
    this.index = 0;

    this._resize();
    this._bindEvents();
    this._update();
  }

  _isMobile() {
    return window.matchMedia('(max-width: 1024px)').matches;
  }

  _resize() {
    const sliderW = this.slider.offsetWidth;
    // Desktop: 2 cards fill the slider; Mobile: 1 card fills the slider
    this.cardWidth = this._isMobile() ? sliderW : (sliderW - this.gap) / 2;
    this.stepPx = this.cardWidth + this.gap;
    // Tell CSS the card width so flex items size correctly
    this.slider.style.setProperty('--card-width', `${this.cardWidth}px`);
  }

  // Allow scrolling all the way to the last card (leaving an empty slot on desktop)
  _maxIndex() {
    return this.total - 1;
  }

  _update() {
    this.track.style.transform = `translateX(-${this.index * this.stepPx}px)`;
    if (this.btnPrev) this.btnPrev.disabled = this.index === 0;
    if (this.btnNext) this.btnNext.disabled = this.index >= this._maxIndex();
  }

  _bindEvents() {
    if (this.btnPrev) {
      this.btnPrev.addEventListener('click', () => {
        this.index = Math.max(0, this.index - 1);
        this._update();
      });
    }

    if (this.btnNext) {
      this.btnNext.addEventListener('click', () => {
        this.index = Math.min(this._maxIndex(), this.index + 1);
        this._update();
      });
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this._resize();
        this.index = Math.min(this.index, this._maxIndex());
        this._update();
      }, 100);
    });
  }
}

document.querySelectorAll('[data-narkk-plp-big-grid]').forEach((section) => {
  new NarkkBigGridSlider(section);
});

// ── ATC button plus hover animation (GSAP) ────────────────
(function () {
  function initBundleAtcHover() {
    if (typeof gsap === 'undefined') return;

    document.querySelectorAll('.narkk-plp-bundle-card__atc').forEach(function (btn) {
      var plus = btn.querySelector('.narkk-btn__plus');
      if (!plus) return;

      gsap.set(plus, { rotation: 0, scale: 1 });

      btn.addEventListener('mouseenter', function () {
        gsap.to(plus, { rotation: 45, scale: 1.15, duration: 0.3, ease: 'power2.out', overwrite: true });
      });

      btn.addEventListener('mouseleave', function () {
        gsap.to(plus, { rotation: 0, scale: 1, duration: 0.25, ease: 'power2.out', overwrite: true });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBundleAtcHover);
  } else {
    initBundleAtcHover();
  }
}());

// ── Add To Cart (shared handler — skipped if category-grid JS already set it up) ──
if (!window.__narkkAtcInit) {
  window.__narkkAtcInit = true;

  (function () {
    document.addEventListener('click', async function (e) {
      const btn = e.target.closest('[data-atc-btn]');
      if (!btn) return;

      e.preventDefault();
      e.stopPropagation();

      const variantId = parseInt(btn.dataset.variantId, 10);
      if (!variantId) return;

      const label = btn.querySelector('.narkk-btn__label');
      const originalLabel = label ? label.textContent : 'Add To Cart';

      btn.disabled = true;
      if (label) label.textContent = 'Adding…';

      try {
        const res = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ id: variantId, quantity: 1 })
        });

        if (!res.ok) throw new Error('add failed');

        if (label) label.textContent = 'Added!';

        setTimeout(() => { window.location.reload(); }, 800);

      } catch (_) {
        if (label) label.textContent = 'Try again';
        setTimeout(() => {
          if (label) label.textContent = originalLabel;
          btn.disabled = false;
        }, 2000);
      }
    });
  }());
}
