export type ArcGaugeSpec = {
  readonly cx: number;
  readonly cy: number;
  readonly radius: number;
  readonly startAngle: number;
  readonly sweepAngle: number;
  readonly ringStartAngle: number;
  readonly ringSweepAngle: number;
  readonly min: number;
  readonly max: number;
  readonly labelFrom: number;
  readonly minorStep: number;
  readonly majorStep: number;
  readonly redlineFrom: number | null;
  readonly caption: string;
};

export type MiniGaugeIcon = "fuel" | "thermometer";

export type MiniGaugeLabel = {
  readonly at: number;
  readonly text: string;
};

export type MiniGaugeSpec = {
  readonly cx: number;
  readonly cy: number;
  readonly radius: number;
  readonly startAngle: number;
  readonly sweepAngle: number;
  readonly minorSteps: number;
  readonly majorEvery: number;
  readonly blueUntil: number;
  readonly redUntil: number;
  readonly redFrom: number;
  readonly value: number;
  readonly icon: MiniGaugeIcon;
  readonly caption: string;
  readonly captionUnit: string;
  readonly labels: readonly MiniGaugeLabel[];
};

export type ClusterLayout = {
  readonly width: number;
  readonly height: number;
  readonly speed: ArcGaugeSpec;
  readonly rpm: ArcGaugeSpec;
  readonly fuel: MiniGaugeSpec | null;
  readonly coolant: MiniGaugeSpec | null;
  readonly centerX: number;
  readonly logoY: number;
  readonly logoWidth: number;
  readonly modeRowY: number;
  readonly mdmRowY: number;
  readonly gearY: number;
  readonly roadVanishY: number;
  readonly roadNearY: number;
  readonly roadHalfWidth: number;
  readonly roadInnerRatio: number;
  readonly showRoad: boolean;
  readonly telemetryY: number;
  readonly telemetryWidth: number;
  readonly showModes: boolean;
};

export const TELEMETRY_PANEL_HEIGHT = 34;

function telemetryCenterAt(bottomY: number): number {
  return bottomY - TELEMETRY_PANEL_HEIGHT / 2;
}

const ROAD_NEAR_Y = 630;

const MINI_OFFSET_X = 1.22;
const MINI_OFFSET_Y = 0.58;
const MINI_RADIUS = 0.37;
const SPEED_RING_SWEEP = 275;
const SPEED_SCALE_END_GUTTER = 16;

const SPEED_SCALE = {
  startAngle: 115,
  sweepAngle: SPEED_RING_SWEEP - SPEED_SCALE_END_GUTTER,
  ringStartAngle: 115,
  ringSweepAngle: SPEED_RING_SWEEP,
  min: 0,
  max: 330,
  labelFrom: 30,
  minorStep: 7.5,
  majorStep: 30,
  redlineFrom: null,
  caption: "km/h",
} as const;

const RPM_SCALE = {
  startAngle: 167,
  sweepAngle: 244,
  ringStartAngle: 150,
  ringSweepAngle: 275,
  min: 0,
  max: 8,
  labelFrom: 1,
  minorStep: 0.25,
  majorStep: 1,
  redlineFrom: 7,
  caption: "",
} as const;

function fuelArc(gaugeCx: number, gaugeCy: number, gaugeRadius: number): MiniGaugeSpec {
  const cx = gaugeCx - gaugeRadius * MINI_OFFSET_X;
  const cy = gaugeCy + gaugeRadius * MINI_OFFSET_Y;
  const radius = gaugeRadius * MINI_RADIUS;

  return {
    cx,
    cy,
    radius,
    startAngle: 85,
    sweepAngle: 190,
    minorSteps: 16,
    majorEvery: 8,
    blueUntil: 0,
    redUntil: 0.12,
    redFrom: 1.01,
    value: 0.64,
    icon: "fuel",
    caption: "483",
    captionUnit: "km",
    labels: [
      { at: 0, text: "0" },
      { at: 0.5, text: "1/2" },
      { at: 1, text: "1" },
    ],
  };
}

function coolantArc(gaugeCx: number, gaugeCy: number, gaugeRadius: number): MiniGaugeSpec {
  const cx = gaugeCx + gaugeRadius * MINI_OFFSET_X;
  const cy = gaugeCy + gaugeRadius * MINI_OFFSET_Y;
  const radius = gaugeRadius * MINI_RADIUS;

  return {
    cx,
    cy,
    radius,
    startAngle: 95,
    sweepAngle: -190,
    minorSteps: 16,
    majorEvery: 8,
    blueUntil: 0.13,
    redUntil: 0,
    redFrom: 0.84,
    value: 0.46,
    icon: "thermometer",
    caption: "°C",
    captionUnit: "",
    labels: [
      { at: 0, text: "70" },
      { at: 0.5, text: "120" },
      { at: 1, text: "170" },
    ],
  };
}

export const CLUSTER_LAYOUT: ClusterLayout = {
  width: 1400,
  height: 640,
  speed: { cx: 395, cy: 288, radius: 214, ...SPEED_SCALE },
  rpm: { cx: 1005, cy: 288, radius: 214, ...RPM_SCALE },
  fuel: fuelArc(395, 288, 214),
  coolant: coolantArc(1005, 288, 214),
  centerX: 700,
  logoY: 300,
  logoWidth: 560,
  modeRowY: 108,
  mdmRowY: 214,
  gearY: 286,
  roadVanishY: 366,
  roadNearY: ROAD_NEAR_Y,
  roadHalfWidth: 382,
  roadInnerRatio: 0.47,
  showRoad: true,
  telemetryY: telemetryCenterAt(ROAD_NEAR_Y),
  telemetryWidth: 620,
  showModes: true,
};

export function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function gaugeAngleAt(spec: ArcGaugeSpec, value: number): number {
  const span = spec.max - spec.min;
  const ratio = span === 0 ? 0 : (value - spec.min) / span;

  return toRadians(spec.startAngle + ratio * spec.sweepAngle);
}

export function miniAngleAt(spec: MiniGaugeSpec, ratio: number): number {
  return toRadians(spec.startAngle + ratio * spec.sweepAngle);
}

export function polarX(cx: number, radius: number, angle: number): number {
  return cx + Math.cos(angle) * radius;
}

export function polarY(cy: number, radius: number, angle: number): number {
  return cy + Math.sin(angle) * radius;
}
