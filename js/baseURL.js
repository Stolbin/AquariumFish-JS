const isGitHubPages = window.location.hostname === "stolbin.github.io";
const basePath = isGitHubPages ? "/AquariumFish/" : "/";

const baseElement = document.createElement("base");
baseElement.setAttribute("href", basePath);

document.head.appendChild(baseElement);

const redirectTo = window.location.pathname.replace("/AquariumFish", "");
if (redirectTo !== "/") {
  window.location.href = "/AquariumFish" + redirectTo;
}
