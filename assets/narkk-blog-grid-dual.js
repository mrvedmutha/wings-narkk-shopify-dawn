(function () {
  'use strict';

  function initDualGrid(section) {
    var switchEl   = section.querySelector('[data-narkk-switch]');
    var switchLine = switchEl && switchEl.querySelector('.narkk-dual-grid__switch-line');
    var switchText = switchEl && switchEl.querySelector('[data-narkk-switch-text]');
    var dropdown   = section.querySelector('[data-narkk-dropdown]');
    var tabItems   = dropdown ? Array.from(dropdown.querySelectorAll('[data-narkk-tab]')) : [];
    var panels     = Array.from(section.querySelectorAll('[data-narkk-panel]'));
    var ctaWraps   = Array.from(section.querySelectorAll('[data-narkk-panel-cta]'));

    var activeTab  = 'intentions';
    var lineIn     = null;

    // ── Labels from data attrs ───────────────────────────────────
    var iLabel = section.dataset.iLabel || 'Intentions';
    var nLabel = section.dataset.nLabel || 'Narkk';

    function labelFor(tab) {
      return tab === 'intentions' ? iLabel : nLabel;
    }

    // ── Underline animation ──────────────────────────────────────
    function lineEnter() {
      if (!switchLine || typeof gsap === 'undefined') return;
      if (lineIn) lineIn.kill();
      lineIn = gsap.to(switchLine, { scaleX: 1, duration: 0.35, ease: 'power2.out', transformOrigin: 'left center' });
    }

    function lineLeave() {
      if (!switchLine || typeof gsap === 'undefined') return;
      if (lineIn) lineIn.kill();
      lineIn = gsap.to(switchLine, { scaleX: 0, duration: 0.25, ease: 'power2.in', transformOrigin: 'right center' });
    }

    var isLocked = false;

    // ── Dropdown open / close ────────────────────────────────────
    function openDropdown() {
      if (!dropdown) return;
      dropdown.classList.add('is-open');
      switchEl.classList.add('is-open');
    }

    function closeDropdown() {
      if (!dropdown) return;
      dropdown.classList.remove('is-open');
      switchEl.classList.remove('is-open');
      isLocked = false;
    }

    // ── Sync dropdown active states ──────────────────────────────
    function syncDropdownItems() {
      tabItems.forEach(function (item) {
        var tab = item.dataset.narkkTab;
        item.classList.toggle('is-active', tab === activeTab);
        item.classList.toggle('is-hidden', tab === activeTab);
      });
    }

    // ── Switch active tab ────────────────────────────────────────
    function switchTab(tab) {
      if (tab === activeTab) return;
      activeTab = tab;

      if (switchText) switchText.textContent = labelFor(tab);

      panels.forEach(function (panel) {
        var match = panel.dataset.narkkPanel === tab;
        panel.classList.toggle('narkk-dual-grid__panel--hidden', !match);

        if (match) {
          var cards = Array.from(panel.querySelectorAll('[data-narkk-dual-card]'));
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(
              cards,
              { opacity: 0, y: 24 },
              { opacity: 1, y: 0, duration: 0.55, stagger: 0.06, ease: 'power3.out' }
            );
          }
        }
      });

      ctaWraps.forEach(function (wrap) {
        var match = wrap.dataset.narkkPanelCta === tab;
        wrap.classList.toggle('narkk-dual-grid__cta-wrap--hidden', !match);
      });

      syncDropdownItems();
      isLocked = false;
      closeDropdown();
    }

    // ── Hover on switch (disabled when locked) ───────────────────
    if (switchEl) {
      switchEl.addEventListener('mouseenter', function () {
        lineEnter();
        openDropdown();
      });

      switchEl.addEventListener('mouseleave', function () {
        if (isLocked) return;
        lineLeave();
        closeDropdown();
      });

      // Click switch label → freeze/unfreeze dropdown
      switchEl.addEventListener('click', function (e) {
        if (e.target.closest('[data-narkk-tab]')) return; // tab item handled separately
        if (isLocked) {
          isLocked = false;
          closeDropdown();
          lineLeave();
        } else {
          isLocked = true;
          openDropdown();
          lineEnter();
        }
      });
    }

    // ── Click outside → close when locked ───────────────────────
    document.addEventListener('click', function (e) {
      if (!isLocked) return;
      if (switchEl && switchEl.contains(e.target)) return;
      lineLeave();
      closeDropdown();
    });

    // ── Tab item clicks ──────────────────────────────────────────
    tabItems.forEach(function (item) {
      item.addEventListener('click', function (e) {
        e.stopPropagation();
        switchTab(item.dataset.narkkTab);
      });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          switchTab(item.dataset.narkkTab);
        }
      });
    });

    // ── Initial dropdown sync ────────────────────────────────────
    syncDropdownItems();

    // ── Card scroll reveal on initial load ───────────────────────
    if (typeof gsap === 'undefined' || typeof IntersectionObserver === 'undefined') return;

    var activePanel = section.querySelector('[data-narkk-panel="intentions"]');
    if (!activePanel) return;

    var cards = Array.from(activePanel.querySelectorAll('[data-narkk-dual-card]'));

    cards.forEach(function (card, i) {
      gsap.set(card, { opacity: 0, y: 28 });

      var io = new IntersectionObserver(
        function (entries) {
          if (!entries[0].isIntersecting) return;
          io.unobserve(card);
          gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.65,
            delay: (i % 4) * 0.1,
            ease: 'power3.out'
          });
        },
        { threshold: 0.05 }
      );

      io.observe(card);
    });
  }

  function init() {
    document.querySelectorAll('[data-narkk-dual-grid]').forEach(initDualGrid);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
