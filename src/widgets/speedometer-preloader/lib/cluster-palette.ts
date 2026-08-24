export const CLUSTER_PALETTE = {
  chromeTop: "#f2f5fa",
  chromeHigh: "#c6cdd9",
  chromeMid: "#7e8695",
  chromeLow: "#2b3038",
  tickLive: "#ffffff",
  text: "#ffffff",
  textDim: "#9aa1ad",
  needle: "#ff1f2b",
  needleDeep: "#8e0d13",
  needleTail: "#e8ecf4",
  redline: "#ff2233",
  amber: "#ffb020",
  road: "#3a414f",
  mBlue: "#0f7fd4",
  mRed: "#e2001a",
} as const;

export function withAlpha(hex: string, alpha: number): string {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
