const isGitHubPages = window.location.hostname === "stolbin.github.io";
const basePath = isGitHubPages ? "/AquariumFish/" : "/";

// Додавання <base> тега для коректної роботи відносних шляхів
const baseElement = document.createElement("base");
baseElement.setAttribute("href", basePath);
document.head.appendChild(baseElement);

// Перевірка поточного шляху та перенаправлення лише за потреби
if (isGitHubPages && !window.location.pathname.startsWith(basePath)) {
  const redirectTo = basePath + window.location.pathname.replace("/", "");
  window.location.href = redirectTo;
}
