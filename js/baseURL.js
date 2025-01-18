const isGitHubPages =
  window.location.hostname === "stolbin.github.io" &&
  window.location.pathname.startsWith("/AquariumFish");

const basePath = isGitHubPages ? "/AquariumFish/" : "/";

const baseElement = document.createElement("base");
baseElement.setAttribute("href", basePath);

document.head.appendChild(baseElement);
