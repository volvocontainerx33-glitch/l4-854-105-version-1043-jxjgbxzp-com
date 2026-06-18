(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showSlide(i);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  var filterList = document.querySelector('[data-filter-list]');
  if (filterList) {
    var cards = Array.prototype.slice.call(filterList.querySelectorAll('.movie-card'));
    var search = document.getElementById('page-search');
    var region = document.getElementById('filter-region');
    var year = document.getElementById('filter-year');
    var type = document.getElementById('filter-type');
    var empty = document.querySelector('[data-empty-result]');
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q');

    if (search && initialQuery) {
      search.value = initialQuery;
    }

    function matchText(card, query) {
      if (!query) {
        return true;
      }
      var haystack = [
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-year'),
        card.getAttribute('data-type'),
        card.getAttribute('data-tags')
      ].join(' ').toLowerCase();
      return haystack.indexOf(query.toLowerCase()) !== -1;
    }

    function applyFilters() {
      var query = search ? search.value.trim() : '';
      var regionValue = region ? region.value : '';
      var yearValue = year ? year.value : '';
      var typeValue = type ? type.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var ok = matchText(card, query);
        ok = ok && (!regionValue || card.getAttribute('data-region') === regionValue);
        ok = ok && (!yearValue || card.getAttribute('data-year') === yearValue);
        ok = ok && (!typeValue || card.getAttribute('data-type') === typeValue);
        card.style.display = ok ? '' : 'none';
        if (ok) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    [search, region, year, type].forEach(function (item) {
      if (item) {
        item.addEventListener('input', applyFilters);
        item.addEventListener('change', applyFilters);
      }
    });

    applyFilters();
  }
})();

function initMoviePlayer(source) {
  var video = document.getElementById('movie-video');
  var button = document.querySelector('.play-layer');
  var started = false;
  var hlsInstance = null;

  if (!video || !button || !source) {
    return;
  }

  function bindSource() {
    if (started) {
      return;
    }
    started = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
    } else {
      video.src = source;
    }
  }

  function playVideo() {
    bindSource();
    button.classList.add('is-hidden');
    var promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {});
    }
  }

  button.addEventListener('click', playVideo);
  video.addEventListener('click', function () {
    if (!started) {
      playVideo();
    }
  });

  window.addEventListener('pagehide', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
}
