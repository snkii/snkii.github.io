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

    tag.style.left = `${x}px`;
    tag.style.top = `${y}px`;
    tag.style.position = "absolute";

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

    tag.el.style.left = `${tag.x}px`;
    tag.el.style.top = `${tag.y}px`;
  });

  requestAnimationFrame(animateTags);
}

window.addEventListener("load", () => {
  initBubbleTags();
  requestAnimationFrame(animateTags);
});
