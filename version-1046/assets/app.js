
(function () {
  const toggle = document.querySelector(".mobile-toggle");
  const panel = document.querySelector(".mobile-panel");

  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      const open = panel.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const dots = Array.from(document.querySelectorAll(".hero-dot"));
  let activeIndex = 0;
  let timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeIndex = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("active", slideIndex === activeIndex);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("active", dotIndex === activeIndex);
    });
  }

  function startCarousel() {
    if (slides.length < 2) {
      return;
    }

    timer = window.setInterval(function () {
      showSlide(activeIndex + 1);
    }, 5200);
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      if (timer) {
        window.clearInterval(timer);
      }
      showSlide(index);
      startCarousel();
    });
  });

  startCarousel();

  const panels = Array.from(document.querySelectorAll("[data-filter-panel]"));

  panels.forEach(function (panelNode) {
    const page = panelNode.closest("main") || document;
    const input = panelNode.querySelector("[data-card-search]");
    const cards = Array.from(page.querySelectorAll("[data-card-list] .movie-card"));
    const buttons = Array.from(panelNode.querySelectorAll("[data-filter-value]"));
    let activeValues = new Set();

    function matchesCard(card, query) {
      const haystack = [
        card.dataset.title,
        card.dataset.region,
        card.dataset.year,
        card.dataset.genre,
        card.dataset.category
      ].join(" ").toLowerCase();

      const queryOk = !query || haystack.includes(query);
      const filterOk = !activeValues.size || Array.from(activeValues).some(function (value) {
        return value === "all" || haystack.includes(value.toLowerCase());
      });

      return queryOk && filterOk;
    }

    function applyFilters() {
      const query = input ? input.value.trim().toLowerCase() : "";

      cards.forEach(function (card) {
        card.classList.toggle("hidden-card", !matchesCard(card, query));
      });
    }

    if (input) {
      input.addEventListener("input", applyFilters);
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        const value = button.getAttribute("data-filter-value") || "all";
        const rowButtons = Array.from(button.parentElement.querySelectorAll("button"));

        rowButtons.forEach(function (item) {
          item.classList.remove("active");
        });

        button.classList.add("active");

        Array.from(activeValues).forEach(function (stored) {
          if (rowButtons.some(function (item) { return item.getAttribute("data-filter-value") === stored; })) {
            activeValues.delete(stored);
          }
        });

        if (value !== "all") {
          activeValues.add(value);
        }

        applyFilters();
      });
    });
  });
})();
