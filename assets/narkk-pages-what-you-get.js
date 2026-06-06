(function () {
  'use strict';

  function initWhatYouGet() {
    if (typeof gsap === 'undefined' || !window.narkkSplit) return;

    var section = document.querySelector('[data-narkk-what-you-get]');
    if (!section) return;

    var heading = section.querySelector('[data-wyg-heading]');
    var cards   = Array.prototype.slice.call(section.querySelectorAll('[data-wyg-card]'));

    // ── Section heading — char split reveal ──────────────────
    var headingChars = heading ? window.narkkSplit.chars(heading) : [];
    if (headingChars.length) {
      gsap.set(headingChars, { yPercent: 110 });

      var headingIO = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        headingIO.unobserve(heading);
        gsap.to(headingChars, {
          yPercent: 0,
          duration: 1.1,
          ease: 'power4.out',
          stagger: { each: 0.03, from: 'start' }
        });
      }, { threshold: 0.3 });

      headingIO.observe(heading);
    }

    // ── Per-card clip-path reveal ─────────────────────────────
    // Even index: clip starts at top (inset from top = 100%), reveals top→bottom
    // Odd index:  clip starts at bottom (inset from bottom = 100%), reveals bottom→top
    cards.forEach(function (card, i) {
      var startClip = i % 2 === 0 ? 'inset(100% 0 0 0)' : 'inset(0 0 100% 0)';
      gsap.set(card, { clipPath: startClip });

      var io = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        io.unobserve(card);
        gsap.to(card, {
          clipPath: 'inset(0% 0 0% 0)',
          duration: 1.0,
          ease: 'power3.inOut'
        });
      }, { threshold: 0 });

      io.observe(card);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWhatYouGet);
  } else {
    initWhatYouGet();
  }

  document.addEventListener('shopify:section:load', function (e) {
    if (e.target.querySelector('[data-narkk-what-you-get]')) initWhatYouGet();
  });
}());
