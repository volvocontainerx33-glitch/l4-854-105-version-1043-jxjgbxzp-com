(function () {
    window.MoviePlayer = {
        mount: function (videoId, streamUrl, maskId) {
            var video = document.getElementById(videoId);
            var mask = document.getElementById(maskId);
            var loaded = false;
            var hls = null;

            function load() {
                if (loaded || !video) {
                    return;
                }
                loaded = true;
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = streamUrl;
                    return;
                }
                if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({ enableWorker: true });
                    hls.loadSource(streamUrl);
                    hls.attachMedia(video);
                    return;
                }
                video.src = streamUrl;
            }

            function start() {
                load();
                if (mask) {
                    mask.classList.add("is-hidden");
                }
                var play = video.play();
                if (play && play.catch) {
                    play.catch(function () {});
                }
            }

            if (!video) {
                return;
            }
            if (mask) {
                mask.addEventListener("click", start);
            }
            video.addEventListener("click", function () {
                if (video.paused) {
                    start();
                }
            });
            video.addEventListener("play", function () {
                if (mask) {
                    mask.classList.add("is-hidden");
                }
            });
            window.addEventListener("pagehide", function () {
                if (hls) {
                    hls.destroy();
                }
            });
            load();
        }
    };
})();
