import { showLoader, hideLoader } from "./js/show-hide_elements.js";

//* Основні елементи DOM
const mainContainer = document.querySelector("main");
const fishBoxContainer = document.querySelector(".fish_box_container");

//* Контейнер для рендерингу Fish_type_box
const fishTypeBoxesContainer = document.createElement("div");
fishTypeBoxesContainer.classList.add("fish_type_boxes_container");
mainContainer.appendChild(fishTypeBoxesContainer);

//* Кеш даних
let cachedFishData = null;

//* Завантаження JSON з файлу
async function fetchFishData() {
  showLoader();
  try {
    const response = await fetch("./json/fish.json");
    if (!response.ok) throw new Error("Не вдалося завантажити JSON файл");
    const fishData = await response.json();
    cachedFishData = fishData;
    generateFishBoxes(fishData);
  } catch (error) {
    console.error("Помилка завантаження даних:", error);
  } finally {
    hideLoader();
  }
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
    history.pushState({ fishId: fish.id }, fish.className, `#${fish.id}`);
    displayFishBox(fish);
  });

  return box;
}

//* Відображення Fish_box
function displayFishBox(fish) {
  showLoader();
  hideFishTypeBoxes();
  fishBoxContainer.innerHTML = "";

  const header = createHeader(fish.className, () => {
    showFishTypeBoxes();
    history.pushState({}, "", "/");
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
    history.pushState({ itemId: item.id }, item.title, `#${item.id}`);
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
    history.pushState({}, "", `#${parentFish.id}`);
  });

  fishBoxContainer.appendChild(header);

  const detailsContainer = document.createElement("div");
  detailsContainer.classList.add("fish_item_details");

  const imgDetailsContainer = document.createElement("div");
  imgDetailsContainer.classList.add("fish_item_img_details");

  if (item.images && item.images.length > 0) {
    item.images.forEach((image) => {
      const img = document.createElement("img");
      img.src = image.src;
      img.alt = image.alt || item.title;
      img.classList.add("fish_item_details_image");
      imgDetailsContainer.appendChild(img);
    });
  } else {
    const img = document.createElement("img");
    img.src = item.image || (item.images && item.images[0]?.src);
    img.alt = item.title;
    img.classList.add("fish_item_details_image");
    imgDetailsContainer.appendChild(img);
  }

  detailsContainer.appendChild(imgDetailsContainer);

  const description = document.createElement("p");
  description.textContent = item.description;
  description.classList.add("fish_item_details_description");
  detailsContainer.appendChild(description);

  fishBoxContainer.appendChild(detailsContainer);
  hideLoader();
}

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
  backButton.addEventListener("click", backButtonCallback);

  headerContainer.appendChild(backButton);
  headerContainer.appendChild(title);

  return headerContainer;
}

// //* Показ/приховування
function showFishTypeBoxes() {
  fishTypeBoxesContainer.style.display = "flex";
  fishBoxContainer.innerHTML = "";
}
function hideFishTypeBoxes() {
  fishTypeBoxesContainer.style.display = "none";
}

//* Обробник події popstate
window.addEventListener("popstate", (event) => {
  if (event.state && event.state.fishId) {
    const fish = cachedFishData.find((f) => f.id === event.state.fishId);
    if (fish) {
      displayFishBox(fish);
    }
  } else if (event.state && event.state.itemId) {
    const item = findItemById(event.state.itemId);
    if (item) {
      displayFishItemBox(item, item.parentFish);
    }
  } else {
    showFishTypeBoxes();
  }
});

//* Ініціалізація
fetchFishData();
