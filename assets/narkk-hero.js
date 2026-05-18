(function () {
  'use strict';

  function initHeroAnimation() {
    var isPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isPointer || typeof gsap === 'undefined') return;

    var section = document.querySelector('.narkk-hero');
    if (!section) return;

    var image = section.querySelector('.narkk-hero__image');
    if (!image) return;

    gsap.set(image, { scale: 1 });

    section.addEventListener('mouseenter', function () {
      gsap.to(image, { scale: 1.03, duration: 0.6, ease: 'power2.out', overwrite: true });
    });

    section.addEventListener('mouseleave', function () {
      gsap.to(image, { scale: 1, duration: 0.6, ease: 'power2.out', overwrite: true });
    });
  }

  initHeroAnimation();
}());
