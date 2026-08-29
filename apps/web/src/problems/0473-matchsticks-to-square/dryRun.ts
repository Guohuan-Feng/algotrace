import type { FrameKind } from "../../shared/types";

export type MatchsticksToSquareFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  sticks: number[];
  target: number | null;
  sides: number[];
  sideSticks: number[][];
  index: number;
  currentSide: number | null;
  stack: string[];
  result: boolean | null;
};

export function createMatchsticksToSquareDryRun(matchsticksInput: number[]): { frames: MatchsticksToSquareFrame[] } {
  const matchsticks = [...matchsticksInput];
  const total = matchsticks.reduce((sum, value) => sum + value, 0);
  const sides = [0, 0, 0, 0];
  const sideSticks = [[], [], [], []] as number[][];
  const frames: MatchsticksToSquareFrame[] = [];
  const stack: string[] = [];
  let target: number | null = null;
  const push = (frame: Omit<MatchsticksToSquareFrame, "sticks" | "target" | "sides" | "sideSticks" | "stack">) => frames.push({ ...frame, sticks: [...matchsticks], target, sides: [...sides], sideSticks: sideSticks.map((side) => [...side]), stack: [...stack] });

  push({ kind: "start", title: `total = ${total}`, detail: "A square is possible only when the total length is divisible by four.", activeLines: [2, 3], index: 0, currentSide: null, result: null });
  if (total % 4 !== 0) {
    push({ kind: "done", title: "Return False", detail: "The sticks cannot make four equal sides because total % 4 is not zero.", activeLines: [5, 6], index: 0, currentSide: null, result: false });
    return { frames };
  }
  target = total / 4;
  push({ kind: "build", title: `target = ${target}`, detail: "Each of the four sides must sum to total // 4.", activeLines: [8, 9], index: 0, currentSide: null, result: null });
  matchsticks.sort((a, b) => b - a);
  push({ kind: "build", title: "Sort descending", detail: "Try the longest sticks first so impossible branches are rejected earlier.", activeLines: [11], index: 0, currentSide: null, result: null });
  if (matchsticks[0]! > target) {
    push({ kind: "done", title: "Return False", detail: "The longest stick exceeds the required side length.", activeLines: [13, 14], index: 0, currentSide: null, result: false });
    return { frames };
  }

  const backtrack = (index: number): boolean => {
    stack.push(`backtrack(${index})`);
    push({ kind: "visit", title: `backtrack(index = ${index})`, detail: index === matchsticks.length ? "Every stick has been assigned." : `Assign stick ${matchsticks[index]} to one of four sides.`, activeLines: [16, 17, 20], index, currentSide: null, result: null });
    if (index === matchsticks.length) {
      stack.pop();
      push({ kind: "found", title: "All sticks assigned", detail: "Every side is exactly target because additions beyond target were rejected.", activeLines: [17, 18], index, currentSide: null, result: null });
      return true;
    }
    const length = matchsticks[index]!;
    for (let i = 0; i < 4; i += 1) {
      push({ kind: "visit", title: `Try side ${i + 1}`, detail: `Check whether ${sides[i]} + ${length} would exceed target ${target}.`, activeLines: [22, 23], index, currentSide: i, result: null });
      if (sides[i]! + length > target) {
        push({ kind: "prune", title: `Side ${i + 1} is too long`, detail: "This placement violates the equal-side limit, so continue.", activeLines: [23, 24], index, currentSide: i, result: null });
        continue;
      }
      sides[i]! += length;
      sideSticks[i]!.push(length);
      push({ kind: "build", title: `Put ${length} on side ${i + 1}`, detail: "Record the choice, then recursively assign the next stick.", activeLines: [26, 28], index, currentSide: i, result: null });
      if (backtrack(index + 1)) {
        stack.pop();
        push({ kind: "found", title: "A complete square was found", detail: "The successful recursive branch returns True without undoing its assignments.", activeLines: [28, 29], index, currentSide: i, result: null });
        return true;
      }
      sides[i]! -= length;
      sideSticks[i]!.pop();
      push({ kind: "backtrack", title: `Remove ${length} from side ${i + 1}`, detail: "That branch failed, so restore the side before testing another one.", activeLines: [31], index, currentSide: i, result: null });
      if (sides[i] === 0) {
        push({ kind: "prune", title: "Stop equivalent empty-side choices", detail: "Other empty sides are symmetric, so break after the first empty side fails.", activeLines: [33, 34], index, currentSide: i, result: null });
        break;
      }
    }
    stack.pop();
    push({ kind: "backtrack", title: `Return False from index ${index}`, detail: "No side can accept this stick and still complete a square.", activeLines: [36], index, currentSide: null, result: null });
    return false;
  };

  const result = backtrack(0);
  push({ kind: "done", title: `Return ${String(result)}`, detail: result ? "All four side sums equal target." : "No complete four-side assignment exists.", activeLines: [38], index: matchsticks.length, currentSide: null, result });
  return { frames };
}
