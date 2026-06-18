(function () {
  var hlsScript = "https://cdn.jsdelivr.net/npm/hls.js@latest";

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[src="' + src + '"]');
      if (existing) {
        if (window.Hls) {
          resolve();
        } else {
          existing.addEventListener("load", resolve, { once: true });
          existing.addEventListener("error", reject, { once: true });
        }
        return;
      }

      var script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.addEventListener("load", resolve, { once: true });
      script.addEventListener("error", reject, { once: true });
      document.head.appendChild(script);
    });
  }

  function attach(video, stream, playAfterReady) {
    if (!video || !stream) return;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      if (!video.src) {
        video.src = stream;
      }
      if (playAfterReady) {
        video.play().catch(function () {});
      }
      return;
    }

    function useHls() {
      if (!window.Hls || !window.Hls.isSupported()) return;
      if (video._streamEngine) {
        if (playAfterReady) {
          video.play().catch(function () {});
        }
        return;
      }

      var engine = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });

      video._streamEngine = engine;
      engine.loadSource(stream);
      engine.attachMedia(video);
      engine.on(window.Hls.Events.MANIFEST_PARSED, function () {
        if (playAfterReady) {
          video.play().catch(function () {});
        }
      });
    }

    if (window.Hls && window.Hls.isSupported()) {
      useHls();
    } else {
      loadScript(hlsScript).then(useHls).catch(function () {});
    }
  }

  function bindPlayer(frame) {
    var video = frame.querySelector("video");
    var button = frame.querySelector("[data-play-button]");
    if (!video) return;
    var stream = video.getAttribute("data-stream") || "";
    var ready = false;

    function begin() {
      if (!ready) {
        ready = true;
        attach(video, stream, true);
      } else {
        video.play().catch(function () {});
      }
      if (button) {
        button.classList.add("is-hidden");
      }
    }

    if (button) {
      button.addEventListener("click", begin);
    }

    frame.addEventListener("click", function (event) {
      if (event.target === video) return;
      begin();
    });

    video.addEventListener("play", function () {
      if (button) {
        button.classList.add("is-hidden");
      }
    });

    video.addEventListener("pause", function () {
      if (video.currentTime > 0 && !video.ended && button) {
        button.classList.remove("is-hidden");
      }
    });

    attach(video, stream, false);
  }

  document.addEventListener("DOMContentLoaded", function () {
    Array.prototype.slice.call(document.querySelectorAll("[data-video-frame]")).forEach(bindPlayer);
  });
})();
