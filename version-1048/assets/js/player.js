(function () {
    window.setupPlayer = function (source, videoId, startId, coverId) {
        var video = document.getElementById(videoId);
        var start = document.getElementById(startId);
        var cover = document.getElementById(coverId);
        var ready = false;
        var hls = null;

        if (!video || !source) {
            return;
        }

        function attachSource() {
            if (ready) {
                return;
            }
            ready = true;
            video.controls = true;
            if (cover) {
                cover.classList.add('is-hidden');
            }
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }
        }

        function play() {
            attachSource();
            var started = video.play();
            if (started && typeof started.catch === 'function') {
                started.catch(function () {});
            }
        }

        if (start) {
            start.addEventListener('click', play);
        }
        if (cover && cover !== start) {
            cover.addEventListener('click', play);
        }
        video.addEventListener('click', function () {
            if (!ready) {
                play();
            }
        });
        window.addEventListener('pagehide', function () {
            if (hls) {
                hls.destroy();
                hls = null;
            }
        });
    };
})();
