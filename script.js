document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startVideoBtn");
  const videoSection = document.getElementById("videoSection");
  const video = document.getElementById("mainVideo");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const presenceOverlay = document.getElementById("presenceOverlay");
  const continueBtn = document.getElementById("continueBtn");
  const photosBtn = document.getElementById("photosBtn");

  // Empêche l’avance rapide
  video.removeAttribute("controls"); 

  const PRESENCE_INTERVAL = 30; // intervalle pop-ups en secondes
  let awaitingPresence = false;
  let hasFinished = false;
  let lastPresenceTime = null; // initialisé après vrai play
  let lastKnownTime = 0;

  // --- LANCEMENT VIDÉO ---
  startBtn.addEventListener("click", () => {
    startBtn.classList.add("hidden");
    videoSection.classList.remove("hidden");

    video.play().then(() => {
      // vidéo réellement démarrée
      lastKnownTime = video.currentTime;
      lastPresenceTime = video.currentTime;
    }).catch(() => {
      // si play échoue (ex : mobile), attendre interaction sur play/pause
      lastPresenceTime = null;
