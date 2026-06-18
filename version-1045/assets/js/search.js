(function () {
    function text(value) {
        return String(value || "").toLowerCase();
    }

    function card(item) {
        var tags = (item.tags || []).slice(0, 3).map(function (tag) {
            return "<span>" + tag + "</span>";
        }).join("");
        return [
            "<article class=\"movie-card\">",
            "<a class=\"poster-link\" href=\"" + item.url + "\" aria-label=\"" + item.title + "\">",
            "<img src=\"" + item.cover + "\" alt=\"" + item.title + "\" loading=\"lazy\">",
            "</a>",
            "<div class=\"card-body\">",
            "<div class=\"card-meta\"><span>" + item.region + "</span><span>" + item.year + "</span></div>",
            "<h3><a href=\"" + item.url + "\">" + item.title + "</a></h3>",
            "<p>" + item.oneLine + "</p>",
            "<div class=\"tag-row\">" + tags + "</div>",
            "</div>",
            "</article>"
        ].join("");
    }

    function run() {
        var box = document.getElementById("search-results");
        var label = document.getElementById("search-label");
        if (!box || !window.SEARCH_DATA) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var q = text(params.get("q"));
        if (label) {
            label.textContent = q ? "搜索：" + params.get("q") : "输入关键词查找影片";
        }
        if (!q) {
            box.innerHTML = "<div class=\"empty-state\">可按标题、地区、类型、年份或标签检索片库内容。</div>";
            return;
        }
        var result = window.SEARCH_DATA.filter(function (item) {
            var haystack = text(item.title + " " + item.region + " " + item.type + " " + item.year + " " + item.genre + " " + (item.tags || []).join(" ") + " " + item.oneLine);
            return haystack.indexOf(q) !== -1;
        }).slice(0, 120);
        if (result.length === 0) {
            box.innerHTML = "<div class=\"empty-state\">没有找到匹配内容。</div>";
            return;
        }
        box.innerHTML = result.map(card).join("");
    }

    if (document.readyState !== "loading") {
        run();
    } else {
        document.addEventListener("DOMContentLoaded", run);
    }
})();
