(function () {
  'use strict';

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var section = document.querySelector('[data-narkk-usp-strip]');
  if (!section) return;

  gsap.registerPlugin(ScrollTrigger);

  // Bridge Lenis with ScrollTrigger so scrub stays in sync
  if (window.__narkkLenis) {
    window.__narkkLenis.on('scroll', ScrollTrigger.update);
  }

  var tiles = section.querySelectorAll('.narkk-usp-strip__tile');

  tiles.forEach(function (tile, i) {
    /* 1-indexed odd (0, 2) slide up from below; even (1, 3) slide down from above */
    var fromY = i % 2 === 0 ? 60 : -60;

    gsap.fromTo(
      tile,
      { opacity: 0, y: fromY },
      {
        opacity: 1,
        y: 0,
        duration: 0.75,
        ease: 'power3.out',
        delay: i * 0.08,
        scrollTrigger: {
          trigger: tile,
          start: 'top 88%',
          once: true,
        },
      }
    );
  });
}());
