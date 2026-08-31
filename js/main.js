const sections = [...document.querySelectorAll("main section[id]")];
const navigationLinks = [...document.querySelectorAll(".side-nav__link")];

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

const observer = new IntersectionObserver(
  (entries) => {
    entries
      .filter((entry) => entry.isIntersecting)
      .forEach((entry) => setActiveSection(entry.target.id));
  },
  { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
);

sections.forEach((section) => observer.observe(section));

function updateScrollProgress() {
  const scrollableDistance = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableDistance > 0 ? window.scrollY / scrollableDistance : 0;
  document.documentElement.style.setProperty("--scroll-progress", Math.min(1, Math.max(0, progress)));
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);

setActiveSection(sections[0].id);
updateScrollProgress();
