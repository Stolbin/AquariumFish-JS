export function createNavBox() {
  const navBox = document.createElement("nav");
  navBox.classList.add("nav_box");

  const link = document.createElement("a");
  link.href = "/";
  link.classList.add("nav_box_link");

  const title = document.createElement("h1");
  title.classList.add("nav_box_link_title");
  title.textContent = "Aquarium Fish";

  link.appendChild(title);
  navBox.appendChild(link);

  return navBox;
}
