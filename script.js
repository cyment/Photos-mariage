document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startVideoBtn");
  const videoSection = document.getElementById("videoSection");
  const video = document.getElementById("mainVideo");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const presenceOverlay = document.getElementById("presenceOverlay");
  const continueBtn = document.getElementById("continueBtn");
  const photosBtn = document.getElementById("photosBtn");

  video.removeAttribute("controls"); // empêcher l’avance rapide
  const PRESENCE_INTERVAL = 30;      // intervalle pop-up en secondes

  let awaitingPresence = false;
  let hasFinished = false;
  let lastPresenceTime = null;       // initialisation après vrai play
  let lastKnownTime = 0;

  // --- LANCEMENT VIDÉO ---
  startBtn.addEventListener("click", () => {
    startBtn.classList.add("hidden");
    videoSection.classList.remove("hidden");

    video.play().then(() => {
      // la vidéo a réellement commencé
      lastKnownTime = video.currentTime;
      lastPresenceTime = video.currentTime;
    }).catch(() => {
      // si play échoue (mobile), attendre interaction sur play/pause
      lastPresenceTime = null;
    });
  });

  // --- BOUTON PLAY / PAUSE ---
  playPauseBtn.addEventListener("click", () => {
    if (video.paused) {
      video.play().then(() => {
        if (lastPresenceTime === null) {
          lastPresenceTime = video.currentTime; // timer démarré après vrai play
        }
      });
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
    presenceOverlay.classList.remove("hidden");
  }

  // --- BOUTON CONTINUER ---
  continueBtn.addEventListener("click", () => {
    presenceOverlay.classList.add("hidden");
    awaitingPresence = false;
    lastPresenceTime = video.currentTime; // recalage du timer
    video.play();
    playPauseBtn.textContent = "Pause";
  });

  // --- SYSTÈME DE CONTRÔLE DE PRÉSENCE ---
  video.addEventListener("timeupdate", () => {
    if (awaitingPresence || hasFinished || lastPresenceTime === null) return;

    // empêcher l'avance manuelle
    if (video.currentTime > lastKnownTime + 1) {
      video.currentTime = lastKnownTime;
      return;
    } else {
      lastKnownTime = video.currentTime;
    }

    // pop-up toutes les PRESENCE_INTERVAL secondes
    if (video.currentTime - lastPresenceTime >= PRESENCE_INTERVAL) {
      showPresenceOverlay();
    }
  });

  // --- FIN DE VIDÉO ---
  video.addEventListener("ended", () => {
    hasFinished = true;
    playPauseBtn.disabled = true;
    photosBtn.classList.remove("hidden");
  });
});
