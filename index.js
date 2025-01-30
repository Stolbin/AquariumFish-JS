import { fetchFishDataFromAPI } from "./js/api.js";
import { displayFishItemBox } from "./js/fishItemBox.js";
import { showLoader, hideLoader } from "./js/show-hide_elements.js";
import { createHeaderFish } from "./js/headerTitle.js";
import {
  saveStateToStorage,
  restoreStateFromStorage,
} from "./js/storageFunction.js";
import { scrollToTop } from "./js/scrollToTop.js";
import { relocationStart } from "./js/relocationStartNav.js";

scrollToTop();
relocationStart();

const mainContainer = document.querySelector("main");
export const fishBoxContainer = document.querySelector(".fish_box_container");

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
    // cachedFishData = fishData.record;
    cachedFishData = fishData;
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

export function displayFishBox(fish) {
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
