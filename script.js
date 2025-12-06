document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startVideoBtn");
  const videoSection = document.getElementById("videoSection");
  const video = document.getElementById("mainVideo");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const presenceOverlay = document.getElementById("presenceOverlay");
  const continueBtn = document.getElementById("continueBtn");
  const photosBtn = document.getElementById("photosBtn");

  video.removeAttribute("controls"); 
  const PRESENCE_INTERVAL = 30;
  let awaitingPresence = false;
  let hasFinished = false;
  let lastPresenceTime = null;
  let lastKnownTime = 0;

  // --- LANCEMENT VIDÉO ---
  startBtn.addEventListener("click", () => {
    startBtn.classList.add("hidden");
    videoSection.classList.remove("hidden");

    // force la lecture
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        console.log("Lecture bloquée par le navigateur, cliquez sur Lecture.");
      });
    }

    // initialise le timer quand la vidéo commence réellement
    video.addEventListener("playing", function initTimer() {
      lastPresenceTime = video.currentTime;
      lastKnownTime = video.currentTime;
      video.removeEventListener("playing", initTimer);
    });
  });

  // --- PLAY / PAUSE ---
  playPauseBtn.addEventListener("click", () => {
    if (video.paused) {
      video.play().catch(() => {});
      playPauseBtn.textContent = "Pause";
    } else {
      video.pause();
      playPauseBtn.textContent = "Lecture";
    }
  });

  // --- AFFICHER POP-UP ---
  function showPresenceOverlay() {
    awaitingPresence = true;
    video.pause();
    playPauseBtn.textContent = "Lecture";
    presenceOverlay.classList.add("show");
  }

  // --- BOUTON CONTINUER ---
  continueBtn.addEventListener("click", () => {
    presenceOverlay.classList.remove("show");
    awaitingPresence = false;
    lastPresenceTime = video.currentTime;
    video.play();
    playPauseBtn.textContent = "Pause";
  });

  // --- CONTRÔLE DE PRÉSENCE ---
  video.addEventListener("timeupdate", () => {
    if (awaitingPresence || hasFinished || lastPresenceTime === null) return;

    if (video.currentTime > lastKnownTime + 1) {
      video.currentTime = lastKnownTime;
      return;
    } else {
      lastKnownTime = video.currentTime;
    }

    if (video.currentTime - lastPresenceTime >= PRESENCE_INTERVAL) {
      showPresenceOverlay();
    }
  });

  // --- FIN VIDÉO ---
  video.addEventListener("ended", () => {
    hasFinished = true;
    playPauseBtn.disabled = true;
    photosBtn.classList.remove("hidden");
  });
});
