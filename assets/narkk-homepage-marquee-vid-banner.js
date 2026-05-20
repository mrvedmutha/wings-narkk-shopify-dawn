(function () {
  'use strict';

  function initMarqueeBanner(section) {
    var wrap  = section.querySelector('.narkk-marquee-banner__marquee-wrap');
    var track = section.querySelector('.narkk-marquee-banner__track');
    if (!wrap || !track) return;

    function startMarquee() {
      track.classList.add('is-running');
    }

    if (window.narkkSplit && typeof gsap !== 'undefined') {
      window.narkkSplit.fadeRise(wrap);

      var io = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        io.unobserve(section);
        gsap.to(wrap, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          delay: 0.15,
          onComplete: startMarquee
        });
      }, { threshold: 0.15 });

      io.observe(section);
    } else {
      /* GSAP unavailable — start marquee immediately */
      startMarquee();
    }
  }

  function init() {
    document.querySelectorAll('[data-narkk-marquee-banner]').forEach(initMarqueeBanner);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
