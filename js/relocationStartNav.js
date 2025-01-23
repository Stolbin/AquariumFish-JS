import { clearStateFromStorage } from "./storageFunction.js";

export function relocationStart() {
  document.querySelector(".nav_dox_link").addEventListener("click", (e) => {
    e.preventDefault();
    clearStateFromStorage();
    window.location.href = "/";
  });
}
