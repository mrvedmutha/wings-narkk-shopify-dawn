(function () {
  'use strict';

  if (window.__narkkLenisInit) return;
  window.__narkkLenisInit = true;

  // Skip in Shopify theme editor — smooth scroll conflicts with preview iframe
  if (typeof Shopify !== 'undefined' && Shopify.designMode) return;

  // TODO: Remove console logs before going live
  // Skip on product pages — gallery scroll-snap conflicts with Lenis inertia
  if (window.location.pathname.indexOf('/products/') !== -1) {
    console.log('[Narkk Lenis] Skipped — product page detected:', window.location.pathname);
    return;
  }

  if (typeof Lenis === 'undefined') return;

  var lenis = new Lenis({
    duration: 1.8,
    smoothWheel: true,
    autoRaf: true,
    prevent: function (node) {
      return node.hasAttribute('data-lenis-prevent');
    },
  });

  // Expose globally so other scripts (e.g. future ScrollTrigger) can access it
  window.__narkkLenis = lenis;
}());
