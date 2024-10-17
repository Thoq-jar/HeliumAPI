document.addEventListener('DOMContentLoaded', () => {
  const missile = document.getElementById("missile");
  const stillPhoto = document.getElementById("stillPhoto");
  const explosion = document.getElementById("explosion");
  const photoRect = stillPhoto.getBoundingClientRect();

  missile.animate(
    [
      { transform: "translateY(0)" },
      { transform: `translateY(${photoRect.top + 300}px)` },
    ],
    {
      duration: 2000,
      easing: "linear",
      fill: "forwards",
    },
  );

  setTimeout(() => {
    explosion.style.display = "block";
    explosion.classList.add("explode");
  }, 4000);
});