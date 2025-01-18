window.addEventListener("beforeunload", function (e) {
  const message =
    "Ви хочете покинути сторінку? Всі незбережені зміни будуть втрачені.";
  return message;
});

window.addEventListener("keydown", function (event) {
  if (event.key === "F5" || (event.ctrlKey && event.key === "r")) {
    event.preventDefault();
  }
});

window.addEventListener("contextmenu", function (event) {
  event.preventDefault();
});
