
(function () {
  const params = new URLSearchParams(window.location.search);
  const input = document.getElementById("searchInput");
  const resultsNode = document.getElementById("searchResults");
  const seedNode = document.getElementById("searchSeed");
  const query = (params.get("q") || "").trim();

  if (input) {
    input.value = query;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderCard(movie) {
    return [
      '<a class="search-result-card" href="' + escapeHtml(movie.url) + '">',
      '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '<span>',
      '<h3>' + escapeHtml(movie.title) + '</h3>',
      '<p>' + escapeHtml(movie.oneLine) + '</p>',
      '<em>' + escapeHtml(movie.region) + ' · ' + escapeHtml(movie.year) + ' · ' + escapeHtml(movie.category) + '</em>',
      '</span>',
      '</a>'
    ].join("");
  }

  if (!resultsNode || !Array.isArray(siteMovies)) {
    return;
  }

  if (!query) {
    resultsNode.innerHTML = "";
    return;
  }

  const normalized = query.toLowerCase();
  const results = siteMovies.filter(function (movie) {
    const haystack = [
      movie.title,
      movie.region,
      movie.type,
      movie.year,
      movie.genre,
      movie.category,
      Array.isArray(movie.tags) ? movie.tags.join(" ") : ""
    ].join(" ").toLowerCase();

    return haystack.includes(normalized);
  }).slice(0, 80);

  if (seedNode) {
    seedNode.style.display = results.length ? "none" : "grid";
  }

  if (!results.length) {
    resultsNode.innerHTML = '<div class="story-card"><h2>未找到匹配影片</h2><p>可以更换影片名、地区、年份或类型继续搜索。</p></div>';
    return;
  }

  resultsNode.innerHTML = results.map(renderCard).join("");
})();
