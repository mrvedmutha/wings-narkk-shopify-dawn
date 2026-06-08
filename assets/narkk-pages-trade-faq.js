(function () {
  'use strict';

  function initTradeFaq() {
    if (typeof gsap === 'undefined' || !window.narkkSplit) return;

    var section = document.querySelector('[data-narkk-trade-faq]');
    if (!section) return;

    // ── Heading word-split reveal ─────────────────────────────
    var headingEl = section.querySelector('[data-tfaq-heading]');

    if (headingEl) {
      var headingWords = window.narkkSplit.words(headingEl);

      if (headingWords.length) {
        gsap.set(headingWords, { yPercent: 110 });
        headingEl.style.visibility = 'visible';

        var headingIo = new IntersectionObserver(function (entries) {
          if (!entries[0].isIntersecting) return;
          headingIo.disconnect();

          gsap.to(headingWords, {
            yPercent: 0,
            duration: 1.1,
            ease: 'power4.out',
            stagger: { each: 0.08, from: 'start' }
          });
        }, { threshold: 0.2 });

        headingIo.observe(headingEl);
      }
    }

    // ── Accordion items ───────────────────────────────────────
    var items = section.querySelectorAll('[data-tfaq-item]');
    if (!items.length) return;

    var currentOpen = items[0];

    items.forEach(function (item, i) {
      var panel = item.querySelector('[data-tfaq-panel]');

      // First item starts open, rest start collapsed
      if (i === 0) {
        gsap.set(panel, { height: 'auto' });
      } else {
        gsap.set(panel, { height: 0 });
      }

      // Scroll reveal for each item
      gsap.set(item, { opacity: 0, y: 20 });

      var io = new IntersectionObserver(function (ioEntries) {
        if (!ioEntries[0].isIntersecting) return;
        io.unobserve(item);

        gsap.to(item, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        });
      }, { threshold: 0.1 });

      io.observe(item);
    });

    // ── Click handler ─────────────────────────────────────────
    items.forEach(function (item) {
      var trigger = item.querySelector('[data-tfaq-trigger]');
      if (!trigger) return;

      trigger.addEventListener('click', function () {
        if (item === currentOpen) {
          // Toggle: close the open item
          closeItem(item);
          currentOpen = null;
        } else {
          // Close previous, open new
          if (currentOpen) closeItem(currentOpen);
          openItem(item);
          currentOpen = item;
        }
      });
    });
  }

  function openItem(item) {
    item.classList.add('is-open');

    var trigger = item.querySelector('[data-tfaq-trigger]');
    var panel   = item.querySelector('[data-tfaq-panel]');
    var answer  = panel ? panel.querySelector('[data-tfaq-answer]') : null;

    if (trigger) trigger.setAttribute('aria-expanded', 'true');

    if (panel) {
      gsap.killTweensOf(panel);

      // Measure natural height before animating
      gsap.set(panel, { height: 'auto' });
      var naturalHeight = panel.offsetHeight;
      gsap.set(panel, { height: 0 });

      gsap.to(panel, {
        height: naturalHeight,
        duration: 0.5,
        ease: 'power3.inOut',
        onComplete: function () {
          gsap.set(panel, { height: 'auto' });
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

  function closeItem(item) {
    item.classList.remove('is-open');

    var trigger = item.querySelector('[data-tfaq-trigger]');
    var panel   = item.querySelector('[data-tfaq-panel]');
    var answer  = panel ? panel.querySelector('[data-tfaq-answer]') : null;

    if (trigger) trigger.setAttribute('aria-expanded', 'false');

    if (answer) {
      gsap.killTweensOf(answer);
      gsap.set(answer, { opacity: 1, y: 0 });
    }

    if (panel) {
      gsap.killTweensOf(panel);
      gsap.to(panel, {
        height: 0,
        duration: 0.4,
        ease: 'power3.inOut'
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTradeFaq);
  } else {
    initTradeFaq();
  }
}());
