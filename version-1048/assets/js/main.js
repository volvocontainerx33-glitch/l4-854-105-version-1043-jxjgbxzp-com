(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');
    if (toggle && mobileNav) {
        toggle.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var prev = document.querySelector('[data-hero-prev]');
    var next = document.querySelector('[data-hero-next]');
    var index = 0;

    function setSlide(target) {
        if (!slides.length) {
            return;
        }
        index = (target + slides.length) % slides.length;
        slides.forEach(function (slide, itemIndex) {
            slide.classList.toggle('is-active', itemIndex === index);
        });
        dots.forEach(function (dot, itemIndex) {
            dot.classList.toggle('is-active', itemIndex === index);
        });
    }

    if (slides.length) {
        if (prev) {
            prev.addEventListener('click', function () {
                setSlide(index - 1);
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                setSlide(index + 1);
            });
        }
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                setSlide(Number(dot.getAttribute('data-hero-dot')));
            });
        });
        window.setInterval(function () {
            setSlide(index + 1);
        }, 5800);
    }

    function applyCardFilter(input) {
        var scope = input.closest('main') || document;
        var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
        var categoryFilter = scope.querySelector('[data-category-filter]');

        function run() {
            var keyword = (input.value || '').trim().toLowerCase();
            var category = categoryFilter ? categoryFilter.value : '';
            cards.forEach(function (card) {
                var text = card.getAttribute('data-search') || '';
                var cardCategory = card.getAttribute('data-category') || '';
                var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
                var matchedCategory = !category || cardCategory === category;
                card.classList.toggle('is-hidden', !(matchedKeyword && matchedCategory));
            });
        }

        input.addEventListener('input', run);
        if (categoryFilter) {
            categoryFilter.addEventListener('change', run);
        }
        run();
    }

    Array.prototype.slice.call(document.querySelectorAll('[data-card-search]')).forEach(applyCardFilter);

    Array.prototype.slice.call(document.querySelectorAll('[data-list-search]')).forEach(function (input) {
        var scope = input.closest('main') || document;
        var items = Array.prototype.slice.call(scope.querySelectorAll('.rank-item'));
        input.addEventListener('input', function () {
            var keyword = (input.value || '').trim().toLowerCase();
            items.forEach(function (item) {
                var text = item.getAttribute('data-search') || item.textContent.toLowerCase();
                item.classList.toggle('is-hidden', keyword && text.indexOf(keyword) === -1);
            });
        });
    });
})();
