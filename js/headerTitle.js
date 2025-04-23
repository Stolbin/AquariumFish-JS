import { createBackButton } from "./backButton.js";

export function createHeaderFish(fish, onBackClick) {
  const fishHeader = document.createElement("div");
  fishHeader.classList.add("fish_box_header");

  const backButton = createBackButton(onBackClick);
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

export function createHeaderGroupFish(group, onBackClick) {
  const groupFishHeader = document.createElement("div");
  groupFishHeader.classList.add("fish_box_header");

  const backButton = createBackButton(onBackClick);
  groupFishHeader.appendChild(backButton);

  const groupFishTitleBox = document.createElement("div");
  groupFishTitleBox.classList.add("fish-title-box");
  groupFishHeader.appendChild(groupFishTitleBox);

  const generalClassUA = group[0]?.generalClassUA || "";
  const generalClassID = group[0]?.generalClassID || "";

  const headerTitleUA = document.createElement("h2");
  headerTitleUA.textContent = generalClassUA;
  headerTitleUA.classList.add("fish-title");
  groupFishTitleBox.appendChild(headerTitleUA);

  const headerTitleEN = document.createElement("h2");
  headerTitleEN.textContent = generalClassID ? `(${generalClassID})` : "";
  headerTitleEN.classList.add("fish-title");
  groupFishTitleBox.appendChild(headerTitleEN);

  return groupFishHeader;
}

export function createHeaderItem(item, onBackClick) {
  const itemFishHeader = document.createElement("div");
  itemFishHeader.classList.add("fish_box_header");

  const backButton = createBackButton(onBackClick);
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
