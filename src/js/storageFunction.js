export function restoreStateFromStorage() {
  return JSON.parse(localStorage.getItem("state"));
}

export function saveStateToStorage(state) {
  localStorage.setItem("state", JSON.stringify(state));
}

export function clearStateFromStorage() {
  localStorage.removeItem("state");
}
