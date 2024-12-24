import { showLoader, hideLoader } from "./js/show-hide_elements.js";

// Функція для завантаження даних з jsonbin.io
export async function fetchFishDataFromAPI() {
  const apiUrl = "https://api.jsonbin.io/v3/c/676a79b4acd3cb34a8bea0d3/b"; // URL вашої колекції
  const headers = {
    "X-Master-Key":
      "$2a$10$SQEW8T5PpFfBqBSSpAibRuEvgj3XOQass9UXgxSF6KW6CuEnj3F.q",
    "X-Access-Key":
      "$2a$10$8MHqd7RuwwG.42g3BJjhiu03Vx1LFCctAiz5EHsQmj7EzoJiQ.uiW",
  };

  showLoader();
  try {
    const response = await fetch(apiUrl, { headers });
    if (!response.ok)
      throw new Error(`Помилка завантаження даних: ${response.statusText}`);
    const jsonData = await response.json();
    return jsonData.record; // jsonbin.io повертає об'єкт, де дані знаходяться у властивості `record`
  } catch (error) {
    console.error("Помилка завантаження даних з jsonbin.io:", error);
    return null;
  } finally {
    hideLoader();
  }
}
