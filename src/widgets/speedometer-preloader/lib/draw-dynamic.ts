import {
  type ArcGaugeSpec,
  TELEMETRY_PANEL_HEIGHT,
  type ClusterLayout,
  gaugeAngleAt,
  toRadians,
} from "../model/cluster-layout";
import { drawMiniBezel, drawMiniNeedle } from "./mini-gauge";
import { type ModeIconKind, drawModeIcon } from "./mode-icons";
import { drawRoad } from "./road-graphic";
import { paintClusterBackground } from "./screen-base";
import { GAUGE } from "../model/gauge-geometry";
import { ringBevel, ringSheen } from "./chrome";
import { CLUSTER_FONT } from "./cluster-font";
import { type ClusterImages } from "./cluster-images";
import { CLUSTER_PALETTE, withAlpha } from "./cluster-palette";
import { drawBadgeLogo, drawBrandLogo } from "./m-logo";

const BADGE_Y = -0.21;
const BADGE_WIDTH = 0.36;
const TELEMETRY_CHAMFER = 22;
const MODE_SLOT_GAP = 92;
const MODE_LABEL_SIZE = 12;
const MODE_ICON_SIZE = 18;
const MODE_ICON_OFFSET = 22;

export type ClusterFrameInput = {
  readonly layout: ClusterLayout;
  readonly tickLayer: CanvasImageSource;
  readonly numberLayer: CanvasImageSource;
  readonly images: ClusterImages;
  readonly backlight: number;
  readonly arcProgress: number;
  readonly arcLevel: number;
  readonly glowLevel: number;
  readonly logoLevel: number;
  readonly tickLevel: number;
  readonly numberLevel: number;
  readonly needleLevel: number;
  readonly speed: number;
  readonly rpm: number;
  readonly badgeLevel: number;
  readonly centerLevel: number;
  readonly roadLevel: number;
  readonly readyLevel: number;
  readonly odometer: number;
  readonly trip: number;
  readonly clock: string;
  readonly time: number;
};

function traceRing(ctx: CanvasRenderingContext2D, spec: ArcGaugeSpec, radius: number): void {
  ctx.beginPath();
  ctx.arc(
    spec.cx,
    spec.cy,
    radius,
    toRadians(spec.ringStartAngle),
    toRadians(spec.ringStartAngle + spec.ringSweepAngle),
  );
}

function ringLength(spec: ArcGaugeSpec, radius: number): number {
  return radius * Math.abs(toRadians(spec.ringSweepAngle));
}

function drawBezel(
  ctx: CanvasRenderingContext2D,
  spec: ArcGaugeSpec,
  progress: number,
  level: number,
): void {
  if (level <= 0.01 || progress <= 0.002) return;

  const outer = spec.radius * GAUGE.outerRing;
  const band = spec.radius * GAUGE.bezel;
  const bandWidth = spec.radius * GAUGE.bezelWidth;
  const edge = spec.radius * GAUGE.bezelInnerEdge;

  ctx.save();
  ctx.globalAlpha = level;
  ctx.lineCap = "butt";

  ctx.setLineDash([ringLength(spec, outer) * progress, ringLength(spec, outer)]);
  ctx.strokeStyle = "rgba(0, 0, 0, 0.9)";
  ctx.lineWidth = bandWidth * 1.65;
  traceRing(ctx, spec, outer - bandWidth * 0.08);
  ctx.stroke();

  ctx.setLineDash([ringLength(spec, outer) * progress, ringLength(spec, outer)]);
  ctx.strokeStyle = withAlpha(CLUSTER_PALETTE.chromeHigh, 0.72);
  ctx.lineWidth = Math.max(1, spec.radius * GAUGE.outerRingWidth);
  traceRing(ctx, spec, outer);
  ctx.stroke();

  ctx.setLineDash([ringLength(spec, band) * progress, ringLength(spec, band)]);
  ctx.strokeStyle = ringBevel(ctx, spec.cx, spec.cy, band, bandWidth);
  ctx.lineWidth = bandWidth;
  traceRing(ctx, spec, band);
  ctx.stroke();

  ctx.strokeStyle = ringSheen(ctx, spec.cx, spec.cy, band);
  ctx.lineWidth = bandWidth * 0.26;
  traceRing(ctx, spec, band);
  ctx.stroke();

  ctx.setLineDash([ringLength(spec, edge) * progress, ringLength(spec, edge)]);
  ctx.strokeStyle = withAlpha("#05070b", 0.9);
  ctx.lineWidth = Math.max(1, spec.radius * GAUGE.bezelInnerEdgeWidth);
  traceRing(ctx, spec, edge);
  ctx.stroke();

  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = level * 0.07;
  ctx.strokeStyle = withAlpha(CLUSTER_PALETTE.chromeTop, 0.5);
  ctx.lineWidth = bandWidth * 1.45;
  ctx.setLineDash([ringLength(spec, band) * progress, ringLength(spec, band)]);
  traceRing(ctx, spec, band);
  ctx.stroke();
  ctx.restore();
}

function fillStretchedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  stretch: number,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(stretch, 1);
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

function bladePath(
  ctx: CanvasRenderingContext2D,
  reach: number,
  half: number,
  waist: number,
): void {
  ctx.beginPath();
  ctx.moveTo(reach, 0);
  ctx.quadraticCurveTo(reach * waist, -half, 0, -half * 0.82);
  ctx.lineTo(0, half * 0.82);
  ctx.quadraticCurveTo(reach * waist, half, reach, 0);
  ctx.closePath();
}

function bevel(
  ctx: CanvasRenderingContext2D,
  half: number,
  bright: string,
  mid: string,
  dark: string,
): CanvasGradient {
  const shade = ctx.createLinearGradient(0, -half, 0, half);

  shade.addColorStop(0, bright);
  shade.addColorStop(0.42, mid);
  shade.addColorStop(0.52, mid);
  shade.addColorStop(1, dark);

  return shade;
}

function drawHubRing(ctx: CanvasRenderingContext2D, spec: ArcGaugeSpec, level: number): void {
  const outer = spec.radius * GAUGE.hubOuter;
  const red = spec.radius * GAUGE.hubRed;
  const base = spec.radius * GAUGE.hubBase;

  ctx.save();
  ctx.globalAlpha = level;

  ctx.fillStyle = "#04060a";
  ctx.beginPath();
  ctx.arc(spec.cx, spec.cy, outer, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = ringBevel(ctx, spec.cx, spec.cy, outer, spec.radius * GAUGE.hubOuterWidth);
  ctx.lineWidth = spec.radius * GAUGE.hubOuterWidth;
  ctx.beginPath();
  ctx.arc(spec.cx, spec.cy, outer, 0, Math.PI * 2);
  ctx.stroke();

  ctx.globalCompositeOperation = "lighter";

  ctx.strokeStyle = withAlpha(CLUSTER_PALETTE.needle, 0.1);
  ctx.lineWidth = spec.radius * GAUGE.hubRedWidth * 3.2;
  ctx.beginPath();
  ctx.arc(spec.cx, spec.cy, red, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = CLUSTER_PALETTE.needle;
  ctx.lineWidth = spec.radius * GAUGE.hubRedWidth;
  ctx.beginPath();
  ctx.arc(spec.cx, spec.cy, red, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = level;
  ctx.fillStyle = "#070a0f";
  ctx.beginPath();
  ctx.arc(spec.cx, spec.cy, base, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = withAlpha(CLUSTER_PALETTE.chromeHigh, 0.75);
  ctx.lineWidth = Math.max(1, spec.radius * GAUGE.hubBaseWidth);
  ctx.beginPath();
  ctx.arc(spec.cx, spec.cy, base, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawNeedle(
  ctx: CanvasRenderingContext2D,
  spec: ArcGaugeSpec,
  value: number,
  level: number,
): void {
  if (level <= 0.01) return;

  drawHubRing(ctx, spec, level);

  const angle = gaugeAngleAt(spec, value);
  const tip = spec.radius * GAUGE.needleTip;
  const tail = spec.radius * GAUGE.needleTail;
  const half = spec.radius * GAUGE.needleHalf;

  ctx.save();
  ctx.globalAlpha = level;
  ctx.translate(spec.cx, spec.cy);
  ctx.rotate(angle);

  ctx.fillStyle = bevel(ctx, half, "#ffffff", CLUSTER_PALETTE.needleTail, "#6d7789");
  ctx.save();
  ctx.scale(-1, 1);
  bladePath(ctx, tail, half * 0.86, GAUGE.needleWaist);
  ctx.restore();
  ctx.fill();

  ctx.fillStyle = bevel(ctx, half, "#ff6b62", CLUSTER_PALETTE.needle, CLUSTER_PALETTE.needleDeep);
  bladePath(ctx, tip, half, GAUGE.needleWaist);
  ctx.fill();

  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = withAlpha(CLUSTER_PALETTE.needle, 0.5);
  ctx.lineWidth = half * 0.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(half, 0);
  ctx.lineTo(tip * 0.94, 0);
  ctx.stroke();
  ctx.restore();
}

function drawReadout(
  ctx: CanvasRenderingContext2D,
  spec: ArcGaugeSpec,
  value: number,
  level: number,
): void {
  if (level <= 0.01) return;

  ctx.save();
  ctx.globalAlpha = level;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 ${Math.round(spec.radius * GAUGE.readoutSize)}px ${CLUSTER_FONT}`;
  ctx.fillStyle = CLUSTER_PALETTE.text;
  fillStretchedText(
    ctx,
    String(Math.round(value)),
    spec.cx,
    spec.cy - spec.radius * GAUGE.readout,
    1.12,
  );
  ctx.restore();
}

const MODE_SLOTS: readonly { readonly label: string; readonly icon: ModeIconKind }[] = [
  { label: "Efficient", icon: "gauge" },
  { label: "Comfort", icon: "feather" },
  { label: "Comfort", icon: "steeringWheel" },
];

function drawModes(ctx: CanvasRenderingContext2D, input: ClusterFrameInput): void {
  if (!input.layout.showModes) return;

  const level = input.centerLevel * input.backlight;

  if (level <= 0.01) return;

  const { layout } = input;

  ctx.save();
  ctx.globalAlpha = level;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < MODE_SLOTS.length; i += 1) {
    const slot = MODE_SLOTS[i];
    const x = layout.centerX + (i - 1) * MODE_SLOT_GAP;

    ctx.font = `300 ${MODE_LABEL_SIZE}px ${CLUSTER_FONT}`;
    ctx.fillStyle = withAlpha(CLUSTER_PALETTE.text, 0.88);
    ctx.fillText(slot.label, x, layout.modeRowY);

    drawModeIcon(
      ctx,
      slot.icon,
      x,
      layout.modeRowY + MODE_ICON_OFFSET,
      MODE_ICON_SIZE,
      withAlpha(CLUSTER_PALETTE.text, 0.82),
    );
  }

  ctx.font = `700 15px ${CLUSTER_FONT}`;
  ctx.fillStyle = CLUSTER_PALETTE.text;
  ctx.fillText("4WD", layout.centerX, layout.mdmRowY);
  ctx.restore();
}

function drawGear(ctx: CanvasRenderingContext2D, input: ClusterFrameInput): void {
  const level = input.centerLevel * input.backlight;

  if (level <= 0.01) return;

  ctx.save();
  ctx.globalAlpha = level;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 44px ${CLUSTER_FONT}`;
  ctx.fillStyle = CLUSTER_PALETTE.text;
  fillStretchedText(ctx, "P", input.layout.centerX, input.layout.gearY, 1.14);
  ctx.restore();
}

function traceTelemetryPanel(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  half: number,
  top: number,
  bottom: number,
  chamfer: number,
): void {
  ctx.beginPath();
  ctx.moveTo(centerX - half + chamfer, top);
  ctx.quadraticCurveTo(centerX, top - 8, centerX + half - chamfer, top);
  ctx.lineTo(centerX + half, top + 9);
  ctx.lineTo(centerX + half - chamfer, bottom);
  ctx.lineTo(centerX - half + chamfer, bottom);
  ctx.lineTo(centerX - half, top + 9);
  ctx.closePath();
}

function drawTelemetry(ctx: CanvasRenderingContext2D, input: ClusterFrameInput): void {
  const level = input.centerLevel * input.backlight;

  if (level <= 0.01) return;

  const { layout } = input;
  const half = layout.telemetryWidth / 2;
  const y = layout.telemetryY;
  const top = y - TELEMETRY_PANEL_HEIGHT / 2;
  const bottom = y + TELEMETRY_PANEL_HEIGHT / 2;
  const chamfer = TELEMETRY_CHAMFER;
  const at = (fraction: number): number => layout.centerX - half + layout.telemetryWidth * fraction;

  ctx.save();
  ctx.globalAlpha = level;

  traceTelemetryPanel(ctx, layout.centerX, half, top, bottom, chamfer);

  const backing = ctx.createLinearGradient(0, top, 0, bottom);

  backing.addColorStop(0, "rgba(24, 28, 34, 0.94)");
  backing.addColorStop(0.42, "rgba(8, 10, 14, 0.96)");
  backing.addColorStop(1, "rgba(2, 3, 5, 0.9)");

  ctx.fillStyle = backing;
  ctx.fill();

  const rim = ctx.createLinearGradient(layout.centerX - half, 0, layout.centerX + half, 0);

  rim.addColorStop(0, withAlpha(CLUSTER_PALETTE.chromeMid, 0));
  rim.addColorStop(0.16, withAlpha(CLUSTER_PALETTE.chromeHigh, 0.6));
  rim.addColorStop(0.5, withAlpha(CLUSTER_PALETTE.chromeTop, 0.95));
  rim.addColorStop(0.84, withAlpha(CLUSTER_PALETTE.chromeHigh, 0.6));
  rim.addColorStop(1, withAlpha(CLUSTER_PALETTE.chromeMid, 0));

  ctx.strokeStyle = rim;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(layout.centerX - half + chamfer, top);
  ctx.quadraticCurveTo(layout.centerX, top - 8, layout.centerX + half - chamfer, top);
  ctx.stroke();

  ctx.strokeStyle = withAlpha(CLUSTER_PALETTE.chromeMid, 0.28);
  ctx.lineWidth = 1;
  traceTelemetryPanel(ctx, layout.centerX, half, top, bottom, chamfer);
  ctx.stroke();

  ctx.strokeStyle = withAlpha(CLUSTER_PALETTE.chromeMid, 0.3);
  ctx.lineWidth = 1;

  for (const fraction of [0.17, 0.56, 0.84]) {
    ctx.beginPath();
    ctx.moveTo(at(fraction), top + 8);
    ctx.lineTo(at(fraction), bottom - 7);
    ctx.stroke();
  }

  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.font = `700 16px ${CLUSTER_FONT}`;
  ctx.fillStyle = CLUSTER_PALETTE.text;
  fillStretchedText(ctx, input.clock, at(0.08), y, 1.08);

  ctx.textAlign = "left";
  ctx.font = `300 10px ${CLUSTER_FONT}`;
  ctx.fillStyle = CLUSTER_PALETTE.textDim;
  ctx.fillText("TOTAL", at(0.21), y);
  ctx.fillText("TRIP", at(0.595), y);

  ctx.font = `700 16px ${CLUSTER_FONT}`;
  ctx.fillStyle = CLUSTER_PALETTE.text;
  fillStretchedText(ctx, String(Math.round(input.odometer)), at(0.335), y, 1.08);
  fillStretchedText(ctx, input.trip.toFixed(1), at(0.685), y, 1.08);

  ctx.font = `300 9px ${CLUSTER_FONT}`;
  ctx.fillStyle = CLUSTER_PALETTE.textDim;
  ctx.fillText("km", at(0.47), y + 1);
  ctx.fillText("km", at(0.77), y + 1);

  ctx.textAlign = "right";
  ctx.font = `700 16px ${CLUSTER_FONT}`;
  ctx.fillStyle = CLUSTER_PALETTE.text;
  fillStretchedText(ctx, "+18.0 °C", at(0.975), y, 1.06);
  ctx.restore();
}

function drawCenterGlow(ctx: CanvasRenderingContext2D, input: ClusterFrameInput): void {
  const level = input.glowLevel * input.backlight;

  if (level <= 0.01) return;

  const { layout } = input;
  const reach = layout.width * 0.24;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = level;

  const bloom = ctx.createRadialGradient(
    layout.centerX,
    layout.logoY,
    0,
    layout.centerX,
    layout.logoY,
    reach,
  );

  bloom.addColorStop(0, withAlpha(CLUSTER_PALETTE.mRed, 0.34));
  bloom.addColorStop(0.4, withAlpha(CLUSTER_PALETTE.mRed, 0.08));
  bloom.addColorStop(1, withAlpha(CLUSTER_PALETTE.mRed, 0));

  ctx.fillStyle = bloom;
  ctx.beginPath();
  ctx.ellipse(layout.centerX, layout.logoY, reach, reach * 0.34, 0, 0, Math.PI * 2);
  ctx.fill();

  const streak = ctx.createLinearGradient(
    layout.centerX - reach * 1.5,
    0,
    layout.centerX + reach * 1.5,
    0,
  );

  streak.addColorStop(0, withAlpha(CLUSTER_PALETTE.mRed, 0));
  streak.addColorStop(0.5, withAlpha(CLUSTER_PALETTE.mRed, 0.62));
  streak.addColorStop(1, withAlpha(CLUSTER_PALETTE.mRed, 0));

  ctx.fillStyle = streak;
  ctx.fillRect(layout.centerX - reach * 1.5, layout.logoY - 1.2, reach * 3, 2.4);
  ctx.restore();
}

function drawAtmosphere(ctx: CanvasRenderingContext2D, backlight: number): void {
  const { width, height } = ctx.canvas;

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  const vignette = ctx.createRadialGradient(
    width / 2,
    height / 2,
    Math.min(width, height) * 0.42,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.76,
  );

  vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  vignette.addColorStop(1, `rgba(0, 0, 0, ${0.45 * backlight})`);

  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

export function drawClusterFrame(ctx: CanvasRenderingContext2D, input: ClusterFrameInput): void {
  const { layout } = input;
  const arc = input.arcLevel * input.backlight;
  const ticks = input.tickLevel * input.backlight;
  const numbers = input.numberLevel * input.backlight;
  const needles = input.needleLevel * input.backlight;

  paintClusterBackground(ctx, input.backlight, 1);
  drawRoad(ctx, layout, input.roadLevel * input.backlight, input.backlight, input.time);

  drawBezel(ctx, layout.speed, input.arcProgress, arc);
  drawBezel(ctx, layout.rpm, input.arcProgress, arc);

  if (layout.fuel) drawMiniBezel(ctx, layout.fuel, input.arcProgress, arc);
  if (layout.coolant) drawMiniBezel(ctx, layout.coolant, input.arcProgress, arc);

  if (ticks > 0.01) {
    ctx.save();
    ctx.globalAlpha = ticks;
    ctx.drawImage(input.tickLayer, 0, 0, layout.width, layout.height);
    ctx.restore();
  }

  if (numbers > 0.01) {
    ctx.save();
    ctx.globalAlpha = numbers;
    ctx.drawImage(input.numberLayer, 0, 0, layout.width, layout.height);
    ctx.restore();
  }

  drawReadout(ctx, layout.speed, input.speed, numbers);
  drawBadgeLogo(
    ctx,
    input.images.badge,
    layout.rpm.cx,
    layout.rpm.cy + layout.rpm.radius * BADGE_Y,
    layout.rpm.radius * BADGE_WIDTH,
    input.badgeLevel * input.backlight,
  );
  drawModes(ctx, input);
  drawGear(ctx, input);
  drawTelemetry(ctx, input);

  if (layout.fuel) drawMiniNeedle(ctx, layout.fuel, needles);
  if (layout.coolant) drawMiniNeedle(ctx, layout.coolant, needles);

  drawNeedle(ctx, layout.speed, input.speed, needles);
  drawNeedle(ctx, layout.rpm, input.rpm, needles);

  drawCenterGlow(ctx, input);
  drawBrandLogo(
    ctx,
    input.images.brand,
    layout.centerX,
    layout.logoY,
    layout.logoWidth,
    input.logoLevel * input.backlight,
  );

  drawAtmosphere(ctx, input.backlight);
}
