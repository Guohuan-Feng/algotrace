import type { FrameKind } from "../../shared/types";

export type DecodeStringFrame = {
  kind: FrameKind;
  phase: "initialize" | "digit" | "open" | "append" | "close" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  index: number | null;
  char: string | null;
  repeat: number;
  current: string;
  stack: Array<[string, number]>;
  result: string | null;
};

export function createDecodeStringDryRun(input: string): { frames: DecodeStringFrame[] } {
  const stack: Array<[string, number]> = [];
  const frames: DecodeStringFrame[] = [];
  let repeat = 0;
  let current = "";
  const snapshot = (frame: Omit<DecodeStringFrame, "stack" | "repeat" | "current">) => frames.push({ ...frame, repeat, current, stack: stack.map(([prefix, count]) => [prefix, count]) });

  snapshot({ kind: "start", phase: "initialize", title: "Start with an empty decode stack", detail: "Each stack entry keeps the prefix string and multiplier before an opening bracket.", activeLines: [2, 3], index: null, char: null, result: null });

  [...input].forEach((char, index) => {
    if (/\d/.test(char)) {
      repeat = repeat * 10 + Number(char);
      snapshot({ kind: "visit", phase: "digit", title: `Read digit ${char}`, detail: `Accumulate a possibly multi-digit repeat count: repeat = ${repeat}.`, activeLines: [5, 6], index, char, result: null });
    } else if (char === "[") {
      stack.push([current, repeat]);
      current = "";
      repeat = 0;
      snapshot({ kind: "build", phase: "open", title: "Open a repeated block", detail: "Save the prefix and repeat count, then decode the text inside the brackets from a fresh current string.", activeLines: [7, 8, 9], index, char, result: null });
    } else if (char === "]") {
      const [prefix, count] = stack.pop()!;
      current = prefix + current.repeat(count);
      snapshot({ kind: "found", phase: "close", title: `Close block x${count}`, detail: `Repeat the inner text ${count} times and attach it to the saved prefix: current = ${JSON.stringify(current)}.`, activeLines: [10, 11], index, char, result: null });
    } else {
      current += char;
      snapshot({ kind: "visit", phase: "append", title: `Append ${JSON.stringify(char)}`, detail: `This letter is part of the current bracket level: current = ${JSON.stringify(current)}.`, activeLines: [12, 13], index, char, result: null });
    }
  });

  snapshot({ kind: "done", phase: "done", title: "Return the decoded string", detail: `All brackets have closed. The decoded result is ${JSON.stringify(current)}.`, activeLines: [14], index: null, char: null, result: current });
  return { frames };
}
