/**
 * Pricing 05 — monthly/project toggle + add-on totals
 */
(function () {
    function formatMoney(value) {
        return '$' + value.toLocaleString('en-US');
    }

    function initPricing5(root) {
        var plans = {
            monthly: { base: 4800, period: '/month' },
            project: { base: 9800, period: '/project' },
        };

        var plan = 'monthly';
        var totalEl = root.querySelector('[data-total]');
        var baseEl = root.querySelector('[data-base]');
        var addonsEl = root.querySelector('[data-addons]');
        var periodEl = root.querySelector('[data-period]');
        var toggleBtns = root.querySelectorAll('[data-plan]');
        var addonInputs = root.querySelectorAll('[data-addon]');

        function addonsSum() {
            var sum = 0;
            addonInputs.forEach(function (input) {
                if (input.checked) {
                    sum += parseInt(input.value, 10) || 0;
                }
            });
            return sum;
        }

        function refresh() {
            var base = plans[plan].base;
            var addons = addonsSum();
            var total = base + addons;

            if (totalEl) totalEl.textContent = formatMoney(total);
            if (baseEl) baseEl.textContent = formatMoney(base);
            if (addonsEl) addonsEl.textContent = formatMoney(addons).replace('$', '');
            if (periodEl) periodEl.textContent = plans[plan].period;
        }

        toggleBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                plan = btn.getAttribute('data-plan') || 'monthly';
                toggleBtns.forEach(function (el) {
                    var active = el === btn;
                    el.classList.toggle('is-active', active);
                    el.setAttribute('aria-selected', active ? 'true' : 'false');
                });
                refresh();
            });
        });

        addonInputs.forEach(function (input) {
            input.addEventListener('change', refresh);
        });

        refresh();
    }

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('[data-pricing5]').forEach(initPricing5);
    });
})();
