export async function fetchFishDataFromAPI() {
  const CACHE_KEY = "fish_data_cache";

  const cachedData = localStorage.getItem(CACHE_KEY);
  if (cachedData) {
    fetchAndCache(CACHE_KEY);
    return JSON.parse(cachedData);
  }

  return await fetchAndCache(CACHE_KEY);
}

async function fetchAndCache(key) {
  try {
    const BASE_URL = `https://serveraquariumfish.onrender.com/AquariumFish/combinedFishData`;
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error("Не вдалося завантажити дані");

    const data = await response.json();
    localStorage.setItem(key, JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Помилка:", error);
    throw error;
  }
}
