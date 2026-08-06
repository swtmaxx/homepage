import { init } from "https://unpkg.com/@waline/client@v3/dist/waline.js";

const renderIcons = () => {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
};

const setupAvatarFallback = () => {
  const avatar = document.querySelector("[data-avatar]");
  const frame = avatar?.closest(".avatar-frame");

  if (!avatar || !frame) {
    return;
  }

  avatar.addEventListener("error", () => {
    frame.dataset.fallback = "true";
  });
};

const setupWaline = () => {
  const target = document.querySelector("#waline");
  const fallback = document.querySelector("[data-waline-fallback]");

  if (!target) {
    return;
  }

  try {
    window.waline = init({
      el: target,
      serverURL: "https://waline.swtmax.top",
      requiredMeta: ["nick"],
      noCopyright: true,
      noRss: true,
    });
  } catch (error) {
    console.error("[Waline] 初始化失败", error);
    if (fallback) {
      fallback.hidden = false;
    }
  }
};

renderIcons();
window.addEventListener("load", renderIcons, { once: true });
setupAvatarFallback();
setupWaline();
