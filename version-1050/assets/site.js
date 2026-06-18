(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
  var form = document.querySelector('[data-filter-form]');

  if (cards.length && form) {
    var search = form.querySelector('[data-filter-search]');
    var region = form.querySelector('[data-filter-region]');
    var type = form.querySelector('[data-filter-type]');
    var clear = form.querySelector('[data-clear-filter]');
    var empty = document.querySelector('[data-empty]');

    var normalize = function (value) {
      return (value || '').toString().trim().toLowerCase();
    };

    var run = function () {
      var query = normalize(search ? search.value : '');
      var regionValue = normalize(region ? region.value : '');
      var typeValue = normalize(type ? type.value : '');
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-tags'),
          card.textContent
        ].join(' '));
        var okQuery = !query || haystack.indexOf(query) > -1;
        var okRegion = !regionValue || normalize(card.getAttribute('data-region')) === regionValue;
        var okType = !typeValue || normalize(card.getAttribute('data-type')) === typeValue;
        var show = okQuery && okRegion && okType;

        card.classList.toggle('is-hidden', !show);
        if (show) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    };

    if (search) {
      search.addEventListener('input', run);
    }

    if (region) {
      region.addEventListener('change', run);
    }

    if (type) {
      type.addEventListener('change', run);
    }

    if (clear) {
      clear.addEventListener('click', function () {
        if (search) {
          search.value = '';
        }
        if (region) {
          region.value = '';
        }
        if (type) {
          type.value = '';
        }
        run();
      });
    }
  }
})();
