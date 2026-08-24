import { type MiniGaugeSpec, miniAngleAt, polarX, polarY } from "../model/cluster-layout";
import { MINI } from "../model/gauge-geometry";
import { fillOpticallyCenteredText } from "./canvas-text";
import { ringBevel, ringSheen } from "./chrome";
import { CLUSTER_FONT } from "./cluster-font";
import { CLUSTER_PALETTE, withAlpha } from "./cluster-palette";
import { drawModeIcon } from "./mode-icons";

function sweepArc(
  ctx: CanvasRenderingContext2D,
  spec: MiniGaugeSpec,
  radius: number,
  progress: number,
): void {
  ctx.beginPath();
  ctx.arc(
    spec.cx,
    spec.cy,
    radius,
    miniAngleAt(spec, 0),
    miniAngleAt(spec, progress),
    spec.sweepAngle < 0,
  );
}

function tickTone(spec: MiniGaugeSpec, ratio: number): string {
  if (spec.blueUntil > 0 && ratio <= spec.blueUntil) return CLUSTER_PALETTE.mBlue;
  if (spec.redUntil > 0 && ratio <= spec.redUntil) return CLUSTER_PALETTE.redline;
  if (ratio >= spec.redFrom) return CLUSTER_PALETTE.redline;

  return CLUSTER_PALETTE.tickLive;
}

export function drawMiniBezel(
  ctx: CanvasRenderingContext2D,
  spec: MiniGaugeSpec,
  progress: number,
  level: number,
): void {
  if (level <= 0.01 || progress <= 0.002) return;

  const outer = spec.radius * MINI.outerContour;
  const band = spec.radius * MINI.bezel;
  const bandWidth = spec.radius * MINI.bezelWidth;

  ctx.save();
  ctx.globalAlpha = level;
  ctx.lineCap = "butt";

  ctx.strokeStyle = withAlpha(CLUSTER_PALETTE.chromeHigh, 0.55);
  ctx.lineWidth = Math.max(1, spec.radius * MINI.outerContourWidth);
  sweepArc(ctx, spec, outer, progress);
  ctx.stroke();

  ctx.lineCap = "butt";
  ctx.strokeStyle = ringBevel(ctx, spec.cx, spec.cy, band, bandWidth);
  ctx.lineWidth = bandWidth;
  sweepArc(ctx, spec, band, progress);
  ctx.stroke();

  ctx.strokeStyle = ringSheen(ctx, spec.cx, spec.cy, band);
  ctx.lineWidth = bandWidth * 0.32;
  sweepArc(ctx, spec, band, progress);
  ctx.stroke();

  ctx.strokeStyle = withAlpha("#04060a", 0.92);
  ctx.lineWidth = Math.max(1, spec.radius * MINI.separationWidth);
  sweepArc(ctx, spec, spec.radius * MINI.separation, progress);
  ctx.stroke();

  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = level * 0.06;
  ctx.strokeStyle = withAlpha(CLUSTER_PALETTE.chromeTop, 0.5);
  ctx.lineWidth = bandWidth * 1.45;
  sweepArc(ctx, spec, band, progress);
  ctx.stroke();
  ctx.restore();
}

export function drawMiniDial(ctx: CanvasRenderingContext2D, spec: MiniGaugeSpec): void {
  const outer = spec.radius * MINI.dialOuter;
  const inner = spec.radius * MINI.dialInner;
  const counter = spec.sweepAngle < 0;

  ctx.save();
  ctx.beginPath();
  ctx.arc(spec.cx, spec.cy, outer, miniAngleAt(spec, 0), miniAngleAt(spec, 1), counter);
  ctx.arc(spec.cx, spec.cy, inner, miniAngleAt(spec, 1), miniAngleAt(spec, 0), !counter);
  ctx.closePath();

  const depth = ctx.createRadialGradient(spec.cx, spec.cy, inner, spec.cx, spec.cy, outer);

  depth.addColorStop(0, "rgba(3, 6, 10, 0.98)");
  depth.addColorStop(0.5, "rgba(8, 16, 22, 0.94)");
  depth.addColorStop(0.82, "rgba(13, 31, 42, 0.86)");
  depth.addColorStop(1, "rgba(5, 12, 18, 0.98)");

  ctx.fillStyle = depth;
  ctx.fill();
  ctx.restore();
}

export function drawMiniTicks(ctx: CanvasRenderingContext2D, spec: MiniGaugeSpec): void {
  const outer = spec.radius * MINI.tickOuter;

  ctx.save();
  ctx.lineCap = "butt";

  for (let i = 0; i <= spec.minorSteps; i += 1) {
    const ratio = i / spec.minorSteps;
    const angle = miniAngleAt(spec, ratio);
    const isMajor = i % spec.majorEvery === 0;
    const isMedium = !isMajor && i % (spec.majorEvery / 2) === 0;
    const length =
      spec.radius *
      (isMajor ? MINI.tickMajorLength : isMedium ? MINI.tickMediumLength : MINI.tickMinorLength);
    const width =
      spec.radius *
      (isMajor ? MINI.tickMajorWidth : isMedium ? MINI.tickMediumWidth : MINI.tickMinorWidth);

    const tone = tickTone(spec, ratio);

    if (isMajor) {
      const tangentX = -Math.sin(angle);
      const tangentY = Math.cos(angle);
      const outerX = polarX(spec.cx, outer, angle);
      const outerY = polarY(spec.cy, outer, angle);
      const innerX = polarX(spec.cx, outer - length, angle);
      const innerY = polarY(spec.cy, outer - length, angle);

      ctx.fillStyle = withAlpha(tone, 0.96);
      ctx.beginPath();
      ctx.moveTo(outerX + tangentX * width * 0.52, outerY + tangentY * width * 0.52);
      ctx.lineTo(outerX - tangentX * width * 0.52, outerY - tangentY * width * 0.52);
      ctx.lineTo(innerX - tangentX * width * 0.3, innerY - tangentY * width * 0.3);
      ctx.lineTo(innerX + tangentX * width * 0.3, innerY + tangentY * width * 0.3);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.strokeStyle = withAlpha(tone, isMedium ? 0.72 : 0.46);
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(polarX(spec.cx, outer, angle), polarY(spec.cy, outer, angle));
      ctx.lineTo(
        polarX(spec.cx, outer - length, angle),
        polarY(spec.cy, outer - length, angle),
      );
      ctx.stroke();
    }
  }

  ctx.restore();
}

export function drawMiniLabels(ctx: CanvasRenderingContext2D, spec: MiniGaugeSpec): void {
  const labelRadius = spec.radius * MINI.label;

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 ${Math.round(spec.radius * MINI.labelSize)}px ${CLUSTER_FONT}`;
  ctx.fillStyle = withAlpha(CLUSTER_PALETTE.text, 0.9);

  for (const label of spec.labels) {
    const angle = miniAngleAt(spec, label.at);

    fillOpticallyCenteredText(
      ctx,
      label.text,
      polarX(spec.cx, labelRadius, angle),
      polarY(spec.cy, labelRadius, angle),
      1.06,
    );
  }

  const iconAngle = miniAngleAt(spec, 1);

  drawModeIcon(
    ctx,
    spec.icon,
    polarX(spec.cx, spec.radius * MINI.iconOffset, iconAngle),
    polarY(spec.cy, spec.radius * MINI.iconOffset, iconAngle),
    spec.radius * MINI.iconSize,
    withAlpha(CLUSTER_PALETTE.text, 0.78),
  );

  const captionAngle = miniAngleAt(spec, 0);
  const captionX = polarX(spec.cx, spec.radius * MINI.iconOffset, captionAngle);
  const captionY = polarY(spec.cy, spec.radius * MINI.iconOffset, captionAngle);

  ctx.font = `700 ${Math.round(spec.radius * MINI.rangeSize)}px ${CLUSTER_FONT}`;
  ctx.fillStyle = CLUSTER_PALETTE.text;
  fillOpticallyCenteredText(ctx, spec.caption, captionX, captionY, 1.08);

  if (spec.captionUnit) {
    ctx.font = `400 ${Math.round(spec.radius * MINI.rangeUnitSize)}px ${CLUSTER_FONT}`;
    ctx.fillStyle = withAlpha(CLUSTER_PALETTE.textDim, 0.95);
    ctx.fillText(spec.captionUnit, captionX, captionY + spec.radius * MINI.rangeSize * 0.85);
  }

  ctx.restore();
}

export function drawMiniNeedle(
  ctx: CanvasRenderingContext2D,
  spec: MiniGaugeSpec,
  level: number,
): void {
  if (level <= 0.01) return;

  const angle = miniAngleAt(spec, spec.value);
  const outer = spec.radius * MINI.needleOuter;
  const inner = spec.radius * MINI.needleInner;
  const half = spec.radius * MINI.needleHalf;

  ctx.save();
  ctx.globalAlpha = level;
  ctx.translate(spec.cx, spec.cy);
  ctx.rotate(angle);

  const blade = ctx.createLinearGradient(0, -half, 0, half);

  blade.addColorStop(0, "#ff8078");
  blade.addColorStop(0.45, CLUSTER_PALETTE.needle);
  blade.addColorStop(1, CLUSTER_PALETTE.needleDeep);

  ctx.fillStyle = blade;
  ctx.beginPath();
  ctx.moveTo(outer, 0);
  ctx.quadraticCurveTo(outer * 0.72, -half, inner, -half * 0.6);
  ctx.lineTo(inner, half * 0.6);
  ctx.quadraticCurveTo(outer * 0.72, half, outer, 0);
  ctx.closePath();
  ctx.fill();

  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = withAlpha("#ffd7d2", 0.55);
  ctx.lineWidth = half * 0.42;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(inner + half, 0);
  ctx.lineTo(outer * 0.94, 0);
  ctx.stroke();
  ctx.restore();

}
