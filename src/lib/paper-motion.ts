export interface Point {
  x: number;
  y: number;
}
export interface PaperState {
  position: Point;
  velocity: Point;
}

export const restingPaper = (): PaperState => ({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
});

const clamp = (value: number) => Math.max(-1, Math.min(1, value));

/** Coordinates come from the untransformed frame, avoiding pointer feedback. */
export function paperTarget(
  x: number,
  y: number,
  width: number,
  height: number,
): Point {
  if (
    width <= 0 ||
    height <= 0 ||
    ![x, y, width, height].every(Number.isFinite)
  ) {
    return { x: 0, y: 0 };
  }
  return { x: clamp((x / width) * 2 - 1), y: clamp((y / height) * 2 - 1) };
}

/** Damped spring with bounded substeps, stable after a delayed animation frame. */
export function advancePaper(
  state: PaperState,
  target: Point,
  elapsed: number,
): PaperState {
  if (!Number.isFinite(elapsed) || elapsed <= 0) return state;
  const duration = Math.min(elapsed, 0.05);
  const steps = Math.ceil(duration / (1 / 120));
  const dt = duration / steps;
  const next = {
    position: { ...state.position },
    velocity: { ...state.velocity },
  };
  for (let step = 0; step < steps; step++) {
    for (const axis of ["x", "y"] as const) {
      const acceleration =
        130 * (clamp(target[axis]) - next.position[axis]) -
        24 * next.velocity[axis];
      next.velocity[axis] += acceleration * dt;
      next.position[axis] += next.velocity[axis] * dt;
    }
  }
  return next;
}

export function paperSettled(state: PaperState, target: Point): boolean {
  return (["x", "y"] as const).every(
    (axis) =>
      Math.abs(state.position[axis] - target[axis]) < 0.0005 &&
      Math.abs(state.velocity[axis]) < 0.0005,
  );
}

export function paperStyle(point: Point) {
  const x = clamp(point.x);
  const y = clamp(point.y);
  return {
    transform: `translate3d(${(x * 1.5).toFixed(4)}px, ${(y * 1.5).toFixed(4)}px, 0) rotateX(${(-y * 0.45).toFixed(4)}deg) rotateY(${(x * 0.65).toFixed(4)}deg)`,
    shadowTransform: `translate3d(${(-x * 5).toFixed(4)}px, ${(3 - y * 4).toFixed(4)}px, 0)`,
    shadowOpacity: (0.15 + Math.max(Math.abs(x), Math.abs(y)) * 0.1).toFixed(4),
  };
}
