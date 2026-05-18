(function () {
  'use strict';

  function initFooterAnimations() {
    var isPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var isWide    = window.matchMedia('(width > 1024px)').matches;
    if (!isPointer || !isWide || typeof gsap === 'undefined') return;

    // ── Bottom bar cells — fill-slide-up (same as header) ────────
    var barItems = document.querySelectorAll('.narkk-footer__bar-item');
    barItems.forEach(function (item) {
      var fill = item.querySelector('.narkk-footer__bar-fill');
      if (!fill) return;

      gsap.set(fill, { y: 0, yPercent: 100 });

      item.addEventListener('mouseenter', function () {
        gsap.to(fill, { yPercent: 0, duration: 0.38, ease: 'power2.out', overwrite: true });
      });

      item.addEventListener('mouseleave', function () {
        gsap.to(fill, { yPercent: 100, duration: 0.28, ease: 'power2.in', overwrite: true });
      });
    });

    // ── WINGS underline: left→right in, right→left out ───────────
    var wingsLink = document.querySelector('.narkk-footer__wings');
    if (wingsLink) {
      var line = wingsLink.querySelector('.narkk-footer__wings-line');
      if (line) {
        gsap.set(line, { scaleX: 0, transformOrigin: 'left center' });

        wingsLink.addEventListener('mouseenter', function () {
          gsap.to(line, {
            scaleX: 1,
            duration: 0.35,
            ease: 'power2.out',
            transformOrigin: 'left center',
            overwrite: true
          });
        });

        wingsLink.addEventListener('mouseleave', function () {
          gsap.to(line, {
            scaleX: 0,
            duration: 0.25,
            ease: 'power2.in',
            transformOrigin: 'right center',
            overwrite: true
          });
        });
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooterAnimations);
  } else {
    initFooterAnimations();
  }
})();
