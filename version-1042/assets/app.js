(function () {
  function ready(callback) {
    if (document.readyState !== 'loading') {
      callback();
      return;
    }
    document.addEventListener('DOMContentLoaded', callback);
  }

  function text(value) {
    return String(value || '').toLowerCase().trim();
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function initMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  function initHero() {
    var slider = document.querySelector('[data-hero-slider]');
    if (!slider) {
      return;
    }
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var prev = document.querySelector('[data-hero-prev]');
    var next = document.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, itemIndex) {
        slide.classList.toggle('is-active', itemIndex === index);
      });
      dots.forEach(function (dot, itemIndex) {
        dot.classList.toggle('is-active', itemIndex === index);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot, itemIndex) {
      dot.addEventListener('click', function () {
        show(itemIndex);
        restart();
      });
    });
    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }
    show(0);
    restart();
  }

  function initFilter() {
    var input = document.querySelector('[data-filter-input]');
    if (!input) {
      return;
    }
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
    var empty = document.querySelector('[data-empty]');
    function apply() {
      var query = text(input.value);
      var visible = 0;
      cards.forEach(function (card) {
        var haystack = text(card.getAttribute('data-search'));
        var match = !query || haystack.indexOf(query) !== -1;
        card.style.display = match ? '' : 'none';
        if (match) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }
    input.addEventListener('input', apply);
    apply();
  }

  function buildSearchCard(movie) {
    return [
      '<article class="movie-card compact-card" data-movie-card>',
      '  <a href="' + escapeHtml(movie.url) + '" class="poster-link" aria-label="观看' + escapeHtml(movie.title) + '">',
      '    <div class="poster-wrap">',
      '      <img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '      <div class="poster-mask"></div>',
      '      <span class="corner-label">' + escapeHtml(movie.type) + '</span>',
      '      <span class="duration-label">' + escapeHtml(movie.year) + '</span>',
      '    </div>',
      '    <div class="card-body">',
      '      <h2>' + escapeHtml(movie.title) + '</h2>',
      '      <p>' + escapeHtml(movie.oneLine) + '</p>',
      '      <div class="card-meta"><span>★ ' + escapeHtml(movie.score) + '</span><span>' + escapeHtml(movie.region) + '</span></div>',
      '    </div>',
      '  </a>',
      '</article>'
    ].join('');
  }

  function initSearchPage() {
    var page = document.querySelector('[data-search-page]');
    if (!page || !window.SiteMovieIndex) {
      return;
    }
    var field = page.querySelector('[data-search-field]');
    var results = page.querySelector('[data-search-results]');
    var empty = page.querySelector('[data-empty]');
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';
    if (field) {
      field.value = initial;
    }

    function render() {
      var query = text(field ? field.value : initial);
      var data = window.SiteMovieIndex.filter(function (movie) {
        var haystack = text([movie.title, movie.region, movie.type, movie.year, movie.genre, movie.tags].join(' '));
        return !query || haystack.indexOf(query) !== -1;
      }).slice(0, 240);
      results.innerHTML = data.map(buildSearchCard).join('');
      if (empty) {
        empty.classList.toggle('is-visible', data.length === 0);
      }
    }

    if (field) {
      field.addEventListener('input', render);
    }
    render();
  }

  ready(function () {
    initMenu();
    initHero();
    initFilter();
    initSearchPage();
  });
})();
