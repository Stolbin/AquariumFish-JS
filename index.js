import { fetchFishDataFromAPI } from "./js/api.js";
import { showLoader, hideLoader } from "./js/show-hide_elements.js";
import { createImageNavigation } from "./js/imageSlider.js";
import { createHeaderFish, createHeaderItem } from "./js/headerTitle.js";
import {
  saveStateToStorage,
  restoreStateFromStorage,
} from "./js/storageFunction.js";

const mainContainer = document.querySelector("main");
const fishBoxContainer = document.querySelector(".fish_box_container");

const fishTypeBoxesContainer = document.createElement("div");
fishTypeBoxesContainer.classList.add("fish_type_boxes_container");
mainContainer.appendChild(fishTypeBoxesContainer);

let cachedFishData = null;
let currentFish = null;
let currentItem = null;
let currentIndex = 0;

async function fetchFishData() {
  showLoader();
  try {
    const fishData = await fetchFishDataFromAPI();
    cachedFishData = fishData.record;
    sortFishData(cachedFishData);
    generateFishBoxes(cachedFishData);

    if (cachedFishData.length === 0) {
      throw new Error("Дані риб порожні.");
    }
    const savedState = restoreStateFromStorage();
    const currentState = history.state;

    if (savedState) {
      handleState(savedState);
    } else if (currentState) {
      handleState(currentState);
    } else {
      showFishTypeBoxes();
    }
  } catch (error) {
    console.error("Помилка завантаження даних:", error);
  } finally {
    hideLoader();
  }
}

function handleState(state) {
  if (state.itemId) {
    const item = findItemById(state.itemId);
    if (item) {
      displayFishItemBox(item, item.parentFish);
      fishTypeBoxesContainer.classList.add("hidden");
    } else {
      showFishTypeBoxes();
    }
  } else if (state.fishId) {
    const fish = cachedFishData.find((f) => f.id === state.fishId);
    if (fish) {
      displayFishBox(fish);
    }
  } else {
    showFishTypeBoxes();
  }
}

function displayFishItemBox(item, parentFish) {
  showLoader();
  fishBoxContainer.innerHTML = "";

  const header = createHeaderItem(item, () => {
    displayFishBox(parentFish);
    history.replaceState(
      { fishId: parentFish.id, source: "type" },
      "",
      `#${parentFish.id}`
    );
    saveStateToStorage({ fishId: parentFish.id, source: "type" });
  });

  fishBoxContainer.appendChild(header);

  const detailsContainer = document.createElement("div");
  detailsContainer.classList.add("fish_item_details");

  const imageBox = createImageBox(item);
  detailsContainer.appendChild(imageBox);

  const descriptionContainer = document.createElement("div");
  descriptionContainer.classList.add("fish_item_description_box");
  detailsContainer.appendChild(descriptionContainer);

  //! Descriptions
  const descriptions = item.descriptions || {};

  //! Main Info
  if (descriptions.mainInfo) {
    const mainInfoContainer = document.createElement("div");
    mainInfoContainer.classList.add("fish_item_descriptions_box");
    const mainInfoTitle = document.createElement("h3");
    mainInfoTitle.classList.add("fish_item_description_mainInfoTitle");
    mainInfoTitle.textContent = `Опис:`;
    const mainInfoText = document.createElement("p");
    mainInfoText.classList.add("fish_item_description_mainInfoText");
    mainInfoText.textContent = descriptions.mainInfo || "";

    descriptionContainer.appendChild(mainInfoContainer);
    mainInfoContainer.innerHTML = `<h3>${mainInfoTitle.textContent}</h3> <p>${mainInfoText.textContent}</p>`;
  }

  //! Environment
  if (descriptions.environment) {
    const environmentContainer = document.createElement("div");
    environmentContainer.classList.add("fish_item_descriptions_box");
    const environmentTitle = document.createElement("h3");
    environmentTitle.classList.add("fish_item_description_environmentTitle");
    environmentTitle.textContent = `Середовище:`;
    const environmentText = document.createElement("p");
    environmentText.classList.add("fish_item_description_environmentText");
    environmentText.textContent = descriptions.environment || "";

    descriptionContainer.appendChild(environmentContainer);
    environmentContainer.innerHTML = `<h3>${environmentTitle.textContent}</h3> <p>${environmentText.textContent}</p>`;
  }

  //! Reproduction
  if (descriptions.reproduction) {
    const reproductionContainer = document.createElement("div");
    reproductionContainer.classList.add("fish_item_descriptions_box");
    const reproductionTitle = document.createElement("h3");
    reproductionTitle.classList.add("fish_item_description_reproductionTitle");
    reproductionTitle.textContent = `Розмноження:`;
    const reproductionText = document.createElement("p");
    reproductionText.classList.add("fish_item_description_reproductionText");
    reproductionText.textContent = descriptions.reproduction || "";

    descriptionContainer.appendChild(reproductionContainer);
    reproductionContainer.innerHTML = `<h3>${reproductionTitle.textContent}</h3> <p>${reproductionText.textContent}</p>`;
  }

  fishBoxContainer.appendChild(detailsContainer);

  hideLoader();
  currentItem = item;

  history.replaceState(
    { itemId: item.id, parentFishId: parentFish.id, source: "item" },
    item.titleUA,
    `#${item.id}`
  );
  saveStateToStorage({
    itemId: item.id,
    parentFishId: parentFish.id,
    source: "item",
  });
}

function findItemById(itemId) {
  return cachedFishData
    .flatMap((fish) => fish.items)
    .find((item) => item.id === itemId);
}

function sortFishData(fishData) {
  fishData.sort((a, b) => (a.classNameUA || "").localeCompare(b.classNameUA));

  fishData.forEach((fish) => {
    if (fish.items && Array.isArray(fish.items)) {
      fish.items.forEach((item) => {
        item.parentFish = fish;
      });

      fish.items.sort((a, b) => (a.titleUA || "").localeCompare(b.titleUA));
    }
  });
}

function generateFishBoxes(fishData) {
  fishTypeBoxesContainer.innerHTML = "";
  const fragment = document.createDocumentFragment();

  fishData.forEach((fish) => {
    const box = createFishTypeBox(fish);
    fragment.appendChild(box);
  });

  fishTypeBoxesContainer.appendChild(fragment);
}

function createFishTypeBox(fish) {
  showLoader();
  const box = document.createElement("div");
  box.className = "fish_type_box";

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("fish_type_image_container");

  const img = document.createElement("img");
  img.src = fish.image;
  img.alt = fish.image_alt;
  img.classList.add("fish_type_image");

  imageContainer.appendChild(img);

  const link = document.createElement("a");
  link.href = `#${fish.id}`;
  link.classList.add("fish_type_linkText");

  const titleUA = document.createElement("p");
  titleUA.textContent = fish.classNameUA || "";
  const titleEN = document.createElement("p");
  titleEN.textContent = `(${fish.classNameEN})` || "";

  link.appendChild(titleUA);
  link.appendChild(titleEN);

  box.appendChild(imageContainer);
  box.appendChild(link);

  box.addEventListener("click", (e) => {
    e.preventDefault();
    history.pushState(
      { fishId: fish.id, source: "type" },
      fish.classNameUA,
      `#${fish.id}`
    );
    displayFishBox(fish);
    saveStateToStorage({ fishId: fish.id, source: "type" });
  });

  hideLoader();
  return box;
}

function displayFishBox(fish) {
  showLoader();
  hideFishTypeBoxes();

  fishBoxContainer.innerHTML = "";

  const header = createHeaderFish(fish, () => {
    showFishTypeBoxes();
    history.replaceState({ source: "type" }, "", "");
    saveStateToStorage({ source: "type" });
  });

  fishBoxContainer.appendChild(header);

  const itemsContainer = document.createElement("div");
  itemsContainer.classList.add("fish_items_container");

  if (fish.items && fish.items.length > 0) {
    fish.items.forEach((item) => {
      const itemBox = createFishItemBox(item, fish);
      itemsContainer.appendChild(itemBox);
    });
  } else {
    const noItemsMessage = document.createElement("p");
    noItemsMessage.textContent = "Немає елементів для цього виду риби.";
    itemsContainer.appendChild(noItemsMessage);
  }

  fishBoxContainer.appendChild(itemsContainer);
  hideLoader();
  currentFish = fish;

  history.replaceState(
    { fishId: fish.id, source: "type" },
    fish.id,
    `#${fish.id}`
  );
  saveStateToStorage({ fishId: fish.id, source: "type" });
}

function createFishItemBox(item, parentFish) {
  const itemBox = document.createElement("div");
  itemBox.className = "fish_item_box";

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("fish_item_image_container");

  const img = document.createElement("img");
  img.src = item.images && item.images[0]?.src;
  img.alt = item.titleUA;
  img.classList.add("fish_item_image");
  imageContainer.appendChild(img);

  if (item.classification) {
    const headerTitleСlassification = document.createElement("h2");
    headerTitleСlassification.textContent = item.classification;
    headerTitleСlassification.classList.add("item-number");
    imageContainer.appendChild(headerTitleСlassification);
  }

  const link = document.createElement("a");
  link.href = `#${item.id}`;
  link.classList.add("fish_item_linkText");

  const titleUA = document.createElement("p");
  titleUA.textContent = item.titleUA || "";
  const titleEN = document.createElement("p");
  titleEN.textContent = `(${item.titleEN})` || "";

  link.appendChild(titleUA);
  link.appendChild(titleEN);

  itemBox.appendChild(imageContainer);
  itemBox.appendChild(link);

  itemBox.addEventListener("click", (e) => {
    e.preventDefault();
    history.pushState(
      {
        itemId: item.titleEN,
        parentFishId: parentFish.titleEN,
        source: "item",
      },
      item.titleEN,
      `#${item.titleEN}`
    );
    displayFishItemBox(item, parentFish);
    saveStateToStorage({
      itemId: item.id,
      parentFishId: parentFish.id,
      source: "item",
    });
  });

  return itemBox;
}

function createImageBox(item) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("image-box-wrapper");

  const imageBox = document.createElement("div");
  imageBox.classList.add("image-box");

  const mainImageContainer = document.createElement("div");
  mainImageContainer.classList.add("main-image");

  const mainImage = document.createElement("img");
  mainImage.src = item.images[0]?.src || item.image;
  mainImage.alt = item.images[0]?.alt || item.titleUA;
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
      title: "Температура: ",
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

function showFishTypeBoxes() {
  fishBoxContainer.classList.add("hidden");
  fishTypeBoxesContainer.classList.remove("hidden");
  history.replaceState({ source: "type" }, "", "/");
}

function hideFishTypeBoxes() {
  fishTypeBoxesContainer.classList.add("hidden");
  fishBoxContainer.classList.remove("hidden");
}

fetchFishData();
