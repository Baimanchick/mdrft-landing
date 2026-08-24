export function ringBevel(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  width: number,
): CanvasGradient {
  const bevel = ctx.createRadialGradient(cx, cy, radius - width / 2, cx, cy, radius + width / 2);

  bevel.addColorStop(0, "#11151c");
  bevel.addColorStop(0.14, "#565e6d");
  bevel.addColorStop(0.3, "#c9d2df");
  bevel.addColorStop(0.44, "#ffffff");
  bevel.addColorStop(0.56, "#e2e8f1");
  bevel.addColorStop(0.72, "#8a93a3");
  bevel.addColorStop(0.88, "#39404c");
  bevel.addColorStop(1, "#0d1116");

  return bevel;
}

export function ringSheen(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
): CanvasGradient {
  const sheen = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);

  sheen.addColorStop(0, "rgba(255, 255, 255, 0)");
  sheen.addColorStop(0.18, "rgba(255, 255, 255, 0.55)");
  sheen.addColorStop(0.36, "rgba(255, 255, 255, 0)");
  sheen.addColorStop(0.62, "rgba(255, 255, 255, 0.32)");
  sheen.addColorStop(0.84, "rgba(255, 255, 255, 0)");
  sheen.addColorStop(1, "rgba(255, 255, 255, 0.4)");

  return sheen;
}
