document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startVideoBtn");
  const videoSection = document.getElementById("videoSection");
  const video = document.getElementById("mainVideo");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const presenceOverlay = document.getElementById("presenceOverlay");
  const continueBtn = document.getElementById("continueBtn");
  const photosBtn = document.getElementById("photosBtn");

  // Durée entre les pop-ups en secondes
  const PRESENCE_INTERVAL = 30;

  let awaitingPresence = false;
  let hasFinished = false;
  let lastPresenceTime = 0; // moment où la dernière pop-up a été montrée

  // Enlever les contrôles natifs pour ne pas avancer rapidement
  video.removeAttribute("controls");

  // Empêcher l'utilisateur d'avancer la vidéo manuellement
  let lastKnownTime = 0;
  video.addEventListener("timeupdate", () => {
    // Si on est en cours de pop-up, ne rien faire
    if (awaitingPresence || hasFinished) return;

    // Empêcher l'avance manuelle
    if (video.currentTime > lastKnownTime + 1) {
      video.currentTime = lastKnownTime;
    } else {
      lastKnownTime = video.currentTime;
    }

    // Vérifier si on doit afficher une pop-up
    if (video.currentTime - lastPresenceTime >= PRESENCE_INTERVAL) {
      showPresenceOverlay();
      lastPresenceTime = video.currentTime; 
    }
  });

  video.addEventListener("seeked", () => {
    // Rembobiner si tentative d'avance
    if (video.currentTime > lastKnownTime + 1) {
      video.currentTime = lastKnownTime;
    }
  });

  // Démarrage vidéo
  startBtn.addEventListener("click", () => {
    startBtn.classList.add("hidden");
    videoSection.classList.remove("hidden");

    video.play().then(() => {
      lastKnownTime = 0;
      lastPresenceTime = 0;
    }).catch(() => {});
  });

  playPauseBtn.addEventListener("click", () => {
    if (video.paused) {
      video.play();
      playPauseBtn.textContent = "Pause";
    } else {
      video.pause();
      playPauseBtn.textContent = "Lecture";
    }
  });

  function showPresenceOverlay() {
    awaitingPresence = true;
    video.pause();
    playPauseBtn.textContent = "Lecture";

    // Empêcher qu'une pop-up ne s'affiche pendant une autre
    presenceOverlay.classList.remove("hidden");
  }

  continueBtn.addEventListener("click", () => {
    presenceOverlay.classList.add("hidden");
    awaitingPresence = false;

    video.play();
    playPauseBtn.textContent = "Pause";
  });

  // Déblocage final
  video.addEventListener("ended", () => {
    hasFinished = true;
    playPauseBtn.disabled = true;
    photosBtn.classList.remove("hidden");
  });
});
