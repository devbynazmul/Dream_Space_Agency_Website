/**
 * Services Details 05 — Digital Agency GSAP
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

  function initStats() {
    document.querySelectorAll('[data-sd5-count]').forEach(function (el) {
      if (typeof ScrollTrigger === 'undefined') return;
      var target = parseFloat(el.getAttribute('data-to')) || 0;
      var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      var o = { v: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: function () {
          gsap.to(o, {
            v: target,
            duration: reduced() ? 0.01 : 1.4,
            ease: 'power2.out',
            onUpdate: function () {
              el.textContent = decimals ? o.v.toFixed(decimals) : String(Math.round(o.v));
            },
          });
        },
      });
    });
  }

  function initMarquee() {
    var track = document.querySelector('[data-sd5-marquee-track]');
    if (!track || reduced()) return;
    var half = track.scrollWidth / 2;
    if (!half) return;
    gsap.to(track, { x: -half, duration: 26, ease: 'none', repeat: -1 });
  }

  function initMatrix() {
    var rows = document.querySelectorAll('[data-sd5-cell]');
    if (!rows.length || reduced() || typeof ScrollTrigger === 'undefined') return;
    gsap.fromTo(
      rows,
      { y: 28, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.09,
        ease: 'power2.out',
        scrollTrigger: { trigger: rows[0].parentElement, start: 'top 85%', once: true },
      }
    );
  }

  function initSteps() {
    var steps = document.querySelectorAll('[data-sd5-step]');
    if (!steps.length || reduced() || typeof ScrollTrigger === 'undefined') return;
    gsap.fromTo(
      steps,
      { x: -24, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: steps[0].parentElement, start: 'top 85%', once: true },
      }
    );
  }

  function initCta() {
    var panel = document.querySelector('[data-sd5-cta-panel]');
    if (!panel || reduced() || typeof ScrollTrigger === 'undefined') return;
    gsap.fromTo(
      panel,
      { y: 36, opacity: 0.45 },
      {
        y: 0,
        opacity: 1,
        duration: 0.75,
        ease: 'power2.out',
        scrollTrigger: { trigger: panel, start: 'top 88%', once: true },
      }
    );
  }

  ready(function () {
    if (!document.querySelector('.sd5-page')) return;
    whenGsap(function () {
      initStats();
      initMarquee();
      initMatrix();
      initSteps();
      initCta();
      // Offer stack via main.js .scroll-section
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
