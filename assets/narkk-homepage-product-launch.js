(function () {
  'use strict';

  function initLaunch() {
    if (typeof gsap === 'undefined' || !window.narkkSplit) return;

    var section = document.querySelector('[data-narkk-launch]');
    if (!section) return;

    var isDesktop = window.matchMedia('(min-width: 1025px)').matches;

    var divider  = section.querySelector('.narkk-launch__divider');
    var heading  = section.querySelector('.narkk-launch__heading');
    var body     = section.querySelector('.narkk-launch__body');
    var ctaBtn   = section.querySelector('.narkk-launch__cta .button');
    var slides   = Array.prototype.slice.call(section.querySelectorAll('.narkk-launch__slide'));

    // ── Text splitting ───────────────────────────────────────
    var headingWords = heading ? window.narkkSplit.words(heading) : [];

    // ── Initial states ───────────────────────────────────────
    if (isDesktop && divider) gsap.set(divider, { scaleX: 0 });
    if (headingWords.length)  gsap.set(headingWords, { yPercent: 110, skewX: -15 });
    if (body)   gsap.set(body,   { opacity: 0, y: 16 });
    if (ctaBtn) gsap.set(ctaBtn, { opacity: 0, y: 10 });

    // First slide visible, rest hidden
    slides.forEach(function (slide, i) {
      gsap.set(slide, { opacity: i === 0 ? 1 : 0 });
    });

    // ── Cycling ──────────────────────────────────────────────
    var currentSlide = 0;
    var cycleTimer   = null;

    function nextSlide() {
      if (slides.length < 2) return;
      var prev = currentSlide;
      currentSlide = (currentSlide + 1) % slides.length;

      slides[prev].classList.remove('is-active');
      slides[currentSlide].classList.add('is-active');

      gsap.to(slides[prev],         { opacity: 0, duration: 0.5, ease: 'power2.inOut' });
      gsap.to(slides[currentSlide], { opacity: 1, duration: 0.5, ease: 'power2.inOut', delay: 0.15 });
    }

    function startCycling() {
      if (slides.length < 2 || cycleTimer) return;
      cycleTimer = setInterval(nextSlide, 2200);
    }

    // ── Intersection trigger ─────────────────────────────────
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.unobserve(section);

      var tl = gsap.timeline({ onComplete: startCycling });

      // 1. Divider draws left → right first — the "split" moment (desktop only)
      if (isDesktop && divider) {
        tl.to(divider, { scaleX: 1, duration: 1.0, ease: 'power3.inOut' }, 0);
      }

      // 2. Heading — word by word with skew, starts after divider completes
      if (headingWords.length) {
        tl.to(headingWords, {
          yPercent: 0,
          skewX: 0,
          duration: 0.9,
          ease: 'power4.out',
          stagger: { each: 0.07, from: 'start' }
        }, isDesktop ? 1.0 : 0);
      }

      // 3. Body — fade + rise
      if (body) {
        tl.to(body, {
          opacity: 0.9,
          y: 0,
          duration: 0.7,
          ease: 'power2.out'
        }, isDesktop ? 1.6 : 0.5);
      }

      // 4. CTA — fade + rise (stays muted if the button has no link)
      if (ctaBtn) {
        var ctaTargetOpacity = ctaBtn.getAttribute('aria-disabled') === 'true' ? 0.5 : 1;
        tl.to(ctaBtn, {
          opacity: ctaTargetOpacity,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, isDesktop ? 2.1 : 0.9);
      }

    }, { threshold: 0.1 });

    io.observe(section);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLaunch);
  } else {
    initLaunch();
  }
}());
