import assert from "node:assert/strict";
import test from "node:test";
import {
  advancePaper,
  paperSettled,
  paperStyle,
  paperTarget,
  restingPaper,
} from "../src/lib/paper-motion";

test("pointer normalization clamps outside coordinates and rejects invalid bounds", () => {
  assert.deepEqual(paperTarget(50, 100, 100, 200), { x: 0, y: 0 });
  assert.deepEqual(paperTarget(500, -500, 100, 200), { x: 1, y: -1 });
  assert.deepEqual(paperTarget(50, 50, 0, 100), { x: 0, y: 0 });
  assert.deepEqual(paperTarget(NaN, 50, 100, 100), { x: 0, y: 0 });
});

test("spring converges to the pointer and returns to rest without overshoot", () => {
  let state = restingPaper();
  for (let frame = 0; frame < 180; frame++) {
    state = advancePaper(state, { x: 1, y: -1 }, 1 / 60);
    assert.ok(state.position.x >= 0 && state.position.x <= 1);
    assert.ok(state.position.y >= -1 && state.position.y <= 0);
  }
  assert.ok(paperSettled(state, { x: 1, y: -1 }));
  for (let frame = 0; frame < 180; frame++)
    state = advancePaper(state, { x: 0, y: 0 }, 1 / 60);
  assert.ok(paperSettled(state, { x: 0, y: 0 }));
});

test("spring handles stalled frames and different refresh rates", () => {
  const target = { x: 0.8, y: -0.6 };
  const delayed = advancePaper(restingPaper(), target, 10);
  assert.deepEqual(delayed, advancePaper(restingPaper(), target, 0.05));
  const positions = [30, 60, 144].map((rate) => {
    let state = restingPaper();
    for (let frame = 0; frame < rate; frame++)
      state = advancePaper(state, target, 1 / rate);
    return state.position.x;
  });
  assert.ok(Math.max(...positions) - Math.min(...positions) < 0.002);
  assert.deepEqual(advancePaper(restingPaper(), target, NaN), restingPaper());
});

test("visual output remains bounded even with out-of-range input", () => {
  const style = paperStyle({ x: 100, y: -100 });
  assert.match(style.transform, /1.5000px, -1.5000px/);
  assert.match(style.transform, /rotateX\(0.4500deg\) rotateY\(0.6500deg\)/);
  assert.equal(style.shadowOpacity, "0.2500");
});
