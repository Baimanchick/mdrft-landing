export const IGNITION_MARKS = {
  powerOnStart: 80,
  powerOnEnd: 420,
  arcDrawStart: 150,
  arcDrawEnd: 980,
  glowStart: 900,
  glowEnd: 1260,
  logoInStart: 1200,
  logoInEnd: 1640,
  logoOutStart: 2260,
  logoOutEnd: 2580,
  tickStart: 2520,
  tickEnd: 2980,
  numberStart: 2780,
  numberEnd: 3180,
  badgeStart: 3060,
  badgeEnd: 3480,
  needleStart: 3140,
  needleEnd: 3580,
  crankAt: 3320,
  idleAt: 3900,
  centerStart: 3480,
  centerEnd: 3960,
  roadStart: 3700,
  roadEnd: 4260,
  readyStart: 4180,
  readyEnd: 4560,
  shutdownStart: 4980,
  total: 5460,
} as const;

const IDLE_RPM = 0.76;
const CRANK_RPM = 1.18;

export type IgnitionState = {
  readonly backlight: number;
  readonly arcProgress: number;
  readonly arcLevel: number;
  readonly glowLevel: number;
  readonly logoLevel: number;
  readonly tickLevel: number;
  readonly numberLevel: number;
  readonly needleLevel: number;
  readonly speedTarget: number;
  readonly rpmTarget: number;
  readonly badgeLevel: number;
  readonly centerLevel: number;
  readonly roadLevel: number;
  readonly readyLevel: number;
  readonly finished: boolean;
};

function clamp01(value: number): number {
  if (value < 0) return 0;
  if (value > 1) return 1;

  return value;
}

function ramp(value: number, from: number, to: number): number {
  return clamp01((value - from) / (to - from));
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function idleJitter(elapsed: number): number {
  return Math.sin(elapsed * 0.018) * 0.018 + Math.sin(elapsed * 0.069) * 0.011;
}

export function sampleIgnition(elapsed: number): IgnitionState {
  const powerOn = easeOutCubic(ramp(elapsed, IGNITION_MARKS.powerOnStart, IGNITION_MARKS.powerOnEnd));
  const shutdown = easeInOutCubic(ramp(elapsed, IGNITION_MARKS.shutdownStart, IGNITION_MARKS.total));
  const logoIn = easeOutCubic(ramp(elapsed, IGNITION_MARKS.logoInStart, IGNITION_MARKS.logoInEnd));
  const logoOut = easeInOutCubic(ramp(elapsed, IGNITION_MARKS.logoOutStart, IGNITION_MARKS.logoOutEnd));
  const glowIn = easeOutCubic(ramp(elapsed, IGNITION_MARKS.glowStart, IGNITION_MARKS.glowEnd));

  const crank = easeOutCubic(ramp(elapsed, IGNITION_MARKS.crankAt, IGNITION_MARKS.crankAt + 260));
  const settle = easeInOutCubic(ramp(elapsed, IGNITION_MARKS.crankAt + 260, IGNITION_MARKS.idleAt));
  const rpmTarget =
    CRANK_RPM * crank - (CRANK_RPM - IDLE_RPM) * settle + idleJitter(elapsed) * settle;

  return {
    backlight: powerOn * (1 - shutdown),
    arcProgress: easeOutCubic(ramp(elapsed, IGNITION_MARKS.arcDrawStart, IGNITION_MARKS.arcDrawEnd)),
    arcLevel: easeOutCubic(ramp(elapsed, IGNITION_MARKS.arcDrawStart, IGNITION_MARKS.arcDrawStart + 360)),
    glowLevel: glowIn * (1 - logoIn * 0.45) * (1 - logoOut),
    logoLevel: logoIn * (1 - logoOut),
    tickLevel: easeOutCubic(ramp(elapsed, IGNITION_MARKS.tickStart, IGNITION_MARKS.tickEnd)),
    numberLevel: easeOutCubic(ramp(elapsed, IGNITION_MARKS.numberStart, IGNITION_MARKS.numberEnd)),
    needleLevel: easeOutCubic(ramp(elapsed, IGNITION_MARKS.needleStart, IGNITION_MARKS.needleEnd)),
    speedTarget: 0,
    rpmTarget: Math.max(0, rpmTarget),
    badgeLevel: easeOutCubic(ramp(elapsed, IGNITION_MARKS.badgeStart, IGNITION_MARKS.badgeEnd)),
    centerLevel: easeOutCubic(ramp(elapsed, IGNITION_MARKS.centerStart, IGNITION_MARKS.centerEnd)),
    roadLevel: easeOutCubic(ramp(elapsed, IGNITION_MARKS.roadStart, IGNITION_MARKS.roadEnd)),
    readyLevel: easeOutCubic(ramp(elapsed, IGNITION_MARKS.readyStart, IGNITION_MARKS.readyEnd)),
    finished: elapsed >= IGNITION_MARKS.total,
  };
}

export const IGNITION_REST_STATE: IgnitionState = {
  backlight: 1,
  arcProgress: 1,
  arcLevel: 1,
  glowLevel: 0,
  logoLevel: 0,
  tickLevel: 1,
  numberLevel: 1,
  needleLevel: 1,
  speedTarget: 0,
  rpmTarget: IDLE_RPM,
  badgeLevel: 1,
  centerLevel: 1,
  roadLevel: 1,
  readyLevel: 1,
  finished: false,
};
