(function () {
  'use strict';

  function initPlpHero() {
    if (typeof gsap === 'undefined' || !window.narkkSplit) return;

    var section     = document.querySelector('[data-narkk-plp-hero]');
    if (!section) return;

    var heading     = section.querySelector('[data-narkk-plp-heading]');
    var description = section.querySelector('[data-narkk-plp-description]');
    var tagline     = section.querySelector('[data-narkk-plp-tagline]');
    var breadcrumb  = section.querySelector('[data-narkk-plp-breadcrumb]');
    var image       = section.querySelector('[data-narkk-plp-image]');

    /* ── Split heading into words ──────────────────────────── */
    var headingWords = heading ? window.narkkSplit.words(heading) : [];
    if (headingWords.length) {
      gsap.set(headingWords, { yPercent: 110, skewX: -8 });
      heading.style.visibility = 'visible';
    }

    /* ── Hide remaining elements ───────────────────────────── */
    if (breadcrumb)  gsap.set(breadcrumb,  { opacity: 0, y: 10 });
    if (image)       gsap.set(image,       { opacity: 0 });
    if (description) gsap.set(description, { opacity: 0, y: 20 });
    if (tagline)     gsap.set(tagline,     { opacity: 0, y: 20 });

    /* ── IO fires immediately for above-fold content ───────── */
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.unobserve(section);

      var tl = gsap.timeline();

      if (breadcrumb) {
        tl.to(breadcrumb, {
          opacity: 1, y: 0,
          duration: 0.5, ease: 'power3.out'
        }, 0);
      }

      if (image) {
        tl.to(image, {
          opacity: 1,
          duration: 0.9, ease: 'power2.out'
        }, 0.05);
      }

      if (headingWords.length) {
        tl.to(headingWords, {
          yPercent: 0, skewX: 0,
          duration: 0.9, ease: 'power4.out',
          stagger: { each: 0.06, from: 'start' }
        }, 0.2);
      }

      if (description) {
        tl.to(description, {
          opacity: 1, y: 0,
          duration: 0.65, ease: 'power3.out'
        }, 0.65);
      }

      if (tagline) {
        tl.to(tagline, {
          opacity: 1, y: 0,
          duration: 0.65, ease: 'power3.out'
        }, 0.8);
      }
    }, { threshold: 0 });

    io.observe(section);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPlpHero);
  } else {
    initPlpHero();
  }
}());
