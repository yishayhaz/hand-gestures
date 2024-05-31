export function init(canvas, ctx) {
  resize(canvas, ctx);
  window.addEventListener("resize", () => resize(canvas, ctx));
}

export function resize(canvas, ctx) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
}
