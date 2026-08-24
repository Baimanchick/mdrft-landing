import type { ClusterLayout } from "../model/cluster-layout";
import { CLUSTER_PALETTE, withAlpha } from "./cluster-palette";
import { paintClusterBackground } from "./screen-base";

const DASH_COUNT = 5;
const CURVE_CONTROL_X = 0.74;
const CURVE_CONTROL_Y = 0.46;

function roadDepth(layout: ClusterLayout): number {
  return layout.roadNearY - layout.roadVanishY;
}

function traceEdge(ctx: CanvasRenderingContext2D, layout: ClusterLayout, spread: number): void {
  const depth = roadDepth(layout);

  ctx.moveTo(layout.centerX, layout.roadVanishY);
  ctx.quadraticCurveTo(
    layout.centerX + spread * CURVE_CONTROL_X,
    layout.roadVanishY + depth * CURVE_CONTROL_Y,
    layout.centerX + spread,
    layout.roadNearY,
  );
}

function traceSurface(ctx: CanvasRenderingContext2D, layout: ClusterLayout, spread: number): void {
  const depth = roadDepth(layout);

  ctx.beginPath();
  ctx.moveTo(layout.centerX - spread, layout.roadNearY);
  ctx.quadraticCurveTo(
    layout.centerX - spread * CURVE_CONTROL_X,
    layout.roadVanishY + depth * CURVE_CONTROL_Y,
    layout.centerX,
    layout.roadVanishY,
  );
  ctx.quadraticCurveTo(
    layout.centerX + spread * CURVE_CONTROL_X,
    layout.roadVanishY + depth * CURVE_CONTROL_Y,
    layout.centerX + spread,
    layout.roadNearY,
  );
  ctx.closePath();
}

function strokeEdge(
  ctx: CanvasRenderingContext2D,
  layout: ClusterLayout,
  spread: number,
  width: number,
  alpha: number,
): void {
  const fade = ctx.createLinearGradient(0, layout.roadVanishY, 0, layout.roadNearY);

  fade.addColorStop(0, withAlpha(CLUSTER_PALETTE.tickLive, 0));
  fade.addColorStop(0.18, withAlpha(CLUSTER_PALETTE.tickLive, alpha * 0.5));
  fade.addColorStop(0.6, withAlpha(CLUSTER_PALETTE.tickLive, alpha));
  fade.addColorStop(1, withAlpha(CLUSTER_PALETTE.tickLive, alpha * 0.9));

  ctx.strokeStyle = fade;
  ctx.lineWidth = width;
  ctx.beginPath();
  traceEdge(ctx, layout, spread);
  ctx.stroke();
}

export function drawRoad(
  ctx: CanvasRenderingContext2D,
  layout: ClusterLayout,
  level: number,
  backlight: number,
  time: number,
): void {
  if (!layout.showRoad || level <= 0.01) return;

  const outer = layout.roadHalfWidth;
  const inner = outer * layout.roadInnerRatio;
  const depth = roadDepth(layout);

  ctx.save();
  traceSurface(ctx, layout, outer);
  ctx.clip();
  paintClusterBackground(ctx, backlight, level);
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = level;
  ctx.lineCap = "butt";

  const surface = ctx.createLinearGradient(0, layout.roadVanishY, 0, layout.roadNearY);

  surface.addColorStop(0, withAlpha(CLUSTER_PALETTE.road, 0));
  surface.addColorStop(0.55, withAlpha(CLUSTER_PALETTE.road, 0.24));
  surface.addColorStop(1, withAlpha(CLUSTER_PALETTE.road, 0.52));

  ctx.fillStyle = surface;
  traceSurface(ctx, layout, inner);
  ctx.fill();

  strokeEdge(ctx, layout, -outer, 1.5, 0.3);
  strokeEdge(ctx, layout, outer, 1.5, 0.3);
  strokeEdge(ctx, layout, -inner, 2.4, 0.82);
  strokeEdge(ctx, layout, inner, 2.4, 0.82);

  const flow = (time / 2200) % 1;

  for (let i = 0; i < DASH_COUNT; i += 1) {
    const phase = ((i / DASH_COUNT + flow) % 1 + 1) % 1;
    const near = phase * phase;
    const far = Math.max(0, near - 0.09);

    ctx.strokeStyle = withAlpha(CLUSTER_PALETTE.tickLive, 0.08 + 0.32 * near);
    ctx.lineWidth = 1 + 3 * near;
    ctx.beginPath();
    ctx.moveTo(layout.centerX, layout.roadVanishY + depth * far);
    ctx.lineTo(layout.centerX, layout.roadVanishY + depth * near);
    ctx.stroke();
  }

  ctx.restore();
}
