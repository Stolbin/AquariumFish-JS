export function showLoader() {
  const loader = document.getElementById("loader");
  loader.style.display = "flex";
  loader.querySelector(".spinner").style.opacity = 1;
}

export function hideLoader() {
  const loader = document.getElementById("loader");
  loader.style.display = "none";
  loader.querySelector(".spinner").style.opacity = 0;
}
