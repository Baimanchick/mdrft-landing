export const MODE_ICON_KINDS = ["gauge", "feather", "steeringWheel", "fuel", "thermometer"] as const;

export type ModeIconKind = (typeof MODE_ICON_KINDS)[number];

const ICON_VIEWBOX = 24;
const ICON_STROKE = 2;

const ICON_PATHS: Record<ModeIconKind, readonly string[]> = {
  gauge: ["m12 14 4-4", "M3.34 19a10 10 0 1 1 17.32 0"],
  feather: [
    "M14.086 18.412A2 2 0 0 1 12.67 19H5v-7.672a2 2 0 0 1 .586-1.414L11.75 3.75a6 6 0 1 1 8.49 8.49z",
    "M16 8 2 22",
    "M17.488 15H9",
  ],
  steeringWheel: [
    "M22 12A10 10 0 1 1 2 12A10 10 0 1 1 22 12Z",
    "m3.3 7 7 4",
    "m13.7 11 7-4",
    "M12 14v8",
    "M14 12A2 2 0 1 1 10 12A2 2 0 1 1 14 12Z",
  ],
  fuel: [
    "M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0v-6.998a2 2 0 0 0-.59-1.42L18 5",
    "M14 21V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16",
    "M2 21h13",
    "M3 9h11",
  ],
  thermometer: ["M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"],
};

const pathCache = new Map<string, Path2D>();

function resolvePath(definition: string): Path2D {
  const cached = pathCache.get(definition);

  if (cached) return cached;

  const created = new Path2D(definition);

  pathCache.set(definition, created);

  return created;
}

export function drawModeIcon(
  ctx: CanvasRenderingContext2D,
  kind: ModeIconKind,
  x: number,
  y: number,
  size: number,
  color: string,
): void {
  const scale = size / ICON_VIEWBOX;

  ctx.save();
  ctx.translate(x - size / 2, y - size / 2);
  ctx.scale(scale, scale);
  ctx.strokeStyle = color;
  ctx.lineWidth = ICON_STROKE;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (const definition of ICON_PATHS[kind]) {
    ctx.stroke(resolvePath(definition));
  }

  ctx.restore();
}
