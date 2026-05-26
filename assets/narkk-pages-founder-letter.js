(function () {
  'use strict';

  var THRESHOLD = 3;

  function initFounderLetter() {
    var section = document.querySelector('[data-narkk-founder-letter]');
    if (!section) return;

    // Read more runs regardless — button visibility must never depend on GSAP
    initReadMore(section);

    // Heading reveal needs GSAP + narkkSplit
    if (typeof gsap !== 'undefined' && window.narkkSplit) {
      initHeading(section);
    }
  }

  // ── Heading word reveal ────────────────────────────────────────────────────

  function initHeading(section) {
    var headingEl = section.querySelector('[data-founder-heading]');
    if (!headingEl) return;

    var words = window.narkkSplit.words(headingEl);
    if (!words.length) return;

    gsap.set(words, { yPercent: 110 });

    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.unobserve(headingEl);
      gsap.to(words, {
        yPercent: 0,
        duration: 1.1,
        ease: 'power4.out',
        stagger: { each: 0.07, from: 'start' }
      });
    }, { threshold: 0.5 });

    io.observe(headingEl);
  }

  // ── Read more / paragraph collapse ────────────────────────────────────────

  function initReadMore(section) {
    var textEl  = section.querySelector('[data-founder-text]');
    var moreBtn = section.querySelector('[data-founder-more]');
    if (!textEl || !moreBtn) return;

    // Normalize: if content is one <p> with <br><br> paragraph breaks, split it
    var paras = Array.from(textEl.querySelectorAll('p'));
    if (paras.length === 1) {
      var html = paras[0].innerHTML;
      var parts = html.split(/<br\s*\/?>\s*<br\s*\/?>/i);
      if (parts.length > 1) {
        paras[0].remove();
        parts.forEach(function (part) {
          var clean = part.replace(/^(<br\s*\/?>|\s)+|(<br\s*\/?>|\s)+$/gi, '');
          if (!clean) return;
          var p = document.createElement('p');
          p.innerHTML = clean;
          textEl.appendChild(p);
        });
      }
    }

    // Count non-empty direct block children
    var allBlocks = Array.from(textEl.children).filter(function (el) {
      return el.textContent.trim() !== '';
    });

    if (allBlocks.length <= THRESHOLD) return;

    // Wrap blocks beyond threshold in a hidden overflow div
    var overflow = document.createElement('div');
    overflow.className = 'narkk-founder-letter__overflow';

    for (var i = THRESHOLD; i < allBlocks.length; i++) {
      overflow.appendChild(allBlocks[i]);
    }
    textEl.appendChild(overflow); // CSS sets height: 0 and overflow: hidden

    // Add fade gradient to signal truncation
    textEl.classList.add('narkk-founder-letter__text--collapsed');

    // Show the button
    moreBtn.style.display = 'inline-flex';

    moreBtn.addEventListener('click', function () {
      moreBtn.setAttribute('aria-expanded', 'true');
      textEl.classList.remove('narkk-founder-letter__text--collapsed');

      if (typeof gsap !== 'undefined') {
        var fullH = overflow.scrollHeight;
        gsap.fromTo(overflow, { height: 0 }, {
          height: fullH,
          duration: 0.9,
          ease: 'power3.inOut',
          onComplete: function () {
            gsap.set(overflow, { height: 'auto', overflow: 'visible' });
          }
        });
        gsap.to(moreBtn, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out',
          onComplete: function () {
            moreBtn.style.display = 'none';
            gsap.set(moreBtn, { opacity: 1 });
          }
        });
      } else {
        overflow.style.height = 'auto';
        overflow.style.overflow = 'visible';
        moreBtn.style.display = 'none';
      }
    });
  }

  // ── Boot ───────────────────────────────────────────────────────────────────

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFounderLetter);
  } else {
    initFounderLetter();
  }
}());
