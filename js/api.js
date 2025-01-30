// import { config } from "./config.js";

// export async function fetchFishDataFromAPI() {
//   try {
//     const response = await fetch(
//       `https://api.jsonbin.io/v3/b/${config.BASE_URL}`,
//       {
//         headers: {
//           "X-Master-Key": config.X_MASTERS_KEY,
//           "X-Access-Key": config.X_ACCESS_KEY,
//         },
//       }
//     );
//     if (!response.ok) {
//       throw new Error("Не вдалося завантажити дані");
//     }
//     const data = await response.json();
//     console.log("Дані риб:", data);
//     return data;
//   } catch (error) {
//     console.error("Помилка при завантаженні даних:", error);
//     throw error;
//   }
// }

export async function fetchFishDataFromAPI() {
  try {
    const BASE_URL = `../data/fish.json`;
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
