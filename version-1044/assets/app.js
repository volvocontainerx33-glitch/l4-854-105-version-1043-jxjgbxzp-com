(function () {
  const toggle = document.querySelector('.mobile-toggle');
  const panel = document.querySelector('.mobile-panel');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      const isOpen = panel.hasAttribute('hidden');
      if (isOpen) {
        panel.removeAttribute('hidden');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.textContent = '×';
      } else {
        panel.setAttribute('hidden', '');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '☰';
      }
    });
  }

  const filterForms = document.querySelectorAll('[data-filter-panel]');
  filterForms.forEach(function (panelEl) {
    const root = document.querySelector(panelEl.getAttribute('data-filter-panel'));
    if (!root) {
      return;
    }

    const cards = Array.from(root.querySelectorAll('.movie-card'));
    const countEl = document.querySelector('[data-result-count]');
    const emptyEl = document.querySelector('[data-empty-state]');
    const input = panelEl.querySelector('[data-filter-input]');
    const regionSelect = panelEl.querySelector('[data-filter-region]');
    const yearSelect = panelEl.querySelector('[data-filter-year]');
    const typeSelect = panelEl.querySelector('[data-filter-type]');
    const sortSelect = panelEl.querySelector('[data-sort]');
    const listButtons = document.querySelectorAll('[data-view]');

    function textOf(card, name) {
      return (card.getAttribute(name) || '').toLowerCase();
    }

    function applyFilter() {
      const keyword = input ? input.value.trim().toLowerCase() : '';
      const region = regionSelect ? regionSelect.value : '';
      const year = yearSelect ? yearSelect.value : '';
      const type = typeSelect ? typeSelect.value : '';
      let visible = 0;

      cards.forEach(function (card) {
        const keywordText = [
          textOf(card, 'data-title'),
          textOf(card, 'data-region'),
          textOf(card, 'data-year'),
          textOf(card, 'data-type'),
          textOf(card, 'data-tags')
        ].join(' ');

        const matched = (!keyword || keywordText.indexOf(keyword) !== -1)
          && (!region || card.getAttribute('data-region') === region)
          && (!year || card.getAttribute('data-year') === year)
          && (!type || card.getAttribute('data-type') === type);

        card.classList.toggle('hidden-card', !matched);
        if (matched) {
          visible += 1;
        }
      });

      if (countEl) {
        countEl.textContent = String(visible);
      }
      if (emptyEl) {
        emptyEl.hidden = visible !== 0;
      }
    }

    function applySort() {
      if (!sortSelect) {
        return;
      }
      const mode = sortSelect.value;
      const sorted = cards.slice().sort(function (a, b) {
        if (mode === 'year') {
          return Number(b.getAttribute('data-year') || 0) - Number(a.getAttribute('data-year') || 0);
        }
        if (mode === 'title') {
          return (a.getAttribute('data-title') || '').localeCompare(b.getAttribute('data-title') || '', 'zh-CN');
        }
        return Number(b.querySelector('a[href^="movie-"]') ? b.querySelector('a[href^="movie-"]').href.match(/movie-(\d+)/)?.[1] || 0 : 0)
          - Number(a.querySelector('a[href^="movie-"]') ? a.querySelector('a[href^="movie-"]').href.match(/movie-(\d+)/)?.[1] || 0 : 0);
      });
      sorted.forEach(function (card) {
        root.appendChild(card);
      });
    }

    [input, regionSelect, yearSelect, typeSelect].forEach(function (el) {
      if (el) {
        el.addEventListener('input', applyFilter);
        el.addEventListener('change', applyFilter);
      }
    });

    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        applySort();
        applyFilter();
      });
    }

    listButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        const view = button.getAttribute('data-view');
        listButtons.forEach(function (other) {
          other.classList.toggle('is-active', other === button);
        });
        root.classList.toggle('is-list', view === 'list');
      });
    });

    applySort();
    applyFilter();
  });
})();

function initMoviePlayer(streamUrl) {
  const shell = document.querySelector('[data-player]');
  if (!shell) {
    return;
  }

  const video = shell.querySelector('video');
  const overlay = shell.querySelector('.player-overlay');
  const playButton = shell.querySelector('.player-button');
  let ready = false;
  let hlsInstance = null;

  function bindVideo() {
    if (ready) {
      return;
    }
    ready = true;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new Hls();
      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(video);
    } else {
      video.src = streamUrl;
    }
    video.setAttribute('controls', 'controls');
  }

  function startPlayback(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    bindVideo();
    shell.classList.add('is-playing');
    const playTask = video.play();
    if (playTask && typeof playTask.catch === 'function') {
      playTask.catch(function () {});
    }
  }

  if (overlay) {
    overlay.addEventListener('click', startPlayback);
  }
  if (playButton) {
    playButton.addEventListener('click', startPlayback);
  }
  video.addEventListener('click', function () {
    if (!ready) {
      startPlayback();
    }
  });
  video.addEventListener('play', function () {
    shell.classList.add('is-playing');
  });
  video.addEventListener('ended', function () {
    shell.classList.remove('is-playing');
  });
  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}

(function () {
  const searchRoot = document.querySelector('[data-search-results]');
  if (!searchRoot || !window.moviesIndex) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const query = (params.get('q') || '').trim();
  const input = document.querySelector('[name="q"]');
  const label = document.querySelector('[data-search-label]');
  const count = document.querySelector('[data-search-count]');

  if (input) {
    input.value = query;
  }
  if (label) {
    label.textContent = query ? '“' + query + '”' : '全部影片';
  }

  const lower = query.toLowerCase();
  const matched = window.moviesIndex.filter(function (movie) {
    if (!lower) {
      return true;
    }
    return [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.tags, movie.oneLine]
      .join(' ')
      .toLowerCase()
      .indexOf(lower) !== -1;
  }).slice(0, 120);

  if (count) {
    count.textContent = String(matched.length);
  }

  if (!matched.length) {
    searchRoot.innerHTML = '<div class="empty-state">未找到相关内容</div>';
    return;
  }

  searchRoot.innerHTML = matched.map(function (movie) {
    return '<article class="movie-card">'
      + '<a class="movie-cover" href="' + movie.url + '">'
      + '<img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">'
      + '<span class="cover-badge">' + escapeHtml(movie.region) + '</span>'
      + '<span class="duration-badge">' + escapeHtml(movie.duration) + '</span>'
      + '</a>'
      + '<div class="movie-body">'
      + '<h3><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h3>'
      + '<p>' + escapeHtml(movie.oneLine) + '</p>'
      + '<div class="movie-meta"><span>★ ' + movie.score + '</span><span>' + movie.year + '</span></div>'
      + '</div>'
      + '</article>';
  }).join('');

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
})();
