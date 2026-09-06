/**
 * Services 05 — capability stack relies on main.js
 * (.scroll-section + .wrapper + .item → initScrollSectionStack).
 * This file keeps step stagger + ScrollTrigger refresh after layout.
 */
(function () {
  'use strict';

  function refreshStack() {
    if (typeof ScrollTrigger === 'undefined') return;
    // Allow wrapper/item heights to settle after images + smooth setup
    requestAnimationFrame(function () {
      ScrollTrigger.refresh();
    });
  }

  function initGsapOptional() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    var steps = document.querySelectorAll('[data-svc5-step]');
    if (steps.length) {
      gsap.fromTo(
        steps,
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: steps[0].parentElement,
            start: 'top 80%',
            once: true
          }
        }
      );
    }
  }

  function boot() {
    initGsapOptional();
    refreshStack();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.addEventListener('load', refreshStack);
})();
