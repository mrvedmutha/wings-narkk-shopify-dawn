(function () {
  'use strict';

  function initFaqBody() {
    if (typeof gsap === 'undefined') return;

    var section = document.querySelector('[data-narkk-faq-body]');
    if (!section) return;

    var nav        = section.querySelector('[data-faqb-nav]');
    var categories = section.querySelectorAll('[data-faqb-category]');

    if (!nav || !categories.length) return;

    // ── Build nav buttons from rendered panel data attributes ─
    // block.settings is not accessible via section.blocks for theme blocks,
    // so labels are read from data-faqb-cat-label set inside faq-category.liquid.
    categories.forEach(function (cat, i) {
      var id    = cat.getAttribute('data-faqb-category');
      var label = cat.getAttribute('data-faqb-cat-label') || '';

      var btn = document.createElement('button');
      btn.className   = 'narkk-faq-body__nav-item' + (i === 0 ? ' is-active' : '');
      btn.setAttribute('data-faqb-cat-btn', id);
      btn.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      btn.textContent = label;
      nav.appendChild(btn);
    });

    var navBtns = nav.querySelectorAll('[data-faqb-cat-btn]');

    // ── Init: collapse all accordion items ────────────────────
    section.querySelectorAll('[data-faqb-collapse]').forEach(function (el) {
      gsap.set(el, { height: 0 });
    });

    // ── Init: activate first category panel ──────────────────
    var firstCat = categories[0];
    if (firstCat) {
      firstCat.classList.add('is-active');
      revealItems(firstCat, false);
    }

    // ── Category switching ────────────────────────────────────
    navBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-faqb-cat-btn');
        if (btn.classList.contains('is-active')) return;

        navBtns.forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');

        categories.forEach(function (cat) {
          if (cat.classList.contains('is-active')) {
            var openItem = cat.querySelector('[data-faqb-item].is-open');
            if (openItem) closeItem(openItem, false);
            cat.classList.remove('is-active');
          }
        });

        var next = section.querySelector('[data-faqb-category="' + id + '"]');
        if (!next) return;

        next.classList.add('is-active');
        revealItems(next, true);
      });
    });

    // ── Accordion click handler ───────────────────────────────
    section.querySelectorAll('[data-faqb-item]').forEach(function (item) {
      var trigger = item.querySelector('[data-faqb-trigger]');
      if (!trigger) return;

      trigger.addEventListener('click', function () {
        var cat         = item.closest('[data-faqb-category]');
        var currentOpen = cat ? cat.querySelector('[data-faqb-item].is-open') : null;

        if (item.classList.contains('is-open')) {
          closeItem(item, true);
        } else {
          if (currentOpen && currentOpen !== item) closeItem(currentOpen, true);
          openItem(item);
        }
      });
    });
  }

  // ── Stagger items into view ───────────────────────────────
  function revealItems(category, animate) {
    var items = category.querySelectorAll('[data-faqb-item]');

    if (!animate) {
      items.forEach(function (item, i) {
        gsap.set(item, { opacity: 0, y: 16 });

        var io = new IntersectionObserver(function (entries) {
          if (!entries[0].isIntersecting) return;
          io.unobserve(item);

          gsap.to(item, {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power2.out',
            delay: i * 0.06
          });
        }, { threshold: 0.1 });

        io.observe(item);
      });
    } else {
      gsap.set(items, { opacity: 0, y: 12 });

      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: 'power2.out',
        stagger: 0.055
      });
    }
  }

  // ── Open accordion item ───────────────────────────────────
  function openItem(item) {
    item.classList.add('is-open');

    var trigger  = item.querySelector('[data-faqb-trigger]');
    var collapse = item.querySelector('[data-faqb-collapse]');
    var answer   = collapse ? collapse.querySelector('[data-faqb-answer]') : null;

    if (trigger) trigger.setAttribute('aria-expanded', 'true');

    if (collapse) {
      gsap.killTweensOf(collapse);
      gsap.set(collapse, { height: 'auto' });
      var naturalHeight = collapse.offsetHeight;
      gsap.set(collapse, { height: 0 });

      gsap.to(collapse, {
        height: naturalHeight,
        duration: 0.5,
        ease: 'power3.inOut',
        onComplete: function () {
          gsap.set(collapse, { height: 'auto' });
        }
      });
    }

    if (answer) {
      gsap.killTweensOf(answer);
      gsap.fromTo(
        answer,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', delay: 0.2 }
      );
    }
  }

  // ── Close accordion item ──────────────────────────────────
  function closeItem(item, animate) {
    item.classList.remove('is-open');

    var trigger  = item.querySelector('[data-faqb-trigger]');
    var collapse = item.querySelector('[data-faqb-collapse]');

    if (trigger) trigger.setAttribute('aria-expanded', 'false');

    if (collapse) {
      gsap.killTweensOf(collapse);

      if (animate) {
        gsap.to(collapse, { height: 0, duration: 0.4, ease: 'power3.inOut' });
      } else {
        gsap.set(collapse, { height: 0 });
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFaqBody);
  } else {
    initFaqBody();
  }
}());
