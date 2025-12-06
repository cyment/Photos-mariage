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

  // on demande explicitement au navigateur de jouer la vidéo
  const playPromise = video.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        // lecture acceptée par le navigateur
        // lastPresenceTime sera initialisé dans 'playing' event
      })
      .catch(error => {
        // Si ça bloque, l'utilisateur devra cliquer sur play
        console.log("Lecture bloquée par le navigateur, cliquez sur lecture.");
      });
  }

  // --- INITIALISATION DU TIMER QUAND LA VIDÉO COMMENCE VRAIMENT ---
  video.addEventListener("playing", function initTimer() {
    lastPresenceTime = video.currentTime;
    lastKnownTime = video.currentTime;
    video.removeEventListener("playing", initTimer); // ne fait ça qu’une fois
  });
});


video.addEventListener("playing", function resumeTimer() {
  if (lastPresenceTime === null) {
    lastPresenceTime = video.currentTime;
    lastKnownTime = video.currentTime;
  }
  video.removeEventListener("playing", resumeTimer);
});
