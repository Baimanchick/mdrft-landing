const MAIN_TICK_OUTER = 0.905;
const MAIN_TICK_MAJOR_LENGTH = 0.115;
const MAIN_LABEL_INNER_EDGE = 0.596;
const MAIN_MAJOR_TICK_INNER_EDGE = MAIN_TICK_OUTER - MAIN_TICK_MAJOR_LENGTH;
const MAIN_LABEL_RADIUS = (MAIN_LABEL_INNER_EDGE + MAIN_MAJOR_TICK_INNER_EDGE) / 2;

export const GAUGE = {
  outerRing: 1.012,
  outerRingWidth: 0.01,

  bezel: 0.972,
  bezelWidth: 0.046,

  bezelInnerEdge: 0.94,
  bezelInnerEdgeWidth: 0.012,

  dialOuter: 0.925,
  dialInner: 0.505,
  dialSeparatorOuter: 0.91,
  dialSeparatorInner: 0.59,

  redline: 0.902,
  redlineWidth: 0.042,

  tickOuter: MAIN_TICK_OUTER,
  tickMajorLength: MAIN_TICK_MAJOR_LENGTH,
  tickMediumLength: 0.076,
  tickMinorLength: 0.046,
  tickMajorWidth: 0.027,
  tickMediumWidth: 0.012,
  tickMinorWidth: 0.006,

  label: MAIN_LABEL_RADIUS,
  labelSize: 0.088,

  innerOuterLine: MAIN_LABEL_INNER_EDGE,
  innerOuterLineWidth: 0.011,
  innerBand: 0.557,
  innerBandWidth: 0.052,
  innerInnerLine: 0.516,
  innerInnerLineWidth: 0.01,

  caption: 0.35,
  captionSize: 0.058,

  readout: 0.21,
  readoutSize: 0.19,

  hubOuter: 0.128,
  hubOuterWidth: 0.013,
  hubRed: 0.103,
  hubRedWidth: 0.024,
  hubBase: 0.07,
  hubBaseWidth: 0.012,

  needleTip: 0.775,
  needleTail: 0.39,
  needleHalf: 0.018,
  needleWaist: 0.22,
} as const;

export const MINI = {
  outerContour: 1,
  outerContourWidth: 0.024,
  bezel: 0.955,
  bezelWidth: 0.066,
  separation: 0.904,
  separationWidth: 0.018,
  dialOuter: 0.894,
  dialInner: 0.3,
  tickOuter: 0.862,
  tickMajorLength: 0.18,
  tickMediumLength: 0.12,
  tickMinorLength: 0.072,
  tickMajorWidth: 0.04,
  tickMediumWidth: 0.021,
  tickMinorWidth: 0.012,
  label: 0.53,
  labelSize: 0.17,
  needleOuter: 0.84,
  needleInner: 0.34,
  needleHalf: 0.023,
  iconSize: 0.25,
  iconOffset: 1.18,
  rangeSize: 0.26,
  rangeUnitSize: 0.14,
} as const;

export const TICK_TIER = {
  major: "major",
  medium: "medium",
  minor: "minor",
} as const;

export type TickTier = (typeof TICK_TIER)[keyof typeof TICK_TIER];

export function tickTierAt(value: number, majorStep: number): TickTier {
  const major = value / majorStep;

  if (Math.abs(major - Math.round(major)) < 0.001) return TICK_TIER.major;

  const medium = value / (majorStep / 2);

  if (Math.abs(medium - Math.round(medium)) < 0.001) return TICK_TIER.medium;

  return TICK_TIER.minor;
}

export function tickLength(tier: TickTier): number {
  if (tier === TICK_TIER.major) return GAUGE.tickMajorLength;
  if (tier === TICK_TIER.medium) return GAUGE.tickMediumLength;

  return GAUGE.tickMinorLength;
}

export function tickWidth(tier: TickTier): number {
  if (tier === TICK_TIER.major) return GAUGE.tickMajorWidth;
  if (tier === TICK_TIER.medium) return GAUGE.tickMediumWidth;

  return GAUGE.tickMinorWidth;
}
