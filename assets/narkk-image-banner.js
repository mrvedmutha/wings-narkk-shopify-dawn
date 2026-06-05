(function () {
  'use strict';

  function initSection(section) {
    if (typeof gsap === 'undefined' || !window.narkkSplit) return;

    var isDesktop = window.matchMedia('(min-width: 1025px)').matches;

    var headingEl  = section.querySelector('[data-narkk-ibanner-heading]');
    var sideEl     = section.querySelector('[data-narkk-ibanner-side]');
    var paragraphs = Array.prototype.slice.call(section.querySelectorAll('[data-narkk-ibanner-paragraph]'));
    var ctaItems   = Array.prototype.slice.call(section.querySelectorAll('[data-narkk-ibanner-cta] .button'));

    // ── Text splitting ───────────────────────────────────────
    var headingChars = headingEl ? window.narkkSplit.chars(headingEl) : [];
    var sideWords    = sideEl    ? window.narkkSplit.words(sideEl)    : [];

    // ── Initial states ───────────────────────────────────────
    if (headingChars.length) gsap.set(headingChars, { yPercent: 110 });
    // Side text animates in on desktop; stays visible statically on tablet/mobile
    if (isDesktop && sideWords.length) gsap.set(sideWords, { opacity: 0, y: 16 });

    // Paragraph: animate on desktop only (mobile stays static)
    if (isDesktop) {
      paragraphs.forEach(function (p) { gsap.set(p, { opacity: 0, y: 16 }); });
    }

    // CTA: animate on both desktop + mobile
    ctaItems.forEach(function (btn) { gsap.set(btn, { opacity: 0, y: 10 }); });

    // ── Intersection observer ────────────────────────────────
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.unobserve(section);

      var tl = gsap.timeline();

      // 1. Heading — char-by-char slide up from mask
      if (headingChars.length) {
        tl.to(headingChars, {
          yPercent: 0,
          duration: 1.1,
          ease: 'power4.out',
          stagger: { each: 0.05, from: 'start' }
        }, 0);
      }

      // 2. Side text — word-by-word fade + rise (desktop only)
      if (isDesktop && sideWords.length) {
        tl.to(sideWords, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger: { each: 0.12 }
        }, 0.6);
      }

      // 3. Paragraphs — desktop only, fade + rise
      if (isDesktop && paragraphs.length) {
        tl.to(paragraphs, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger: { each: 0.15 }
        }, 0.9);
      }

      // 4. CTA buttons — both desktop + mobile
      if (ctaItems.length) {
        tl.to(ctaItems, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: { each: 0.12 }
        }, isDesktop ? 1.2 : 0.5);
      }
    }, { threshold: 0.1 });

    io.observe(section);
  }

  function init() {
    var sections = document.querySelectorAll('[data-narkk-ibanner]');
    Array.prototype.forEach.call(sections, initSection);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
