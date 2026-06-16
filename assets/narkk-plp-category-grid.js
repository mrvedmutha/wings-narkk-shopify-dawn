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
