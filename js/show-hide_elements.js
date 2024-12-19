export function showLoader() {
  const loader = document.getElementById("loader");
  loader.style.display = "flex";
}

export function hideLoader() {
  const loader = document.getElementById("loader");
  loader.style.display = "none";
}

const searchInput = document.querySelector(".search_input");

export function showSearchInput() {
  searchInput.style.display = "block";
}
export function hideSearchInput() {
  searchInput.style.display = "none";
}
