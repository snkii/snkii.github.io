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

    tagStates.push({
      el: tag,
      x,
      y,
      vx,
      vy,
      width,
      height,
      fx: 0,      // 추가: 외부 force x
      fy: 0,      // 추가: 외부 force y
      forceDecay: 0 // 추가: 감쇠율
    });
  });
}

let lastTime = performance.now();

function animateTags(now) {
  const deltaTime = Math.min((now - lastTime) / 1000, 0.05); // 초 단위
  lastTime = now;

  const containerWidth = wrapper.clientWidth;
  const containerHeight = wrapper.clientHeight;

  for (const tag of tagStates) {
    // 기본 속도 + 외부 force 적용
    tag.x += (tag.vx + tag.fx) * deltaTime * 60;
    tag.y += (tag.vy + tag.fy) * deltaTime * 60;

    // force 감쇠
    if (tag.forceDecay > 0) {
      tag.fx *= tag.forceDecay;
      tag.fy *= tag.forceDecay;

      if (Math.abs(tag.fx) < 0.01) tag.fx = 0;
      if (Math.abs(tag.fy) < 0.01) tag.fy = 0;
    }

    // 벽 반사 처리
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

// 클릭 이벤트: 퍼짐 효과 추가
window.addEventListener("click", (e) => {
    const rect = wrapper.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
  
    tagStates.forEach(tag => {
      const dx = tag.x + tag.width / 2 - clickX;
      const dy = tag.y + tag.height / 2 - clickY;
      const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
  
      const power = 5;
      tag.fx = (dx / dist) * power;
      tag.fy = (dy / dist) * power;
      tag.forceDecay = 0.9;
    });
  });

// 초기화 및 애니메이션 시작
window.addEventListener("load", () => {
  initBubbleTags();
  requestAnimationFrame(animateTags);
});

// 복사, 마우스 우클릭, 선택 방지
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
