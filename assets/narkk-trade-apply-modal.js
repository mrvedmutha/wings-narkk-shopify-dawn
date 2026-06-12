(function () {
  'use strict';

  var modal   = document.getElementById('narkk-tam');
  var overlay = document.getElementById('narkk-tam-overlay');

  if (!modal || !overlay) return;

  var savedScrollY = 0;

  /* ── Scroll lock ────────────────────────────────────────────────
     overflow:hidden on BOTH html and body covers every browser's
     root scroll context without altering layout (no position:fixed
     flash on close).
  ──────────────────────────────────────────────────────────────── */

  function lockScroll() {
    savedScrollY = window.scrollY || window.pageYOffset;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow            = 'hidden';
    if (window.__narkkLenis) window.__narkkLenis.stop();
  }

  function unlockScroll() {
    document.documentElement.style.overflow = '';
    document.body.style.overflow            = '';
    window.scrollTo(0, savedScrollY);
    if (window.__narkkLenis) window.__narkkLenis.start();
  }

  /* ── Wheel containment ──────────────────────────────────────────
     Catches macOS momentum events that bypass overflow:hidden and
     routes them to the modal scroll area instead of the page.
  ──────────────────────────────────────────────────────────────── */

  function getScrollEl() {
    var right = modal.querySelector('.narkk-tam__right');
    var panel = modal.querySelector('.narkk-tam__panel');
    if (right && window.getComputedStyle(right).overflowY === 'auto') return right;
    if (panel && window.getComputedStyle(panel).overflowY === 'auto') return panel;
    return null;
  }

  window.addEventListener('wheel', function (e) {
    if (!modal.classList.contains('is-open')) return;
    e.preventDefault();
    var scrollEl = getScrollEl();
    if (scrollEl) scrollEl.scrollTop += e.deltaY;
  }, { passive: false });

  window.addEventListener('touchmove', function (e) {
    if (!modal.classList.contains('is-open')) return;
    var scrollEl = getScrollEl();
    if (!scrollEl) { e.preventDefault(); return; }
    var inScroll = scrollEl === e.target || scrollEl.contains(e.target);
    if (!inScroll) e.preventDefault();
  }, { passive: false });

  /* ── Open / close ───────────────────────────────────────────── */

  function openModal() {
    lockScroll();
    modal.classList.add('is-open');
    overlay.classList.add('is-open');
    modal.removeAttribute('aria-hidden');
    overlay.removeAttribute('aria-hidden');
    var firstInput = modal.querySelector('input, textarea, button');
    if (firstInput) firstInput.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    overlay.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-hidden', 'true');
    unlockScroll();
  }

  /* Triggers — any [data-trade-modal-open] on the page */
  document.querySelectorAll('[data-trade-modal-open]').forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      openModal();
    });
  });

  var closeBtn = modal.querySelector('[data-tam-close]');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}());
