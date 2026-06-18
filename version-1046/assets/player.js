
function initMoviePlayer(videoId, mediaUrl) {
  const video = document.getElementById(videoId);

  if (!video) {
    return;
  }

  const shell = video.closest(".player-shell");
  const button = shell ? shell.querySelector(".play-overlay") : null;
  let attached = false;
  let hlsInstance = null;

  function attachMedia() {
    if (attached) {
      return;
    }

    attached = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = mediaUrl;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(mediaUrl);
      hlsInstance.attachMedia(video);
      return;
    }

    video.src = mediaUrl;
  }

  function playVideo() {
    attachMedia();

    if (shell) {
      shell.classList.add("is-playing");
    }

    video.controls = true;

    const playPromise = video.play();

    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {
        if (shell) {
          shell.classList.remove("is-playing");
        }
      });
    }
  }

  if (button) {
    button.addEventListener("click", playVideo);
  }

  video.addEventListener("click", function () {
    if (video.paused) {
      playVideo();
    }
  });

  window.addEventListener("pagehide", function () {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
}
