import { describe, expect, it } from "vitest";
import { createWallsAndGatesDryRun } from "./dryRun";

describe("createWallsAndGatesDryRun", () => {
  it("fills every empty room with its nearest gate distance", () => {
    const { frames } = createWallsAndGatesDryRun([
      [2147483647, -1, 0, 2147483647],
      [2147483647, 2147483647, 2147483647, -1],
      [2147483647, -1, 2147483647, -1],
      [0, -1, 2147483647, 2147483647],
    ]);
    const finalFrame = frames[frames.length - 1];
    const assignedRoom = frames.find((frame) => frame.updated?.[0] === 1 && frame.updated?.[1] === 2);

    expect(assignedRoom?.rooms[1][2]).toBe(1);
    expect(finalFrame?.rooms).toEqual([
      [3, -1, 0, 1],
      [2, 2, 1, -1],
      [1, -1, 2, -1],
      [0, -1, 3, 4],
    ]);
  });
});
