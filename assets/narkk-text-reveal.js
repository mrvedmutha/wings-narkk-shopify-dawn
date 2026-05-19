(function () {
  'use strict';

  if (window.__narkkTextRevealInit) return;
  window.__narkkTextRevealInit = true;

  function splitIntoChars(el) {
    var original = el.textContent;
    el.textContent = '';
    var chars = [];

    for (var i = 0; i < original.length; i++) {
      var ch = original[i];

      if (ch === ' ') {
        var space = document.createElement('span');
        space.className = 'narkk-split__space';
        space.textContent = ' ';
        el.appendChild(space);
      } else {
        var mask = document.createElement('span');
        mask.className = 'narkk-split__mask';
        var inner = document.createElement('span');
        inner.className = 'narkk-split__char';
        inner.textContent = ch;
        mask.appendChild(inner);
        el.appendChild(mask);
        chars.push(inner);
      }
    }

    return chars;
  }

  function init() {
    if (typeof gsap === 'undefined') return;

    var els = document.querySelectorAll('[data-narkk-split]');
    if (!els.length) return;

    els.forEach(function (el) {
      var chars = splitIntoChars(el);
      if (!chars.length) return;

      gsap.set(chars, { yPercent: 110 });
      el.style.visibility = 'visible';

      var delay       = parseFloat(el.getAttribute('data-narkk-split-delay')   || '0');
      var staggerEach = parseFloat(el.getAttribute('data-narkk-split-stagger') || '0.04');

      var io = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        io.unobserve(el);
        gsap.to(chars, {
          yPercent: 0,
          duration: 1.1,
          ease: 'power4.out',
          delay: delay,
          stagger: { each: staggerEach, from: 'start' }
        });
      }, { threshold: 0.15 });

      io.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
