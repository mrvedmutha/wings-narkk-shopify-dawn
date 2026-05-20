(function () {
  'use strict';

  function initHover(cardCols) {
    var BOTTOM_PX     = 24; // matches CSS bottom: 2.4rem (1rem = 10px)
    var TARGET_TOP_PX = 40; // px from card top the label travels to (Figma: top: 40.1px)

    cardCols.forEach(function (col) {
      var card  = col.querySelector('.narkk-collections__card');
      var label = col.querySelector('.narkk-collections__card-label');
      var cta   = col.querySelector('.narkk-collections__card-cta');
      var img   = col.querySelector('.narkk-collections__card-img');

      if (!card || !label) return;

      var delta = null;
      if (cta) gsap.set(cta, { opacity: 0, y: 10, pointerEvents: 'none' });

      col.addEventListener('mouseenter', function () {
        // Calculate once: distance from natural bottom position to TARGET_TOP_PX
        if (delta === null) {
          var naturalTop = card.offsetHeight - BOTTOM_PX - label.offsetHeight;
          delta = -(naturalTop - TARGET_TOP_PX);
        }

        gsap.to(label, { y: delta,   duration: 0.45, ease: 'power2.out', overwrite: true });
        if (cta) gsap.to(cta, { opacity: 1, y: 0,   pointerEvents: 'auto', duration: 0.35, ease: 'power2.out', delay: 0.1, overwrite: true });
        if (img) gsap.to(img, { scale: 1.05,         duration: 0.5,  ease: 'power2.out', overwrite: true });
      });

      col.addEventListener('mouseleave', function () {
        gsap.to(label, { y: 0,       duration: 0.4, ease: 'power2.out', overwrite: true });
        if (cta) gsap.to(cta, { opacity: 0, y: 10, pointerEvents: 'none', duration: 0.3, ease: 'power2.out', overwrite: true });
        if (img) gsap.to(img, { scale: 1,            duration: 0.5,  ease: 'power2.out', overwrite: true });
      });
    });
  }

  function init() {
    if (typeof gsap === 'undefined' || !window.narkkSplit) return;

    var section = document.querySelector('[data-narkk-collections]');
    if (!section) return;

    var isDesktop = window.matchMedia('(width > 1024px)').matches;
    var isMobile  = window.matchMedia('(width < 768px)').matches;

    // ── Body text: word-split reveal ─────────────────────────
    var bodyEl    = section.querySelector('.narkk-collections__body');
    var bodyWords = bodyEl ? window.narkkSplit.words(bodyEl) : [];
    if (bodyWords.length) gsap.set(bodyWords, { yPercent: 110 });

    // ── Mobile: body reveal only, no curtain or hover ─────────
    if (isMobile) {
      if (!bodyWords.length) return;
      var mobIo = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        mobIo.unobserve(section);
        gsap.to(bodyWords, {
          yPercent: 0,
          duration: 0.9,
          ease: 'power4.out',
          stagger: { each: 0.05 }
        });
      }, { threshold: 0.1 });
      mobIo.observe(section);
      return;
    }

    // ── Curtain reveal: tablet + desktop ─────────────────────
    var cards    = Array.prototype.slice.call(section.querySelectorAll('.narkk-collections__card'));
    var cardCols = Array.prototype.slice.call(section.querySelectorAll('.narkk-collections__card-col'));

    // Confirm initial states set by CSS so GSAP owns the property
    cards.forEach(function (card, i) {
      gsap.set(card, { clipPath: i % 2 === 1 ? 'inset(0 0 100% 0)' : 'inset(100% 0 0 0)' });
    });

    var cardsEl = section.querySelector('.narkk-collections__cards');

    var revealIo = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      revealIo.unobserve(cardsEl);

      var tl = gsap.timeline({
        onComplete: function () {
          if (isDesktop) initHover(cardCols);
        }
      });

      // Cards: staggered curtain
      cards.forEach(function (card, i) {
        tl.to(card, {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.0,
          ease: 'power3.inOut'
        }, i * 0.15);
      });

      // Body words: start mid-way through card reveals
      if (bodyWords.length) {
        tl.to(bodyWords, {
          yPercent: 0,
          duration: 0.9,
          ease: 'power4.out',
          stagger: { each: 0.06 }
        }, 0.6);
      }
    }, { threshold: 0.2 });

    revealIo.observe(cardsEl);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
