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
  const deltaTime = (now - lastTime) / 16.666; // 60fps 기준으로 보정
  lastTime = now;

  const containerWidth = wrapper.clientWidth;
  const containerHeight = wrapper.clientHeight;

  for (const tag of tagStates) {
    tag.x += tag.vx * deltaTime;
    tag.y += tag.vy * deltaTime;

    if (tag.x <= 0 || tag.x + tag.width >= containerWidth) {
      tag.vx *= -1;
      tag.x = Math.max(0, Math.min(tag.x, containerWidth - tag.width)); // 경계 클램프
    }

    if (tag.y <= 0 || tag.y + tag.height >= containerHeight) {
      tag.vy *= -1;
      tag.y = Math.max(0, Math.min(tag.y, containerHeight - tag.height));
    }

    tag.el.style.transform = `matrix3d(1,0,0,0, 0,1,0,0, 0,0,1,0, ${tag.x},${tag.y},0,1)`;
  }

  // 랜덤 지연: 미세한 타이밍 흩어짐으로 떨림 방지
  setTimeout(() => requestAnimationFrame(animateTags), Math.random() * 2 + 1);
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

