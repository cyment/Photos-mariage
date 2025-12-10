document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("mainVideo");
  const afterVideoBtn = document.getElementById("afterVideoBtn");

  // Affiche le bouton "Bravo d’avoir regardé" quand la vidéo est terminée
  video.addEventListener("ended", () => {
    afterVideoBtn.classList.remove("hidden");
  });
});
