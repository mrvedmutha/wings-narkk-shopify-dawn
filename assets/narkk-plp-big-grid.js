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
