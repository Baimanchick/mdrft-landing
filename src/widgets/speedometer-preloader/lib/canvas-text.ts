export function fillOpticallyCenteredText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  stretch = 1,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(stretch, 1);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  const metrics = ctx.measureText(text);
  const offsetX = (metrics.actualBoundingBoxLeft - metrics.actualBoundingBoxRight) / 2;
  const offsetY = (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;

  ctx.fillText(text, offsetX, offsetY);
  ctx.restore();
}
