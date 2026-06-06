(function () {
  'use strict';

  function initProfessionals() {
    if (typeof gsap === 'undefined' || !window.narkkSplit) return;

    var section   = document.querySelector('[data-narkk-professionals]');
    if (!section) return;

    var eyebrow   = section.querySelector('[data-prof-eyebrow]');
    var line      = section.querySelector('[data-prof-line]');
    var imageWrap = section.querySelector('[data-prof-image]');
    var textWrap  = section.querySelector('[data-prof-text]');
    var textParas = textWrap
      ? Array.prototype.slice.call(textWrap.querySelectorAll('p'))
      : [];

    // ── Text splitting ───────────────────────────────────────
    var eyebrowChars = eyebrow ? window.narkkSplit.chars(eyebrow) : [];

    // ── Initial states ───────────────────────────────────────
    if (eyebrowChars.length) gsap.set(eyebrowChars, { yPercent: 110 });
    if (line)              gsap.set(line,      { scaleX: 0, transformOrigin: 'center 50%' });
    if (imageWrap)         gsap.set(imageWrap, { clipPath: 'inset(0% 0% 100% 0%)' });
    if (textParas.length)  gsap.set(textParas, { opacity: 0, y: 28 });

    // ── Intersection trigger ─────────────────────────────────
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.unobserve(section);

      var tl = gsap.timeline();

      // 1. Eyebrow chars — slide up
      if (eyebrowChars.length) {
        tl.to(eyebrowChars, {
          yPercent: 0,
          duration: 1.1,
          ease: 'power4.out',
          stagger: { each: 0.04, from: 'start' }
        }, 0);
      }

      // 2. Divider line — scale from center
      if (line) {
        tl.to(line, {
          scaleX: 1,
          duration: 1.2,
          ease: 'power3.inOut'
        }, 0.35);
      }

      // 3. Image — top-down curtain reveal
      if (imageWrap) {
        tl.to(imageWrap, {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.0,
          ease: 'power3.inOut'
        }, 0.85);
      }

      // 4. Text paragraphs — staggered fade + rise
      if (textParas.length) {
        tl.to(textParas, {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: 'power2.out',
          stagger: { each: 0.18 }
        }, 1.3);
      }

    }, { threshold: 0.1 });

    io.observe(section);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProfessionals);
  } else {
    initProfessionals();
  }
}());
