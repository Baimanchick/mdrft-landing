import { isImageReady } from "./cluster-images";
import { CLUSTER_PALETTE, withAlpha } from "./cluster-palette";

function drawGlow(ctx: CanvasRenderingContext2D, width: number, level: number): void {
  const reach = width * 0.75;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = level;

  const bloom = ctx.createRadialGradient(0, 10, 0, 0, 10, reach);

  bloom.addColorStop(0, withAlpha(CLUSTER_PALETTE.mRed, 0.32));
  bloom.addColorStop(0.42, withAlpha(CLUSTER_PALETTE.mRed, 0.09));
  bloom.addColorStop(1, withAlpha(CLUSTER_PALETTE.mRed, 0));

  ctx.fillStyle = bloom;
  ctx.beginPath();
  ctx.ellipse(0, 10, reach, reach * 0.36, 0, 0, Math.PI * 2);
  ctx.fill();

  const streak = ctx.createLinearGradient(-reach * 1.3, 0, reach * 1.3, 0);

  streak.addColorStop(0, withAlpha(CLUSTER_PALETTE.mRed, 0));
  streak.addColorStop(0.5, withAlpha(CLUSTER_PALETTE.mRed, 0.55));
  streak.addColorStop(1, withAlpha(CLUSTER_PALETTE.mRed, 0));

  ctx.fillStyle = streak;
  ctx.fillRect(-reach * 1.3, 16, reach * 2.6, 2.4);
  ctx.restore();
}

export function drawBrandLogo(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  level: number,
): void {
  if (level <= 0.01) return;

  ctx.save();
  ctx.translate(x, y);

  drawGlow(ctx, width, level);

  if (isImageReady(image)) {
    const height = (width * image.naturalHeight) / image.naturalWidth;

    ctx.globalAlpha = level;
    ctx.drawImage(image, -width / 2, -height / 2, width, height);
  }

  ctx.restore();
}

export function drawBadgeLogo(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  level: number,
): void {
  if (level <= 0.01 || !isImageReady(image)) return;

  const height = (width * image.naturalHeight) / image.naturalWidth;

  ctx.save();
  ctx.globalAlpha = level;
  ctx.drawImage(image, x - width / 2, y - height / 2, width, height);
  ctx.restore();
}
