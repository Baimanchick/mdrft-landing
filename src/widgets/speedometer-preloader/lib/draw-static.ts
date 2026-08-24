import {
  type ArcGaugeSpec,
  type ClusterLayout,
  gaugeAngleAt,
  polarX,
  polarY,
  toRadians,
} from "../model/cluster-layout";
import { GAUGE, TICK_TIER, tickLength, tickTierAt, tickWidth } from "../model/gauge-geometry";
import { fillOpticallyCenteredText } from "./canvas-text";
import { ringBevel, ringSheen } from "./chrome";
import { drawMiniDial, drawMiniLabels, drawMiniTicks } from "./mini-gauge";
import { CLUSTER_FONT } from "./cluster-font";
import { CLUSTER_PALETTE, withAlpha } from "./cluster-palette";

const WARN_SPAN = 0.7;
const LABEL_STRETCH = 1;

function scaleArc(ctx: CanvasRenderingContext2D, spec: ArcGaugeSpec, radius: number): void {
  ctx.beginPath();
  ctx.arc(
    spec.cx,
    spec.cy,
    radius,
    toRadians(spec.ringStartAngle),
    toRadians(spec.ringStartAngle + spec.ringSweepAngle),
  );
}

function drawDialSurface(ctx: CanvasRenderingContext2D, spec: ArcGaugeSpec): void {
  const outer = spec.radius * GAUGE.dialOuter;
  const inner = spec.radius * GAUGE.dialInner;
  const start = toRadians(spec.ringStartAngle);
  const end = toRadians(spec.ringStartAngle + spec.ringSweepAngle);

  ctx.save();
  ctx.beginPath();
  ctx.arc(spec.cx, spec.cy, outer, start, end);
  ctx.arc(spec.cx, spec.cy, inner, end, start, true);
  ctx.closePath();

  const face = ctx.createRadialGradient(spec.cx, spec.cy, inner, spec.cx, spec.cy, outer);

  face.addColorStop(0, "rgba(4, 6, 9, 0.98)");
  face.addColorStop(0.18, "rgba(17, 21, 27, 0.96)");
  face.addColorStop(0.62, "rgba(25, 30, 37, 0.88)");
  face.addColorStop(0.9, "rgba(13, 17, 22, 0.96)");
  face.addColorStop(1, "rgba(3, 5, 8, 0.99)");

  ctx.fillStyle = face;
  ctx.fill();

  const shade = ctx.createLinearGradient(
    spec.cx - spec.radius,
    spec.cy - spec.radius,
    spec.cx + spec.radius,
    spec.cy + spec.radius,
  );

  shade.addColorStop(0, "rgba(255, 255, 255, 0.08)");
  shade.addColorStop(0.34, "rgba(255, 255, 255, 0)");
  shade.addColorStop(0.72, "rgba(0, 0, 0, 0.18)");
  shade.addColorStop(1, "rgba(255, 255, 255, 0.04)");
  ctx.fillStyle = shade;
  ctx.fill();
  ctx.restore();
}

function drawDialSeparators(ctx: CanvasRenderingContext2D, spec: ArcGaugeSpec): void {
  const count = Math.round((spec.max - spec.min) / spec.majorStep);
  const outer = spec.radius * GAUGE.dialSeparatorOuter;
  const inner = spec.radius * GAUGE.dialSeparatorInner;

  ctx.save();
  ctx.strokeStyle = withAlpha(CLUSTER_PALETTE.chromeHigh, 0.13);
  ctx.lineWidth = Math.max(0.7, spec.radius * 0.003);

  for (let i = 0; i <= count; i += 1) {
    const angle = gaugeAngleAt(spec, spec.min + i * spec.majorStep);

    ctx.beginPath();
    ctx.moveTo(polarX(spec.cx, outer, angle), polarY(spec.cy, outer, angle));
    ctx.lineTo(polarX(spec.cx, inner, angle), polarY(spec.cy, inner, angle));
    ctx.stroke();
  }

  ctx.restore();
}

function drawRedlineBand(ctx: CanvasRenderingContext2D, spec: ArcGaugeSpec): void {
  if (spec.redlineFrom === null) return;

  const radius = spec.radius * GAUGE.redline;

  ctx.save();
  ctx.lineCap = "butt";
  ctx.lineWidth = spec.radius * GAUGE.redlineWidth;

  const warm = ctx.createLinearGradient(
    polarX(spec.cx, radius, gaugeAngleAt(spec, spec.redlineFrom - WARN_SPAN)),
    polarY(spec.cy, radius, gaugeAngleAt(spec, spec.redlineFrom - WARN_SPAN)),
    polarX(spec.cx, radius, gaugeAngleAt(spec, spec.redlineFrom)),
    polarY(spec.cy, radius, gaugeAngleAt(spec, spec.redlineFrom)),
  );

  warm.addColorStop(0, withAlpha(CLUSTER_PALETTE.amber, 0.15));
  warm.addColorStop(1, CLUSTER_PALETTE.amber);

  ctx.strokeStyle = warm;
  ctx.beginPath();
  ctx.arc(
    spec.cx,
    spec.cy,
    radius,
    gaugeAngleAt(spec, spec.redlineFrom - WARN_SPAN),
    gaugeAngleAt(spec, spec.redlineFrom),
  );
  ctx.stroke();

  ctx.strokeStyle = CLUSTER_PALETTE.redline;
  ctx.beginPath();
  ctx.arc(
    spec.cx,
    spec.cy,
    radius,
    gaugeAngleAt(spec, spec.redlineFrom),
    gaugeAngleAt(spec, spec.max),
  );
  ctx.stroke();
  ctx.restore();
}

function drawTicks(ctx: CanvasRenderingContext2D, spec: ArcGaugeSpec): void {
  const steps = Math.round((spec.max - spec.min) / spec.minorStep);
  const outer = spec.radius * GAUGE.tickOuter;

  ctx.save();
  ctx.lineCap = "butt";

  for (let i = 0; i <= steps; i += 1) {
    const value = spec.min + i * spec.minorStep;
    const tier = tickTierAt(value, spec.majorStep);
    const angle = gaugeAngleAt(spec, value);
    const length = spec.radius * tickLength(tier);
    const past = spec.redlineFrom !== null && value >= spec.redlineFrom;
    const warn =
      spec.redlineFrom !== null && !past && value >= spec.redlineFrom - WARN_SPAN;

    const tone =
      tier === TICK_TIER.major
        ? CLUSTER_PALETTE.tickLive
        : past
          ? CLUSTER_PALETTE.redline
          : warn
            ? CLUSTER_PALETTE.amber
            : CLUSTER_PALETTE.tickLive;
    const alpha =
      tier === TICK_TIER.major ? 0.97 : tier === TICK_TIER.medium ? 0.76 : 0.52;

    const width = spec.radius * tickWidth(tier);

    if (tier === TICK_TIER.major) {
      const outerHalf = width * 0.55;
      const innerHalf = width * 0.36;
      const tangentX = -Math.sin(angle);
      const tangentY = Math.cos(angle);
      const outerX = polarX(spec.cx, outer, angle);
      const outerY = polarY(spec.cy, outer, angle);
      const innerX = polarX(spec.cx, outer - length, angle);
      const innerY = polarY(spec.cy, outer - length, angle);

      ctx.fillStyle = withAlpha(tone, alpha);
      ctx.beginPath();
      ctx.moveTo(outerX + tangentX * outerHalf, outerY + tangentY * outerHalf);
      ctx.lineTo(outerX - tangentX * outerHalf, outerY - tangentY * outerHalf);
      ctx.lineTo(innerX - tangentX * innerHalf, innerY - tangentY * innerHalf);
      ctx.lineTo(innerX + tangentX * innerHalf, innerY + tangentY * innerHalf);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.strokeStyle = withAlpha(tone, alpha);
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

function drawInnerRings(ctx: CanvasRenderingContext2D, spec: ArcGaugeSpec): void {
  const band = spec.radius * GAUGE.innerBand;
  const bandWidth = spec.radius * GAUGE.innerBandWidth;

  ctx.save();
  ctx.lineCap = "butt";

  ctx.strokeStyle = withAlpha(CLUSTER_PALETTE.chromeHigh, 0.62);
  ctx.lineWidth = Math.max(1, spec.radius * GAUGE.innerOuterLineWidth);
  scaleArc(ctx, spec, spec.radius * GAUGE.innerOuterLine);
  ctx.stroke();

  ctx.strokeStyle = ringBevel(ctx, spec.cx, spec.cy, band, bandWidth);
  ctx.lineWidth = bandWidth;
  scaleArc(ctx, spec, band);
  ctx.stroke();

  ctx.strokeStyle = ringSheen(ctx, spec.cx, spec.cy, band);
  ctx.lineWidth = bandWidth * 0.28;
  scaleArc(ctx, spec, band);
  ctx.stroke();

  ctx.strokeStyle = withAlpha("#020307", 0.86);
  ctx.lineWidth = Math.max(1, spec.radius * GAUGE.innerInnerLineWidth);
  scaleArc(ctx, spec, spec.radius * GAUGE.innerInnerLine);
  ctx.stroke();
  ctx.restore();
}

function drawScaleLabels(ctx: CanvasRenderingContext2D, spec: ArcGaugeSpec): void {
  const labelRadius = spec.radius * GAUGE.label;
  const count = Math.round((spec.max - spec.min) / spec.majorStep);

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 ${Math.round(spec.radius * GAUGE.labelSize)}px ${CLUSTER_FONT}`;

  for (let i = 0; i <= count; i += 1) {
    const value = spec.min + i * spec.majorStep;

    if (value < spec.labelFrom) continue;

    const text = String(value);
    const angle = gaugeAngleAt(spec, value);
    ctx.fillStyle = CLUSTER_PALETTE.text;
    fillOpticallyCenteredText(
      ctx,
      text,
      polarX(spec.cx, labelRadius, angle),
      polarY(spec.cy, labelRadius, angle),
      LABEL_STRETCH,
    );
  }

  if (spec.caption) {
    ctx.font = `400 ${Math.round(spec.radius * GAUGE.captionSize)}px ${CLUSTER_FONT}`;
    ctx.fillStyle = withAlpha(CLUSTER_PALETTE.textDim, 0.92);
    ctx.fillText(spec.caption, spec.cx, spec.cy - spec.radius * GAUGE.caption);
  }
  ctx.restore();
}

export function drawTickLayer(ctx: CanvasRenderingContext2D, layout: ClusterLayout): void {
  ctx.clearRect(0, 0, layout.width, layout.height);

  for (const spec of [layout.speed, layout.rpm]) {
    drawDialSurface(ctx, spec);
    drawDialSeparators(ctx, spec);
    drawRedlineBand(ctx, spec);
    drawTicks(ctx, spec);
    drawInnerRings(ctx, spec);
  }

  if (layout.fuel) {
    drawMiniDial(ctx, layout.fuel);
    drawMiniTicks(ctx, layout.fuel);
  }

  if (layout.coolant) {
    drawMiniDial(ctx, layout.coolant);
    drawMiniTicks(ctx, layout.coolant);
  }
}

export function drawNumberLayer(ctx: CanvasRenderingContext2D, layout: ClusterLayout): void {
  ctx.clearRect(0, 0, layout.width, layout.height);

  drawScaleLabels(ctx, layout.speed);
  drawScaleLabels(ctx, layout.rpm);

  if (layout.fuel) drawMiniLabels(ctx, layout.fuel);
  if (layout.coolant) drawMiniLabels(ctx, layout.coolant);
}
