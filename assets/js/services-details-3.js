/**
 * Services Details 03 — Startup Agency GSAP
 */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function whenGsap(fn) {
    var n = 0;
    (function w() {
      if (typeof gsap !== 'undefined') {
        if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
        fn();
        return;
      }
      if (++n < 40) setTimeout(w, 50);
    })();
  }

  function reduced() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function countIn(el) {
    if (!el || typeof ScrollTrigger === 'undefined') return;
    var target = parseFloat(el.getAttribute('data-to')) || 0;
    var obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: function () {
        gsap.to(obj, {
          v: target,
          duration: reduced() ? 0.01 : 1.25,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = Math.round(obj.v);
          },
        });
      },
    });
  }

  function initHero() {
    var root = document.querySelector('[data-sd3-hero]');
    if (!root) return;

    var day = root.querySelector('[data-sd3-day]');
    var lines = root.querySelectorAll('[data-sd3-title-line]');
    var media = root.querySelector('[data-sd3-hero-media] img');
    var tags = root.querySelectorAll('[data-sd3-tag]');

    if (!reduced()) {
      if (lines.length) {
        // Animate each line as a clip reveal: outer stays full-width, inner moves
        lines.forEach(function (line) {
          var text = line.textContent;
          line.innerHTML = '<span class="sd3-hero__line-inner">' + text + '</span>';
        });
        var inners = root.querySelectorAll('.sd3-hero__line-inner');
        gsap.fromTo(
          inners,
          { yPercent: 115 },
          { yPercent: 0, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.12 }
        );
      }
      if (tags.length) {
        gsap.fromTo(
          tags,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: 'power2.out', delay: 0.55 }
        );
      }
      if (media && typeof ScrollTrigger !== 'undefined') {
        gsap.fromTo(
          media,
          { scale: 1.12 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }
    }

    if (day && !reduced()) {
      var o = { d: 1 };
      gsap.to(o, {
        d: 12,
        duration: 1.6,
        ease: 'power2.out',
        delay: 0.35,
        onUpdate: function () {
          day.textContent = String(Math.round(o.d)).padStart(2, '0');
        },
      });
    }
  }

  function initOutcomes() {
    document.querySelectorAll('[data-sd3-count]').forEach(countIn);

    var metrics = document.querySelectorAll('[data-sd3-out-card]');
    var progress = document.querySelector('[data-sd3-out-progress]');

    if (metrics.length && !reduced() && typeof ScrollTrigger !== 'undefined') {
      gsap.fromTo(
        metrics,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.07,
          ease: 'power2.out',
          scrollTrigger: { trigger: metrics[0].parentElement, start: 'top 88%', once: true },
        }
      );
    }

    if (progress && typeof ScrollTrigger !== 'undefined') {
      gsap.fromTo(
        progress,
        { width: '0%' },
        {
          width: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-sd3-out]',
            start: 'top 80%',
            end: 'bottom 40%',
            scrub: true,
          },
        }
      );
    }
  }

  function initRunway() {
    var steps = document.querySelectorAll('[data-sd3-step]');
    var fill = document.querySelector('[data-sd3-meter-fill]');
    var label = document.querySelector('[data-sd3-meter-label]');
    if (!steps.length || typeof ScrollTrigger === 'undefined') return;

    steps.forEach(function (step, i) {
      ScrollTrigger.create({
        trigger: step,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: function () {
          if (fill) gsap.to(fill, { width: ((i + 1) / steps.length) * 100 + '%', duration: 0.4 });
          if (label) label.textContent = 'Gate 0' + (i + 1);
        },
        onEnterBack: function () {
          if (fill) gsap.to(fill, { width: ((i + 1) / steps.length) * 100 + '%', duration: 0.4 });
          if (label) label.textContent = 'Gate 0' + (i + 1);
        },
      });

      if (!reduced()) {
        gsap.fromTo(
          step,
          { y: 28, opacity: 0.35 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: 'power2.out',
            scrollTrigger: { trigger: step, start: 'top 88%', once: true },
          }
        );
      }
    });
  }

  function initCta() {
    var panel = document.querySelector('[data-sd3-cta-panel]');
    if (!panel || reduced() || typeof ScrollTrigger === 'undefined') return;
    gsap.fromTo(
      panel,
      { y: 32, opacity: 0.5 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: panel, start: 'top 88%', once: true },
      }
    );
  }

  ready(function () {
    if (!document.querySelector('.sd3-page')) return;
    whenGsap(function () {
      initHero();
      initOutcomes();
      initRunway();
      initCta();
      // Stack for tracks via main.js .scroll-section
      if (typeof ScrollTrigger !== 'undefined') {
        requestAnimationFrame(function () {
          ScrollTrigger.refresh();
        });
        window.addEventListener('load', function () {
          ScrollTrigger.refresh();
        });
      }
    });
  });
})();
