(function () {
  'use strict';

  function initContactForm() {
    if (typeof gsap === 'undefined' || !window.narkkSplit) return;

    var section = document.querySelector('[data-narkk-pcf]');
    if (!section) return;

    // ── Heading — word split reveal ───────────────────────────
    var headingEl = section.querySelector('[data-pcf-heading]');

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

    // ── Subtext — fade rise ───────────────────────────────────
    var subtextEl = section.querySelector('[data-pcf-subtext]');

    if (subtextEl) {
      gsap.set(subtextEl, { opacity: 0, y: 20 });

      var subtextIo = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        subtextIo.disconnect();

        gsap.to(subtextEl, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          delay: 0.35
        });
      }, { threshold: 0.2 });

      subtextIo.observe(subtextEl);
    }

    // ── Left column — eyebrow + contact info items stagger ────
    var eyebrow = section.querySelector('[data-pcf-eyebrow]');
    var infoItems = section.querySelectorAll('[data-pcf-info] > *');
    var leftEls = [];

    if (eyebrow) leftEls.push(eyebrow);
    infoItems.forEach(function (el) { leftEls.push(el); });

    if (leftEls.length) {
      gsap.set(leftEls, { opacity: 0, y: 20 });

      var leftIo = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        leftIo.disconnect();

        gsap.to(leftEls, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger: { each: 0.12, from: 'start' }
        });
      }, { threshold: 0.15 });

      leftIo.observe(leftEls[0]);
    }

    // ── Form fields — staggered fade rise on scroll ───────────
    var fields = section.querySelectorAll('[data-pcf-field]');

    fields.forEach(function (field, i) {
      gsap.set(field, { opacity: 0, y: 24 });

      var fieldIo = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        fieldIo.unobserve(field);

        gsap.to(field, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          delay: i * 0.08
        });
      }, { threshold: 0.1 });

      fieldIo.observe(field);
    });

    // ── Custom select ─────────────────────────────────────────
    initSelect(section);

    // ── Form validation & submission ──────────────────────────
    initFormValidation(section);
  }

  function initSelect(section) {
    var selectEl = section.querySelector('[data-pcf-select]');
    if (!selectEl) return;

    var trigger    = selectEl.querySelector('[data-pcf-select-trigger]');
    var dropdown   = selectEl.querySelector('[data-pcf-select-dropdown]');
    var labelEl    = selectEl.querySelector('[data-pcf-select-label]');
    var valueInput = selectEl.querySelector('[data-pcf-select-value]');
    var options    = selectEl.querySelectorAll('.narkk-pcf__select-option');

    if (!trigger || !dropdown) return;

    function lenisStop() { if (window.__narkkLenis) window.__narkkLenis.stop(); }
    function lenisStart() { if (window.__narkkLenis) window.__narkkLenis.start(); }

    // Toggle open / close
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = selectEl.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      isOpen ? lenisStop() : lenisStart();
    });

    // Option selection
    options.forEach(function (option) {
      option.addEventListener('click', function () {
        var text = option.textContent.trim();

        if (labelEl) labelEl.textContent = text;
        if (valueInput) valueInput.value = option.getAttribute('data-value');

        options.forEach(function (o) { o.classList.remove('is-selected'); });
        option.classList.add('is-selected');
        trigger.classList.add('has-value');

        selectEl.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        lenisStart();
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!selectEl.contains(e.target) && selectEl.classList.contains('is-open')) {
        selectEl.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        lenisStart();
      }
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && selectEl.classList.contains('is-open')) {
        selectEl.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
        lenisStart();
      }
    });
  }

  function initFormValidation(section) {
    var form = section.querySelector('.narkk-pcf__form');
    if (!form) return;

    var rules = [
      { name: 'contact[name]', message: 'Please enter your full name.' },
      { name: 'contact[email]',     message: 'Please enter a valid email address.', email: true },
      { name: 'contact[body]',      message: 'Please enter your message.' }
    ];

    function getError(name) {
      return form.querySelector('[data-pcf-error="' + name + '"]');
    }

    function getField(name) {
      return form.querySelector('[name="' + name + '"]');
    }

    function setError(name, message) {
      var field = getField(name);
      var error = getError(name);
      if (field) field.classList.add('is-invalid');
      if (error) error.textContent = message;
    }

    function clearError(name) {
      var field = getField(name);
      var error = getError(name);
      if (field) field.classList.remove('is-invalid');
      if (error) error.textContent = '';
    }

    function validateEmail(val) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    }

    function validate() {
      var valid = true;
      rules.forEach(function (rule) {
        var field = getField(rule.name);
        if (!field) return;
        var val = field.value.trim();
        if (!val || (rule.email && !validateEmail(val))) {
          setError(rule.name, rule.message);
          valid = false;
        } else {
          clearError(rule.name);
        }
      });
      return valid;
    }

    // Clear individual errors on input
    rules.forEach(function (rule) {
      var field = getField(rule.name);
      if (field) {
        field.addEventListener('input', function () { clearError(rule.name); });
      }
    });

    form.addEventListener('submit', function (e) {
      if (!validate()) {
        e.preventDefault();
        var firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
  } else {
    initContactForm();
  }
}());
