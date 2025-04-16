export function createBackButton(onBackClick) {
  const backButton = document.createElement("button");
  backButton.classList.add("back_button");
  const icon = document.createElement("i");

  backButton.appendChild(icon);

  backButton.addEventListener("click", () => {
    history.replaceState(null, "", "/");
    if (typeof onBackClick === "function") {
      onBackClick();
    }
  });

  return backButton;
}
