const sections = [...document.querySelectorAll("main section[id]")];
const navigationLinks = [...document.querySelectorAll(".side-nav__link")];
const themeToggle = document.querySelector(".theme-toggle");
const themeStorageKey = "portulaca-theme";

function setActiveSection(sectionId) {
  const activeIndex = sections.findIndex((section) => section.id === sectionId);

  navigationLinks.forEach((link, index) => {
    const isCurrent = index === activeIndex;
    link.classList.toggle("is-current", isCurrent);
    link.classList.toggle("is-past", index < activeIndex);
    link.classList.toggle("is-future", index > activeIndex);
    if (isCurrent) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function getVisibleHeight(section) {
  const bounds = section.getBoundingClientRect();
  return Math.max(0, Math.min(bounds.bottom, window.innerHeight) - Math.max(bounds.top, 0));
}

function updateActiveSection() {
  const dominantSection = sections.reduce(
    (current, section) => (getVisibleHeight(section) > getVisibleHeight(current) ? section : current),
    sections[0]
  );
  setActiveSection(dominantSection.id);
}

const observer = new IntersectionObserver(() => updateActiveSection(), { threshold: 0 });
sections.forEach((section) => observer.observe(section));

function updateScrollProgress() {
  const scrollableDistance = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableDistance > 0 ? window.scrollY / scrollableDistance : 0;
  document.documentElement.style.setProperty("--scroll-progress", Math.min(1, Math.max(0, progress)));
}

function updateScrollState() {
  updateScrollProgress();
  updateActiveSection();
}

function applyTheme(theme) {
  const isDarkTheme = theme === "dark";
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute("aria-pressed", String(isDarkTheme));
  themeToggle.setAttribute("aria-label", isDarkTheme ? "Activar tema claro" : "Activar tema oscuro");
}

function getInitialTheme() {
  const storedTheme = localStorage.getItem(themeStorageKey);
  if (storedTheme === "light" || storedTheme === "dark") return storedTheme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem(themeStorageKey, nextTheme);
  applyTheme(nextTheme);
});

window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("resize", updateScrollState);

setActiveSection(sections[0].id);
applyTheme(getInitialTheme());
updateScrollState();
