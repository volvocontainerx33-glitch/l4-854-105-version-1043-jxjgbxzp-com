(function () {
  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function qsa(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function setupMenu() {
    var toggle = qs("[data-menu-toggle]");
    var panel = qs("[data-mobile-panel]");
    if (!toggle || !panel) return;
    toggle.addEventListener("click", function () {
      panel.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var root = qs("[data-hero]");
    if (!root) return;
    var slides = qsa("[data-hero-slide]", root);
    var dots = qsa("[data-hero-dot]", root);
    var prev = qs("[data-hero-prev]", root);
    var next = qs("[data-hero-next]", root);
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) return;
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function move(step) {
      show(index + step);
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        move(1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        start();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        move(-1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        move(1);
        start();
      });
    }

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function setupCatalogFilter() {
    var input = qs("[data-catalog-search]");
    var list = qs("[data-filter-list]");
    if (!input || !list) return;
    var cards = qsa("[data-search-text]", list);
    var empty = qs("[data-empty-state]");
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";
    if (query) {
      input.value = query;
    }

    function apply() {
      var term = normalize(input.value);
      var visible = 0;
      cards.forEach(function (card) {
        var text = normalize(card.getAttribute("data-search-text"));
        var matched = !term || text.indexOf(term) !== -1;
        card.classList.toggle("hidden-card", !matched);
        if (matched) visible += 1;
      });
      if (empty) {
        empty.classList.toggle("is-visible", visible === 0);
      }
    }

    input.addEventListener("input", apply);
    apply();
  }

  function setupSort() {
    var select = qs("[data-sort-select]");
    var list = qs("[data-filter-list]");
    if (!select || !list) return;
    select.addEventListener("change", function () {
      var cards = qsa("[data-sort-year]", list);
      var mode = select.value;
      cards.sort(function (a, b) {
        var ay = parseInt(a.getAttribute("data-sort-year"), 10) || 0;
        var by = parseInt(b.getAttribute("data-sort-year"), 10) || 0;
        var at = a.getAttribute("data-sort-title") || "";
        var bt = b.getAttribute("data-sort-title") || "";
        if (mode === "year-asc") return ay - by;
        if (mode === "title") return at.localeCompare(bt, "zh-Hans-CN");
        return by - ay;
      });
      cards.forEach(function (card) {
        list.appendChild(card);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupMenu();
    setupHero();
    setupCatalogFilter();
    setupSort();
  });
})();
