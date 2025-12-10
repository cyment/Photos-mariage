const overlay = document.getElementById("overlay");
const watchBtn = document.getElementById("watchVideoBtn");
const skipBtn = document.getElementById("skipBtn");

const videoSection = document.getElementById("videoSection");
const photosSection = document.getElementById("photosSection");
const video = document.getElementById("weddingVideo");

// Regarder la vidéo
watchBtn.addEventListener("click", () => {
    overlay.style.display = "none";
    videoSection.classList.remove("hidden");

    // Lancer la vidéo uniquement après un clic utilisateur (règles navigateur)
    video.play().catch(err => {
        console.warn("Lecture auto bloquée :", err);
    });
});

// Aller directement aux photos
skipBtn.addEventListener("click", () => {
    overlay.style.display = "none";
    photosSection.classList.remove("hidden");
});
