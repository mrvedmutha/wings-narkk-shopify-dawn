(function () {
  'use strict';

  function initSocialCollage() {
    if (typeof gsap === 'undefined' || !window.narkkSplit) return;

    var section = document.querySelector('[data-narkk-sc]');
    if (!section) return;

    var isDesktop = window.matchMedia('(width >= 1025px)').matches;

    // ── Element refs ─────────────────────────────────────────
    var hLineTop     = section.querySelector('.narkk-sc__h-line--top');
    var hLineBot     = section.querySelector('.narkk-sc__h-line--bot');
    var vLines       = Array.prototype.slice.call(section.querySelectorAll('.narkk-sc__pline--vert'));
    var hLines       = Array.prototype.slice.call(section.querySelectorAll('.narkk-sc__pline--horiz'));
    var panelImgs    = Array.prototype.slice.call(section.querySelectorAll('.narkk-sc__panel-img-wrap'));
    var colorTiles   = Array.prototype.slice.call(section.querySelectorAll('.narkk-sc__ctile'));
    var eyebrow      = section.querySelector('.narkk-sc__eyebrow');
    var heading      = section.querySelector('.narkk-sc__heading');
    var bodyText     = section.querySelector('.narkk-sc__body-text');
    var socialLabel  = section.querySelector('.narkk-sc__social-label');
    var icons        = Array.prototype.slice.call(section.querySelectorAll('.narkk-sc__icon-link'));

    // ── Text splitting ────────────────────────────────────────
    var eyebrowChars = eyebrow ? window.narkkSplit.chars(eyebrow) : [];
    var headingWords = heading ? window.narkkSplit.words(heading) : [];

    // ── Initial states ────────────────────────────────────────
    if (hLineTop) gsap.set(hLineTop, { scaleX: 0, transformOrigin: 'left center' });
    if (hLineBot) gsap.set(hLineBot, { scaleX: 0, transformOrigin: 'right center' });

    if (isDesktop) {
      gsap.set(vLines,    { scaleY: 0, transformOrigin: 'top center' });
      gsap.set(hLines,    { scaleX: 0, transformOrigin: 'left center' });
      gsap.set(panelImgs, { clipPath: 'inset(0% 0% 100% 0%)' });
    }
    if (colorTiles.length) gsap.set(colorTiles, { scaleY: 0, transformOrigin: 'top center' });

    if (eyebrowChars.length) gsap.set(eyebrowChars, { yPercent: 110 });
    if (headingWords.length) gsap.set(headingWords, { yPercent: 110, skewX: -12 });
    if (bodyText)    gsap.set(bodyText,    { opacity: 0, y: 20 });
    if (socialLabel) gsap.set(socialLabel, { opacity: 0, y: 16 });
    if (icons.length) gsap.set(icons,      { opacity: 0, y: 16 });

    // ── Scroll trigger ────────────────────────────────────────
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.unobserve(section);

      var tl = gsap.timeline();

      // 1. Section horizontal dividers
      if (hLineTop) tl.to(hLineTop, { scaleX: 1, duration: 1.1, ease: 'power3.inOut' }, 0);
      if (hLineBot) tl.to(hLineBot, { scaleX: 1, duration: 1.1, ease: 'power3.inOut' }, 0);

      if (isDesktop) {
        // 2. Panel images reveal top-to-bottom
        if (panelImgs.length) {
          tl.to(panelImgs, {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.0,
            ease: 'power3.inOut',
            stagger: 0
          }, 0.3);
        }

        // 3. Panel vertical lines grow downward
        if (vLines.length) {
          tl.to(vLines, {
            scaleY: 1,
            duration: 0.8,
            ease: 'power3.inOut',
            stagger: { each: 0.1, from: 'start' }
          }, 0.9);
        }

        // 4. Panel horizontal lines grow from left
        if (hLines.length) {
          tl.to(hLines, {
            scaleX: 1,
            duration: 0.75,
            ease: 'power3.inOut',
            stagger: { each: 0.08, from: 'start' }
          }, 1.2);
        }
      }

      // 5. Color tiles fill down from top (desktop only)
      if (isDesktop && colorTiles.length) {
        tl.to(colorTiles, {
          scaleY: 1,
          duration: 0.55,
          ease: 'power3.inOut',
          stagger: { each: 0.09, from: 'start' }
        }, 1.45);
      }

      // 6. Eyebrow — char by char
      var textAt = isDesktop ? 0.3 : 0.15;
      if (eyebrowChars.length) {
        tl.to(eyebrowChars, {
          yPercent: 0,
          duration: 0.9,
          ease: 'power4.out',
          stagger: { each: 0.04, from: 'start' }
        }, textAt);
      }

      // 7. Heading — word by word with skew
      if (headingWords.length) {
        tl.to(headingWords, {
          yPercent: 0,
          skewX: 0,
          duration: 0.9,
          ease: 'power4.out',
          stagger: { each: 0.07, from: 'start' }
        }, textAt + 0.35);
      }

      // 8. Body text
      if (bodyText) {
        tl.to(bodyText, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, textAt + 0.8);
      }

      // 9. Social label
      if (socialLabel) {
        tl.to(socialLabel, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, textAt + 1.15);
      }

      // 10. Social icons stagger
      if (icons.length) {
        tl.to(icons, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          stagger: { each: 0.1, from: 'start' }
        }, textAt + 1.3);
      }

    }, { threshold: 0.1 });

    io.observe(section);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSocialCollage);
  } else {
    initSocialCollage();
  }
}());
