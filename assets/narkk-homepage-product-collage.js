(function () {
  'use strict';

  function splitIntoChars(el) {
    var text = el.textContent;
    el.textContent = '';
    var chars = [];

    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (ch === ' ') {
        var space = document.createElement('span');
        space.className = 'narkk-split__space';
        space.textContent = ' ';
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

  function splitIntoWords(el) {
    var text = el.textContent.trim();
    el.textContent = '';
    var words = text.split(/\s+/);
    var wordEls = [];

    words.forEach(function (word, i) {
      var mask = document.createElement('span');
      mask.className = 'narkk-split__mask';
      var inner = document.createElement('span');
      inner.className = 'narkk-split__word';
      inner.textContent = word;
      mask.appendChild(inner);
      el.appendChild(mask);
      wordEls.push(inner);

      if (i < words.length - 1) {
        var sp = document.createElement('span');
        sp.className = 'narkk-split__space';
        sp.textContent = ' ';
        el.appendChild(sp);
      }
    });

    return wordEls;
  }

  function attachHover(wrap) {
    var img = wrap.querySelector('.narkk-collage__img');
    gsap.set(wrap, { pointerEvents: 'auto' });
    if (!img) return;
    wrap.addEventListener('mouseenter', function () {
      gsap.to(img, { scale: 1.06, duration: 0.5, ease: 'power2.out', overwrite: true });
    });
    wrap.addEventListener('mouseleave', function () {
      gsap.to(img, { scale: 1, duration: 0.5, ease: 'power2.out', overwrite: true });
    });
  }

  function initCollage() {
    if (typeof gsap === 'undefined') return;

    var section = document.querySelector('[data-narkk-collage]');
    if (!section) return;

    var isWide    = window.matchMedia('(width > 749px)').matches;
    var hLine     = section.querySelector('.narkk-collage__h-line');
    var vLine     = section.querySelector('.narkk-collage__v-line');
    var img1Wrap  = section.querySelector('.narkk-collage__img-wrap--1');
    var img2Wrap  = section.querySelector('.narkk-collage__img-wrap--2');
    var eyebrow   = section.querySelector('.narkk-collage__eyebrow');
    var heading   = section.querySelector('.narkk-collage__heading');
    var ctaBtn    = section.querySelector('.narkk-collage__body-group .button');

    var eyebrowChars = eyebrow ? splitIntoChars(eyebrow) : [];
    var headingWords = heading ? splitIntoWords(heading) : [];

    // ── Initial states ───────────────────────────────────────
    if (isWide && hLine) gsap.set(hLine, { scaleX: 0 });
    if (isWide && vLine) gsap.set(vLine, { scaleY: 0 });
    if (img1Wrap) gsap.set(img1Wrap, { clipPath: 'inset(100% 0% 0% 0%)', pointerEvents: 'none' });
    if (img2Wrap) gsap.set(img2Wrap, { clipPath: 'inset(0% 0% 100% 0%)', pointerEvents: 'none' });
    if (eyebrowChars.length) gsap.set(eyebrowChars, { yPercent: 110 });
    if (headingWords.length) gsap.set(headingWords, { yPercent: 110, skewX: -15 });
    if (ctaBtn) gsap.set(ctaBtn, { opacity: 0, y: 10 });

    // ── Trigger on enter ─────────────────────────────────────
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

      // 4. Eyebrow — char by char (same as INTRODUCING)
      if (eyebrowChars.length) {
        tl.to(eyebrowChars, {
          yPercent: 0,
          duration: 1.1,
          ease: 'power4.out',
          stagger: { each: 0.04, from: 'start' }
        }, isWide ? 1.0 : 0.5);
      }

      // 5. Heading — word by word, slanting /
      if (headingWords.length) {
        tl.to(headingWords, {
          yPercent: 0,
          skewX: 0,
          duration: 0.9,
          ease: 'power4.out',
          stagger: { each: 0.07, from: 'start' }
        }, isWide ? 1.3 : 0.7);
      }

      // 6. CTA — fade + rise
      if (ctaBtn) {
        tl.to(ctaBtn, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, isWide ? 1.85 : 1.2);
      }
    }, { threshold: 0.1 });

    io.observe(section);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCollage);
  } else {
    initCollage();
  }
}());
