(function () {
  'use strict';

  function initTradePerks() {
    if (typeof gsap === 'undefined' || !window.narkkSplit) return;

    var section = document.querySelector('[data-narkk-trade-perks]');
    if (!section) return;

    // ── Left column animation (fires once on section enter) ───────────────
    var headingEl = section.querySelector('[data-tp-heading]');
    var subtextEl = section.querySelector('[data-tp-subtext]');
    var ctaEl     = section.querySelector('[data-tp-cta]');

    // Split words inside each colour span separately to preserve colour
    var headingWords = [];
    if (headingEl) {
      var headingSpans = headingEl.querySelectorAll(
        '.narkk-trade-perks__heading-default, .narkk-trade-perks__heading-accent'
      );
      headingSpans.forEach(function (span) {
        var words = window.narkkSplit.words(span);
        headingWords = headingWords.concat(words);
      });

      if (headingWords.length) {
        gsap.set(headingWords, { yPercent: 110 });
        headingEl.style.visibility = 'visible';
      }
    }

    if (subtextEl) gsap.set(subtextEl, { opacity: 0, y: 20 });
    if (ctaEl)     gsap.set(ctaEl,     { opacity: 0, y: 16 });

    var leftIo = new IntersectionObserver(function (ioEntries) {
      if (!ioEntries[0].isIntersecting) return;
      leftIo.disconnect();

      var tl = gsap.timeline();

      if (headingWords.length) {
        tl.to(headingWords, {
          yPercent: 0,
          duration: 1.0,
          ease: 'power4.out',
          stagger: { each: 0.06, from: 'start' }
        }, 0);
      }

      if (subtextEl) {
        tl.to(subtextEl, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out'
        }, 0.5);
      }

      if (ctaEl) {
        tl.to(ctaEl, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, 0.75);
      }
    }, { threshold: 0.15 });

    leftIo.observe(section);

    // ── Right entries (per-entry scroll reveal, same as beliefs) ──────────
    var entries = section.querySelectorAll('[data-tp-entry]');
    if (!entries.length) return;

    entries.forEach(function (entry) {
      var indexEl   = entry.querySelector('[data-tp-index]');
      var perkEl    = entry.querySelector('[data-tp-perk-heading]');
      var bodyEl    = entry.querySelector('[data-tp-body]');
      var dividerEl = entry.querySelector('[data-tp-divider]');

      var indexChars = indexEl ? window.narkkSplit.chars(indexEl) : [];
      var perkWords  = perkEl  ? window.narkkSplit.words(perkEl)  : [];

      if (indexChars.length) {
        gsap.set(indexChars, { yPercent: 110 });
        indexEl.style.visibility = 'visible';
      }
      if (perkWords.length) {
        gsap.set(perkWords, { yPercent: 110 });
        perkEl.style.visibility = 'visible';
      }
      if (bodyEl)    gsap.set(bodyEl,    { opacity: 0, y: 20 });
      if (dividerEl) gsap.set(dividerEl, { scaleX: 0, transformOrigin: 'left center' });

      var io = new IntersectionObserver(function (ioEntries) {
        if (!ioEntries[0].isIntersecting) return;
        io.unobserve(entry);

        var tl = gsap.timeline();

        if (indexChars.length) {
          tl.to(indexChars, {
            yPercent: 0,
            duration: 0.8,
            ease: 'power4.out',
            stagger: { each: 0.06, from: 'start' }
          }, 0);
        }

        if (perkWords.length) {
          tl.to(perkWords, {
            yPercent: 0,
            duration: 1.0,
            ease: 'power4.out',
            stagger: { each: 0.08, from: 'start' }
          }, 0.15);
        }

        if (bodyEl) {
          tl.to(bodyEl, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out'
          }, 0.55);
        }

        if (dividerEl) {
          tl.to(dividerEl, {
            scaleX: 1,
            duration: 0.9,
            ease: 'power3.inOut'
          }, 0.9);
        }
      }, { threshold: 0.2 });

      io.observe(entry);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTradePerks);
  } else {
    initTradePerks();
  }
}());
