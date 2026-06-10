(function () {
  'use strict';

  const MOBILE_BP = 849;

  /* ── DOM refs ──────────────────────────────────────────────── */
  const pdp            = document.querySelector('[data-narkk-pdp]');
  if (!pdp) return;

  const galleryImages  = pdp.querySelector('[data-narkk-pdp-images]');
  const thumbsWrap     = pdp.querySelector('[data-narkk-pdp-thumbs]');
  const thumbBtns      = pdp.querySelectorAll('[data-narkk-pdp-thumb]');
  const lightboxModal  = document.querySelector('[data-narkk-pdp-lightbox]');
  const lightboxImg    = lightboxModal && lightboxModal.querySelector('[data-narkk-pdp-lightbox-img]');
  const lightboxBg     = lightboxModal && lightboxModal.querySelector('[data-narkk-pdp-lightbox-bg]');
  const lightboxClose  = lightboxModal && lightboxModal.querySelector('[data-narkk-pdp-lightbox-close]');
  const lightboxTriggers = pdp.querySelectorAll('[data-narkk-pdp-lightbox-open]');
  const accordions     = pdp.querySelectorAll('[data-narkk-pdp-accordion]');
  const qtyWrap        = pdp.querySelector('[data-narkk-pdp-qty]');

  /* ── Helpers ───────────────────────────────────────────────── */
  function isMobile() {
    return window.innerWidth <= MOBILE_BP;
  }

  /* ============================================================
     GALLERY — scroll-snap image switching
     ============================================================ */

  if (galleryImages) {
    /* Sync active thumbnail on scroll */
    var syncThumbs = debounce(function () {
      var scrollPos   = isMobile() ? galleryImages.scrollLeft : galleryImages.scrollTop;
      var slideSize   = isMobile() ? galleryImages.clientWidth : galleryImages.clientHeight;
      var activeIndex = Math.round(scrollPos / slideSize);
      setActiveThumb(activeIndex);
    }, 50);

    galleryImages.addEventListener('scroll', syncThumbs, { passive: true });
  }

  /* ── Thumbnail clicks ──────────────────────────────────────── */
  if (thumbBtns.length) {
    thumbBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var index = parseInt(btn.dataset.narkkPdpThumb, 10);
        scrollToSlide(index);
        setActiveThumb(index);
      });
    });
  }

  function scrollToSlide(index) {
    if (!galleryImages) return;
    if (isMobile()) {
      galleryImages.scrollTo({ left: index * galleryImages.clientWidth, behavior: 'smooth' });
    } else {
      galleryImages.scrollTo({ top: index * galleryImages.clientHeight, behavior: 'smooth' });
    }
  }

  function setActiveThumb(index) {
    if (!thumbBtns.length) return;
    thumbBtns.forEach(function (btn, i) {
      btn.classList.toggle('is-active', i === index);
    });
    var activeBtn = thumbBtns[index];
    if (activeBtn && thumbsWrap) {
      /* Scroll only within the thumbs strip — never propagate to the page.
         scrollIntoView bubbles up and causes page scroll when sticky hasn't kicked in. */
      var btnLeft  = activeBtn.offsetLeft;
      var btnRight = btnLeft + activeBtn.offsetWidth;
      var stripLeft  = thumbsWrap.scrollLeft;
      var stripRight = stripLeft + thumbsWrap.clientWidth;
      if (btnLeft < stripLeft) {
        thumbsWrap.scrollTo({ left: btnLeft, behavior: 'smooth' });
      } else if (btnRight > stripRight) {
        thumbsWrap.scrollTo({ left: btnRight - thumbsWrap.clientWidth, behavior: 'smooth' });
      }
    }
  }

  /* ============================================================
     ACCORDIONS
     ============================================================ */

  function initAccordions() {
    var mobile = isMobile();
    accordions.forEach(function (acc) {
      var btn = acc.querySelector('[data-narkk-pdp-accordion-btn]');
      if (!btn) return;

      if (mobile) {
        acc.classList.remove('is-open');
        acc.classList.add('mobile-collapsed');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        btn.setAttribute('aria-expanded', String(acc.classList.contains('is-open')));
      }
    });
  }

  accordions.forEach(function (acc) {
    var btn = acc.querySelector('[data-narkk-pdp-accordion-btn]');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var isOpen = acc.classList.contains('is-open');
      if (isOpen) {
        acc.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        acc.classList.add('is-open');
        acc.classList.remove('mobile-collapsed');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ============================================================
     QUANTITY STEPPER
     ============================================================ */

  if (qtyWrap) {
    var qtyInput = qtyWrap.querySelector('[data-narkk-pdp-qty-input]');
    var qtyPlus  = qtyWrap.querySelector('[data-narkk-pdp-qty-plus]');
    var qtyMinus = qtyWrap.querySelector('[data-narkk-pdp-qty-minus]');

    if (qtyPlus && qtyInput) {
      qtyPlus.addEventListener('click', function () {
        var current = parseInt(qtyInput.value, 10) || 1;
        qtyInput.value = current + 1;
        qtyInput.dispatchEvent(new Event('change', { bubbles: true }));
      });
    }

    if (qtyMinus && qtyInput) {
      qtyMinus.addEventListener('click', function () {
        var current = parseInt(qtyInput.value, 10) || 1;
        if (current > 1) {
          qtyInput.value = current - 1;
          qtyInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    }
  }

  /* ============================================================
     LIGHTBOX
     ============================================================ */

  var lastTrigger = null;

  function openLightbox(src, alt) {
    if (!lightboxModal || !lightboxImg) return;

    lightboxImg.src = '';
    lightboxImg.alt = alt || '';
    lightboxImg.classList.add('is-loading');

    lightboxModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    if (lightboxClose) lightboxClose.focus();

    var tempImg = new Image();
    tempImg.onload = function () {
      lightboxImg.src = src;
      lightboxImg.classList.remove('is-loading');
    };
    tempImg.onerror = function () {
      lightboxImg.src = src;
      lightboxImg.classList.remove('is-loading');
    };
    tempImg.src = src;
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    if (lastTrigger) lastTrigger.focus();
    lastTrigger = null;
  }

  lightboxTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      lastTrigger = trigger;
      openLightbox(trigger.dataset.src, trigger.dataset.alt);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBg)    lightboxBg.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightboxModal && !lightboxModal.hasAttribute('hidden')) {
      closeLightbox();
    }
  });

  /* ============================================================
     RESIZE HANDLING
     ============================================================ */

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initAccordions, 200);
  });

  /* ── Init ──────────────────────────────────────────────────── */
  initAccordions();

  /* ── Utilities ─────────────────────────────────────────────── */
  function debounce(fn, wait) {
    var t;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, wait);
    };
  }

}());
