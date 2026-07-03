(function () {
  'use strict';

  function initWhatYouGet() {
    if (typeof gsap === 'undefined' || !window.narkkSplit) return;

    var section = document.querySelector('[data-narkk-what-you-get]');
    if (!section) return;

    var heading = section.querySelector('[data-wyg-heading]');
    var cards   = Array.prototype.slice.call(section.querySelectorAll('[data-wyg-card]'));

    // ── Section heading — char split reveal ──────────────────
    var headingChars = heading ? window.narkkSplit.chars(heading) : [];
    if (headingChars.length) {
      gsap.set(headingChars, { yPercent: 110 });

      var headingIO = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        headingIO.unobserve(heading);
        gsap.to(headingChars, {
          yPercent: 0,
          duration: 1.1,
          ease: 'power4.out',
          stagger: { each: 0.03, from: 'start' }
        });
      }, { threshold: 0.3 });

      headingIO.observe(heading);
    }

    // ── Per-card clip-path reveal ─────────────────────────────
    // Even index: clip starts at top (inset from top = 100%), reveals top→bottom
    // Odd index:  clip starts at bottom (inset from bottom = 100%), reveals bottom→top
    cards.forEach(function (card, i) {
      var startClip = i % 2 === 0 ? 'inset(100% 0 0 0)' : 'inset(0 0 100% 0)';
      gsap.set(card, { clipPath: startClip });

      var io = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        io.unobserve(card);
        gsap.to(card, {
          clipPath: 'inset(0% 0 0% 0)',
          duration: 1.0,
          ease: 'power3.inOut'
        });
      }, { threshold: 0 });

      io.observe(card);
    });
  }

  // ── Plus button reveal — hover on desktop, tap to toggle on touch ──
  function initPlusReveal(root) {
    var scope   = root || document;
    var isFine  = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var buttons = Array.prototype.slice.call(scope.querySelectorAll('[data-wyg-plus-btn]'));

    function setRevealed(card, btn, revealed) {
      card.classList.toggle('is-revealed', revealed);
      btn.setAttribute('aria-expanded', revealed ? 'true' : 'false');
    }

    buttons.forEach(function (btn) {
      var card = btn.closest('[data-wyg-card]');
      if (!card) return;

      if (isFine) {
        btn.addEventListener('mouseenter', function () { setRevealed(card, btn, true); });
        btn.addEventListener('mouseleave', function () { setRevealed(card, btn, false); });
        btn.addEventListener('focus', function () { setRevealed(card, btn, true); });
        btn.addEventListener('blur', function () { setRevealed(card, btn, false); });
      } else {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          var willReveal = !card.classList.contains('is-revealed');

          buttons.forEach(function (otherBtn) {
            if (otherBtn === btn) return;
            var otherCard = otherBtn.closest('[data-wyg-card]');
            if (otherCard) setRevealed(otherCard, otherBtn, false);
          });

          setRevealed(card, btn, willReveal);
        });
      }
    });

    if (!isFine) {
      document.addEventListener('click', function (e) {
        buttons.forEach(function (btn) {
          var card = btn.closest('[data-wyg-card]');
          if (card && !card.contains(e.target)) setRevealed(card, btn, false);
        });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWhatYouGet);
    document.addEventListener('DOMContentLoaded', function () { initPlusReveal(); });
  } else {
    initWhatYouGet();
    initPlusReveal();
  }

  document.addEventListener('shopify:section:load', function (e) {
    if (e.target.querySelector('[data-narkk-what-you-get]')) {
      initWhatYouGet();
      initPlusReveal(e.target);
    }
  });
}());
