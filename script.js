document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startVideoBtn");
  const videoSection = document.getElementById("videoSection");
  const video = document.getElementById("mainVideo");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const presenceOverlay = document.getElementById("presenceOverlay");
  const continueBtn = document.getElementById("continueBtn");
  const photosBtn = document.getElementById("photosBtn");

  // Enlever les contrôles natifs → éviter avance rapide
  video.removeAttribute("controls");

  // Intervalle entre pop-ups de présence (en secondes)
  const PRESENCE_INTERVAL = 30;

  let awaitingPresence = false;
  let hasFinished = false;
  let lastPresenceTime = null; // sera initialisé quand la vidéo démarre
  let lastKnownTime = 0;       // sert à détecter avance manuelle

  // --- LANCEMENT VIDÉO ---------------------------------------
  startBtn.addEventListener("click", () => {
    startBtn.classList.add("hidden");
    videoSection.classList.remove("hidden");

    video.play().catch(() => {
      // Certains navigateurs peuvent bloquer le play auto,
      // l'utilisateur cliquera sur le bouton play.
    });
  });

  // --- BOUTON PLAY / PAUSE -----------------------------------
  playPauseBtn.addEventListener("click", () => {
    if (video.paused) {
      video.play();
      playPauseBtn.textContent = "Pause";
    } else {
      video.pause();
      playPauseBtn.textContent = "Lecture";
    }
  });

  // --- AFFICHER POP-UP ---------------------------------------
  function showPresenceOverlay() {
    awaitingPresence = true;
    video.pause();
    playPauseBtn.textContent = "Lecture";
    presenceOverlay.classList.remove("hidden");
  }

  // --- BOUTON CONTINUER ---------------------------------------
  continueBtn.addEventListener("click", () => {
    presenceOverlay.classList.add("hidden");
    awaitingPresence = false;

    // 🔥 Très important : on recale le minuteur ici
    lastPresenceTime = video.currentTime;

    video.play();
    playPauseBtn.textContent = "Pause";
  });

  // --- SYSTÈME DE CONTRÔLE DE PRÉSENCE ------------------------
  video.addEventListener("timeupdate", () => {
    if (awaitingPresence || hasFinished) return;

    // Initialiser le timer du premier contrôle
    if (lastPresenceTime === null) {
      lastPresenceTime = video.currentTime;
    }

    // Empêcher l'avance manuelle
    if (video.currentTime > lastKnownTime
