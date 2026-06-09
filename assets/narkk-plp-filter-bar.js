(function () {
  'use strict';

  function initFilterBar() {
    var bar      = document.querySelector('[data-narkk-filter-bar]');
    if (!bar) return;

    var trigger  = bar.querySelector('[data-filter-trigger]');
    var drawer   = document.querySelector('[data-narkk-filter-drawer]');
    var backdrop = document.querySelector('[data-narkk-filter-backdrop]');
    var closeBtn = drawer ? drawer.querySelector('[data-filter-close]') : null;
    var sortBtn  = bar.querySelector('[data-filter-sort-btn]');
    var sortDrop = bar.querySelector('[data-filter-sort-dropdown]');
    var sortOpts = sortDrop ? sortDrop.querySelectorAll('[data-filter-sort-option]') : [];
    var sortVal  = bar.querySelector('[data-filter-sort-value]');
    var groups   = drawer ? drawer.querySelectorAll('[data-filter-group]') : [];
    var items    = drawer ? drawer.querySelectorAll('[data-filter-item]') : [];

    /* ── Set initial max-height on all group item lists ──── */
    groups.forEach(function (group) {
      var list = group.querySelector('[data-filter-items]');
      if (list) list.style.maxHeight = list.scrollHeight + 'px';
    });

    /* ── Drawer open / close ─────────────────────────────── */
    function openDrawer() {
      if (!drawer) return;
      drawer.classList.add('is-open');
      backdrop.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function closeDrawer() {
      if (!drawer) return;
      drawer.classList.remove('is-open');
      backdrop.classList.remove('is-open');
      document.body.style.overflow = '';
      if (trigger) trigger.focus();
    }

    if (trigger)  trigger.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) {
        closeDrawer();
      }
    });

    /* ── Filter group accordion ──────────────────────────── */
    groups.forEach(function (group) {
      var header = group.querySelector('[data-filter-group-header]');
      var list   = group.querySelector('[data-filter-items]');
      if (!header || !list) return;

      header.addEventListener('click', function () {
        var isCollapsed = group.classList.contains('is-collapsed');

        if (isCollapsed) {
          list.style.maxHeight = list.scrollHeight + 'px';
          group.classList.remove('is-collapsed');
        } else {
          list.style.maxHeight = list.scrollHeight + 'px';
          requestAnimationFrame(function () {
            list.style.maxHeight = '0';
          });
          group.classList.add('is-collapsed');
        }
      });
    });

    /* ── Filter item checkbox toggle ─────────────────────── */
    items.forEach(function (item) {
      item.addEventListener('click', function () {
        item.classList.toggle('is-checked');
      });
    });

    /* ── Sort dropdown ───────────────────────────────────── */
    if (sortBtn && sortDrop) {
      sortBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = sortDrop.classList.contains('is-open');
        sortDrop.classList.toggle('is-open', !isOpen);
        sortBtn.setAttribute('aria-expanded', String(!isOpen));
      });

      sortOpts.forEach(function (opt) {
        opt.addEventListener('click', function () {
          sortOpts.forEach(function (o) { o.classList.remove('is-active'); });
          opt.classList.add('is-active');
          if (sortVal) sortVal.textContent = opt.textContent.trim();
          sortDrop.classList.remove('is-open');
          sortBtn.setAttribute('aria-expanded', 'false');
        });
      });

      document.addEventListener('click', function () {
        sortDrop.classList.remove('is-open');
        sortBtn.setAttribute('aria-expanded', 'false');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFilterBar);
  } else {
    initFilterBar();
  }
}());
