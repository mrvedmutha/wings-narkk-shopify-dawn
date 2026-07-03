(function () {
  'use strict';

  var modals = Array.prototype.slice.call(document.querySelectorAll('[data-tam-modal]'));
  if (!modals.length) return;

  var savedScrollY = 0;
  var activeModal  = null;

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
     routes them to whichever modal is currently open.
  ──────────────────────────────────────────────────────────────── */

  function getScrollEl(modal) {
    var right = modal.querySelector('.narkk-tam__right');
    var panel = modal.querySelector('.narkk-tam__panel');
    if (right && window.getComputedStyle(right).overflowY === 'auto') return right;
    if (panel && window.getComputedStyle(panel).overflowY === 'auto') return panel;
    return null;
  }

  window.addEventListener('wheel', function (e) {
    if (!activeModal) return;
    e.preventDefault();
    var scrollEl = getScrollEl(activeModal);
    if (scrollEl) scrollEl.scrollTop += e.deltaY;
  }, { passive: false });

  window.addEventListener('touchmove', function (e) {
    if (!activeModal) return;
    var scrollEl = getScrollEl(activeModal);
    if (!scrollEl) { e.preventDefault(); return; }
    var inScroll = scrollEl === e.target || scrollEl.contains(e.target);
    if (!inScroll) e.preventDefault();
  }, { passive: false });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && activeModal) closeActiveModal();
  });

  function closeActiveModal() {
    if (!activeModal) return;
    var handle  = activeModal.dataset.modalHandle;
    var overlay = document.querySelector('[data-tam-overlay][data-modal-handle="' + handle + '"]');
    activeModal.classList.remove('is-open');
    activeModal.setAttribute('aria-hidden', 'true');
    if (overlay) {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
    }
    activeModal = null;
    unlockScroll();
  }

  /* ── Wire up each modal instance by its handle ─────────────────── */
  modals.forEach(function (modal) {
    var handle  = modal.dataset.modalHandle;
    var overlay = document.querySelector('[data-tam-overlay][data-modal-handle="' + handle + '"]');
    if (!overlay) return;

    function openModal() {
      if (activeModal && activeModal !== modal) closeActiveModal();
      lockScroll();
      activeModal = modal;
      modal.classList.add('is-open');
      overlay.classList.add('is-open');
      modal.removeAttribute('aria-hidden');
      overlay.removeAttribute('aria-hidden');
      var firstInput = modal.querySelector('input, textarea, button');
      if (firstInput) firstInput.focus();
    }

    document.querySelectorAll('[data-trade-modal-open="' + handle + '"]').forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        openModal();
      });
    });

    var closeBtn = modal.querySelector('[data-tam-close]');
    if (closeBtn) closeBtn.addEventListener('click', closeActiveModal);
    overlay.addEventListener('click', closeActiveModal);
  });
}());
