(function () {
  var CinemaSite = {
    initMenu: function () {
      var toggle = document.querySelector("[data-menu-toggle]");
      var mobileNav = document.querySelector("[data-mobile-nav]");
      if (!toggle || !mobileNav) {
        return;
      }
      toggle.addEventListener("click", function () {
        mobileNav.classList.toggle("is-open");
      });
    },

    initHero: function () {
      var root = document.querySelector("[data-hero]");
      if (!root) {
        return;
      }
      var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
      if (slides.length < 2) {
        return;
      }
      var index = 0;
      var timer = null;

      function show(nextIndex) {
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, itemIndex) {
          slide.classList.toggle("is-active", itemIndex === index);
        });
        dots.forEach(function (dot, itemIndex) {
          dot.classList.toggle("is-active", itemIndex === index);
        });
      }

      function start() {
        stop();
        timer = window.setInterval(function () {
          if (document.visibilityState === "visible") {
            show(index + 1);
          }
        }, 4800);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          var dotIndex = parseInt(dot.getAttribute("data-hero-dot"), 10);
          show(dotIndex);
          start();
        });
      });

      root.addEventListener("mouseenter", stop);
      root.addEventListener("mouseleave", start);
      start();
    },

    initFilters: function () {
      var lists = Array.prototype.slice.call(document.querySelectorAll("[data-filter-list]"));
      lists.forEach(function (list) {
        var key = list.getAttribute("data-filter-list");
        var controls = document.querySelector('[data-filter-controls="' + key + '"]');
        if (!controls) {
          return;
        }
        var search = controls.querySelector(".js-search");
        var year = controls.querySelector(".js-year");
        var type = controls.querySelector(".js-type");
        var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));

        function currentValue(input) {
          return input ? input.value.trim().toLowerCase() : "";
        }

        function apply() {
          var query = currentValue(search);
          var selectedYear = currentValue(year);
          var selectedType = currentValue(type);
          cards.forEach(function (card) {
            var text = [
              card.getAttribute("data-title"),
              card.getAttribute("data-year"),
              card.getAttribute("data-type"),
              card.getAttribute("data-genre"),
              card.getAttribute("data-region"),
              card.getAttribute("data-tags")
            ].join(" ").toLowerCase();
            var matchesQuery = !query || text.indexOf(query) !== -1;
            var matchesYear = !selectedYear || String(card.getAttribute("data-year")).toLowerCase() === selectedYear;
            var matchesType = !selectedType || String(card.getAttribute("data-type")).toLowerCase() === selectedType;
            card.classList.toggle("is-hidden", !(matchesQuery && matchesYear && matchesType));
          });
        }

        if (search) {
          search.addEventListener("input", apply);
          if (window.CinemaSiteQuery) {
            search.value = window.CinemaSiteQuery;
          }
        }
        if (year) {
          year.addEventListener("change", apply);
        }
        if (type) {
          type.addEventListener("change", apply);
        }
        apply();
      });
    },

    initPlayer: function (videoId, source) {
      var video = document.getElementById(videoId);
      if (!video) {
        return;
      }
      var shell = video.closest(".player-shell");
      var overlay = shell ? shell.querySelector(".player-overlay") : null;
      var hlsInstance = null;
      var started = false;

      function attachSource() {
        if (started) {
          return;
        }
        started = true;
        video.controls = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            maxBufferLength: 30,
            enableWorker: true
          });
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
        } else {
          video.src = source;
        }
      }

      function play() {
        attachSource();
        if (overlay) {
          overlay.classList.add("is-hidden");
        }
        var promise = video.play();
        if (promise && promise.catch) {
          promise.catch(function () {
            if (overlay) {
              overlay.classList.remove("is-hidden");
            }
          });
        }
      }

      if (overlay) {
        overlay.addEventListener("click", play);
      }
      video.addEventListener("play", function () {
        if (overlay) {
          overlay.classList.add("is-hidden");
        }
      });
      video.addEventListener("click", function () {
        if (!started) {
          play();
        }
      });
      window.addEventListener("beforeunload", function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    }
  };

  window.CinemaSite = CinemaSite;

  document.addEventListener("DOMContentLoaded", function () {
    CinemaSite.initMenu();
    CinemaSite.initHero();
    CinemaSite.initFilters();
  });
})();
