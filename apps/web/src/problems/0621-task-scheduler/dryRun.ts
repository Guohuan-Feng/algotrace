import type { FrameKind } from "../../shared/types";

export type TaskSchedulerFrame = {
  kind: FrameKind;
  phase: "initialize" | "pop" | "run" | "idle" | "temp" | "restore" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  heap: number[];
  temp: number[];
  time: number;
  slot: number | null;
  current: number | null;
  schedule: string[];
  result: number | null;
};

const orderHeap = (heap: number[]) => [...heap].sort((left, right) => left - right);

export function createTaskSchedulerDryRun(tasks: string[], cooldown: number): { frames: TaskSchedulerFrame[] } {
  const counts = new Map<string, number>();
  tasks.forEach((task) => counts.set(task, (counts.get(task) ?? 0) + 1));
  const heap = [...counts.values()].map((freq) => -freq);
  const temp: number[] = [];
  const schedule: string[] = [];
  const frames: TaskSchedulerFrame[] = [];
  let time = 0;
  const push = (frame: Omit<TaskSchedulerFrame, "heap" | "temp" | "time" | "schedule">) => frames.push({ ...frame, heap: orderHeap(heap), temp: [...temp], time, schedule: [...schedule] });

  push({ kind: "start", phase: "initialize", title: "Count task frequencies", detail: `Counter(tasks) = ${JSON.stringify(Object.fromEntries(counts))}. The heap stores only negative frequencies, exactly as the submitted code does.`, activeLines: [2, 3, 4, 5], slot: null, current: null, result: null });
  while (heap.length) {
    temp.length = 0;
    push({ kind: "visit", phase: "temp", title: `Start a ${cooldown + 1}-slot window`, detail: "temp holds unfinished frequencies until this cooling window ends.", activeLines: [9, 10, 12], slot: null, current: null, result: null });
    let broke = false;
    for (let slot = 0; slot < cooldown + 1; slot += 1) {
      let freq: number | null = null;
      if (heap.length) {
        const original = orderHeap(heap).shift()!;
        heap.splice(heap.indexOf(original), 1);
        freq = original + 1;
        schedule.push(`run ${Math.abs(original)}`);
        push({ kind: "visit", phase: "pop", title: `Pop frequency ${original}`, detail: `Use one occurrence, so freq becomes ${freq}.`, activeLines: [13, 14], slot, current: freq, result: null });
        if (freq < 0) {
          temp.push(freq);
          push({ kind: "build", phase: "temp", title: `Hold ${freq} in temp`, detail: "It still has remaining work, but cannot re-enter the heap until this window ends.", activeLines: [16, 17], slot, current: freq, result: null });
        }
      } else {
        schedule.push("idle");
        push({ kind: "prune", phase: "idle", title: "Idle slot", detail: "The heap is empty inside this window, so the CPU idles for one tick.", activeLines: [13, 19], slot, current: null, result: null });
      }
      time += 1;
      push({ kind: "visit", phase: "run", title: `time = ${time}`, detail: "Each slot advances time by one.", activeLines: [19], slot, current: freq, result: null });
      if (!heap.length && !temp.length) {
        push({ kind: "visit", phase: "done", title: "No remaining work", detail: "Both heap and temp are empty; break before adding extra idle slots.", activeLines: [21, 22], slot, current: null, result: time });
        broke = true;
        break;
      }
    }
    if (broke) break;
    for (const freq of temp) heap.push(freq);
    push({ kind: "backtrack", phase: "restore", title: "Restore temp to heap", detail: "The cooling window ended, so unfinished frequencies compete again.", activeLines: [24, 25], slot: null, current: null, result: null });
  }
  push({ kind: "done", phase: "done", title: `Return time = ${time}`, detail: "The total number of occupied and idle slots is the answer.", activeLines: [27], slot: null, current: null, result: time });
  return { frames };
}
