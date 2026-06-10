(function () {
  'use strict';

  function init() {
    if (typeof gsap === 'undefined' || !window.narkkSplit) return;

    var section = document.querySelector('[data-narkk-build]');
    if (!section) return;

    var isMobile = window.matchMedia('(width < 768px)').matches;

    // ── Mobile: no curtain (horizontal scroll handles layout) ─
    if (isMobile) return;

    var imgWraps = Array.prototype.slice.call(
      section.querySelectorAll('.narkk-build__card-img-wrap')
    );

    // Mirror CSS initial clip states so GSAP owns the property
    imgWraps.forEach(function (wrap, i) {
      gsap.set(wrap, { clipPath: i % 2 === 0 ? 'inset(100% 0 0 0)' : 'inset(0 0 100% 0)' });
    });

    var cardsEl = section.querySelector('.narkk-build__cards');

    var revealIo = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      revealIo.unobserve(cardsEl);

      var tl = gsap.timeline();

      imgWraps.forEach(function (wrap, i) {
        tl.to(wrap, {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.0,
          ease: 'power3.inOut'
        }, i * 0.15);
      });
    }, { threshold: 0.2 });

    revealIo.observe(cardsEl);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('shopify:section:load', function (e) {
    if (e.target.querySelector('[data-narkk-build]')) init();
  });
}());
