(function () {
  'use strict';

  function initMission() {
    if (typeof gsap === 'undefined' || !window.narkkSplit) return;

    var section = document.querySelector('[data-narkk-mission]');
    if (!section) return;

    var isDesktop = window.matchMedia('(min-width: 1025px)').matches;

    var hLine   = section.querySelector('.narkk-mission__h-line');
    var vLine   = section.querySelector('.narkk-mission__v-line');
    var eyebrow = section.querySelector('.narkk-mission__eyebrow');
    var heading = section.querySelector('.narkk-mission__heading');

    // ── Text splitting ───────────────────────────────────────
    var eyebrowChars = eyebrow ? window.narkkSplit.chars(eyebrow) : [];
    var headingWords = heading ? window.narkkSplit.words(heading) : [];

    // ── Initial states ───────────────────────────────────────
    if (isDesktop) {
      if (hLine) gsap.set(hLine, { scaleX: 0 });
      if (vLine) gsap.set(vLine, { scaleY: 0 });
    }
    if (eyebrowChars.length) gsap.set(eyebrowChars, { yPercent: 110 });
    if (headingWords.length) gsap.set(headingWords, { yPercent: 110, skewX: -15 });

    // ── Intersection trigger ─────────────────────────────────
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.unobserve(section);

      var tl = gsap.timeline();

      // 1. Lines expand from center (desktop only)
      if (isDesktop) {
        if (hLine) tl.to(hLine, { scaleX: 1, duration: 1.2, ease: 'power3.inOut' }, 0);
        if (vLine) tl.to(vLine, { scaleY: 1, duration: 1.2, ease: 'power3.inOut' }, 0);
      }

      // 2. Eyebrow — char by char slide up
      if (eyebrowChars.length) {
        tl.to(eyebrowChars, {
          yPercent: 0,
          duration: 1.1,
          ease: 'power4.out',
          stagger: { each: 0.04, from: 'start' }
        }, isDesktop ? 0.8 : 0.2);
      }

      // 3. Heading — word by word with skew
      if (headingWords.length) {
        tl.to(headingWords, {
          yPercent: 0,
          skewX: 0,
          duration: 0.9,
          ease: 'power4.out',
          stagger: { each: 0.07, from: 'start' }
        }, isDesktop ? 1.1 : 0.5);
      }
    }, { threshold: 0.1 });

    io.observe(section);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMission);
  } else {
    initMission();
  }
}());
