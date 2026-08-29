import { describe, expect, test } from "vitest";
import { createAsteroidDryRun } from "./dryRun";

describe("Asteroid Collision dry run", () => {
  test("resolves a collision chain until the incoming asteroid can be pushed", () => {
    const { frames } = createAsteroidDryRun([5, 10, -5]);
    const last = frames[frames.length - 1]!;

    expect(last.result).toEqual([5, 10]);
    expect(frames.some((frame) => frame.phase === "stack-wins")).toBe(true);
  });

  test("removes both asteroids when their absolute sizes match", () => {
    const { frames } = createAsteroidDryRun([8, -8]);
    expect(frames[frames.length - 1]!.result).toEqual([]);
  });
});
