const isGitHubPages = window.location.hostname === "https://stolbin.github.io/";
const isCorrectPath = window.location.pathname.startsWith("/AquariumFish");

const basePath = isGitHubPages && isCorrectPath ? "/AquariumFish/" : "/";

const baseElement = document.createElement("base");
baseElement.setAttribute("href", basePath);

document.head.appendChild(baseElement);
