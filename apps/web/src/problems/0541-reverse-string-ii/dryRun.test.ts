import { describe, expect, test } from "vitest";
import { createReverseStringIIRun } from "./dryRun";

describe("Reverse String II dry run", () => {
  test("reverses the first k characters of every 2k block", () => {
    const { frames } = createReverseStringIIRun("abcdefg", 2);
    expect(frames[frames.length - 1]?.result).toBe("bacdfeg");
    expect(frames.some((frame) => frame.start === 4 && frame.chars.join("") === "bacdfeg")).toBe(true);
  });
});
