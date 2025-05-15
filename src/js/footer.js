export function createFooter() {
  const footer = document.createElement("footer");

  const footerContainer = document.createElement("div");
  footerContainer.classList.add("footer_container");

  const p = document.createElement("p");
  p.textContent = "© Aquarium Fish 2025";

  footerContainer.appendChild(p);
  footer.appendChild(footerContainer);

  return footer;
}
