(function () {
  'use strict';

  function attachHover(wrap) {
    var img = wrap.querySelector('.narkk-program-img-cta__image');
    if (!img) return;
    gsap.set(wrap, { pointerEvents: 'auto' });
    wrap.addEventListener('mouseenter', function () {
      gsap.to(img, { scale: 1.06, duration: 0.5, ease: 'power2.out', overwrite: true });
    });
    wrap.addEventListener('mouseleave', function () {
      gsap.to(img, { scale: 1, duration: 0.5, ease: 'power2.out', overwrite: true });
    });
  }

  function initProgramImgCta() {
    if (typeof gsap === 'undefined') return;

    var section = document.querySelector('[data-narkk-program-img-cta]');
    if (!section) return;

    var imageWrap = section.querySelector('[data-program-image]');
    var body      = section.querySelector('[data-program-body]');
    var cta       = section.querySelector('[data-program-cta]');

    // ── Initial states ───────────────────────────────────────
    if (imageWrap) gsap.set(imageWrap, { clipPath: 'inset(100% 0% 0% 0%)', pointerEvents: 'none' });
    if (body)      gsap.set(body,      { opacity: 0, y: 24 });
    if (cta)       gsap.set(cta,       { opacity: 0, y: 16 });

    // ── Trigger on scroll into view ──────────────────────────
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.unobserve(section);

      var tl = gsap.timeline();

      // 1. Image — curtain wipe bottom → top
      if (imageWrap) {
        tl.to(imageWrap, {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.0,
          ease: 'power3.inOut',
          onComplete: function () { attachHover(imageWrap); }
        }, 0);
      }

      // 2. Body text — fade + rise
      if (body) {
        tl.to(body, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out'
        }, 0.5);
      }

      // 3. CTA — fade + rise
      if (cta) {
        tl.to(cta, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, 0.85);
      }

    }, { threshold: 0.1 });

    io.observe(section);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProgramImgCta);
  } else {
    initProgramImgCta();
  }
}());
