// Header: hidden on load, slides in as soon as a trigger section enters the
// viewport. data-reveal names the trigger; it defaults to What I do.

(() => {
  const header = document.querySelector(".site-header[data-reveal]");
  const trigger = header && document.querySelector(header.dataset.reveal || "#expertise");
  if (!header || !trigger) return;

  const update = () => {
    header.classList.toggle("is-visible", trigger.getBoundingClientRect().top < innerHeight);
  };

  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", update);
  update();
})();

// Floating preview for the Selected work rows.
// Follows the cursor on devices that can hover; does nothing on touch.

(() => {
  const preview = document.querySelector(".preview");
  const rows = document.querySelectorAll(".work-row[data-preview]");
  if (!preview || !rows.length || !matchMedia("(hover: hover)").matches) return;

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const OFFSET = 24;
  let target = { x: 0, y: 0 };
  let current = { x: 0, y: 0 };
  let frame = null;

  const isVideo = (src) => /\.(mp4|webm)$/i.test(src);

  function placeholder(name) {
    const el = document.createElement("div");
    el.className = "preview-empty";
    el.textContent = name;
    return el;
  }

  function media(row) {
    const src = row.dataset.preview;
    const name = row.querySelector(".row-title").textContent.replace("↗", "").trim();
    if (!src) return placeholder(name);

    const el = isVideo(src) ? document.createElement("video") : document.createElement("img");
    if (isVideo(src)) {
      Object.assign(el, { muted: true, loop: true, autoplay: true, playsInline: true });
    } else {
      el.alt = "";
    }
    el.src = src;
    el.addEventListener("error", () => el.replaceWith(placeholder(name)), { once: true });
    return el;
  }

  function place() {
    // Keep the card inside the viewport.
    const w = preview.offsetWidth;
    const h = preview.offsetHeight;
    let x = target.x + OFFSET;
    let y = target.y - h / 2;
    if (x + w > innerWidth - 16) x = target.x - w - OFFSET;
    y = Math.max(16, Math.min(y, innerHeight - h - 16));
    return { x, y };
  }

  function tick() {
    const goal = place();
    current.x += (goal.x - current.x) * (reduceMotion ? 1 : 0.18);
    current.y += (goal.y - current.y) * (reduceMotion ? 1 : 0.18);
    preview.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
    frame = requestAnimationFrame(tick);
  }

  rows.forEach((row) => {
    row.addEventListener("mouseenter", (e) => {
      preview.replaceChildren(media(row));
      target = { x: e.clientX, y: e.clientY };
      current = place();
      preview.classList.add("is-visible");
      if (!frame) frame = requestAnimationFrame(tick);
    });

    row.addEventListener("mousemove", (e) => {
      target = { x: e.clientX, y: e.clientY };
    });

    row.addEventListener("mouseleave", () => {
      preview.classList.remove("is-visible");
      cancelAnimationFrame(frame);
      frame = null;
    });
  });
})();
