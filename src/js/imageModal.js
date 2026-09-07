import { createImageNavigation } from "./imageSlider.js";
import { handleImageLoading } from "./imageLoader.js";

export function openImageModal(item, initialIndex, updateParentImageCallback) {
  if (window.innerWidth <= 1400) return;

  const existingOverlay = document.querySelector(".image-modal-overlay");
  if (existingOverlay) existingOverlay.remove();

  const overlay = document.createElement("div");
  overlay.classList.add("image-modal-overlay");

  const modalContent = document.createElement("div");
  modalContent.classList.add("image-modal-content");

  const closeButton = document.createElement("button");
  closeButton.classList.add("image-modal-close");
  closeButton.innerHTML = "&times;";
  modalContent.appendChild(closeButton);

  const modalImageContainer = document.createElement("div");
  modalImageContainer.classList.add("modal-image-container");

  const modalImage = document.createElement("img");
  modalImage.loading = "lazy";
  modalImage.src = item.images?.[initialIndex]?.src || item.image;
  modalImage.alt = item.images?.[initialIndex]?.alt || item.titleUA;
  modalImage.classList.add("fish_item_image");

  modalImageContainer.appendChild(modalImage);
  modalContent.appendChild(modalImageContainer);
  overlay.appendChild(modalContent);
  document.body.appendChild(overlay);

  handleImageLoading(modalImage, modalImageContainer);

  let currentIndex = initialIndex;

  const updateModalImage = (imgElement, newImage) => {
    const container = imgElement.parentElement;

    const oldLoader = container.querySelector(".image-loader-container");
    if (oldLoader) oldLoader.remove();

    imgElement.classList.remove("loaded");
    imgElement.classList.add("fade-out");

    setTimeout(() => {
      imgElement.src = newImage.src;
      imgElement.alt = newImage.alt;
      handleImageLoading(imgElement, container);
      imgElement.classList.remove("fade-out");
    }, 200);

    currentIndex =
      item.images?.findIndex((img) => img.src === newImage.src) || 0;

    if (updateParentImageCallback) {
      updateParentImageCallback(newImage, currentIndex);
    }
  };

  const { prevButton, nextButton, thumbnailStrip } = createImageNavigation(
    modalImage,
    item,
    currentIndex,
    updateModalImage,
  );

  thumbnailStrip.classList.add("modal-thumbnail-strip");

  const wrappers = thumbnailStrip.querySelectorAll(".thumbnail-wrapper");
  wrappers.forEach((wrapper) => {
    wrapper.classList.add("modal-thumbnail-wrapper");

    const img = wrapper.querySelector(".thumbnail");
    if (img) {
      img.classList.add("modal-thumbnail");

      const oldLoader = wrapper.querySelector(".image-loader-container");
      if (oldLoader) oldLoader.remove();

      handleImageLoading(img, wrapper);
    }
  });

  modalImageContainer.appendChild(prevButton);
  modalImageContainer.appendChild(nextButton);
  modalContent.appendChild(thumbnailStrip);

  document.body.classList.add("modal-open");

  const closeModal = () => {
    overlay.remove();
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", handleEsc);
  };

  closeButton.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });

  const handleEsc = (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  };
  document.addEventListener("keydown", handleEsc);
}
