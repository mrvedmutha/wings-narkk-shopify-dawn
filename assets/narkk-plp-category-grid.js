class NarkkCategoryGridLoadMore {
  constructor(section) {
    this.section = section;
    this.grid = section.querySelector('[data-grid]');
    if (!this.grid) return;

    this.btn = section.querySelector('[data-load-more]');
    this.wrap = section.querySelector('[data-load-more-wrap]');
    this.label = section.querySelector('[data-load-more-label]');
    if (!this.btn) return;

    this.perPage = parseInt(this.grid.dataset.perPage, 10);
    this.total = parseInt(this.grid.dataset.total, 10);
    this.shown = this.perPage;

    this.btn.addEventListener('click', () => this._loadMore());
  }

  _loadMore() {
    const next = Math.min(this.shown + this.perPage, this.total);

    this.grid
      .querySelectorAll('.narkk-plp-card--hidden')
      .forEach((card) => {
        const idx = parseInt(card.dataset.cardIndex, 10);
        if (idx < next) card.classList.remove('narkk-plp-card--hidden');
      });

    this.shown = next;
    const remaining = this.total - this.shown;

    if (remaining <= 0) {
      this.wrap.remove();
    } else {
      this.label.textContent = `Load More (${remaining})`;
      this.btn.dataset.remaining = remaining;
    }

    // Lenis caches scroll height — wait two frames for the browser to paint
    // the newly visible cards before telling Lenis to remeasure
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (window.__narkkLenis) window.__narkkLenis.resize();
      });
    });
  }
}

document.querySelectorAll('[data-narkk-plp-category-grid]').forEach((section) => {
  new NarkkCategoryGridLoadMore(section);
});

// ── ATC button plus hover animation (GSAP) ────────────────
(function () {
  function initAtcHover() {
    if (typeof gsap === 'undefined') return;

    document.querySelectorAll('.narkk-plp-card__atc').forEach(function (btn) {
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
    document.addEventListener('DOMContentLoaded', initAtcHover);
  } else {
    initAtcHover();
  }
}());

// ── Add To Cart (shared handler — skipped if big-grid JS already set it up) ──
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
