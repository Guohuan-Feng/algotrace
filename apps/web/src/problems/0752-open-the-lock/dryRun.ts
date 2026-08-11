import type { FrameKind } from "../../shared/types";

export type OpenLockFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  deadends: string[];
  queue: string[];
  visited: string[];
  current: string | null;
  target: string;
  wheelIndex: number | null;
  neighbor: string | null;
  queuedLock: string | null;
  steps: number;
  result: number | null;
};

export function createOpenLockDryRun(deadendsInput: string[], target: string): { frames: OpenLockFrame[] } {
  const dead = new Set(deadendsInput);
  const queue: string[] = [];
  const visited = new Set<string>();
  const frames: OpenLockFrame[] = [];
  let steps = 0;

  const push = (frame: Omit<OpenLockFrame, "deadends" | "queue" | "visited" | "steps">) => {
    frames.push({
      ...frame,
      deadends: [...dead].sort(),
      queue: [...queue],
      visited: [...visited],
      steps,
    });
  };

  push({
    kind: "start",
    title: "Build the deadend set",
    detail: `${dead.size} deadend states must never enter BFS.`,
    activeLines: [5],
    current: null,
    target,
    wheelIndex: null,
    neighbor: null,
    queuedLock: null,
    result: null,
  });

  if (dead.has("0000")) {
    push({
      kind: "done",
      title: "Start is blocked",
      detail: "0000 is a deadend, so return -1 before BFS starts.",
      activeLines: [7, 8],
      current: "0000",
      target,
      wheelIndex: null,
      neighbor: null,
      queuedLock: null,
      result: -1,
    });
    return { frames };
  }

  queue.push("0000");
  visited.add("0000");
  push({
    kind: "build",
    title: "Start from 0000",
    detail: "queue = ['0000'], visited = {'0000'}, steps = 0.",
    activeLines: [10, 11, 12],
    current: "0000",
    target,
    wheelIndex: null,
    neighbor: null,
    queuedLock: "0000",
    result: null,
  });

  while (queue.length) {
    const levelSize = queue.length;
    push({
      kind: "build",
      title: `BFS level ${steps}`,
      detail: `Process exactly ${levelSize} lock state${levelSize === 1 ? "" : "s"} before increasing steps.`,
      activeLines: [14, 15],
      current: null,
      target,
      wheelIndex: null,
      neighbor: null,
      queuedLock: null,
      result: null,
    });

    for (let count = 0; count < levelSize; count += 1) {
      const current = queue.shift()!;
      push({
        kind: "visit",
        title: `Dequeue ${current}`,
        detail: `This state is ${steps} move${steps === 1 ? "" : "s"} from 0000.`,
        activeLines: [15, 16],
        current,
        target,
        wheelIndex: null,
        neighbor: null,
        queuedLock: null,
        result: null,
      });

      if (current === target) {
        push({
          kind: "done",
          title: "Target reached",
          detail: `${current} equals target, so return ${steps}.`,
          activeLines: [18, 19],
          current,
          target,
          wheelIndex: null,
          neighbor: null,
          queuedLock: null,
          result: steps,
        });
        return { frames };
      }

      for (let wheelIndex = 0; wheelIndex < 4; wheelIndex += 1) {
        const digit = Number(current[wheelIndex]);
        push({
          kind: "visit",
          title: `Read wheel ${wheelIndex}`,
          detail: `digit = ${digit}; try rotating this wheel forward and backward.`,
          activeLines: [21, 22],
          current,
          target,
          wheelIndex,
          neighbor: null,
          queuedLock: null,
          result: null,
        });

        for (const move of [1, -1]) {
          const newDigit = (digit + move + 10) % 10;
          const neighbor = `${current.slice(0, wheelIndex)}${newDigit}${current.slice(wheelIndex + 1)}`;
          push({
            kind: "visit",
            title: `${current} -> ${neighbor}`,
            detail: `Rotate wheel ${wheelIndex} by ${move}; new_digit = ${newDigit}.`,
            activeLines: [24, 25, 26],
            current,
            target,
            wheelIndex,
            neighbor,
            queuedLock: null,
            result: null,
          });

          if (dead.has(neighbor) || visited.has(neighbor)) {
            push({
              kind: "prune",
              title: "Skip neighbor",
              detail: dead.has(neighbor) ? `${neighbor} is a deadend.` : `${neighbor} is already visited.`,
              activeLines: [28],
              current,
              target,
              wheelIndex,
              neighbor,
              queuedLock: null,
              result: null,
            });
            continue;
          }

          visited.add(neighbor);
          queue.push(neighbor);
          push({
            kind: "found",
            title: `Enqueue ${neighbor}`,
            detail: "It is safe and new, so add it to visited and the BFS queue.",
            activeLines: [28, 29, 30],
            current,
            target,
            wheelIndex,
            neighbor,
            queuedLock: neighbor,
            result: null,
          });
        }
      }
    }

    steps += 1;
    push({
      kind: "build",
      title: `Advance to step ${steps}`,
      detail: "The full BFS level is complete; every queued state now has this distance.",
      activeLines: [32],
      current: null,
      target,
      wheelIndex: null,
      neighbor: null,
      queuedLock: null,
      result: null,
    });
  }

  push({
    kind: "done",
    title: "Target is unreachable",
    detail: "The queue is empty before reaching target, so return -1.",
    activeLines: [34],
    current: null,
    target,
    wheelIndex: null,
    neighbor: null,
    queuedLock: null,
    result: -1,
  });
  return { frames };
}
