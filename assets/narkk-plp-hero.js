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

    /* ── Split description into words (may hold several <p> from rich text) ── */
    var descriptionWords = [];
    if (description) {
      var descParagraphs = description.querySelectorAll('p');
      if (!descParagraphs.length) descParagraphs = [description];
      descParagraphs.forEach(function (p) {
        if (!p.textContent.trim().length) return;
        descriptionWords = descriptionWords.concat(window.narkkSplit.words(p));
      });
      if (descriptionWords.length) gsap.set(descriptionWords, { yPercent: 110 });
      description.style.visibility = 'visible';
    }

    /* ── Split tagline into words ──────────────────────────── */
    var taglineWords = tagline ? window.narkkSplit.words(tagline) : [];
    if (taglineWords.length) {
      gsap.set(taglineWords, { yPercent: 110 });
      tagline.style.visibility = 'visible';
    }

    /* ── Hide remaining elements ───────────────────────────── */
    if (breadcrumb)  gsap.set(breadcrumb,  { opacity: 0, y: 10 });
    if (image)       gsap.set(image,       { opacity: 0 });

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

      if (descriptionWords.length) {
        tl.to(descriptionWords, {
          yPercent: 0,
          duration: 0.8, ease: 'power4.out',
          stagger: { each: 0.02, from: 'start' }
        }, 0.55);
      }

      if (taglineWords.length) {
        tl.to(taglineWords, {
          yPercent: 0,
          duration: 0.8, ease: 'power4.out',
          stagger: { each: 0.03, from: 'start' }
        }, 0.85);
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
