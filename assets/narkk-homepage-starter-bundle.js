(function () {
  'use strict';

  function init() {
    if (typeof gsap === 'undefined' || !window.narkkSplit) return;

    var section = document.querySelector('[data-narkk-bundle]');
    if (!section) return;

    section.classList.add('js-ready');

    // ── Build tab buttons from panels ─────────────────────────────────────
    // section.blocks isn't populated for theme blocks — read from DOM instead
    var tabsEl  = section.querySelector('[data-narkk-bundle-tabs]');
    var panels  = Array.from(section.querySelectorAll('.narkk-bundle__panel'));

    // Clear any previously built buttons (editor re-init)
    if (tabsEl) tabsEl.innerHTML = '';

    var tabs = panels.map(function (panel, i) {
      var panelId = panel.dataset.panelId;
      var label   = panel.dataset.tabLabel || 'Tab';

      var btn = document.createElement('button');
      btn.className = 'narkk-bundle__tab' + (i === 0 ? ' is-active' : '');
      btn.setAttribute('role', 'tab');
      btn.id = 'narkk-bundle-tab-' + panelId;
      btn.setAttribute('aria-controls', 'narkk-bundle-panel-' + panelId);
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.setAttribute('data-tab-id', panelId);
      btn.textContent = label;

      if (tabsEl) tabsEl.appendChild(btn);

      if (i === 0) panel.classList.add('is-active');

      return btn;
    });

    // ── Tab buttons: fade-rise on section enter ───────────────────────────
    if (tabs.length) {
      gsap.set(tabs, { opacity: 0, y: 20 });

      var tabsWrap = section.querySelector('[data-narkk-bundle-tabs-wrap]');
      var tabsIo = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        tabsIo.disconnect();
        gsap.to(tabs, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: { each: 0.08 }
        });
      }, { threshold: 0.5 });

      if (tabsWrap) tabsIo.observe(tabsWrap);
    }

    // ── Set up card animations for every panel ────────────────────────────
    // Observers fire lazily — inactive panels trigger when tab is switched
    panels.forEach(function (panel) { initCardAnimations(panel); });

    // ── Load videos only in the active panel — others load on tab switch ──
    var activePanel = section.querySelector('.narkk-bundle__panel.is-active');
    if (activePanel) loadPanelVideos(activePanel);

    // ── Tab switching ─────────────────────────────────────────────────────
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        switchTab(section, tabs, tab.getAttribute('data-tab-id'));
      });
    });
  }

  // ── Per-card animations (initial load only) ───────────────────────────────

  function initCardAnimations(panel) {
    var cards = Array.from(panel.querySelectorAll('.narkk-bundle__card'));

    cards.forEach(function (card, i) {
      // Even index: clip from top (top→bottom reveal); odd: clip from bottom (bottom→top reveal)
      var startClip = i % 2 === 0 ? 'inset(100% 0 0 0)' : 'inset(0 0 100% 0)';
      gsap.set(card, { clipPath: startClip });

      var io = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        io.unobserve(card);
        gsap.to(card, { clipPath: 'inset(0% 0 0% 0)', duration: 1.0, ease: 'power3.inOut' });
      }, { threshold: 0 });
      io.observe(card);
    });
  }

  // ── Lazy-load videos inside a panel ──────────────────────────────────────

  function loadPanelVideos(panel) {
    panel.querySelectorAll('video[data-lazy-src]').forEach(function (video) {
      if (!video.getAttribute('src')) {
        video.src = video.dataset.lazySrc;
        video.load();
      }
    });
  }

  // ── Tab switching (crossfade only, no animation replay) ───────────────────

  function switchTab(section, tabs, tabId) {
    var currentPanel = section.querySelector('.narkk-bundle__panel.is-active');
    var nextPanel    = section.querySelector('[data-panel-id="' + tabId + '"]');

    if (!nextPanel || nextPanel === currentPanel) return;

    gsap.killTweensOf(section.querySelectorAll('.narkk-bundle__panel'));

    tabs.forEach(function (t) {
      var active = t.getAttribute('data-tab-id') === tabId;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    gsap.to(currentPanel, {
      opacity: 0,
      duration: 0.2,
      ease: 'power1.in',
      onComplete: function () {
        currentPanel.classList.remove('is-active');
        nextPanel.classList.add('is-active');
        loadPanelVideos(nextPanel);
        gsap.fromTo(nextPanel, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power1.out' });
      }
    });
  }

  // ── Boot ──────────────────────────────────────────────────────────────────

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('shopify:section:load', function (e) {
    if (e.target.querySelector('[data-narkk-bundle]')) init();
  });
}());
