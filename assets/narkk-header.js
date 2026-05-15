(function () {
  'use strict';

  // ── GSAP hover animations ─────────────────────────────────────
  // Only runs on true pointer devices — zero interaction on touch.
  function initHoverAnimations() {
    var isPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isPointer || typeof gsap === 'undefined') return;

    var items = document.querySelectorAll('.narkk-nav-item');

    items.forEach(function (item) {
      var fill = item.querySelector('.narkk-nav-fill');
      if (!fill) return;

      gsap.set(fill, { yPercent: 100 });

      item.addEventListener('mouseenter', function () {
        gsap.to(fill, { yPercent: 0, duration: 0.38, ease: 'power2.out' });
      });

      item.addEventListener('mouseleave', function () {
        gsap.to(fill, { yPercent: 100, duration: 0.28, ease: 'power2.in' });
      });
    });
  }

  // ── Mobile drawer ─────────────────────────────────────────────
  function initDrawer() {
    var hamburgerBtn = document.getElementById('narkk-hamburger-btn');
    var drawer       = document.getElementById('narkk-drawer');
    var drawerClose  = document.getElementById('narkk-drawer-close');
    var overlay      = document.getElementById('narkk-overlay');

    if (!drawer) return;

    function openDrawer() {
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      overlay.classList.add('is-visible');
      overlay.setAttribute('aria-hidden', 'false');
      if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      overlay.classList.remove('is-visible');
      overlay.setAttribute('aria-hidden', 'true');
      if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', openDrawer);
    if (drawerClose)  drawerClose.addEventListener('click', closeDrawer);
    if (overlay)      overlay.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        closeDrawer();
      }
    });
  }

  // ── Cart count — hooks into Dawn's pubsub ─────────────────────
  function initCartCount() {
    if (typeof subscribe === 'undefined' || typeof PUB_SUB_EVENTS === 'undefined') return;

    subscribe(PUB_SUB_EVENTS.cartUpdate, function (event) {
      var count = event && event.cart ? event.cart.item_count : null;
      if (count === null) return;
      document.querySelectorAll('[data-cart-count]').forEach(function (el) {
        el.textContent = count;
      });
    });
  }

  // ── Boot ──────────────────────────────────────────────────────
  // Both gsap.min.js and this file are deferred in document order,
  // so GSAP is guaranteed to be available when this runs.
  document.addEventListener('DOMContentLoaded', function () {
    initHoverAnimations();
    initDrawer();
    initCartCount();
  });
}());
