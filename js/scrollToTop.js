export function scrollToTop() {
  document.addEventListener("DOMContentLoaded", () => {
    const scrollToTopButton = document.createElement("button");
    scrollToTopButton.id = "scrollToTop";
    scrollToTopButton.className = "scroll-to-top";
    scrollToTopButton.setAttribute("aria-label", "Scroll to top");

    const svgImage = document.createElement("img");
    svgImage.src = "../img/up-arrow-svgrepo-com.svg";
    svgImage.alt = "Scroll to top";
    svgImage.style.width = "100%";
    svgImage.style.height = "100%";
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
