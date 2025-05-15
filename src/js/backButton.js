import arrowLeftIcon from "../img/arrow-left2.svg";

export function createBackButton(onBackClick) {
  const backButton = document.createElement("button");
  backButton.classList.add("back_button");

  const svgArrowBack = document.createElement("img");
  svgArrowBack.src = arrowLeftIcon;
  svgArrowBack.alt = "Arrow Back";
  svgArrowBack.className = "icon";
  backButton.appendChild(svgArrowBack);

  backButton.addEventListener("click", () => {
    history.replaceState(null, "", "/");
    if (typeof onBackClick === "function") {
      onBackClick();
    }
  });

  return backButton;
}
