import type { FrameKind } from "../../shared/types";

export type CpuTask = [number, number, number];
export type SingleThreadedCpuFrame = {
  kind: FrameKind;
  phase: "initialize" | "sort" | "jump-time" | "enqueue" | "select" | "execute" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  tasks: CpuTask[];
  heap: Array<[number, number]>;
  time: number;
  cursor: number;
  current: CpuTask | null;
  ans: number[];
  result: number[] | null;
};

const orderHeap = (heap: Array<[number, number]>) => [...heap].sort((left, right) => left[0] - right[0] || left[1] - right[1]);

export function createSingleThreadedCpuDryRun(tasksInput: number[][]): { frames: SingleThreadedCpuFrame[] } {
  const tasks = tasksInput.map(([start, process], index) => [start!, process!, index] as CpuTask).sort((left, right) => left[0] - right[0] || left[1] - right[1] || left[2] - right[2]);
  const heap: Array<[number, number]> = [];
  const ans: number[] = [];
  const frames: SingleThreadedCpuFrame[] = [];
  let time = 0;
  let cursor = 0;
  const push = (frame: Omit<SingleThreadedCpuFrame, "tasks" | "heap" | "time" | "cursor" | "ans">) => frames.push({ ...frame, tasks: tasks.map((task) => [...task] as CpuTask), heap: orderHeap(heap), time, cursor, ans: [...ans] });

  push({ kind: "start", phase: "initialize", title: "Attach original indices", detail: "new_tasks stores (enqueue time, processing time, original index).", activeLines: [6, 9, 10, 11, 13], current: null, result: null });
  push({ kind: "build", phase: "sort", title: "Sort by enqueue time", detail: `tasks = ${JSON.stringify(tasks)}.`, activeLines: [16], current: null, result: null });
  while (cursor < tasks.length || heap.length) {
    if (!heap.length && cursor < tasks.length && time < tasks[cursor]![0]) {
      time = tasks[cursor]![0];
      push({ kind: "visit", phase: "jump-time", title: `CPU idle: jump to time ${time}`, detail: "No task is waiting, so move time directly to the next enqueue time.", activeLines: [24, 26, 27], current: tasks[cursor]!, result: null });
    }
    while (cursor < tasks.length && tasks[cursor]![0] <= time) {
      const [, process, index] = tasks[cursor]!;
      heap.push([process, index]);
      push({ kind: "build", phase: "enqueue", title: `Queue task ${index}`, detail: `Task ${index} arrived by time ${time}; push (process=${process}, index=${index}).`, activeLines: [30, 31, 32, 33, 36], current: tasks[cursor]!, result: null });
      cursor += 1;
    }
    const [process, index] = orderHeap(heap).shift()!;
    heap.splice(heap.findIndex(([entryProcess, entryIndex]) => entryProcess === process && entryIndex === index), 1);
    const current = tasks.find((task) => task[2] === index)!;
    push({ kind: "visit", phase: "select", title: `Select task ${index}`, detail: `It has the shortest processing time; ties use the smaller original index.`, activeLines: [41], current, result: null });
    time += process;
    ans.push(index);
    push({ kind: "build", phase: "execute", title: `Run task ${index} until time ${time}`, detail: `time += ${process}; append ${index} to ans.`, activeLines: [44, 45], current, result: null });
  }
  push({ kind: "done", phase: "done", title: "Return execution order", detail: `ans = [${ans.join(", ")}].`, activeLines: [47], current: null, result: [...ans] });
  return { frames };
}
