const isGitHubPages = window.location.hostname === "stolbin.github.io";
const basePath = isGitHubPages ? "/AquariumFish/" : "/";
document.write(`<base href="${basePath}">`);
