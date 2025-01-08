export function createImageNavigation(
  mainImage,
  item,
  currentIndex,
  updateDisplayedImage
) {
  //* Кнопка для попереднього зображення
  const prevButton = document.createElement("button");
  prevButton.classList.add("prev-button");
  prevButton.innerHTML = "&#11164;";
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
  nextButton.innerHTML = "&#11166;";
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
