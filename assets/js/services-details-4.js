/**
 * Services Details 04 — UI/UX Agency GSAP
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

  function initHero() {
    var lines = document.querySelectorAll('[data-sd4-line]');
    var figs = document.querySelectorAll('[data-sd4-fig]');
    if (reduced()) return;

    if (lines.length) {
      gsap.fromTo(
        lines,
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.95, stagger: 0.12, ease: 'power3.out', delay: 0.1 }
      );
    }

    if (figs.length && typeof ScrollTrigger !== 'undefined') {
      gsap.fromTo(
        figs,
        { y: 48, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power2.out', delay: 0.35 }
      );

      figs.forEach(function (fig, i) {
        var img = fig.querySelector('img');
        if (!img) return;
        gsap.to(img, {
          yPercent: i % 2 === 0 ? -8 : 8,
          ease: 'none',
          scrollTrigger: {
            trigger: fig.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    }
  }

  function initPillars() {
    var items = document.querySelectorAll('[data-sd4-pillar]');
    if (!items.length || reduced() || typeof ScrollTrigger === 'undefined') return;
    gsap.fromTo(
      items,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: { trigger: items[0].parentElement, start: 'top 85%', once: true },
      }
    );
  }

  function initFlow() {
    var section = document.querySelector('[data-sd4-flow]');
    if (!section || typeof ScrollTrigger === 'undefined') return;
    var track = section.querySelector('[data-sd4-track]');
    var bar = section.querySelector('[data-sd4-bar]');
    var pin = section.querySelector('.sd4-flow__pin');
    if (!track || !pin) return;

    if (window.matchMedia('(max-width: 767px)').matches || reduced()) return;

    var getScroll = function () {
      return Math.max(0, track.scrollWidth - window.innerWidth + 40);
    };

    gsap.to(track, {
      x: function () {
        return -getScroll();
      },
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: function () {
          return '+=' + (getScroll() + window.innerHeight * 0.35);
        },
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: function (self) {
          if (bar) gsap.set(bar, { width: self.progress * 100 + '%' });
        },
      },
    });
  }

  function initDeliver() {
    var items = document.querySelectorAll('[data-sd4-item]');
    var count = document.querySelector('[data-sd4-count]');
    if (items.length && !reduced() && typeof ScrollTrigger !== 'undefined') {
      gsap.fromTo(
        items,
        { x: 20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: items[0].parentElement, start: 'top 85%', once: true },
        }
      );
    }
    if (count && typeof ScrollTrigger !== 'undefined') {
      var o = { v: 0 };
      var t = parseFloat(count.getAttribute('data-to')) || 0;
      ScrollTrigger.create({
        trigger: count,
        start: 'top 90%',
        once: true,
        onEnter: function () {
          gsap.to(o, {
            v: t,
            duration: reduced() ? 0.01 : 1.3,
            ease: 'power2.out',
            onUpdate: function () {
              count.textContent = Math.round(o.v);
            },
          });
        },
      });
    }

    var media = document.querySelector('[data-sd4-deliver-media] img');
    if (media && typeof ScrollTrigger !== 'undefined' && !reduced()) {
      gsap.fromTo(
        media,
        { scale: 1.08 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: media.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }
  }

  ready(function () {
    if (!document.querySelector('.sd4-page')) return;
    whenGsap(function () {
      initHero();
      initPillars();
      initFlow();
      initDeliver();
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
