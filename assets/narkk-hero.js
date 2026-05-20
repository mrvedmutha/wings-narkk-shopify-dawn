(function () {
  'use strict';

  function initHeroAnimation() {
    if (typeof gsap === 'undefined') return;

    var section = document.querySelector('.narkk-hero');
    if (!section) return;

    // ── Image hover (pointer devices only) ──────────────────────
    var isPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var image = section.querySelector('.narkk-hero__image');
    if (isPointer && image) {
      gsap.set(image, { scale: 1 });
      section.addEventListener('mouseenter', function () {
        gsap.to(image, { scale: 1.03, duration: 0.6, ease: 'power2.out', overwrite: true });
      });
      section.addEventListener('mouseleave', function () {
        gsap.to(image, { scale: 1, duration: 0.6, ease: 'power2.out', overwrite: true });
      });
    }

    // ── CTA reveal ───────────────────────────────────────────────
    var ctaText = section.querySelector('.narkk-hero__cta-text');
    var ctaBtn  = section.querySelector('.narkk-hero__cta .button');

    if (ctaText) gsap.set(ctaText, { opacity: 0, y: 20 });
    if (ctaBtn)  gsap.set(ctaBtn,  { opacity: 0, y: 10 });

    var ctaSection = section.querySelector('.narkk-hero__cta');
    if (!ctaSection || (!ctaText && !ctaBtn)) return;

    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.unobserve(ctaSection);

      var tl = gsap.timeline();

      if (ctaText) {
        tl.to(ctaText, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.4);
      }
      if (ctaBtn) {
        tl.to(ctaBtn, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.75);
      }
    }, { threshold: 0.2 });

    io.observe(ctaSection);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroAnimation);
  } else {
    initHeroAnimation();
  }
}());
