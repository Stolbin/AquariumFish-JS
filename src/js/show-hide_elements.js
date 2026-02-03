export function showLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;

  if (!loader.querySelector(".spinner")) {
    loader.innerHTML = `
      <div class="spinner" style="opacity: 0;">
        <p class="spinner_text">Loading</p>
        <span></span>
      </div>
    `;
  }

  const spinner = loader.querySelector(".spinner");
  loader.style.display = "flex";

  requestAnimationFrame(() => {
    spinner.style.opacity = "1";
  });
}

export function hideLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;

  const spinner = loader.querySelector(".spinner");
  if (spinner) spinner.style.opacity = "0";

  loader.style.display = "none";
}
