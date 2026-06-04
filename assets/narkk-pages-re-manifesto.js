(function () {
  'use strict';

  function initReManifesto() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    var section = document.querySelector('[data-narkk-re-manifesto]');
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);

    // Skip pin scroll in theme editor — conflicts with preview iframe
    if (typeof Shopify !== 'undefined' && Shopify.designMode) return;

    // Bridge Lenis with ScrollTrigger so scrub stays in sync
    if (window.__narkkLenis) {
      window.__narkkLenis.on('scroll', ScrollTrigger.update);
    }

    var mm = gsap.matchMedia();

    mm.add('(min-width: 1025px)', function () {
      var right = section.querySelector('[data-manifesto-right]');
      var track = section.querySelector('[data-manifesto-track]');
      if (!right || !track) return;

      // startX: push the track slightly right on enter so the first card
      // peeks in from the right edge, hinting there's more to scroll through.
      // Using function-based values so they're recalculated on invalidateOnRefresh.
      var anim = gsap.fromTo(
        track,
        {
          x: function () { return right.offsetWidth * 0.12; }
        },
        {
          x: function () { return -(track.scrollWidth - right.offsetWidth); },
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: function () {
              var startX = right.offsetWidth * 0.12;
              var totalTravel = startX + (track.scrollWidth - right.offsetWidth);
              return '+=' + totalTravel;
            },
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          }
        }
      );

      // Cleanup when matchMedia condition no longer applies
      return function () {
        if (anim.scrollTrigger) anim.scrollTrigger.kill();
        anim.kill();
        gsap.set(track, { clearProps: 'x' });
      };
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReManifesto);
  } else {
    initReManifesto();
  }
}());
