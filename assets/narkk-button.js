(function () {
  'use strict';

  // Guard against double-init when snippet is rendered multiple times on a page
  if (window.__narkkBtnAnimInit) return;
  window.__narkkBtnAnimInit = true;

  function initButtonAnimations() {
    var isPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isPointer || typeof gsap === 'undefined') return;

    var buttons = document.querySelectorAll('.button');

    buttons.forEach(function (btn) {
      var plus = btn.querySelector('.narkk-btn__plus');
      if (!plus) return;

      gsap.set(btn,  { scale: 1, transformOrigin: 'center center' });
      gsap.set(plus, { rotation: 0 });

      btn.addEventListener('mouseenter', function () {
        gsap.to(btn,  { scale: 1.03, duration: 0.35, ease: 'power2.out', overwrite: true });
        gsap.to(plus, { rotation: 360, duration: 0.55, ease: 'power2.inOut', overwrite: true });
      });

      btn.addEventListener('mouseleave', function () {
        gsap.to(btn,  { scale: 1, duration: 0.35, ease: 'power2.out', overwrite: true });
        gsap.to(plus, { rotation: 0, duration: 0.45, ease: 'power2.inOut', overwrite: true });
      });
    });
  }

  initButtonAnimations();
}());
