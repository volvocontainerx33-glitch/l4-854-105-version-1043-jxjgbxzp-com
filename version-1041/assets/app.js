(function () {
    function selectAll(selector, scope) {
        return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
    }

    function initMobileMenu() {
        var button = document.querySelector('[data-mobile-toggle]');
        var menu = document.querySelector('[data-mobile-menu]');
        if (!button || !menu) {
            return;
        }
        button.addEventListener('click', function () {
            menu.classList.toggle('is-open');
        });
    }

    function initHero() {
        var slides = selectAll('[data-hero-slide]');
        var dots = selectAll('[data-hero-dot]');
        if (slides.length < 2) {
            return;
        }
        var current = 0;
        function show(index) {
            current = index;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }
        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                show(index);
            });
        });
        window.setInterval(function () {
            show((current + 1) % slides.length);
        }, 5200);
    }

    function normalize(value) {
        return (value || '').toString().trim().toLowerCase();
    }

    function filterCards(term) {
        var cards = selectAll('[data-search-text]');
        var empty = document.querySelector('[data-empty-result]');
        if (!cards.length) {
            return;
        }
        var query = normalize(term);
        var visible = 0;
        cards.forEach(function (card) {
            var text = normalize(card.getAttribute('data-search-text'));
            var matched = !query || text.indexOf(query) !== -1;
            card.style.display = matched ? '' : 'none';
            if (matched) {
                visible += 1;
            }
        });
        if (empty) {
            empty.classList.toggle('visible', visible === 0);
        }
    }

    function initSearchPage() {
        var input = document.querySelector('[data-filter-input]');
        if (!input) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';
        if (query) {
            input.value = query;
        }
        filterCards(input.value);
        input.addEventListener('input', function () {
            filterCards(input.value);
        });
    }

    function initPlayers() {
        selectAll('[data-player]').forEach(function (player) {
            var video = player.querySelector('video');
            var trigger = player.querySelector('[data-play]');
            var mediaUrl = player.getAttribute('data-media');
            if (!video || !trigger || !mediaUrl) {
                return;
            }
            function play() {
                player.classList.add('is-playing');
                if (player.getAttribute('data-ready') !== 'true') {
                    if (window.Hls && window.Hls.isSupported()) {
                        var hls = new window.Hls({
                            enableWorker: true,
                            lowLatencyMode: true
                        });
                        hls.loadSource(mediaUrl);
                        hls.attachMedia(video);
                        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                            video.play().catch(function () {});
                        });
                        player.hlsPlayer = hls;
                    } else {
                        video.src = mediaUrl;
                        video.play().catch(function () {});
                    }
                    player.setAttribute('data-ready', 'true');
                } else {
                    video.play().catch(function () {});
                }
            }
            trigger.addEventListener('click', play);
            player.querySelector('.player-layer').addEventListener('click', play);
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initMobileMenu();
        initHero();
        initSearchPage();
        initPlayers();
    });
})();
