/**
 * Pricing 03 — testimonial prev/next
 */
(function () {
    function initPricing3Testimonial(root) {
        var slides = Array.prototype.slice.call(root.querySelectorAll('[data-slide]'));
        if (!slides.length) return;

        var index = slides.findIndex(function (slide) {
            return slide.classList.contains('is-active');
        });
        if (index < 0) index = 0;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                var active = i === index;
                slide.classList.toggle('is-active', active);
                if (active) {
                    slide.removeAttribute('hidden');
                } else {
                    slide.setAttribute('hidden', '');
                }
            });
        }

        root.addEventListener('click', function (event) {
            if (event.target.closest('[data-prev]')) {
                event.preventDefault();
                show(index - 1);
                return;
            }
            if (event.target.closest('[data-next]')) {
                event.preventDefault();
                show(index + 1);
            }
        });

        show(index);
    }

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('[data-pricing3-testimonial]').forEach(initPricing3Testimonial);
    });
})();
