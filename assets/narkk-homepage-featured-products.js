(function () {
  'use strict';

  function initFeaturedProducts() {
    if (typeof gsap === 'undefined' || !window.narkkSplit) return;

    var section = document.querySelector('[data-narkk-fp]');
    if (!section) return;

    var heading = section.querySelector('[data-narkk-split]');
    var cards   = Array.prototype.slice.call(
      section.querySelectorAll('[data-narkk-fp-card]')
    );

    /* ── Heading split ─────────────────────────────────────────── */
    var headingWords = heading ? window.narkkSplit.words(heading) : [];
    if (headingWords.length) {
      gsap.set(headingWords, { yPercent: 110, skewX: -12 });
    }

    /* ── Cards: hidden until scroll reveal ─────────────────────── */
    if (cards.length) {
      gsap.set(cards, { opacity: 0, y: 36 });
    }

    /* ── IntersectionObserver ──────────────────────────────────── */
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.unobserve(section);

      var tl = gsap.timeline();

      /* 1. Heading — words up from clip mask */
      if (headingWords.length) {
        tl.to(headingWords, {
          yPercent: 0,
          skewX: 0,
          duration: 0.85,
          ease: 'power4.out',
          stagger: { each: 0.04, from: 'start' }
        }, 0);
      }

      /* 2. Cards — fade + rise, staggered across the grid */
      if (cards.length) {
        tl.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.72,
          ease: 'power3.out',
          stagger: { each: 0.07, from: 'start' }
        }, 0.3);
      }
    }, { threshold: 0.05 });

    io.observe(section);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFeaturedProducts);
  } else {
    initFeaturedProducts();
  }
}());
