// Service details. On devices that can hover, a card follows the cursor
// over each service. On touch, tapping a service opens a sheet instead.

(() => {
  const buttons = document.querySelectorAll(".svc");
  const float = document.querySelector(".svc-float");
  const sheet = document.querySelector(".svc-sheet");
  if (!buttons.length || !float || !sheet) return;

  const canHover = matchMedia("(hover: hover)");
  const body = sheet.querySelector(".svc-sheet-body");
  const detailOf = (btn) => btn.nextElementSibling.innerHTML;
  const OFFSET = 24;

  const place = (x, y) => {
    const { width, height } = float.getBoundingClientRect();
    const left = Math.min(x + OFFSET, innerWidth - width - 16);
    const top = Math.min(Math.max(y - height / 2, 16), innerHeight - height - 16);
    float.style.transform = `translate(${left}px, ${top}px)`;
  };

  buttons.forEach((btn) => {
    btn.addEventListener("mouseenter", (e) => {
      if (!canHover.matches) return;
      float.innerHTML = detailOf(btn);
      place(e.clientX, e.clientY);
      float.classList.add("is-visible");
    });
    btn.addEventListener("mousemove", (e) => {
      if (canHover.matches) place(e.clientX, e.clientY);
    });
    btn.addEventListener("mouseleave", () => float.classList.remove("is-visible"));

    // Touch, or keyboard on any device: open the sheet
    btn.addEventListener("click", (e) => {
      if (canHover.matches && e.detail > 0) return;
      float.classList.remove("is-visible");
      body.innerHTML = detailOf(btn);
      sheet.showModal();
    });
  });

  sheet.querySelector(".svc-close").addEventListener("click", () => sheet.close());
  // A tap on the backdrop lands on the dialog itself
  sheet.addEventListener("click", (e) => {
    if (e.target === sheet) sheet.close();
  });
})();
