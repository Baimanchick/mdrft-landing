export type NeedleSpring = {
  position: number;
  velocity: number;
};

const MAX_SUBSTEP = 0.008;
const STOP_RESTITUTION = 0.32;

export function createNeedleSpring(position: number): NeedleSpring {
  return { position, velocity: 0 };
}

export function advanceNeedleSpring(
  spring: NeedleSpring,
  target: number,
  stiffness: number,
  damping: number,
  dt: number,
  min: number,
  max: number,
): void {
  const steps = Math.min(6, Math.max(1, Math.ceil(dt / MAX_SUBSTEP)));
  const step = dt / steps;

  for (let i = 0; i < steps; i += 1) {
    const acceleration = stiffness * (target - spring.position) - damping * spring.velocity;

    spring.velocity += acceleration * step;
    spring.position += spring.velocity * step;

    if (spring.position > max) {
      spring.position = max;
      spring.velocity = -spring.velocity * STOP_RESTITUTION;
    }

    if (spring.position < min) {
      spring.position = min;
      spring.velocity = -spring.velocity * STOP_RESTITUTION;
    }
  }
}
