/**
 * About 04 — GSAP scroll stagger + hover float preview on beliefs
 * Mirrors services-4 float (no collapse). Depends on gsap + ScrollTrigger.
 */
(function () {
    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    function whenGsapReady(fn) {
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

    function initAbout4() {
        if (!document.querySelector('[data-about4-beliefs]')) return;

        initBeliefsReveal();
        initBeliefsHover();

        if (typeof ScrollTrigger !== 'undefined') {
            window.requestAnimationFrame(function () {
                ScrollTrigger.refresh();
            });
        }
    }

    /* Stagger each belief <li> on scroll — transform only (never hide with opacity) */
    function initBeliefsReveal() {
        if (typeof ScrollTrigger === 'undefined') return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        var items = document.querySelectorAll('[data-about4-belief]');
        if (!items.length) return;

        gsap.set(items, { clearProps: 'opacity,visibility,transform' });

        gsap.fromTo(
            items,
            { y: 36 },
            {
                y: 0,
                duration: 0.7,
                stagger: 0.12,
                ease: 'power2.out',
                immediateRender: false,
                clearProps: 'transform',
                overwrite: 'auto',
                scrollTrigger: {
                    trigger: '[data-about4-beliefs]',
                    start: 'top 78%',
                    once: true,
                    invalidateOnRefresh: true,
                },
            },
        );
    }

    /* Floating image follows cursor on desktop hover (always; no collapse) */
    function initBeliefsHover() {
        var root = document.querySelector('[data-about4-beliefs]');
        if (!root) return;

        var floatEl = root.querySelector('[data-about4-float]');
        var floatImg = floatEl && floatEl.querySelector('[data-about4-float-img]');
        var items = root.querySelectorAll('[data-about4-belief]');
        if (!floatEl || !floatImg || !items.length) return;
        if (!window.matchMedia('(min-width: 992px)').matches) return;

        // Escape ScrollSmoother transform ancestors
        if (floatEl.parentElement !== document.body) {
            document.body.appendChild(floatEl);
        }

        var offsetX = 28;
        var offsetY = 20;
        var visible = false;

        gsap.set(floatEl, {
            position: 'fixed',
            top: 0,
            left: 0,
            x: 0,
            y: 0,
            xPercent: 0,
            yPercent: 0,
            autoAlpha: 0,
            scale: 0.88,
            pointerEvents: 'none',
            zIndex: 9999,
        });

        var xTo = gsap.quickTo(floatEl, 'x', { duration: 0.4, ease: 'power3.out' });
        var yTo = gsap.quickTo(floatEl, 'y', { duration: 0.4, ease: 'power3.out' });

        function placeAt(clientX, clientY) {
            var w = floatEl.offsetWidth || 260;
            var h = floatEl.offsetHeight || 320;
            var pad = 16;
            var x = clientX + offsetX;
            var y = clientY + offsetY;

            if (x + w > window.innerWidth - pad) x = clientX - w - offsetX;
            if (x < pad) x = pad;
            if (y + h > window.innerHeight - pad) y = clientY - h - offsetY;
            if (y < pad) y = pad;

            xTo(x);
            yTo(y);
        }

        function hideFloat() {
            if (!visible) return;
            visible = false;
            gsap.to(floatEl, {
                autoAlpha: 0,
                scale: 0.92,
                duration: 0.28,
                ease: 'power2.in',
                overwrite: 'auto',
            });
        }

        function showFloat(item, clientX, clientY) {
            var preview = item.getAttribute('data-preview');
            if (preview) floatImg.src = preview;
            visible = true;
            placeAt(clientX, clientY);
            gsap.to(floatEl, {
                autoAlpha: 1,
                scale: 1,
                duration: 0.35,
                ease: 'power2.out',
                overwrite: 'auto',
            });
        }

        root.addEventListener('mousemove', function (e) {
            if (!visible) return;
            placeAt(e.clientX, e.clientY);
        });

        items.forEach(function (item) {
            item.addEventListener('mouseenter', function (e) {
                showFloat(item, e.clientX, e.clientY);
            });
            item.addEventListener('mouseleave', hideFloat);
        });
    }

    ready(function () {
        whenGsapReady(function () {
            window.setTimeout(initAbout4, 120);
        });
    });
})();
