import upArrowIcon from "../img/up-arrow-svgrepo-com.svg";

export function scrollToTop() {
  document.addEventListener("DOMContentLoaded", () => {
    const scrollToTopButton = document.createElement("button");
    scrollToTopButton.id = "scrollToTop";
    scrollToTopButton.className = "scroll-to-top";
    scrollToTopButton.setAttribute("aria-label", "Scroll to top");

    const svgImage = document.createElement("img");
    svgImage.src = upArrowIcon;
    svgImage.alt = "Scroll to top";
    svgImage.className = "scroll-to-top_img";
    scrollToTopButton.appendChild(svgImage);

    document.body.appendChild(scrollToTopButton);

    window.addEventListener("scroll", () => {
      if (window.scrollY > window.innerHeight * 0.1) {
        scrollToTopButton.classList.add("visible");
      } else {
        scrollToTopButton.classList.remove("visible");
      }
    });

    scrollToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  });
}
