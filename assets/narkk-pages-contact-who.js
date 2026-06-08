(function () {
  'use strict';

  function initContactWho() {
    if (typeof gsap === 'undefined' || !window.narkkSplit) return;

    var section = document.querySelector('[data-narkk-pcw]');
    if (!section) return;

    var blocks = section.querySelectorAll('[data-pcw-block]');
    if (!blocks.length) return;

    blocks.forEach(function (block) {
      var index     = parseInt(block.getAttribute('data-pcw-block'), 10) || 0;
      var baseDelay = index * 0.15;

      // ── Heading — word split reveal ─────────────────────────
      var headingEl = block.querySelector('[data-pcw-heading]');

      if (headingEl) {
        var words = window.narkkSplit.words(headingEl);

        if (words.length) {
          gsap.set(words, { yPercent: 110 });
          headingEl.style.visibility = 'visible';

          var headingIo = new IntersectionObserver(function (entries) {
            if (!entries[0].isIntersecting) return;
            headingIo.disconnect();

            gsap.to(words, {
              yPercent: 0,
              duration: 1.0,
              ease: 'power4.out',
              delay: baseDelay,
              stagger: { each: 0.07, from: 'start' }
            });
          }, { threshold: 0.2 });

          headingIo.observe(headingEl);
        }
      }

      // ── Icon, body, button — staggered fade rise ────────────
      var iconEl  = block.querySelector('[data-pcw-icon]');
      var bodyEl  = block.querySelector('[data-pcw-body]');
      var btnEl   = block.querySelector('[data-pcw-btn]');
      var fadeEls = [iconEl, bodyEl, btnEl].filter(Boolean);

      if (fadeEls.length) {
        gsap.set(fadeEls, { opacity: 0, y: 20 });

        var fadeIo = new IntersectionObserver(function (entries) {
          if (!entries[0].isIntersecting) return;
          fadeIo.disconnect();

          gsap.to(fadeEls, {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: 'power2.out',
            delay: baseDelay,
            stagger: { each: 0.1 }
          });
        }, { threshold: 0.15 });

        fadeIo.observe(block);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactWho);
  } else {
    initContactWho();
  }
}());
