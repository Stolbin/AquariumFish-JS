import { handleImageLoading } from "./imageLoader.js";

export function createImageNavigation(
  mainImage,
  item,
  currentIndex,
  updateDisplayedImage,
) {
  const prevButton = document.createElement("button");
  prevButton.classList.add("prev-button");
  prevButton.innerHTML = `
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org">
      <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

  prevButton.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + item.images.length) % item.images.length;
    updateThumbnails(thumbnailStrip, currentIndex);
    triggerImageUpdate();
  });

  const nextButton = document.createElement("button");
  nextButton.classList.add("next-button");
  nextButton.innerHTML = `
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org">
      <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

  nextButton.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % item.images.length;
    updateThumbnails(thumbnailStrip, currentIndex);
    triggerImageUpdate();
  });

  const thumbnailStrip = document.createElement("div");
  thumbnailStrip.classList.add("thumbnail-strip");

  let isDown = false;
  let startX;
  let scrollLeft;

  thumbnailStrip.addEventListener("mousedown", (e) => {
    isDown = true;
    thumbnailStrip.classList.add("grabbing");
    startX = e.pageX - thumbnailStrip.offsetLeft;
    scrollLeft = thumbnailStrip.scrollLeft;
  });

  thumbnailStrip.addEventListener("mouseleave", () => {
    isDown = false;
    thumbnailStrip.classList.remove("grabbing");
  });

  thumbnailStrip.addEventListener("mouseup", () => {
    isDown = false;
    thumbnailStrip.classList.remove("grabbing");
  });

  thumbnailStrip.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - thumbnailStrip.offsetLeft;
    const walk = (x - startX) * 1.5;
    thumbnailStrip.scrollLeft = scrollLeft - walk;
  });

  item.images.forEach((image, index) => {
    const thumbWrapper = document.createElement("div");
    thumbWrapper.classList.add("thumbnail-wrapper");

    const thumbnail = document.createElement("img");
    thumbnail.src = image.src;
    thumbnail.classList.add("thumbnail");
    if (index === currentIndex) thumbnail.classList.add("active-thumbnail");

    handleImageLoading(thumbnail, thumbWrapper);
    thumbWrapper.appendChild(thumbnail);

    thumbWrapper.addEventListener("click", (e) => {
      if (isDown) {
        const dragDistance = Math.abs(
          e.pageX - (startX + thumbnailStrip.offsetLeft),
        );
        if (dragDistance > 5) return;
      }
      currentIndex = index;
      updateThumbnails(thumbnailStrip, currentIndex);
      triggerImageUpdate();
    });
    thumbnailStrip.appendChild(thumbWrapper);
  });

  function triggerImageUpdate() {
    mainImage.classList.remove("loaded");
    mainImage.classList.add("fade-out");

    setTimeout(() => {
      updateDisplayedImage(mainImage, item.images[currentIndex]);
      mainImage.classList.remove("fade-out");
    }, 200);
  }

  function updateThumbnails(thumbnailStrip, activeIndex) {
    const wrappers = thumbnailStrip.querySelectorAll(".thumbnail-wrapper");
    wrappers.forEach((wrapper, index) => {
      const thumb = wrapper.querySelector(".thumbnail");
      if (index === activeIndex) {
        thumb.classList.add("active-thumbnail");
        wrapper.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      } else {
        thumb.classList.remove("active-thumbnail");
      }
    });
  }

  return { prevButton, nextButton, thumbnailStrip };
}
