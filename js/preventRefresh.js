window.addEventListener("keydown", function (event) {
  if (
    (event.key === "F5" || (event.ctrlKey && event.key === "r")) &&
    window.location.pathname !== "/"
  ) {
    event.preventDefault();
  }
});

window.addEventListener("contextmenu", function (event) {
  event.preventDefault();
});

window.addEventListener("load", () => {
  if (window.location.pathname === "/") {
    clearStateFromStorage();
  }
});
