export function createImageNavigation(
  mainImage,
  item,
  currentIndex,
  updateDisplayedImage
) {
  const prevButton = document.createElement("button");
  prevButton.classList.add("prev-button");

  const prevArrow = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  prevArrow.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  prevArrow.setAttribute("viewBox", "0 0 24 24");
  prevArrow.setAttribute("width", "24");
  prevArrow.setAttribute("height", "24");
  prevArrow.innerHTML = `<path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;

  prevButton.appendChild(prevArrow);
  prevButton.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + item.images.length) % item.images.length;
    updateThumbnails(thumbnailStrip, currentIndex);
    mainImage.classList.add("fade-out");

    setTimeout(() => {
      updateDisplayedImage(mainImage, item.images[currentIndex]);
      mainImage.classList.remove("fade-out");
    }, 500);
  });

  //* Кнопка для наступного зображення
  const nextButton = document.createElement("button");
  nextButton.classList.add("next-button");

  const nextArrow = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  nextArrow.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  nextArrow.setAttribute("viewBox", "0 0 24 24");
  nextArrow.setAttribute("width", "24");
  nextArrow.setAttribute("height", "24");
  nextArrow.innerHTML = `<path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;

  nextButton.appendChild(nextArrow);
  nextButton.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % item.images.length;
    updateThumbnails(thumbnailStrip, currentIndex);
    mainImage.classList.add("fade-out");

    setTimeout(() => {
      updateDisplayedImage(mainImage, item.images[currentIndex]);
      mainImage.classList.remove("fade-out");
    }, 500);
  });

  const thumbnailStrip = document.createElement("div");
  thumbnailStrip.classList.add("thumbnail-strip");

  item.images.forEach((image, index) => {
    const thumbnail = document.createElement("img");
    thumbnail.src = image.src;
    thumbnail.alt = image.alt || item.title;
    thumbnail.classList.add("thumbnail");
    if (index === currentIndex) thumbnail.classList.add("active-thumbnail");
    thumbnail.addEventListener("click", () => {
      currentIndex = index;
      updateThumbnails(thumbnailStrip, currentIndex);
      mainImage.classList.add("fade-out");

      setTimeout(() => {
        updateDisplayedImage(mainImage, image);
        mainImage.classList.remove("fade-out");
      }, 500);
    });
    thumbnailStrip.appendChild(thumbnail);
  });

  function updateThumbnails(thumbnailStrip, activeIndex) {
    const thumbnails = thumbnailStrip.querySelectorAll(".thumbnail");
    thumbnails.forEach((thumbnail, index) => {
      if (index === activeIndex) {
        thumbnail.classList.add("active-thumbnail");
      } else {
        thumbnail.classList.remove("active-thumbnail");
      }
    });
  }

  return {
    prevButton,
    nextButton,
    thumbnailStrip,
  };
}
