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
    const vx = (Math.random() - 0.5) * 0.6;
    const vy = (Math.random() - 0.5) * 0.6;

    tag.style.position = "absolute";
    tag.style.willChange = "transform";

    tagStates.push({ el: tag, x, y, vx, vy, width, height });
  });
}

function animateTags() {
  const containerWidth = wrapper.clientWidth;
  const containerHeight = wrapper.clientHeight;

  tagStates.forEach(tag => {
    tag.x += tag.vx;
    tag.y += tag.vy;

    if (tag.x <= 0 || tag.x + tag.width >= containerWidth) tag.vx *= -1;
    if (tag.y <= 0 || tag.y + tag.height >= containerHeight) tag.vy *= -1;

    tag.el.style.transform = `translate(${tag.x}px, ${tag.y}px)`;
  });

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

