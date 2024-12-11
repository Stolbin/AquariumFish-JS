const mainContainer = document.querySelector("main");
const fishBoxContainer = document.querySelector(".fish_box_container");
const searchInput = document.querySelector(".search_input");

// Додаємо новий контейнер для fish_view_box
const fishViewBoxesContainer = document.createElement("div");
fishViewBoxesContainer.classList.add("fish_view_boxes_container"); // Додаємо клас для нового контейнера
mainContainer.appendChild(fishViewBoxesContainer);

// Завантаження JSON з файлу
fetch("./fish.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Не вдалося завантажити JSON файл");
    }
    return response.json();
  })
  .then((fishData) => {
    generateFishBoxes(fishData);
  })
  .catch((error) => {
    console.error("Помилка:", error);
  });

// Функція для генерації Fish_view_box
function generateFishBoxes(fishData) {
  const fragment = document.createDocumentFragment();
  fishData.forEach((fish) => {
    const box = document.createElement("div");
    box.className = "fish_view_box";

    // Створюємо контейнер для зображення
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("fish_view_image_container");

    // Створюємо зображення
    const img = document.createElement("img");
    img.src = fish.image;
    img.alt = fish.image_alt;
    img.classList.add("fish_view_image");

    // Додаємо зображення в контейнер
    imageContainer.appendChild(img);

    const link = document.createElement("a");
    link.href = `#${fish.id}`;
    link.textContent = fish.className;
    link.classList.add("fish_view_linkText");

    // Додаємо контейнер з зображенням і лінк в box
    box.appendChild(imageContainer); // Додаємо контейнер з зображенням
    box.appendChild(link); // Додаємо лінк
    fragment.appendChild(box);

    link.addEventListener("click", (e) => {
      e.preventDefault();
      displayFishBox(fish);
    });
  });

  // Додаємо всі fish_view_box в новий контейнер
  fishViewBoxesContainer.appendChild(fragment);
}

// Функція для відображення Fish_box
function displayFishBox(fish) {
  fishBoxContainer.innerHTML = ""; // Очищаємо контейнер

  const title = document.createElement("h2");
  title.textContent = fish.className;

  const description = document.createElement("p");
  description.textContent = fish.details.description;

  fishBoxContainer.appendChild(title);
  fishBoxContainer.appendChild(description);

  fish.items.forEach((item) => {
    const itemBox = document.createElement("div");
    itemBox.className = "fish_item_box";

    if (item.images && item.images.length > 0) {
      const imageContainer = document.createElement("div");
      imageContainer.className = "Image_container";

      item.images.forEach((image) => {
        const itemImg = document.createElement("img");
        itemImg.src = image.src;
        itemImg.alt = image.alt;
        itemImg.style.width = "100px";
        itemImg.style.margin = "5px";

        imageContainer.appendChild(itemImg);
      });

      itemBox.appendChild(imageContainer);
    } else {
      const itemImg = document.createElement("img");
      itemImg.src = item.image;
      itemImg.alt = item.title;
      itemBox.appendChild(itemImg);
    }

    const itemTitle = document.createElement("h3");
    itemTitle.textContent = item.title;

    const itemDescription = document.createElement("p");
    itemDescription.textContent = item.description;

    itemBox.appendChild(itemTitle);
    itemBox.appendChild(itemDescription);

    fishBoxContainer.appendChild(itemBox);
  });

  // Заміна поточного стану в історії
  history.pushState({ fishId: fish.id }, fish.className, `#${fish.id}`);

  // Додаємо кнопку "Назад"
  const backButton = document.createElement("button");
  backButton.textContent = "Назад";
  backButton.classList.add("back_button");
  fishBoxContainer.insertBefore(backButton, fishBoxContainer.firstChild);

  // Слухач для кнопки "Назад"
  backButton.addEventListener("click", () => {
    showFishViewBoxes(); // Показуємо всі fish_view_box
    history.replaceState({}, document.title, "/"); // Очищаємо хеш з URL
  });

  // Приховуємо всі старі fish_view_box
  const fishViewBoxes = document.querySelectorAll(".fish_view_box");
  fishViewBoxes.forEach((box) => {
    box.style.display = "none";
  });
  searchInput.style.display = "none";
}

// Функція для показу всіх fish_view_box
function showFishViewBoxes() {
  const fishViewBoxes = document.querySelectorAll(".fish_view_box");
  fishViewBoxes.forEach((box) => {
    box.style.display = "flex";
  });
  fishBoxContainer.innerHTML = ""; // Очищаємо контейнер для детальних інформацій про риб
  searchInput.style.display = "inline-block";
}

// Обробка історії браузера (натискання на кнопки "Назад" або "Вперед")
window.addEventListener("popstate", (event) => {
  if (event.state && event.state.fishId) {
    const fishId = event.state.fishId;
    fetch("./fish.json")
      .then((response) => response.json())
      .then((fishData) => {
        const fish = fishData.find((item) => item.id === fishId);
        if (fish) {
          displayFishBox(fish);
        }
      });
  } else {
    showFishViewBoxes(); // Якщо немає стану, відображаємо всі boxes
  }
});

// Додаємо слухач для натискання клавіші Backspace
window.addEventListener("keydown", (event) => {
  if (event.key === "Backspace") {
    // Якщо натиснута клавіша Backspace, то викликаємо функцію для повернення
    event.preventDefault(); // Перешкоджаємо виконанню стандартної дії (повернення на попередню сторінку)
    goBack();
  }
});

// Функція для обробки повернення назад
function goBack() {
  showFishViewBoxes(); // Показуємо всі fish_view_box
  history.pushState({}, document.title, "/"); // Очищаємо хеш з URL
}

// Функція для ініціалізації
function initialize() {
  const hash = window.location.hash;
  if (hash) {
    const fishId = hash.slice(1); // Отримуємо id риби з хешу
    fetch("./fish.json")
      .then((response) => response.json())
      .then((fishData) => {
        const fish = fishData.find((item) => item.id === fishId);
        if (fish) {
          displayFishBox(fish);
        }
      });
  } else {
    showFishViewBoxes();
  }
}

initialize();
