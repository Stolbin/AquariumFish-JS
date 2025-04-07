export async function fetchFishDataFromAPI() {
  try {
    const BASE_URL = `https://serveraquariumfish.onrender.com/AquariumFish/combinedFishData`;
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error("Не вдалося завантажити дані");
    }
    const data = await response.json();
    console.log("Дані риб:", data);
    return data;
  } catch (error) {
    console.error("Помилка при завантаженні даних:", error);
    throw error;
  }
}
