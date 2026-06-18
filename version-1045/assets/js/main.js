(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
            return;
        }
        document.addEventListener("DOMContentLoaded", fn);
    }

    ready(function () {
        var toggle = document.querySelector("[data-mobile-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (toggle && panel) {
            toggle.addEventListener("click", function () {
                panel.classList.toggle("is-open");
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
        if (slides.length > 0) {
            var active = 0;
            function setSlide(index) {
                active = index;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle("is-active", i === active);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle("is-active", i === active);
                });
            }
            dots.forEach(function (dot, index) {
                dot.addEventListener("click", function () {
                    setSlide(index);
                });
            });
            setInterval(function () {
                setSlide((active + 1) % slides.length);
            }, 5200);
            setSlide(0);
        }
    });
})();
