(function () {
  window.mountMoviePlayer = function (sourceUrl) {
    var player = document.querySelector('[data-player]');
    if (!player) {
      return;
    }

    var video = player.querySelector('video');
    var cover = player.querySelector('[data-cover-layer]');
    var triggers = player.querySelectorAll('[data-start-player]');
    var attached = false;
    var hls = null;

    var attach = function () {
      if (attached || !video) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = sourceUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hls.loadSource(sourceUrl);
        hls.attachMedia(video);
      } else {
        video.src = sourceUrl;
      }

      attached = true;
    };

    var start = function () {
      attach();
      if (cover) {
        cover.classList.add('is-hidden');
      }
      if (video) {
        video.controls = true;
        var task = video.play();
        if (task && task.catch) {
          task.catch(function () {});
        }
      }
    };

    Array.prototype.forEach.call(triggers, function (button) {
      button.addEventListener('click', start);
    });

    if (cover) {
      cover.addEventListener('click', start);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          start();
        }
      });
    }

    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  };
})();
