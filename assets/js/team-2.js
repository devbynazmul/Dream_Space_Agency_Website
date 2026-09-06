/**
 * Team 02 — roster preview + hero motion
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
    var root = document.querySelector('[data-team2-hero]');
    if (!root) return;

    var lines = root.querySelectorAll('[data-team2-title-line]');
    if (lines.length && !reduced()) {
      lines.forEach(function (line) {
        var t = line.textContent;
        line.innerHTML = '<span class="team2-hero__line-inner">' + t + '</span>';
      });
      gsap.fromTo(
        root.querySelectorAll('.team2-hero__line-inner'),
        { yPercent: 110 },
        { yPercent: 0, duration: 0.95, stagger: 0.1, ease: 'power3.out', delay: 0.1 }
      );
    }

    var countEl = root.querySelector('[data-team2-count]');
    if (countEl && typeof ScrollTrigger !== 'undefined') {
      var target = parseFloat(countEl.getAttribute('data-to')) || 0;
      var o = { v: 0 };
      ScrollTrigger.create({
        trigger: countEl,
        start: 'top 90%',
        once: true,
        onEnter: function () {
          gsap.to(o, {
            v: target,
            duration: reduced() ? 0.01 : 1.2,
            ease: 'power2.out',
            onUpdate: function () {
              countEl.textContent = Math.round(o.v);
            },
          });
        },
      });
    }

    var meta = root.querySelectorAll('[data-team2-meta] li');
    if (meta.length && !reduced()) {
      gsap.fromTo(
        meta,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: 'power2.out', delay: 0.4 }
      );
    }
  }

  function initRoster() {
    var root = document.querySelector('[data-team2-roster]');
    if (!root) return;

    var people = root.querySelectorAll('[data-team2-person]');
    var img = root.querySelector('[data-team2-preview-img]');
    var nameEl = root.querySelector('[data-team2-preview-name]');
    var roleEl = root.querySelector('[data-team2-preview-role]');
    if (!people.length || !img) return;

    function activate(person) {
      people.forEach(function (p) {
        p.classList.toggle('is-active', p === person);
      });
      var src = person.getAttribute('data-img');
      var name = person.getAttribute('data-name') || '';
      var role = person.getAttribute('data-role') || '';

      if (src && img.getAttribute('src') !== src) {
        if (typeof gsap !== 'undefined' && !reduced()) {
          gsap.to(img, {
            opacity: 0,
            scale: 1.04,
            duration: 0.18,
            onComplete: function () {
              img.setAttribute('src', src);
              img.setAttribute('alt', name);
              gsap.fromTo(img, { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' });
            },
          });
        } else {
          img.setAttribute('src', src);
          img.setAttribute('alt', name);
        }
      }
      if (nameEl) nameEl.textContent = name;
      if (roleEl) roleEl.textContent = role;
    }

    people.forEach(function (person) {
      person.addEventListener('mouseenter', function () {
        activate(person);
      });
      person.addEventListener('focusin', function () {
        activate(person);
      });
    });

    if (typeof gsap !== 'undefined' && !reduced() && typeof ScrollTrigger !== 'undefined') {
      gsap.fromTo(
        people,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.45,
          stagger: 0.05,
          ease: 'power2.out',
          scrollTrigger: { trigger: root, start: 'top 80%', once: true },
        }
      );
    }
  }

  function initDisc() {
    var cards = document.querySelectorAll('[data-team2-disc-card]');
    if (!cards.length || reduced() || typeof ScrollTrigger === 'undefined') return;
    gsap.fromTo(
      cards,
      { y: 28, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: { trigger: cards[0].parentElement, start: 'top 88%', once: true },
      }
    );
  }

  ready(function () {
    if (!document.querySelector('.team2-page')) return;
    whenGsap(function () {
      initHero();
      initRoster();
      initDisc();
      if (typeof ScrollTrigger !== 'undefined') {
        requestAnimationFrame(function () {
          ScrollTrigger.refresh();
        });
      }
    });
  });
})();
