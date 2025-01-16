export function createHeaderFish(fish, onBackClick) {
  const fishHeader = document.createElement("div");
  fishHeader.classList.add("fish_box_header");

  const backButton = document.createElement("button");
  backButton.textContent = "Назад";
  backButton.classList.add("back_button");
  backButton.addEventListener("click", () => {
    history.replaceState(null, "", "/");
    if (typeof onBackClick === "function") {
      onBackClick();
    }
  });
  fishHeader.appendChild(backButton);

  const fishTitleBox = document.createElement("div");
  fishTitleBox.classList.add("fish-title-box");
  fishHeader.appendChild(fishTitleBox);

  const headerTitleUA = document.createElement("h2");
  headerTitleUA.textContent = fish.classNameUA || "";
  headerTitleUA.classList.add("fish-title");
  fishTitleBox.appendChild(headerTitleUA);

  const headerTitleEN = document.createElement("h2");
  headerTitleEN.textContent = fish.classNameEN ? ` (${fish.classNameEN})` : "";
  headerTitleEN.classList.add("fish-title");
  fishTitleBox.appendChild(headerTitleEN);

  return fishHeader;
}

export function createHeaderItem(item, onBackClick) {
  const itemFishHeader = document.createElement("div");
  itemFishHeader.classList.add("fish_box_header");

  const backButton = document.createElement("button");
  backButton.textContent = "Назад";
  backButton.classList.add("back_button");
  backButton.addEventListener("click", () => {
    history.replaceState(null, "", "/");
    if (typeof onBackClick === "function") {
      onBackClick();
    }
  });
  itemFishHeader.appendChild(backButton);

  const itemTitleBox = document.createElement("div");
  itemTitleBox.classList.add("item-title-box");
  itemFishHeader.appendChild(itemTitleBox);

  const headerTitleUA = document.createElement("h2");
  headerTitleUA.textContent = item.titleUA ? item.titleUA : "";
  headerTitleUA.classList.add("item-title");
  itemTitleBox.appendChild(headerTitleUA);

  const headerTitleEN = document.createElement("h2");
  headerTitleEN.textContent = item.titleEN ? `(${item.titleEN})` : "";
  headerTitleEN.classList.add("item-title");
  itemTitleBox.appendChild(headerTitleEN);

  const headerTitleСlassification = document.createElement("h2");
  headerTitleСlassification.textContent = item.classification
    ? item.classification
    : "";
  headerTitleСlassification.classList.add("item-title_number");
  itemTitleBox.appendChild(headerTitleСlassification);

  return itemFishHeader;
}
