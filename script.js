const root = document.documentElement;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const localTime = document.querySelector("#local-time");
const uplinkValue = document.querySelector("#uplink-value");
const sessionValue = document.querySelector("#session-value");
const progress = document.querySelector(".scroll-progress");
const scrambleCharacters = "01#@$%&*+<>/\\\\[]{}";

document.querySelector("#year").textContent = new Date().getFullYear();

function updateClock() {
  if (!localTime) return;
  localTime.textContent = new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Shanghai",
  }).format(new Date());
}

function updateTelemetry() {
  if (uplinkValue) {
    uplinkValue.textContent = (12 + Math.random() * 18).toFixed(1).padStart(4, "0");
  }
  if (sessionValue) {
    sessionValue.textContent = Math.floor(Math.random() * 999999).toString().padStart(6, "0");
  }
}

function updateScrollProgress() {
  if (!progress) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
}

function updatePointer(event) {
  root.style.setProperty("--mouse-x", `${event.clientX}px`);
  root.style.setProperty("--mouse-y", `${event.clientY}px`);
}

function scramble(element) {
  if (reducedMotion.matches || element.dataset.scrambling === "true") return;

  const original = element.dataset.scramble || element.textContent;
  const frames = 12;
  let frame = 0;
  element.dataset.scrambling = "true";

  const timer = window.setInterval(() => {
    element.textContent = [...original]
      .map((character, index) => {
        if (character === " " || index < Math.floor((frame / frames) * original.length)) {
          return character;
        }
        return scrambleCharacters[Math.floor(Math.random() * scrambleCharacters.length)];
      })
      .join("");

    frame += 1;
    if (frame > frames) {
      window.clearInterval(timer);
      element.textContent = original;
      element.dataset.scrambling = "false";
    }
  }, 34);
}

document.querySelectorAll(".service-module").forEach((module) => {
  const label = module.querySelector("[data-scramble]");
  module.addEventListener("mouseenter", () => label && scramble(label));
  module.addEventListener("focus", () => label && scramble(label));
});

if (reducedMotion.matches) {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 },
  );

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
  window.addEventListener("pointermove", updatePointer, { passive: true });

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      document.querySelectorAll(".hero .reveal").forEach((element) => element.classList.add("is-visible"));
    });
  });

  window.setTimeout(() => {
    document.querySelectorAll(".reveal:not(.is-visible)").forEach((element) => element.classList.add("is-visible"));
  }, 900);
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });

updateClock();
updateTelemetry();
updateScrollProgress();

window.setInterval(updateClock, 1000);
window.setInterval(updateTelemetry, 1800);

window.addEventListener("DOMContentLoaded", () => {
  window.lucide?.createIcons();
});
