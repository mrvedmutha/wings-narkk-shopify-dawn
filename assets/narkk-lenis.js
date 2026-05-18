(function () {
  'use strict';

  if (window.__narkkLenisInit) return;
  window.__narkkLenisInit = true;

  // Skip in Shopify theme editor — smooth scroll conflicts with preview iframe
  if (typeof Shopify !== 'undefined' && Shopify.designMode) return;

  if (typeof Lenis === 'undefined') return;

  var lenis = new Lenis({
    duration: 1.2,
    smoothWheel: true,
    autoRaf: true,
  });

  // Expose globally so other scripts (e.g. future ScrollTrigger) can access it
  window.__narkkLenis = lenis;
}());
