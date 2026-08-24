import { CLUSTER_LAYOUT } from "../model/cluster-layout";
import {
  IGNITION_REST_STATE,
  type IgnitionState,
  sampleIgnition,
} from "../model/ignition-timeline";
import { loadClusterImages } from "./cluster-images";
import { type ClusterFrameInput, drawClusterFrame } from "./draw-dynamic";
import { drawNumberLayer, drawTickLayer } from "./draw-static";
import { advanceNeedleSpring, createNeedleSpring } from "./needle-spring";

const MAX_PIXEL_RATIO = 2;
const MAX_FRAME_SECONDS = 0.05;
const REST_HOLD_MS = 900;

const SPEED_STIFFNESS = 30;
const SPEED_DAMPING = 8.6;
const RPM_STIFFNESS = 32;
const RPM_DAMPING = 8.2;

const ODOMETER = 116312;
const TRIP = 0;

export type ClusterRendererOptions = {
  readonly canvas: HTMLCanvasElement;
  readonly host: HTMLElement;
  readonly reducedMotion: boolean;
  readonly onFinish: () => void;
};

export type ClusterRenderer = {
  readonly stop: () => void;
  readonly finishNow: () => void;
};

function formatClock(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

export function createClusterRenderer(options: ClusterRendererOptions): ClusterRenderer {
  const ctx = options.canvas.getContext("2d", { alpha: true });
  const tickCanvas = document.createElement("canvas");
  const numberCanvas = document.createElement("canvas");
  const tickCtx = tickCanvas.getContext("2d");
  const numberCtx = numberCanvas.getContext("2d");

  if (!ctx || !tickCtx || !numberCtx) {
    options.onFinish();

    return { stop: () => undefined, finishNow: () => undefined };
  }

  const images = loadClusterImages();
  const speedSpring = createNeedleSpring(0);
  const rpmSpring = createNeedleSpring(0);

  const layout = CLUSTER_LAYOUT;
  let elapsed = 0;
  let clock = formatClock(new Date());
  let clockMinute = -1;
  let frameId = 0;
  let restTimer: ReturnType<typeof setTimeout> | null = null;
  let lastTimestamp = 0;
  let startTimestamp = 0;
  let finished = false;
  let disposed = false;

  const finish = (): void => {
    if (finished) return;

    finished = true;

    if (frameId) window.cancelAnimationFrame(frameId);
    if (restTimer) clearTimeout(restTimer);

    options.onFinish();
  };

  const paintLayers = (): void => {
    drawTickLayer(tickCtx, layout);
    drawNumberLayer(numberCtx, layout);
  };

  const resize = (): void => {
    const boxWidth = options.host.clientWidth;
    const boxHeight = options.host.clientHeight;

    if (boxWidth <= 0 || boxHeight <= 0) return;

    const ratio = Math.min(MAX_PIXEL_RATIO, window.devicePixelRatio || 1);

    const fit = Math.min(boxWidth / layout.width, boxHeight / layout.height);
    const pixelScale = fit * ratio;
    const offsetX = (boxWidth - layout.width * fit) / 2;
    const offsetY = (boxHeight - layout.height * fit) / 2;
    const layerWidth = Math.max(1, Math.round(layout.width * pixelScale));
    const layerHeight = Math.max(1, Math.round(layout.height * pixelScale));

    options.canvas.width = Math.round(boxWidth * ratio);
    options.canvas.height = Math.round(boxHeight * ratio);
    ctx.setTransform(pixelScale, 0, 0, pixelScale, offsetX * ratio, offsetY * ratio);

    for (const [element, context] of [
      [tickCanvas, tickCtx],
      [numberCanvas, numberCtx],
    ] as const) {
      element.width = layerWidth;
      element.height = layerHeight;
      context.setTransform(pixelScale, 0, 0, pixelScale, 0, 0);
    }

    paintLayers();
  };

  const paint = (state: IgnitionState, time: number): void => {
    const input: ClusterFrameInput = {
      layout,
      tickLayer: tickCanvas,
      numberLayer: numberCanvas,
      images,
      backlight: state.backlight,
      arcProgress: state.arcProgress,
      arcLevel: state.arcLevel,
      glowLevel: state.glowLevel,
      logoLevel: state.logoLevel,
      tickLevel: state.tickLevel,
      numberLevel: state.numberLevel,
      needleLevel: state.needleLevel,
      speed: speedSpring.position,
      rpm: rpmSpring.position,
      badgeLevel: state.badgeLevel,
      centerLevel: state.centerLevel,
      roadLevel: state.roadLevel,
      readyLevel: state.readyLevel,
      odometer: ODOMETER,
      trip: TRIP,
      clock,
      time,
    };

    drawClusterFrame(ctx, input);
  };

  const step = (timestamp: number): void => {
    if (disposed) return;

    frameId = window.requestAnimationFrame(step);

    if (startTimestamp === 0) startTimestamp = timestamp;

    const delta = lastTimestamp === 0 ? 0 : (timestamp - lastTimestamp) / 1000;
    const dt = Math.min(MAX_FRAME_SECONDS, Math.max(0, delta));

    lastTimestamp = timestamp;
    elapsed = timestamp - startTimestamp;

    const state = sampleIgnition(elapsed);

    advanceNeedleSpring(
      speedSpring,
      state.speedTarget,
      SPEED_STIFFNESS,
      SPEED_DAMPING,
      dt,
      0,
      layout.speed.max,
    );
    advanceNeedleSpring(
      rpmSpring,
      state.rpmTarget,
      RPM_STIFFNESS,
      RPM_DAMPING,
      dt,
      0,
      layout.rpm.max,
    );

    const now = new Date();

    if (now.getMinutes() !== clockMinute) {
      clockMinute = now.getMinutes();
      clock = formatClock(now);
    }

    paint(state, elapsed);

    if (state.finished) finish();
  };

  const observer = new ResizeObserver(() => resize());

  observer.observe(options.host);
  resize();

  if (document.fonts) {
    document.fonts.ready.then(() => {
      if (disposed) return;

      paintLayers();
    });
  }

  if (options.reducedMotion) {
    rpmSpring.position = IGNITION_REST_STATE.rpmTarget;
    paint(IGNITION_REST_STATE, 0);
    restTimer = setTimeout(finish, REST_HOLD_MS);
  } else {
    frameId = window.requestAnimationFrame(step);
  }

  return {
    stop: () => {
      disposed = true;
      observer.disconnect();

      if (frameId) window.cancelAnimationFrame(frameId);
      if (restTimer) clearTimeout(restTimer);
    },
    finishNow: () => finish(),
  };
}
