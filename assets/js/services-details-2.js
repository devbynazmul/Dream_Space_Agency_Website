/**
 * Services Details 02 — AI & Tech GSAP orchestration
 * Uses gsap + ScrollTrigger from vendor/main stack.
 */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function whenGsap(fn) {
    var tries = 0;
    (function wait() {
      if (typeof gsap !== 'undefined') {
        if (typeof ScrollTrigger !== 'undefined') {
          gsap.registerPlugin(ScrollTrigger);
        }
        fn();
        return;
      }
      tries += 1;
      if (tries < 40) window.setTimeout(wait, 50);
    })();
  }

  function reduced() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function initHero() {
    var root = document.querySelector('[data-sd2-hero]');
    if (!root || reduced()) return;

    var lines = root.querySelectorAll('[data-sd2-title-line]');
    if (lines.length && typeof SplitText === 'undefined') {
      gsap.fromTo(
        lines,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.12,
          ease: 'power3.out',
          delay: 0.15,
        }
      );
    }

    var visual = root.querySelector('[data-sd2-hero-visual] img');
    if (visual && typeof ScrollTrigger !== 'undefined') {
      gsap.fromTo(
        visual,
        { scale: 1.12, yPercent: 6 },
        {
          scale: 1,
          yPercent: 0,
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

    var chips = root.querySelectorAll('[data-sd2-chips] li');
    if (chips.length) {
      gsap.fromTo(
        chips,
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.45,
          stagger: 0.05,
          ease: 'power2.out',
          delay: 0.55,
        }
      );
    }

    // Mild latency read flicker (tech HUD vibe)
    var latency = root.querySelector('[data-sd2-hud-latency]');
    if (latency) {
      var values = [42, 38, 51, 35, 47, 40];
      var i = 0;
      window.setInterval(function () {
        i = (i + 1) % values.length;
        latency.textContent = values[i] + 'ms';
      }, 2200);
    }
  }

  function initCounters() {
    var root = document.querySelector('[data-sd2-stats]');
    if (!root || typeof ScrollTrigger === 'undefined') return;

    var nums = root.querySelectorAll('[data-sd2-count]');
    if (!nums.length) return;

    nums.forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-to')) || 0;
      var obj = { val: 0 };

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: function () {
          gsap.to(obj, {
            val: target,
            duration: reduced() ? 0.01 : 1.4,
            ease: 'power2.out',
            onUpdate: function () {
              el.textContent = Math.round(obj.val);
            },
          });
        },
      });
    });

    var rows = document.querySelectorAll('[data-sd2-brief-row]');
    if (rows.length && !reduced()) {
      gsap.fromTo(
        rows,
        { x: 24, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: rows[0],
            start: 'top 88%',
            once: true,
          },
        }
      );
    }
  }

  function initModules() {
    // Stack scroll is handled globally by main.js
    // (.scroll-section + .wrapper + .item → initScrollSectionStack).
    // Refresh after layout so pin distances stay correct.
    if (typeof ScrollTrigger === 'undefined') return;
    if (!document.querySelector('[data-sd2-modules] .scroll-section')) return;
    window.requestAnimationFrame(function () {
      ScrollTrigger.refresh();
    });
  }

  function initPipeline() {
    var section = document.querySelector('[data-sd2-pipeline]');
    if (!section || typeof ScrollTrigger === 'undefined') return;

    var track = section.querySelector('[data-sd2-pipe-track]');
    var bar = section.querySelector('[data-sd2-pipe-bar]');
    var pin = section.querySelector('.sd2-pipeline__pin');
    if (!track || !pin) return;

    var getScroll = function () {
      return Math.max(0, track.scrollWidth - window.innerWidth + 40);
    };

    if (window.matchMedia('(max-width: 767px)').matches || reduced()) {
      // Mobile: free horizontal CSS scroll feel via vertical list collapse
      gsap.set(track, { clearProps: 'transform' });
      return;
    }

    var tween = gsap.to(track, {
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
          if (bar) {
            gsap.set(bar, { width: self.progress * 100 + '%' });
          }
        },
      },
    });

    return tween;
  }

  function initMarquee() {
    var track = document.querySelector('[data-sd2-marquee-track]');
    if (!track || reduced()) return;

    var half = track.scrollWidth / 2;
    if (!half) return;

    gsap.to(track, {
      x: -half,
      duration: 28,
      ease: 'none',
      repeat: -1,
    });
  }

  function initDeliverables() {
    var list = document.querySelector('[data-sd2-deliver]');
    var items = document.querySelectorAll('[data-sd2-deliver-item]');
    var media = document.querySelector('[data-sd2-stack-media]');
    var images = media ? media.querySelectorAll('[data-sd2-stack-img]') : [];

    function setActive(index) {
      var i = Number(index);
      if (isNaN(i) || i < 0) return;

      items.forEach(function (item) {
        var itemIndex = parseInt(item.getAttribute('data-sd2-img-index'), 10);
        item.classList.toggle('is-active', itemIndex === i);
      });

      images.forEach(function (img) {
        var imgIndex = parseInt(img.getAttribute('data-index'), 10);
        img.classList.toggle('is-active', imgIndex === i);
      });
    }

    if (list && items.length && images.length) {
      items.forEach(function (item) {
        var index = item.getAttribute('data-sd2-img-index');

        item.addEventListener('mouseenter', function () {
          setActive(index);
        });

        item.addEventListener('focusin', function () {
          setActive(index);
        });

        item.addEventListener('click', function () {
          setActive(index);
        });
      });

      list.addEventListener('mouseleave', function () {
        setActive(0);
      });

      // Keyboard / touch: keep first item active by default
      setActive(0);
    }

    if (!items.length || typeof ScrollTrigger === 'undefined' || reduced()) return;

    gsap.fromTo(
      items,
      { y: 28, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: items[0].parentElement,
          start: 'top 85%',
          once: true,
        },
      }
    );
  }

  function initCta() {
    var panel = document.querySelector('[data-sd2-cta-panel]');
    if (!panel || typeof ScrollTrigger === 'undefined' || reduced()) return;

    gsap.fromTo(
      panel,
      { y: 40, opacity: 0.4 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: panel,
          start: 'top 88%',
          once: true,
        },
      }
    );
  }

  function boot() {
    if (!document.querySelector('.sd2-page')) return;

    whenGsap(function () {
      initHero();
      initCounters();
      initModules();
      initPipeline();
      initMarquee();
      initDeliverables();
      initCta();

      if (typeof ScrollTrigger !== 'undefined') {
        window.requestAnimationFrame(function () {
          ScrollTrigger.refresh();
        });
        window.addEventListener('load', function () {
          ScrollTrigger.refresh();
        });
      }
    });
  }

  ready(boot);
})();
