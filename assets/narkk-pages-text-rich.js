(function () {
  'use strict';

  function initTextRich() {
    if (typeof gsap === 'undefined' || !window.narkkSplit) return;

    var section = document.querySelector('[data-narkk-text-rich]');
    if (!section) return;

    var headingEl = section.querySelector('[data-text-rich-heading]');
    if (!headingEl) return;

    var words = window.narkkSplit.words(headingEl);
    if (!words.length) return;

    gsap.set(words, { yPercent: 110 });

    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.unobserve(section);

      gsap.to(words, {
        yPercent: 0,
        duration: 1.1,
        ease: 'power4.out',
        stagger: { each: 0.1, from: 'start' }
      });
    }, { threshold: 0.15 });

    io.observe(section);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTextRich);
  } else {
    initTextRich();
  }
}());
