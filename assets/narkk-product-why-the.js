(function () {
  'use strict';

  function initWhyThe() {
    if (typeof gsap === 'undefined') return;

    var section = document.querySelector('[data-narkk-why-the]');
    if (!section) return;

    // ── Parse embedded item data from Liquid ─────────────────────────────
    var items = [];
    try { items = JSON.parse(section.getAttribute('data-why-items') || '[]'); } catch (e) {}

    if (!items.length) return;

    var thumbs    = Array.from(section.querySelectorAll('[data-why-thumb]'));
    var heroCol   = section.querySelector('[data-why-hero]');
    var headingEl = section.querySelector('[data-why-heading]');
    var copyEl    = section.querySelector('[data-why-copy]');
    var eyebrowEl = section.querySelector('[data-why-eyebrow]');

    var activeIndex = 0;
    var isAnimating = false;
    var isMobile    = function () { return window.innerWidth <= 849; };

    // ── Entry animation (scroll reveal) ──────────────────────────────────
    if (window.narkkSplit) {
      var eyebrowChars = eyebrowEl ? window.narkkSplit.chars(eyebrowEl) : [];
      var headWords    = window.narkkSplit.words(headingEl);

      gsap.set(eyebrowChars, { yPercent: 110 });
      gsap.set(headWords, { yPercent: 110 });
      gsap.set(copyEl, { opacity: 0, y: 16 });
      gsap.set(heroCol, { clipPath: 'inset(0% 100% 0% 0%)' });
      gsap.set(thumbs, { opacity: 0, y: 10 });

      var revealIO = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        revealIO.unobserve(section);

        var tl = gsap.timeline();
        tl.to(heroCol, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.0, ease: 'power3.inOut' }, 0);
        if (eyebrowChars.length) {
          tl.to(eyebrowChars, { yPercent: 0, duration: 0.8, ease: 'power3.out', stagger: 0.025 }, 0.15);
        }
        tl.to(headWords, { yPercent: 0, duration: 0.9, ease: 'power3.out', stagger: 0.055 }, 0.25);
        tl.to(copyEl, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.5);
        tl.to(thumbs, {
          opacity: function (i) { return i === 0 ? 1 : 0.5; },
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.08
        }, 0.3);
      }, { threshold: 0.1 });

      revealIO.observe(section);
    }

    // ── Switch item ───────────────────────────────────────────────────────
    function switchItem(newIndex) {
      if (newIndex === activeIndex || isAnimating) return;
      isAnimating = true;

      var prevIndex = activeIndex;
      var direction = newIndex > prevIndex ? 1 : -1;
      activeIndex   = newIndex;

      // Update thumb active states + opacity
      thumbs.forEach(function (btn, i) {
        btn.classList.toggle('is-active', i === newIndex);
      });
      gsap.to(thumbs, { opacity: 0.5, duration: 0.25 });
      gsap.to(thumbs[newIndex], { opacity: 1, duration: 0.25 });

      if (isMobile()) {
        switchMobile(newIndex, direction);
      } else {
        switchDesktop(newIndex, direction);
      }
    }

    // Desktop: image clip-reveal + word reveal on text
    function switchDesktop(newIndex, direction) {
      var incoming        = document.createElement('img');
      incoming.src        = items[newIndex].image;
      incoming.alt        = items[newIndex].heading;
      incoming.className  = 'narkk-why-the__hero-img';
      incoming.style.mixBlendMode = 'normal';
      heroCol.appendChild(incoming);

      // Ascending (1→2): new image reveals top→bottom (clips from bottom away)
      // Descending (2→1): new image reveals bottom→top (clips from top away)
      var clipFrom = direction > 0 ? 'inset(0% 0% 100% 0%)' : 'inset(100% 0% 0% 0%)';
      var outgoing = heroCol.querySelector('[data-why-hero-img]');

      // Outgoing: subtle zoom out as it's replaced
      if (outgoing) {
        gsap.to(outgoing, { scale: 0.96, duration: 0.75, ease: 'power3.inOut' });
      }

      // Incoming: clip in + settle from slight zoom
      gsap.fromTo(incoming,
        { clipPath: clipFrom, scale: 1.06 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          scale: 1,
          duration: 0.75,
          ease: 'power3.inOut',
          onComplete: function () {
            if (outgoing) outgoing.remove();
            incoming.setAttribute('data-why-hero-img', '');
            incoming.style.mixBlendMode = '';
            isAnimating = false;
          }
        }
      );

      // Fade text out, update, word-reveal in
      gsap.to([headingEl, copyEl], {
        opacity: 0,
        y: direction > 0 ? -8 : 8,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: function () {
          headingEl.textContent = items[newIndex].heading;
          copyEl.textContent    = items[newIndex].text;

          if (window.narkkSplit) {
            var hWords = window.narkkSplit.words(headingEl);
            var cWords = window.narkkSplit.words(copyEl);
            gsap.set(hWords, { yPercent: 110 });
            gsap.set(cWords, { opacity: 0, y: 10 });
            gsap.set([headingEl, copyEl], { opacity: 1, y: 0 });
            gsap.to(hWords, { yPercent: 0, duration: 0.75, ease: 'power3.out', stagger: 0.05 });
            gsap.to(cWords, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.02, delay: 0.1 });
          } else {
            gsap.set([headingEl, copyEl], { opacity: 1, y: 0 });
          }
        }
      });
    }

    // Mobile: hero slides left/right, text uses same word-reveal as desktop
    function switchMobile(newIndex, direction) {
      var xExit  = direction > 0 ? '-60px' : '60px';
      var xEnter = direction > 0 ? '60px'  : '-60px';

      // Slide hero image out, swap src, slide back in
      gsap.to(heroCol, {
        x: xExit, opacity: 0,
        duration: 0.25, ease: 'power2.in',
        onComplete: function () {
          var heroImgEl = heroCol.querySelector('[data-why-hero-img]');
          if (heroImgEl) heroImgEl.src = items[newIndex].image;

          gsap.fromTo(heroCol,
            { x: xEnter, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.35, ease: 'power2.out',
              onComplete: function () { isAnimating = false; }
            }
          );
        }
      });

      // Text: same word-reveal as desktop
      gsap.to([headingEl, copyEl], {
        opacity: 0,
        y: direction > 0 ? -8 : 8,
        duration: 0.2, ease: 'power2.in',
        onComplete: function () {
          headingEl.textContent = items[newIndex].heading;
          copyEl.textContent    = items[newIndex].text;

          if (window.narkkSplit) {
            var hWords = window.narkkSplit.words(headingEl);
            var cWords = window.narkkSplit.words(copyEl);
            gsap.set(hWords, { yPercent: 110 });
            gsap.set(cWords, { opacity: 0, y: 10 });
            gsap.set([headingEl, copyEl], { opacity: 1, y: 0 });
            gsap.to(hWords, { yPercent: 0, duration: 0.75, ease: 'power3.out', stagger: 0.05 });
            gsap.to(cWords, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.02, delay: 0.1 });
          } else {
            gsap.set([headingEl, copyEl], { opacity: 1, y: 0 });
          }
        }
      });
    }

    // ── Thumb clicks ──────────────────────────────────────────────────────
    thumbs.forEach(function (thumb, i) {
      thumb.addEventListener('click', function () { switchItem(i); });
    });

    // ── Touch swipe (mobile) ──────────────────────────────────────────────
    var touchStartX = 0;
    section.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    section.addEventListener('touchend', function (e) {
      if (!isMobile()) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) < 40) return;
      if (dx < 0 && activeIndex < items.length - 1) switchItem(activeIndex + 1);
      if (dx > 0 && activeIndex > 0) switchItem(activeIndex - 1);
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWhyThe);
  } else {
    initWhyThe();
  }

  document.addEventListener('shopify:section:load', function (e) {
    if (e.target.querySelector('[data-narkk-why-the]')) initWhyThe();
  });
}());
