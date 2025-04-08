const tags = document.querySelectorAll(".tag");
const wrapper = document.querySelector(".floating-tags-wrapper");
const tagStates = [];

function initBubbleTags() {
  const wrapperRect = wrapper.getBoundingClientRect();

  tags.forEach(tag => {
    const width = tag.offsetWidth;
    const height = tag.offsetHeight;

    const maxLeft = wrapper.clientWidth - width;
    const maxTop = wrapper.clientHeight - height;

    const x = Math.random() * maxLeft;
    const y = Math.random() * maxTop;
    const vx = (Math.random() - 0.5) * 1.5;
    const vy = (Math.random() - 0.5) * 1.5;

    tag.style.position = "absolute";
    tag.style.willChange = "transform";

    tagStates.push({ el: tag, x, y, vx, vy, width, height });
  });
}

let lastTime = performance.now();

function animateTags(now) {
  const deltaTime = Math.min((now - lastTime) / 1000, 0.05); // 초 단위
  lastTime = now;

  const containerWidth = wrapper.clientWidth;
  const containerHeight = wrapper.clientHeight;

  for (const tag of tagStates) {
    tag.x += tag.vx * deltaTime * 60;
    tag.y += tag.vy * deltaTime * 60;

    if (tag.x <= 0 || tag.x + tag.width >= containerWidth) {
      tag.vx *= -1;
      tag.x = Math.max(0, Math.min(tag.x, containerWidth - tag.width));
    }

    if (tag.y <= 0 || tag.y + tag.height >= containerHeight) {
      tag.vy *= -1;
      tag.y = Math.max(0, Math.min(tag.y, containerHeight - tag.height));
    }

    tag.el.style.transform = `translate3d(${tag.x}px, ${tag.y}px, 0)`;
  }

  requestAnimationFrame(animateTags);
}


window.addEventListener("load", () => {
  initBubbleTags();
  requestAnimationFrame(animateTags);
});

window.addEventListener("contextmenu", e => e.preventDefault());

window.addEventListener("selectstart", e => e.preventDefault());

window.addEventListener("keydown", e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
    e.preventDefault();
  }
});

window.addEventListener("copy", e => {
  e.preventDefault();
});

