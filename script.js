document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startVideoBtn");
  const videoSection = document.getElementById("videoSection");
  const video = document.getElementById("mainVideo");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const presenceOverlay = document.getElementById("presenceOverlay");
  const continueBtn = document.getElementById("continueBtn");
  const photosBtn = document.getElementById("photosBtn");

  video.removeAttribute("controls");

  const PRESENCE_INTERVAL = 30; // secondes
  let presenceTimer = null;
  let hasFinished = false;

  // --- LANCER LA VIDÉO ---
  startBtn.addEventListener("click", () => {
    startBtn.classList.add("hidden");
    videoSection.classList.remove("hidden");

    video.play().catch(() => {
      console.log("Lecture bloquée, utilisez le bouton Lecture.");
    });

    // timer pop-up toutes les PRESENCE_INTERVAL secondes
    if (presenceTimer === null) {
      presenceTimer = setInterval(() => {
        if (!video.paused && !hasFinished) {
          showPresenceOverlay();
        }
      }, PRESENCE_INTERVAL * 1000);
    }
  });

  // --- BOUTON PLAY / PAUSE ---
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
    video.pause();
    playPauseBtn.textContent = "Lecture";
    presenceOverlay.classList.add("show");
  }

  // --- BOUTON CONTINUER ---
  continueBtn.addEventListener("click", () => {
    presenceOverlay.classList.remove("show");
    video.play();
    playPauseBtn.textContent = "Pause";
  });

  // --- FIN VIDÉO ---
  video.addEventListener("ended", () => {
    hasFinished = true;
    playPauseBtn.disabled = true;
    photosBtn.classList.remove("hidden");
    clearInterval(presenceTimer);
  });
});
