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

  video.play().catch(() => {}); // on essaye de lancer la vidéo

  // ✅ On attend que la vidéo passe réellement en état playing
  video.addEventListener("playing", function initTimer() {
    lastPresenceTime = video.currentTime;
    lastKnownTime = video.currentTime;
    video.removeEventListener("playing", initTimer); // on ne fait ça qu’une fois
  });
});

video.addEventListener("playing", function resumeTimer() {
  if (lastPresenceTime === null) {
    lastPresenceTime = video.currentTime;
    lastKnownTime = video.currentTime;
  }
  video.removeEventListener("playing", resumeTimer);
});
