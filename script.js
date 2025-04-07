const gruvboxColors = [
    "#282828", "#3c3836", "#504945", "#665c54", "#7c6f64",
    "#b8bb26", "#fabd2f", "#fe8019", "#fb4934", "#d3869b",
    "#8ec07c", "#ebdbb2", "#d5c4a1", "#928374",
    "#83a598", "#458588"
];

function luminance(hex) {
    const rgb = hex.replace("#", "").match(/.{2}/g).map(c => parseInt(c, 16) / 255);
    const linear = rgb.map(c => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(c1, c2) {
    const L1 = luminance(c1);
    const L2 = luminance(c2);
    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}

function getReadableColors() {
    let bg, text, link;
    const MAX_TRIES = 100;
    for (let i = 0; i < MAX_TRIES; i++) {
        bg = gruvboxColors[Math.floor(Math.random() * gruvboxColors.length)];
        text = gruvboxColors[Math.floor(Math.random() * gruvboxColors.length)];
        link = gruvboxColors[Math.floor(Math.random() * gruvboxColors.length)];

        const contrastText = contrastRatio(bg, text);
        const contrastLink = contrastRatio(bg, link);
        const distinct = new Set([bg, text, link]).size === 3;

        if (distinct && contrastText >= 4.5 && contrastLink >= 4.5) {
            return { bg, text, link };
        }
    }
    return { bg: "#282828", text: "#ebdbb2", link: "#fabd2f" };
}

function applyColors(bg, text, link) {
    document.body.style.backgroundColor = bg;
    document.body.style.color = text;

    document.querySelectorAll("a").forEach((el) => {
        el.style.color = link;
    });

    const welcome = document.querySelector(".welcome");
    const instruction = document.querySelector(".instruction");
    const credit = document.querySelector(".credit");
    const gallery = document.querySelector(".gallery");
    const galleryText = document.querySelector(".gallery-text");
    const galleryBlink = document.querySelector(".gallery-blink");
    const socialLinks = document.querySelectorAll(".social-links a");
    const copyright = document.querySelector(".copyright");
    const about = document.querySelector(".about");
    const aboutText = document.querySelector(".about-text");
    const aboutBlink = document.querySelector(".about-blink");
    const thisthat = document.querySelector(".thisthat");
    const thisthatText = document.querySelector(".thisthat-text");
    const thisthatBlink = document.querySelector(".thisthat-blink");

    if (welcome) welcome.style.color = link;
    if (instruction) instruction.style.color = link;
    if (credit) credit.style.color = link;
    if (gallery) gallery.style.color = link;
    if (galleryText) galleryText.style.color = link;
    if (galleryBlink) galleryBlink.style.color = link;
    if (copyright) copyright.style.color = link;
    if (about) about.style.color = link;
    if (aboutText) aboutText.style.color = link;
    if (aboutBlink) aboutBlink.style.color = link;
    if (thisthat) thisthat.style.color = link;
    if (thisthatText) thisthatText.style.color = link;
    if (thisthatBlink) thisthatBlink.style.color = link;

    socialLinks.forEach((icon) => (icon.style.color = link));
}

document.addEventListener("DOMContentLoaded", () => {
    const email = document.querySelector('a[href^="mailto:"]');
    if (email) {
        email.addEventListener("mousedown", (e) => e.preventDefault());
        email.addEventListener("selectstart", (e) => e.preventDefault());
    }

    const initial = getReadableColors();
    applyColors(initial.bg, initial.text, initial.link);

    document.body.addEventListener("click", (e) => {
        const clickedLink = e.target.closest("a");
        if (!clickedLink) return;
      
        const href = clickedLink.getAttribute("href")?.trim().toLowerCase();
        console.log("🔍 href 확인:", `[${href}]`);
      
        if (["about", "gallery", "thisthat"].includes(href)) {
          console.log("🚫 제외 대상이므로 색상 변경 생략:", href);
          return;
        }
      
        console.log("🎨 색상 변경 실행!");
        const { bg, text, link } = getReadableColors();
        applyColors(bg, text, link);
      });
});
