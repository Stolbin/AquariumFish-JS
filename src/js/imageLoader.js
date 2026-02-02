export function createImageLoader(isSmall = false) {
  const loaderContainer = document.createElement("div");
  loaderContainer.classList.add("image-loader-container");
  if (isSmall) loaderContainer.classList.add("small-loader");

  loaderContainer.innerHTML = `
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
  `;
  return loaderContainer;
}

export function handleImageLoading(img, container) {
  const isSmall =
    container.classList.contains("thumbnail-wrapper") ||
    container.classList.contains("thumbnail-strip");
  const loader = createImageLoader(isSmall);

  if (!img.complete) {
    container.appendChild(loader);
  }

  img.classList.remove("loaded");

  img.onload = () => {
    setTimeout(() => {
      img.classList.add("loaded");
      if (loader.parentNode === container) loader.remove();
    }, 100);
  };

  img.onerror = () => {
    if (loader.parentNode === container) loader.remove();
    img.classList.add("loaded");
  };

  if (img.complete) img.onload();
}
