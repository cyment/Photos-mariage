document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startVideoBtn");
  const videoSection = document.getElementById("videoSection");
  const video = document.getElementById("mainVideo");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const presenceOverlay = document.getElementById("presenceOverlay");
  const continueBtn = document.getElementById("continueBtn");
  const photosBtn = document.getElementById("photosBtn");

  // IMPORTANT : on enlève les contrôles natifs pour éviter l'avance rapide
  video.removeAttribute("controls");

  // ⏱️ Checkpoints en secondes où on demande "toujours là ?"
  // Adapte selon la longueur de ta vidéo
  const checkpoints = [60, 180]; // 1 min, 3 min, par ex.
  let nextCheckpointIndex = 0;
  let awaitingPresence = false;
  let hasFinished = false;

  // Lancer la vidéo après le texte d'intro
  startBtn.addEventListener("click", () => {
    startBtn.classList.add("hidden");
    videoSection.classList.remove("hidden");
    // Lancer la vidéo (l’utilisateur a interagi, donc OK pour la plupart des navigateurs)
    video.play().catch(() => {
      // Si ça bloque, tant pis, l’utilisateur pourra cliquer sur Pause/Play
    });
  });

  // Play / Pause custom
  playPauseBtn.addEventListener("click", () => {
    if (video.paused) {
      video.play();
      playPauseBtn.textContent = "Pause";
    } else {
      video.pause();
      playPauseBtn.textContent = "Lecture";
    }
  });

  // Affichage de l'overlay "présence"
  function showPresenceOverlay() {
    awaitingPresence = true;
    video.pause();
    playPauseBtn.textContent = "Lecture";
    presenceOverlay.classList.remove("hidden");
  }

  continueBtn.addEventListener("click", () => {
    presenceOverlay.classList.add("hidden");
    awaitingPresence = false;
    video.play();
    playPauseBtn.textContent = "Pause";
  });

  // Vérifier les checkpoints pendant la lecture
  video.addEventListener("timeupdate", () => {
    if (hasFinished || awaitingPresence) return;

    if (nextCheckpointIndex < checkpoints.length) {
      const target = checkpoints[nextCheckpointIndex];
      if (video.currentTime >= target) {
        nextCheckpointIndex++;
        showPresenceOverlay();
      }
    }
  });

  // Quand la vidéo se termine → on débloque les photos
  video.addEventListener("ended", () => {
    hasFinished = true;
    playPauseBtn.disabled = true;
    photosBtn.classList.remove("hidden");
  });
});
