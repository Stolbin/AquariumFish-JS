export function restoreStateFromStorage() {
  return JSON.parse(localStorage.getItem("state"));
}

export function clearStateFromStorage() {
  localStorage.removeItem("state");
}
