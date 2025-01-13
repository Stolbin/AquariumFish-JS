import { fetchFishDataFromAPI } from "./js/api.js";
import { showLoader, hideLoader } from "./js/show-hide_elements.js";
import { createImageNavigation } from "./js/imageSlider.js";

//* Основні елементи DOM
const mainContainer = document.querySelector("main");
const fishBoxContainer = document.querySelector(".fish_box_container");

//* Контейнер для рендерингу Fish_type_box
const fishTypeBoxesContainer = document.createElement("div");
fishTypeBoxesContainer.classList.add("fish_type_boxes_container");
mainContainer.appendChild(fishTypeBoxesContainer);

//* Кеш даних
let cachedFishData = null;
let currentFish = null;
let currentItem = null;
let currentIndex = 0;

//* Завантаження даних з API
async function fetchFishData() {
  showLoader();
  try {
    const fishData = await fetchFishDataFromAPI();
    cachedFishData = fishData.record;
    sortFishData(cachedFishData);
    generateFishBoxes(cachedFishData);
  } catch (error) {
    console.error("Помилка завантаження даних:", error);
  } finally {
    hideLoader();
  }
}

//* Сортування риб по алфавіту
function sortFishData(fishData) {
  fishData.sort((a, b) => a.className.localeCompare(b.className));
  fishData.forEach((fish) => {
    if (fish.items && Array.isArray(fish.items)) {
      fish.items.sort((a, b) => a.title.localeCompare(b.title));
    }
  });
}

//* Генерація Fish_type_box
function generateFishBoxes(fishData) {
  fishTypeBoxesContainer.innerHTML = "";
  const fragment = document.createDocumentFragment();

  fishData.forEach((fish) => {
    const box = createFishTypeBox(fish);
    fragment.appendChild(box);
  });

  fishTypeBoxesContainer.appendChild(fragment);
}

//* Створення Fish_type_box
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
  link.textContent = fish.className;
  link.classList.add("fish_type_linkText");

  box.appendChild(imageContainer);
  box.appendChild(link);

  box.addEventListener("click", (e) => {
    e.preventDefault();
    history.pushState(
      { fishId: fish.id, source: "type" },
      fish.className,
      `#${fish.id}`
    );
    displayFishBox(fish);
  });

  hideLoader();
  return box;
}

//* Відображення Fish_box
function displayFishBox(fish) {
  showLoader();
  hideFishTypeBoxes();
  fishBoxContainer.innerHTML = "";

  const header = createHeader(fish.className, () => {
    showFishTypeBoxes();
    history.replaceState({ source: "type" }, "", "");
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
    fish.className,
    `#${fish.id}`
  );
}

//* Створення Fish_item_box
function createFishItemBox(item, parentFish) {
  const itemBox = document.createElement("div");
  itemBox.className = "fish_item_box";

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("fish_item_image_container");

  const img = document.createElement("img");
  img.src = item.image || (item.images && item.images[0]?.src);
  img.alt = item.title;
  img.classList.add("fish_item_image");
  imageContainer.appendChild(img);

  const link = document.createElement("a");
  link.href = `#${item.id}`;
  link.textContent = item.title;
  link.classList.add("fish_item_linkText");

  itemBox.appendChild(imageContainer);
  itemBox.appendChild(link);

  itemBox.addEventListener("click", (e) => {
    e.preventDefault();
    history.pushState(
      { itemId: item.id, parentFishId: parentFish.id, source: "item" },
      item.title,
      `#${item.id}`
    );
    displayFishItemBox(item, parentFish);
  });

  return itemBox;
}

//* Відображення окремого Fish_item_box
function displayFishItemBox(item, parentFish) {
  showLoader();

  fishBoxContainer.innerHTML = "";

  const header = createHeader(item.title, () => {
    displayFishBox(parentFish);
    history.replaceState(
      { fishId: parentFish.id, source: "type" },
      "",
      `#${parentFish.id}`
    );
  });

  fishBoxContainer.appendChild(header);

  const detailsContainer = document.createElement("div");
  detailsContainer.classList.add("fish_item_details");

  const imageBox = createImageBox(item);

  detailsContainer.appendChild(imageBox);

  const description = document.createElement("p");
  description.textContent = item.description;
  description.classList.add("fish_item_details_description");
  detailsContainer.appendChild(description);

  fishBoxContainer.appendChild(detailsContainer);

  hideLoader();
  currentItem = item;

  history.replaceState(
    { itemId: item.id, parentFishId: parentFish.id, source: "item" },
    item.title,
    `#${item.id}`
  );
}

function createImageBox(item) {
  // Основний контейнер
  const wrapper = document.createElement("div");
  wrapper.classList.add("image-box-wrapper");

  // Існуючий контейнер для зображень
  const imageBox = document.createElement("div");
  imageBox.classList.add("image-box");

  const mainImageContainer = document.createElement("div");
  mainImageContainer.classList.add("main-image");

  const mainImage = document.createElement("img");
  mainImage.src = item.images[0]?.src || item.image;
  mainImage.alt = item.images[0]?.alt || item.title;
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

  // Новий контейнер для опису
  const mainDescription = document.createElement("div");
  mainDescription.classList.add("main-description");

  // Дані для наповнення
  const descriptions = [
    { title: "Регіон проживання:", value: item.region },
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

  // Додавання обох контейнерів до обгортки
  wrapper.appendChild(imageBox);
  wrapper.appendChild(mainDescription);

  return wrapper;
}

//* Функція для оновлення зображення
function updateDisplayedImage(mainImage, newImage) {
  mainImage.src = newImage.src;
  mainImage.alt = newImage.alt;
}

//* Показ/приховування
function showFishTypeBoxes() {
  fishTypeBoxesContainer.style.display = "flex";
  fishBoxContainer.innerHTML = "";
  history.replaceState({ source: "type" }, "", "");
}

function hideFishTypeBoxes() {
  fishTypeBoxesContainer.style.display = "none";
}

//* Обробник події popstate
window.addEventListener("popstate", (event) => {
  if (event.state) {
    if (event.state.fishId) {
      const fish = cachedFishData.find((f) => f.id === event.state.fishId);
      if (fish) {
        displayFishBox(fish);
      }
    } else if (event.state.itemId) {
      const item = findItemById(event.state.itemId);
      if (item) {
        displayFishItemBox(item, item.parentFish);
      }
    } else if (event.state.source === "type") {
      showFishTypeBoxes();
    }
  } else {
    showFishTypeBoxes();
  }
});

//* Створення заголовка з кнопкою назад
function createHeader(titleText, backButtonCallback) {
  const headerContainer = document.createElement("div");
  headerContainer.classList.add("fish_box_header");

  const title = document.createElement("h2");
  title.textContent = titleText;
  title.classList.add("box_title");

  const backButton = document.createElement("button");
  backButton.textContent = "Назад";
  backButton.classList.add("back_button");
  backButton.addEventListener("click", () => {
    backButtonCallback();
    history.replaceState({ source: "type" }, "", "");
  });

  headerContainer.appendChild(backButton);
  headerContainer.appendChild(title);

  return headerContainer;
}

//* Функція для знаходження елемента за ID
function findItemById(itemId) {
  let item = null;
  cachedFishData.forEach((fish) => {
    if (!item && fish.items) {
      item = fish.items.find((i) => i.id === itemId);
    }
  });
  return item;
}

//* Ініціалізація
fetchFishData();
