const tags = document.querySelectorAll(".tag");
const wrapper = document.querySelector(".floating-tags-wrapper");
const tagStates = [];

function initBubbleTags() {
  const wrapperRect = wrapper.getBoundingClientRect();

  tags.forEach(tag => {
    tag.setAttribute("draggable", "false");
    tag.addEventListener("dragstart", e => e.preventDefault());
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

    tagStates.push({
      el: tag,
      x,
      y,
      vx,
      vy,
      width,
      height,
      fx: 0,
      fy: 0,
      forceDecay: 0
    });
  });
}

let lastTime = performance.now();

function animateTags(now) {
  const deltaTime = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;

  const containerWidth = wrapper.clientWidth;
  const containerHeight = wrapper.clientHeight;

  for (const tag of tagStates) {
    tag.x += (tag.vx + tag.fx) * deltaTime * 60;
    tag.y += (tag.vy + tag.fy) * deltaTime * 60;

    if (tag.forceDecay > 0) {
      tag.fx *= tag.forceDecay;
      tag.fy *= tag.forceDecay;

      if (Math.abs(tag.fx) < 0.01) tag.fx = 0;
      if (Math.abs(tag.fy) < 0.01) tag.fy = 0;
    }

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

function handleInteraction(e) {
  if (e.target.classList.contains("tag")) return;

  const isTouch = e.type === "touchstart";
  const clientX = isTouch ? e.touches[0].clientX : e.clientX;
  const clientY = isTouch ? e.touches[0].clientY : e.clientY;

  const rect = wrapper.getBoundingClientRect();
  const clickX = clientX - rect.left;
  const clickY = clientY - rect.top;

  tagStates.forEach(tag => {
    const dx = tag.x + tag.width / 2 - clickX;
    const dy = tag.y + tag.height / 2 - clickY;
    const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);

    const power = 5;
    tag.fx = (dx / dist) * power;
    tag.fy = (dy / dist) * power;
    tag.forceDecay = 0.9;
  });
}


window.addEventListener("click", handleInteraction);
window.addEventListener("touchstart", handleInteraction, { passive: true });


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
window.addEventListener("dragstart", e => e.preventDefault());

function setViewportHeight() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
window.addEventListener('resize', setViewportHeight);
window.addEventListener('load', setViewportHeight);