(function () {
  'use strict';

  function initCommunity() {
    if (typeof gsap === 'undefined' || !window.narkkSplit) return;

    var section = document.querySelector('[data-narkk-community]');
    if (!section) return;

    var isDesktop = window.matchMedia('(min-width: 1025px)').matches;

    var hLine     = section.querySelector('.narkk-community__h-line');
    var vLine     = section.querySelector('.narkk-community__v-line');
    var card      = section.querySelector('.narkk-community__card');
    var heading   = section.querySelector('.narkk-community__heading');
    var textEls   = Array.prototype.slice.call(section.querySelectorAll('.narkk-community__text'));
    var subheading = section.querySelector('.narkk-community__subheading');
    var subText   = section.querySelector('.narkk-community__sub-text');
    var steps     = Array.prototype.slice.call(section.querySelectorAll('.narkk-community__step'));
    var ctaBtn    = section.querySelector('.narkk-community__cta .button');

    // ── Text splitting ───────────────────────────────────────
    var headingChars = heading ? window.narkkSplit.chars(heading) : [];

    // ── Measure card → set line CSS vars + GSAP origins ─────
    function updateLineOrigins() {
      if (!isDesktop || !card) return;
      var sRect = section.getBoundingClientRect();
      var cRect = card.getBoundingClientRect();
      var ox = cRect.left - sRect.left;
      var oy = cRect.top  - sRect.top;

      section.style.setProperty('--community-card-top',  oy + 'px');
      section.style.setProperty('--community-card-left', ox + 'px');

      // H-line grows from intersection (card left) in both directions
      if (hLine) gsap.set(hLine, { scaleX: 0, transformOrigin: ox + 'px 50%' });
      // V-line grows from intersection (card top) in both directions
      if (vLine) gsap.set(vLine, { scaleY: 0, transformOrigin: '50% ' + oy + 'px' });
    }

    // ── Initial states ───────────────────────────────────────
    updateLineOrigins();

    if (headingChars.length) gsap.set(headingChars, { yPercent: 110 });

    textEls.forEach(function (el) { gsap.set(el, { opacity: 0, y: 16 }); });
    if (subheading) gsap.set(subheading, { opacity: 0, y: 16 });
    if (subText)    gsap.set(subText,    { opacity: 0, y: 16 });
    steps.forEach(function (el)   { gsap.set(el, { opacity: 0, y: 20 }); });
    if (ctaBtn) gsap.set(ctaBtn, { opacity: 0, y: 10 });

    // Card hidden — reveals top-down (top of card appears first)
    if (card) gsap.set(card, { clipPath: 'inset(0% 0% 100% 0%)' });

    // ── Fallback: force all elements visible if animation never plays ──
    var animPlayed = false;
    var fallbackDelay = isDesktop ? 4000 : 2800;
    var fallbackTimer = setTimeout(function () {
      if (animPlayed) return;
      if (headingChars.length) gsap.set(headingChars, { yPercent: 0 });
      textEls.forEach(function (el) { gsap.set(el, { opacity: 1, y: 0 }); });
      if (subheading) gsap.set(subheading, { opacity: 1, y: 0 });
      if (subText)    gsap.set(subText,    { opacity: 1, y: 0 });
      steps.forEach(function (el) { gsap.set(el, { opacity: 1, y: 0 }); });
      if (ctaBtn)     gsap.set(ctaBtn,     { opacity: 1, y: 0 });
      if (card)       gsap.set(card,       { clipPath: 'inset(0% 0% 0% 0%)' });
      if (hLine)      gsap.set(hLine,      { scaleX: 1 });
      if (vLine)      gsap.set(vLine,      { scaleY: 1 });
    }, fallbackDelay);

    // ── Intersection trigger ─────────────────────────────────
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.unobserve(section);
      animPlayed = true;
      clearTimeout(fallbackTimer);

      var tl = gsap.timeline();

      // 1. Lines — desktop only, from intersection outward
      if (isDesktop) {
        if (hLine) tl.to(hLine, { scaleX: 1, duration: 1.2, ease: 'power3.inOut' }, 0);
        if (vLine) tl.to(vLine, { scaleY: 1, duration: 1.2, ease: 'power3.inOut' }, 0);
      }

      // 2. Card clip-path — top-down curtain reveal
      if (card) {
        tl.to(card, {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.0,
          ease: 'power3.inOut'
        }, isDesktop ? 0.5 : 0);
      }

      // 3. Heading — char by char slide up
      if (headingChars.length) {
        tl.to(headingChars, {
          yPercent: 0,
          duration: 1.1,
          ease: 'power4.out',
          stagger: { each: 0.04, from: 'start' }
        }, isDesktop ? 1.0 : 0.4);
      }

      // 4. Text paragraphs — staggered fade + rise
      if (textEls.length) {
        tl.to(textEls, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger: { each: 0.15 }
        }, isDesktop ? 1.3 : 0.7);
      }

      // 5. Subheading label
      if (subheading) {
        tl.to(subheading, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, isDesktop ? 1.8 : 1.0);
      }

      // 6. Sub-text
      if (subText) {
        tl.to(subText, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, isDesktop ? 2.1 : 1.3);
      }

      // 7. Steps — staggered left to right
      if (steps.length) {
        tl.to(steps, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: { each: 0.15 }
        }, isDesktop ? 1.8 : 1.0);
      }

      // 8. CTA button
      if (ctaBtn) {
        tl.to(ctaBtn, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, isDesktop ? 2.5 : 1.6);
      }
    }, { threshold: 0 });

    io.observe(section);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCommunity);
  } else {
    initCommunity();
  }
}());
