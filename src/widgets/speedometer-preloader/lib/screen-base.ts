export function paintClusterBackground(
  ctx: CanvasRenderingContext2D,
  backlight: number,
  alpha: number,
): void {
  const { width, height } = ctx.canvas;

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#040506";
  ctx.fillRect(0, 0, width, height);

  const glow = ctx.createRadialGradient(
    width / 2,
    height * 0.46,
    height * 0.05,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.66,
  );

  glow.addColorStop(0, "#0a0d13");
  glow.addColorStop(0.6, "#05070a");
  glow.addColorStop(1, "#010102");

  ctx.globalAlpha = alpha * (0.55 + 0.45 * backlight);
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}
