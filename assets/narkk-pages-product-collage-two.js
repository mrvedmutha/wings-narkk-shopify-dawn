(function () {
  'use strict';

  function attachHover(wrap) {
    var img = wrap.querySelector('.narkk-collage-two__img');
    gsap.set(wrap, { pointerEvents: 'auto' });
    if (!img) return;
    wrap.addEventListener('mouseenter', function () {
      gsap.to(img, { scale: 1.06, duration: 0.5, ease: 'power2.out', overwrite: true });
    });
    wrap.addEventListener('mouseleave', function () {
      gsap.to(img, { scale: 1, duration: 0.5, ease: 'power2.out', overwrite: true });
    });
  }

  function initCollageTwo() {
    if (typeof gsap === 'undefined' || !window.narkkSplit) return;

    var section = document.querySelector('[data-narkk-collage-two]');
    if (!section) return;

    var isWide      = window.matchMedia('(width > 749px)').matches;
    var hLine       = section.querySelector('.narkk-collage-two__h-line');
    var vLine       = section.querySelector('.narkk-collage-two__v-line');
    var img1Wrap    = section.querySelector('.narkk-collage-two__img-wrap--1');
    var img2Wrap    = section.querySelector('.narkk-collage-two__img-wrap--2');
    var heading     = section.querySelector('.narkk-collage-two__heading');

    var headingWords = heading ? window.narkkSplit.words(heading) : [];

    // ── Initial states ───────────────────────────────────────
    if (isWide && hLine) gsap.set(hLine, { scaleX: 0 });
    if (isWide && vLine) gsap.set(vLine, { scaleY: 0 });
    if (img1Wrap) gsap.set(img1Wrap, { clipPath: 'inset(100% 0% 0% 0%)', pointerEvents: 'none' });
    if (img2Wrap) gsap.set(img2Wrap, { clipPath: 'inset(0% 0% 100% 0%)', pointerEvents: 'none' });
    if (headingWords.length) gsap.set(headingWords, { yPercent: 110, skewX: -15 });

    // ── Trigger on scroll into view ──────────────────────────
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.unobserve(section);

      var tl = gsap.timeline();

      // 1. Lines expand from center (desktop only)
      if (isWide) {
        if (hLine) tl.to(hLine, { scaleX: 1, duration: 1.2, ease: 'power3.inOut' }, 0);
        if (vLine) tl.to(vLine, { scaleY: 1, duration: 1.2, ease: 'power3.inOut' }, 0);
      }

      // 2. Image 1 — curtain bottom→top
      if (img1Wrap) {
        tl.to(img1Wrap, {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.0,
          ease: 'power3.inOut',
          onComplete: function () { attachHover(img1Wrap); }
        }, isWide ? 0.5 : 0);
      }

      // 3. Image 2 — curtain top→bottom
      if (img2Wrap) {
        tl.to(img2Wrap, {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.0,
          ease: 'power3.inOut',
          onComplete: function () { attachHover(img2Wrap); }
        }, isWide ? 0.85 : 0.25);
      }

      // 4. Heading — word by word, slanting in
      if (headingWords.length) {
        tl.to(headingWords, {
          yPercent: 0,
          skewX: 0,
          duration: 0.9,
          ease: 'power4.out',
          stagger: { each: 0.07, from: 'start' }
        }, isWide ? 1.3 : 0.7);
      }

    }, { threshold: 0.1 });

    io.observe(section);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCollageTwo);
  } else {
    initCollageTwo();
  }
}());
