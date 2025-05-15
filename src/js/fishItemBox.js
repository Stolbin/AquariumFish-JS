import { fishBoxContainer, displayFishBox } from "./index.js";
import { showLoader, hideLoader } from "./show-hide_elements.js";
import { createHeaderItem } from "./headerTitle.js";
import { createImageNavigation } from "./imageSlider.js";
import { saveStateToStorage } from "./storageFunction.js";

let currentItem = null;

export function displayFishItemBox(
  item,
  parentFish,
  isFromGroup = false,
  groupId = null
) {
  showLoader();
  fishBoxContainer.innerHTML = "";

  const header = createHeaderItem(item, () => {
    displayFishBox(parentFish, isFromGroup ? groupId : null);

    history.replaceState(
      {
        fishId: parentFish.id,
        source: isFromGroup ? "group" : "type",
        ...(isFromGroup && { groupId }),
      },
      "",
      `#${parentFish.id}`
    );

    saveStateToStorage({
      fishId: parentFish.id,
      source: isFromGroup ? "group" : "type",
      ...(isFromGroup && { groupId }),
    });
  });

  fishBoxContainer.appendChild(header);

  const detailsContainer = document.createElement("div");
  detailsContainer.classList.add("fish_item_details");

  const imageBox = createImageBox(item);
  detailsContainer.appendChild(imageBox);

  const descriptionContainer = document.createElement("div");
  descriptionContainer.classList.add("fish_item_descriptions_box");
  detailsContainer.appendChild(descriptionContainer);

  const descriptions = item.descriptions || {};

  //! mainInfo
  if (descriptions.mainInfo) {
    const mainInfoContainer = document.createElement("div");
    mainInfoContainer.classList.add("fish_item_descriptions_box");

    const mainInfoTitle = document.createElement("h3");
    mainInfoTitle.classList.add("fish_item_description_mainInfoTitle");
    mainInfoTitle.textContent = `Опис:`;

    const mainInfoText = document.createElement("p");
    mainInfoText.classList.add("fish_item_description_mainInfoText");
    mainInfoText.innerHTML = (descriptions.mainInfo || "")
      .replace(/\n/g, "<br>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    mainInfoContainer.appendChild(mainInfoTitle);
    mainInfoContainer.appendChild(mainInfoText);
    descriptionContainer.appendChild(mainInfoContainer);
  }

  //! environment
  if (descriptions.environment) {
    const environmentContainer = document.createElement("div");
    environmentContainer.classList.add("fish_item_descriptions_box");

    const environmentTitle = document.createElement("h3");
    environmentTitle.classList.add("fish_item_description_environmentTitle");
    environmentTitle.textContent = `Середовище:`;

    const environmentText = document.createElement("p");
    environmentText.classList.add("fish_item_description_environmentText");
    environmentText.innerHTML = (descriptions.environment || "")
      .replace(/\n/g, "<br>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    environmentContainer.appendChild(environmentTitle);
    environmentContainer.appendChild(environmentText);
    descriptionContainer.appendChild(environmentContainer);
  }

  //! reproduction
  if (descriptions.reproduction) {
    const reproductionContainer = document.createElement("div");
    reproductionContainer.classList.add("fish_item_descriptions_box");

    const reproductionTitle = document.createElement("h3");
    reproductionTitle.classList.add("fish_item_description_reproductionTitle");
    reproductionTitle.textContent = `Розмноження:`;

    const reproductionText = document.createElement("p");
    reproductionText.classList.add("fish_item_description_reproductionText");
    reproductionText.innerHTML = (descriptions.reproduction || "")
      .replace(/\n/g, "<br>&nbsp;&nbsp;&nbsp;")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    reproductionContainer.appendChild(reproductionTitle);
    reproductionContainer.appendChild(reproductionText);
    descriptionContainer.appendChild(reproductionContainer);
  }

  fishBoxContainer.appendChild(detailsContainer);
  window.scrollTo({ top: 0, behavior: "auto" });
  hideLoader();
  currentItem = item;

  history.replaceState(
    {
      itemId: item.id,
      parentFishId: parentFish.id,
      source: isFromGroup ? "group" : "type",
      ...(isFromGroup && { groupId }),
    },
    item.titleUA,
    `#${item.id}`
  );

  saveStateToStorage({
    itemId: item.id,
    parentFishId: parentFish.id,
    source: isFromGroup ? "group" : "type",
    ...(isFromGroup && { groupId }),
  });
}

function createImageBox(item) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("image-box-wrapper");

  const imageBox = document.createElement("div");
  imageBox.classList.add("image-box");

  const mainImageContainer = document.createElement("div");
  mainImageContainer.classList.add("main-image");

  const mainImage = document.createElement("img");
  mainImage.loading = "lazy";
  mainImage.src = item.images?.[0]?.src || item.image;
  mainImage.alt = item.images?.[0]?.alt || item.titleUA;
  mainImage.id = "displayed-image";
  mainImageContainer.appendChild(mainImage);

  let currentIndex = 0;

  const { prevButton, nextButton, thumbnailStrip } = createImageNavigation(
    mainImage,
    item,
    currentIndex,
    updateDisplayedImage
  );

  mainImageContainer.appendChild(prevButton);
  mainImageContainer.appendChild(nextButton);
  imageBox.appendChild(mainImageContainer);
  imageBox.appendChild(thumbnailStrip);

  const mainDescription = document.createElement("div");
  mainDescription.classList.add("main-description");

  const descriptions = [
    { title: "Регіон проживання:", value: item.region || null },
    { title: "Розмір:", value: item.size ? `${item.size}см` : null },
    {
      title: "Температура:",
      value: item.temperature ? `${item.temperature}°C` : null,
    },
    { title: "pH:", value: item.pH ? `${item.pH}pH` : null },
    { title: "dGH:", value: item.dGH ? `${item.dGH}°` : null },
  ];

  descriptions.forEach((desc) => {
    if (!desc.value) return;

    const descriptionBox = document.createElement("div");
    descriptionBox.classList.add("description-box");

    const heading = document.createElement("h3");
    heading.classList.add("main-description_title");
    heading.textContent = desc.title;

    const paragraph = document.createElement("p");
    paragraph.classList.add("main-description_text");
    paragraph.textContent = desc.value;

    descriptionBox.appendChild(heading);
    descriptionBox.appendChild(paragraph);
    mainDescription.appendChild(descriptionBox);
  });

  wrapper.appendChild(imageBox);
  wrapper.appendChild(mainDescription);

  return wrapper;
}

function updateDisplayedImage(mainImage, newImage) {
  mainImage.src = newImage.src;
  mainImage.alt = newImage.alt;
}
