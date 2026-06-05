(function () {
  'use strict';

  function initBlogGrid(section) {
    var moreRow     = section.querySelector('[data-narkk-blog-more]');
    var loadMoreBtn = section.querySelector('[data-narkk-blog-load-more]');
    var ctaWrap     = section.querySelector('[data-narkk-blog-cta]');

    // ── Load more (progressive reveal) ──────────────────────────────────────
    if (loadMoreBtn && moreRow) {
      function hiddenCards() {
        return Array.from(moreRow.querySelectorAll('.narkk-blog-grid__card--hidden'));
      }

      function syncCta() {
        if (ctaWrap && hiddenCards().length === 0) {
          ctaWrap.style.display = 'none';
        }
      }

      syncCta();

      loadMoreBtn.addEventListener('click', function () {
        var toShow = hiddenCards().slice(0, 4);

        toShow.forEach(function (card, i) {
          card.classList.remove('narkk-blog-grid__card--hidden');

          if (typeof gsap !== 'undefined') {
            gsap.fromTo(
              card,
              { opacity: 0, y: 28 },
              { opacity: 1, y: 0, duration: 0.55, delay: i * 0.08, ease: 'power3.out' }
            );
          }
        });

        syncCta();
      });
    }

    // ── Card reveal on scroll ────────────────────────────────────────────────
    if (typeof gsap === 'undefined' || typeof IntersectionObserver === 'undefined') return;

    var cards = Array.from(section.querySelectorAll('[data-narkk-blog-card]')).filter(function (c) {
      return !c.classList.contains('narkk-blog-grid__card--hidden');
    });

    cards.forEach(function (card, i) {
      gsap.set(card, { opacity: 0, y: 28 });

      var io = new IntersectionObserver(
        function (entries) {
          if (!entries[0].isIntersecting) return;
          io.unobserve(card);
          gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.65,
            delay: (i % 4) * 0.1,
            ease: 'power3.out'
          });
        },
        { threshold: 0.1 }
      );

      io.observe(card);
    });
  }

  function init() {
    document.querySelectorAll('[data-narkk-blog-grid]').forEach(initBlogGrid);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
