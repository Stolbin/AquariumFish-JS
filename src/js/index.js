import "../css/index.css";
import { fetchFishDataFromAPI } from "./api.js";
import { displayFishItemBox } from "./fishItemBox.js";
import { showLoader, hideLoader } from "./show-hide_elements.js";
import { createHeaderFish, createHeaderGroupFish } from "./headerTitle.js";
import { restoreStateFromStorage } from "./storageFunction.js";
import { scrollToTop } from "./scrollToTop.js";
import { createFooter } from "./footer.js";
import { createNavBox } from "./navigations.js";
import "./preventRefresh.js";

scrollToTop();

const mainContainer = document.querySelector("main");
document.querySelector("header").appendChild(createNavBox());
document.querySelector("footer").appendChild(createFooter());

export const fishBoxContainer = document.querySelector(".fish_box_container");
const fishTypeBoxesContainer = document.createElement("div");
fishTypeBoxesContainer.classList.add("fish_type_boxes_container");
mainContainer.appendChild(fishTypeBoxesContainer);

let cachedFishData = null;
let currentFish = null;

function showFishTypeBoxes() {
  fishBoxContainer.classList.add("hidden");
  fishTypeBoxesContainer.classList.remove("hidden");
}

function hideFishTypeBoxes() {
  fishTypeBoxesContainer.classList.add("hidden");
  fishBoxContainer.classList.remove("hidden");
}

function sortFishData(fishData) {
  fishData.sort((a, b) => (a.classNameUA || "").localeCompare(b.classNameUA));

  fishData.forEach((fish) => {
    if (Array.isArray(fish.items)) {
      fish.items.forEach((item) => {
        item.parentFish = fish;
      });
      fish.items.sort((a, b) => (a.titleEN || "").localeCompare(b.titleEN));
    }
  });
}

function generateFishBoxes(fishData) {
  fishTypeBoxesContainer.innerHTML = "";
  const fragment = document.createDocumentFragment();

  fishData.forEach((fish) => {
    fragment.appendChild(createFishTypeBox(fish));
  });

  fishTypeBoxesContainer.appendChild(fragment);
}

function createFishTypeBox(fish) {
  const box = document.createElement("div");
  box.className = "fish_type_box";

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("fish_type_image_container");

  const img = document.createElement("img");
  img.src = fish.image;
  img.alt = fish.image_alt;
  img.loading = "lazy";
  img.classList.add("fish_type_image");
  imageContainer.appendChild(img);

  const linkBox = document.createElement("div");
  linkBox.classList.add("fish_type_linkText_box");

  const link = document.createElement("a");
  link.href = `#${fish.id}`;
  link.classList.add("fish_type_linkText");

  const titleUA = document.createElement("p");
  titleUA.textContent = fish.classNameUA || "";
  const titleEN = document.createElement("p");
  titleEN.textContent = `(${fish.classNameEN})` || "";

  link.appendChild(titleUA);
  link.appendChild(titleEN);
  linkBox.appendChild(link);

  box.appendChild(imageContainer);
  box.appendChild(linkBox);

  box.addEventListener("click", (e) => {
    e.preventDefault();
    history.pushState(
      { fishId: fish.id, source: "type" },
      fish.classNameUA,
      `#${fish.id}`
    );
    displayFishBox(fish);
  });

  return box;
}

function createFishItemBox(item, parentFish) {
  const itemBox = document.createElement("div");
  itemBox.className = "fish_item_box";

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("fish_item_image_container");

  const img = document.createElement("img");
  img.src = item.images?.[0]?.src || "";
  img.alt = item.titleUA;
  img.loading = "lazy";
  img.classList.add("fish_item_image");
  imageContainer.appendChild(img);

  if (item.classification) {
    const headerClassification = document.createElement("h2");
    headerClassification.textContent = item.classification;
    headerClassification.classList.add("item-number");
    imageContainer.appendChild(headerClassification);
  }

  const linkBox = document.createElement("div");
  linkBox.classList.add("fish_item_linkText_box");

  const link = document.createElement("a");
  link.href = `#${item.id}`;
  link.classList.add("fish_item_linkText");

  const titleUA = document.createElement("p");
  titleUA.textContent = item.titleUA || "";
  const titleEN = document.createElement("p");
  titleEN.textContent = `(${item.titleEN})` || "";

  link.appendChild(titleUA);
  link.appendChild(titleEN);
  linkBox.appendChild(link);

  itemBox.appendChild(imageContainer);
  itemBox.appendChild(linkBox);

  itemBox.addEventListener("click", (e) => {
    e.preventDefault();
    const isFromGroup = item.generalClassID !== undefined;
    displayFishItemBox(item, parentFish, isFromGroup, item.generalClassID);
  });

  return itemBox;
}

export function displayFishBox(fish, groupId = null) {
  showLoader();
  hideFishTypeBoxes();
  fishBoxContainer.innerHTML = "";

  if (groupId) {
    const group = fish.items.filter((item) => item.generalClassID === groupId);
    const groupHeader = createHeaderGroupFish(group, () =>
      displayFishBox(fish)
    );
    fishBoxContainer.appendChild(groupHeader);

    const detailedContainer = document.createElement("div");
    detailedContainer.classList.add("fish_items_container");
    group.forEach((item) =>
      detailedContainer.appendChild(createFishItemBox(item, fish))
    );
    fishBoxContainer.appendChild(detailedContainer);

    window.scrollTo({ top: 0, behavior: "auto" });
    hideLoader();
    return;
  }

  const header = createHeaderFish(fish, showFishTypeBoxes);
  fishBoxContainer.appendChild(header);

  const itemsContainer = document.createElement("div");
  itemsContainer.classList.add("fish_items_container");

  const groupedItems = {};
  fish.items.forEach((item) => {
    const id = item.generalClassID || item.id;
    if (!groupedItems[id]) groupedItems[id] = [];
    groupedItems[id].push(item);
  });

  Object.entries(groupedItems).forEach(([id, group]) => {
    if (group.length === 1 || !group[0].generalClassID) {
      itemsContainer.appendChild(createFishItemBox(group[0], fish));
    } else {
      const groupBox = document.createElement("div");
      groupBox.className = "fish_item_box grouped";

      const imgContainer = document.createElement("div");
      imgContainer.classList.add("fish_item_image_container");

      const img = document.createElement("img");
      img.src = group[0].images?.[0]?.src || "";
      img.alt = group[0].generalClassUA || "Невідома група";
      img.loading = "lazy";
      img.classList.add("fish_item_image");
      imgContainer.appendChild(img);

      const linkBox = document.createElement("div");
      linkBox.classList.add("fish_item_linkText_box");

      const link = document.createElement("a");
      link.href = `#${id}`;
      link.classList.add("fish_item_linkText");

      const titleUA = document.createElement("p");
      titleUA.textContent = group[0].generalClassUA || "Невідома група";
      const titleEN = document.createElement("p");
      titleEN.textContent = `(${group[0].generalClassID || ""})`;

      link.appendChild(titleUA);
      link.appendChild(titleEN);
      linkBox.appendChild(link);

      groupBox.appendChild(imgContainer);
      groupBox.appendChild(linkBox);

      groupBox.addEventListener("click", (e) => {
        e.preventDefault();
        displayFishBox(fish, id);
      });

      itemsContainer.appendChild(groupBox);
    }
  });

  if (!fish.items.length) {
    const msg = document.createElement("p");
    msg.textContent = "Немає елементів для цього виду риби.";
    itemsContainer.appendChild(msg);
  }

  fishBoxContainer.appendChild(itemsContainer);
  window.scrollTo({ top: 0, behavior: "auto" });
  hideLoader();
  currentFish = fish;
}

async function fetchFishData() {
  showLoader();
  try {
    cachedFishData = (await fetchFishDataFromAPI()) || [];
    if (!cachedFishData.length) throw new Error("Дані риб порожні.");

    sortFishData(cachedFishData);
    generateFishBoxes(cachedFishData);

    const state = restoreStateFromStorage() || history.state;
    if (state && Object.keys(state).length) {
      if (state.itemId && state.parentFishId) {
        const parentFish = cachedFishData.find(
          (f) => f.id === state.parentFishId
        );
        const item = parentFish?.items.find((it) => it.id === state.itemId);
        if (item) {
          fishTypeBoxesContainer.classList.add("hidden");
          displayFishItemBox(
            item,
            parentFish,
            state.source === "group",
            state.groupId || null
          );
        } else {
          showFishTypeBoxes();
        }
      } else if (state.fishId) {
        const fish = cachedFishData.find((f) => f.id === state.fishId);
        if (fish) displayFishBox(fish, state.groupId || null);
        else showFishTypeBoxes();
      } else showFishTypeBoxes();
    } else {
      showFishTypeBoxes();
    }
  } catch (err) {
    console.error("Помилка завантаження даних:", err);
  } finally {
    hideLoader();
  }
}

window.addEventListener("popstate", (event) => {
  const state = event.state;
  if (!state) return showFishTypeBoxes();

  if (state.itemId && state.parentFishId) {
    const parentFish = cachedFishData.find((f) => f.id === state.parentFishId);
    const item = parentFish?.items.find((it) => it.id === state.itemId);
    if (item)
      return displayFishItemBox(
        item,
        parentFish,
        state.source === "group",
        state.groupId || null
      );
  }

  if (state.fishId) {
    const fish = cachedFishData.find((f) => f.id === state.fishId);
    if (fish) return displayFishBox(fish, state.groupId || null);
  }

  showFishTypeBoxes();
});

fetchFishData();
