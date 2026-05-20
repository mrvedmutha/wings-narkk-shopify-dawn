(function () {
  'use strict';

  function initManifesto() {
    if (typeof gsap === 'undefined' || !window.narkkSplit) return;

    var section = document.querySelector('[data-narkk-manifesto]');
    if (!section) return;

    var logoWrap   = section.querySelector('[data-manifesto-logo]');
    var ellipseSvg = section.querySelector('[data-manifesto-ellipse]');
    var circle     = ellipseSvg ? ellipseSvg.querySelector('circle') : null;
    var eyebrow    = section.querySelector('[data-manifesto-eyebrow]');
    var heading    = section.querySelector('[data-manifesto-heading]');
    var bodyParas  = section.querySelectorAll('[data-manifesto-body] p');

    // ── Ellipse: set initial stroke state ────────────────────
    var circumference = circle ? 2 * Math.PI * parseFloat(circle.getAttribute('r') || 175) : 0;
    if (circle && circumference) {
      circle.style.strokeDasharray  = circumference;
      circle.style.strokeDashoffset = circumference;
    }

    // ── Text split ───────────────────────────────────────────
    var eyebrowChars = eyebrow ? window.narkkSplit.chars(eyebrow) : [];
    var headingWords = heading ? window.narkkSplit.words(heading) : [];

    // ── Initial states ───────────────────────────────────────
    if (logoWrap) {
      gsap.set(logoWrap, { clipPath: 'inset(100% 0% 0% 0%)' });
      logoWrap.style.visibility = 'visible';
    }
    if (eyebrowChars.length) {
      gsap.set(eyebrowChars, { yPercent: 110 });
      eyebrow.style.visibility = 'visible';
    }
    if (headingWords.length) {
      gsap.set(headingWords, { yPercent: 110, skewX: -15 });
      heading.style.visibility = 'visible';
    }
    window.narkkSplit.fadeRise(bodyParas);

    // ── Scroll trigger ───────────────────────────────────────
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.unobserve(section);

      var tl = gsap.timeline();

      // 1. Logo: curtain bottom → top
      if (logoWrap) {
        tl.to(logoWrap, {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.0,
          ease: 'power3.inOut'
        }, 0);
      }

      // 2. Ellipse: stroke draws clockwise from 12 o'clock
      if (circle && circumference) {
        tl.call(function () {
          circle.style.transition       = 'stroke-dashoffset 1.0s cubic-bezier(0.65, 0, 0.35, 1)';
          circle.style.strokeDashoffset = '0';
        }, [], 0.55);
      }

      // 3. Eyebrow: char by char (alongside logo)
      if (eyebrowChars.length) {
        tl.to(eyebrowChars, {
          yPercent: 0,
          duration: 1.1,
          ease: 'power4.out',
          stagger: { each: 0.04, from: 'start' }
        }, 0.4);
      }

      // 4. Heading: word by word with skew
      if (headingWords.length) {
        tl.to(headingWords, {
          yPercent: 0,
          skewX: 0,
          duration: 0.9,
          ease: 'power4.out',
          stagger: { each: 0.07, from: 'start' }
        }, 0.75);
      }

      // 5. Body paragraphs: staggered fade + rise
      if (bodyParas.length) {
        tl.to(bodyParas, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger: { each: 0.2, from: 'start' }
        }, 1.2);
      }

    }, { threshold: 0.35 });

    io.observe(section);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initManifesto);
  } else {
    initManifesto();
  }
}());
