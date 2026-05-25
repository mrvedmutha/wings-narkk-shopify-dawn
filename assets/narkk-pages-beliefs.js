(function () {
  'use strict';

  function initBeliefs() {
    if (typeof gsap === 'undefined' || !window.narkkSplit) return;

    var section = document.querySelector('[data-narkk-beliefs]');
    if (!section) return;

    var entries = section.querySelectorAll('[data-beliefs-entry]');
    if (!entries.length) return;

    entries.forEach(function (entry) {
      var indexEl   = entry.querySelector('[data-beliefs-index]');
      var headingEl = entry.querySelector('[data-beliefs-heading]');
      var bodyEl    = entry.querySelector('[data-beliefs-body]');
      var dividerEl = entry.querySelector('[data-beliefs-divider]');

      var indexChars   = indexEl   ? window.narkkSplit.chars(indexEl)   : [];
      var headingWords = headingEl ? window.narkkSplit.words(headingEl) : [];

      if (indexChars.length) {
        gsap.set(indexChars, { yPercent: 110 });
        indexEl.style.visibility = 'visible';
      }
      if (headingWords.length) {
        gsap.set(headingWords, { yPercent: 110 });
        headingEl.style.visibility = 'visible';
      }
      if (bodyEl)    gsap.set(bodyEl,    { opacity: 0, y: 20 });
      if (dividerEl) gsap.set(dividerEl, { scaleX: 0, transformOrigin: 'left center' });

      var io = new IntersectionObserver(function (ioEntries) {
        if (!ioEntries[0].isIntersecting) return;
        io.unobserve(entry);

        var tl = gsap.timeline();

        // 1. Index chars slide up from mask
        if (indexChars.length) {
          tl.to(indexChars, {
            yPercent: 0,
            duration: 0.8,
            ease: 'power4.out',
            stagger: { each: 0.06, from: 'start' }
          }, 0);
        }

        // 2. Heading words rise word-by-word
        if (headingWords.length) {
          tl.to(headingWords, {
            yPercent: 0,
            duration: 1.0,
            ease: 'power4.out',
            stagger: { each: 0.08, from: 'start' }
          }, 0.15);
        }

        // 3. Body paragraph fades and rises
        if (bodyEl) {
          tl.to(bodyEl, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out'
          }, 0.55);
        }

        // 4. Divider sweeps left → right like an underline
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
    document.addEventListener('DOMContentLoaded', initBeliefs);
  } else {
    initBeliefs();
  }
}());
