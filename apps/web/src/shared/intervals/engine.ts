import type { FrameKind } from "../types";
import type {
  HeapEntry,
  Interval,
  IntervalItem,
  IntervalLane,
  IntervalTraceFrame,
  IntervalTraceRun,
  TraceEvent,
} from "./types";

type FrameInput = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  phase: string;
  lanes?: IntervalLane[];
  output?: IntervalItem[];
  outputLabel?: string;
  currentIds?: string[];
  comparedIds?: string[];
  acceptedIds?: string[];
  rejectedIds?: string[];
  coveredIds?: string[];
  pointers?: Array<[string, string | number]>;
  invariant?: string;
  sweep?: number | null;
  events?: TraceEvent[];
  eventIndex?: number | null;
  mask?: IntervalItem | null;
  heap?: HeapEntry[];
  skyline?: Array<[number, number]>;
  result?: string | number | boolean | null;
};

type OccupancyOptions = {
  activeLabel: string;
  bestLabel: string;
  title: string;
  finalTitle: string;
  finalDetail: (best: number) => string;
};

const cloneItem = (item: IntervalItem): IntervalItem => ({ ...item });
const cloneItems = (items: IntervalItem[]) => items.map(cloneItem);
const cloneLanes = (lanes: IntervalLane[]) => lanes.map((lane) => ({ ...lane, intervals: cloneItems(lane.intervals) }));

function makeFrame(input: FrameInput): IntervalTraceFrame {
  return {
    kind: input.kind,
    title: input.title,
    detail: input.detail,
    activeLines: [...input.activeLines],
    phase: input.phase,
    lanes: cloneLanes(input.lanes ?? []),
    output: cloneItems(input.output ?? []),
    outputLabel: input.outputLabel ?? "输出",
    currentIds: [...(input.currentIds ?? [])],
    comparedIds: [...(input.comparedIds ?? [])],
    acceptedIds: [...(input.acceptedIds ?? [])],
    rejectedIds: [...(input.rejectedIds ?? [])],
    coveredIds: [...(input.coveredIds ?? [])],
    pointers: [...(input.pointers ?? [])],
    invariant: input.invariant ?? "",
    sweep: input.sweep ?? null,
    events: input.events?.map((event) => ({ ...event })),
    eventIndex: input.eventIndex ?? null,
    mask: input.mask ? cloneItem(input.mask) : null,
    heap: input.heap?.map((entry) => ({ ...entry })),
    skyline: input.skyline?.map(([x, height]) => [x, height]),
    result: input.result ?? null,
  };
}

function numberValue(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${label} 必须是有限数字。`);
  }
  return value;
}

function intervalValue(value: unknown, label: string): Interval {
  if (!Array.isArray(value) || value.length !== 2) {
    throw new Error(`${label} 必须是 [start, end]。`);
  }
  const start = numberValue(value[0], `${label}[0]`);
  const end = numberValue(value[1], `${label}[1]`);
  if (end < start) {
    throw new Error(`${label} 必须满足 start <= end。`);
  }
  return [start, end];
}

function intervalList(value: unknown, label: string): Interval[] {
  if (!Array.isArray(value)) {
    throw new Error(`${label} 必须是区间组成的 JSON 数组。`);
  }
  if (value.length > 12) {
    throw new Error(`${label} 最多支持 12 个区间，保证动画清晰可读。`);
  }
  return value.map((entry, index) => intervalValue(entry, `${label}[${index}]`));
}

function objectValue(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} 必须是 JSON 对象。`);
  }
  return value as Record<string, unknown>;
}

function itemsFromPairs(pairs: Interval[], prefix: string, owner?: string): IntervalItem[] {
  return pairs.map(([start, end], index) => ({ id: `${prefix}${index}`, start, end, label: `[${start}, ${end}]`, owner }));
}

function lane(id: string, label: string, intervals: IntervalItem[], tone: IntervalLane["tone"] = "input"): IntervalLane {
  return { id, label, intervals, tone };
}

function sortedByStart(items: IntervalItem[]) {
  return [...items].sort((left, right) => left.start - right.start || left.end - right.end || left.id.localeCompare(right.id));
}

function sortedByEnd(items: IntervalItem[]) {
  return [...items].sort((left, right) => left.end - right.end || left.start - right.start || left.id.localeCompare(right.id));
}

function pairText(items: IntervalItem[]) {
  return `[${items.map((item) => `[${item.start},${item.end}]`).join(", ")}]`;
}

function occupancyRun(input: unknown, options: OccupancyOptions): IntervalTraceRun {
  const airplanes = itemsFromPairs(intervalList(input, "intervals"), "I");
  const events: Array<TraceEvent & { intervalId: string }> = airplanes.flatMap((airplane) => [
    { id: `${airplane.id}-start`, intervalId: airplane.id, time: airplane.start, delta: 1, label: `${airplane.label} 起始` },
    { id: `${airplane.id}-end`, intervalId: airplane.id, time: airplane.end, delta: -1, label: `${airplane.label} 结束` },
  ]).sort((left, right) => left.time - right.time || left.delta - right.delta || left.id.localeCompare(right.id));
  const frames: IntervalTraceFrame[] = [];
  const active = new Set<string>();
  let count = 0;
  let best = 0;
  const inputLane = () => [lane("intervals", "输入区间", airplanes)];
  const eventStrip: TraceEvent[] = events.map(({ intervalId: _intervalId, ...event }) => event);

  frames.push(makeFrame({
    kind: "start",
    title: options.title,
    detail: "把每个区间拆成起点 (+1) 与终点 (-1) 事件。",
    activeLines: [1, 2],
    phase: "建立事件",
    lanes: inputLane(),
    events: eventStrip,
    pointers: [[options.activeLabel, count], [options.bestLabel, best]],
    invariant: "按事件从左到右扫描，就能统计同时存在的区间数。",
  }));

  frames.push(makeFrame({
    kind: "build",
    title: "按时间排序事件",
    detail: "同一时刻先处理 -1，再处理 +1；释放出的资源可以立即复用。",
    activeLines: [3],
    phase: "排序事件",
    lanes: inputLane(),
    events: eventStrip,
    pointers: [[options.activeLabel, count], [options.bestLabel, best]],
    invariant: "相同时间点：结束事件排在开始事件前。",
  }));

  events.forEach((event, eventIndex) => {
    if (event.delta > 0) active.add(event.intervalId);
    else active.delete(event.intervalId);
    count += event.delta;
    const updatedBest = Math.max(best, count);
    const isPeak = updatedBest > best;
    best = updatedBest;
    frames.push(makeFrame({
      kind: isPeak ? "found" : "visit",
      title: isPeak ? `发现新峰值：${best}` : `处理 ${event.label}`,
      detail: `时间 ${event.time} ${event.delta > 0 ? "加入" : "移除"}一个区间；${options.activeLabel} 变为 ${count}。`,
      activeLines: isPeak ? [5, 6] : [5],
      phase: "扫描事件",
      lanes: inputLane(),
      events: eventStrip,
      eventIndex,
      sweep: event.time,
      currentIds: [event.intervalId],
      acceptedIds: [...active],
      pointers: [["时间", event.time], ["变化", event.delta], [options.activeLabel, count], [options.bestLabel, best]],
      invariant: "该事件处理后，活跃数量等于覆盖当前扫描位置的区间数。",
      result: best,
    }));
  });

  frames.push(makeFrame({
    kind: "done",
    title: options.finalTitle,
    detail: options.finalDetail(best),
    activeLines: [7],
    phase: "完成",
    lanes: inputLane(),
    events: eventStrip,
    acceptedIds: [...active],
    pointers: [[options.bestLabel, best]],
    invariant: "前缀和的最大值就是最大并发需求。",
    result: best,
  }));

  return { frames };
}

export function createAirplanesDryRun(input: unknown): IntervalTraceRun {
  return occupancyRun(input, {
    activeLabel: "在空飞机数",
    bestLabel: "最大值",
    title: "建立飞机事件",
    finalTitle: "得到最大飞机数量",
    finalDetail: (best) => `任意时刻天空中最多有 ${best} 架飞机。`,
  });
}

export function createMeetingRoomsTwoDryRun(input: unknown): IntervalTraceRun {
  return occupancyRun(input, {
    activeLabel: "已用会议室",
    bestLabel: "最少会议室",
    title: "建立会议事件",
    finalTitle: "得到最少会议室数量",
    finalDetail: (best) => `重叠峰值需要 ${best} 个会议室。`,
  });
}

export function createMeetingRoomsDryRun(input: unknown): IntervalTraceRun {
  const meetings = itemsFromPairs(intervalList(input, "intervals"), "M");
  const sorted = sortedByStart(meetings);
  const frames: IntervalTraceFrame[] = [];
  const lanes = () => [lane("input", "原始会议", meetings, "muted"), lane("sorted", "按开始时间排序", sorted)];

  frames.push(makeFrame({
    kind: "start",
    title: "按开始时间排序会议",
    detail: "排序后，只需要检查相邻会议是否冲突。",
    activeLines: [1],
    phase: "排序",
    lanes: lanes(),
    invariant: "当前位置之前的相邻会议对都已经检查过。",
  }));

  if (sorted.length < 2) {
    frames.push(makeFrame({
      kind: "done",
      title: "没有可重叠的会议对",
      detail: "零场或一场会议总是可以参加。",
      activeLines: [6],
      phase: "完成",
      lanes: lanes(),
      result: true,
      invariant: "不存在需要比较的相邻会议对。",
    }));
    return { frames };
  }

  for (let index = 1; index < sorted.length; index += 1) {
    const previous = sorted[index - 1];
    const current = sorted[index];
    const overlaps = current.start < previous.end;
    frames.push(makeFrame({
      kind: overlaps ? "found" : "visit",
      title: overlaps ? "发现冲突" : "相邻会议不冲突",
      detail: `${current.start} ${overlaps ? "<" : ">="} ${previous.end}；${overlaps ? "两场会议发生重叠" : "前一场结束后可以接着开下一场"}。`,
      activeLines: overlaps ? [4, 5] : [3, 4],
      phase: "比较相邻会议",
      lanes: lanes(),
      currentIds: [current.id],
      comparedIds: [previous.id],
      pointers: [["索引", index], ["当前开始", current.start], ["前一场结束", previous.end]],
      invariant: "当前会议只需和排序后紧邻的前一场比较。",
      result: overlaps ? false : null,
    }));
    if (overlaps) {
      frames.push(makeFrame({
        kind: "done",
        title: "无法参加所有会议",
        detail: "找到第一对重叠的相邻会议，立即返回 False。",
        activeLines: [5],
        phase: "完成",
        lanes: lanes(),
        currentIds: [current.id],
        comparedIds: [previous.id],
        rejectedIds: [current.id, previous.id],
        pointers: [["索引", index]],
        invariant: "只要有一对重叠会议，就不能参加所有会议。",
        result: false,
      }));
      return { frames };
    }
  }

  frames.push(makeFrame({
    kind: "done",
    title: "所有会议都可参加",
    detail: "排序后的每一对相邻会议都不重叠。",
    activeLines: [6],
    phase: "完成",
    lanes: lanes(),
    acceptedIds: sorted.map((item) => item.id),
    invariant: "没有后续会议早于前一场结束时间开始。",
    result: true,
  }));
  return { frames };
}

export function createMergeIntervalsDryRun(input: unknown): IntervalTraceRun {
  const source = itemsFromPairs(intervalList(input, "intervals"), "I");
  const sorted = sortedByStart(source);
  const merged: IntervalItem[] = [];
  const frames: IntervalTraceFrame[] = [];
  const lanes = () => [lane("input", "原始区间", source, "muted"), lane("sorted", "排序后", sorted)];
  const push = (input: Omit<FrameInput, "lanes" | "output" | "outputLabel">) => {
    frames.push(makeFrame({ ...input, lanes: lanes(), output: merged, outputLabel: "合并结果" }));
  };

  push({
    kind: "start",
    title: "按起点排序",
    detail: "排序后，可能合并的区间一定会紧邻当前结果的尾区间。",
    activeLines: [1],
    phase: "排序",
    invariant: "扫描开始前，合并结果为空。",
  });

  sorted.forEach((current, index) => {
    const tail = merged[merged.length - 1];
    if (!tail || current.start > tail.end) {
      merged.push({ ...current, id: `R${merged.length}`, label: `[${current.start}, ${current.end}]` });
      push({
        kind: "build",
        title: tail ? "开始一个新的不相交区间" : "用第一个区间初始化结果",
        detail: tail ? `${current.start} > ${tail.end}，因此当前区间不能与结果尾部合并。` : "第一个排序后的区间直接作为结果起点。",
        activeLines: [3, 4],
        phase: "追加",
        currentIds: [current.id],
        acceptedIds: [current.id],
        pointers: [["索引", index], ["结果尾部", `[${current.start}, ${current.end}]`]],
        invariant: "已合并区间有序且两两不相交。",
      });
      return;
    }

    const oldEnd = tail.end;
    tail.end = Math.max(tail.end, current.end);
    tail.label = `[${tail.start}, ${tail.end}]`;
    push({
      kind: "build",
      title: "扩展合并结果尾部",
      detail: `${current.start} <= ${oldEnd}，当前区间发生重叠，吸收它并保留最远终点 ${tail.end}。`,
      activeLines: [5, 6],
      phase: "合并",
      currentIds: [current.id],
      comparedIds: [tail.id],
      acceptedIds: [current.id],
      pointers: [["索引", index], ["尾部终点", tail.end]],
      invariant: "结果尾部覆盖了当前重叠块中已经扫描过的所有区间。",
    });
  });

  push({
    kind: "done",
    title: "合并完成",
    detail: `扫描得到 ${pairText(merged)}。`,
    activeLines: [7],
    phase: "完成",
    invariant: "结果有序、不相交，并覆盖所有输入区间。",
    result: pairText(merged),
  });
  return { frames };
}

export function createInsertIntervalDryRun(input: unknown): IntervalTraceRun {
  const record = objectValue(input, "input");
  const source = itemsFromPairs(intervalList(record.intervals, "intervals"), "I");
  const [initialStart, initialEnd] = intervalValue(record.newInterval, "newInterval");
  const newInterval: IntervalItem = { id: "new", start: initialStart, end: initialEnd, label: `[${initialStart}, ${initialEnd}]` };
  const result: IntervalItem[] = [];
  const frames: IntervalTraceFrame[] = [];
  let index = 0;
  const lanes = () => [lane("intervals", "有序区间", source), lane("new", "新区间", [newInterval], "result")];
  const push = (input: Omit<FrameInput, "lanes" | "output" | "outputLabel">) => {
    frames.push(makeFrame({ ...input, lanes: lanes(), output: result, outputLabel: "结果" }));
  };

  push({
    kind: "start",
    title: "从新区间开始",
    detail: "按三段处理：左侧直接保留、重叠部分合并、右侧直接保留。",
    activeLines: [1, 2],
    phase: "初始化",
    currentIds: [newInterval.id],
    pointers: [["索引", index], ["新区间", newInterval.label ?? ""]],
    invariant: "结果中只包含严格位于可变新区间左边的区间。",
  });

  while (index < source.length && source[index].end < newInterval.start) {
    const current = source[index];
    result.push({ ...current, id: `R${result.length}` });
    push({
      kind: "build",
      title: "保留左侧区间",
      detail: `${current.end} < ${newInterval.start}，它不可能与新区间重叠。`,
      activeLines: [4, 5],
      phase: "左侧",
      currentIds: [current.id],
      acceptedIds: [current.id],
      pointers: [["索引", index], ["新区间起点", newInterval.start]],
      invariant: "结果中的每个区间都严格位于新区间左侧。",
    });
    index += 1;
  }

  while (index < source.length && source[index].start <= newInterval.end) {
    const current = source[index];
    const before = newInterval.label;
    newInterval.start = Math.min(newInterval.start, current.start);
    newInterval.end = Math.max(newInterval.end, current.end);
    newInterval.label = `[${newInterval.start}, ${newInterval.end}]`;
    push({
      kind: "build",
      title: "吸收重叠区间",
      detail: `${current.label} 与 ${before} 重叠；把新区间扩展为 ${newInterval.label}。`,
      activeLines: [7, 8, 9],
      phase: "合并",
      currentIds: [newInterval.id, current.id],
      comparedIds: [current.id],
      acceptedIds: [current.id],
      pointers: [["索引", index], ["新区间", newInterval.label]],
      invariant: "可变新区间覆盖了目前处理到的全部重叠区间。",
    });
    index += 1;
  }

  result.push({ ...newInterval, id: `R${result.length}` });
  push({
    kind: "build",
    title: "加入合并后的新区间",
    detail: "剩余区间都不再与它重叠，因此可以把它的最终形态加入结果。",
    activeLines: [11],
    phase: "插入",
    currentIds: [newInterval.id],
    acceptedIds: [newInterval.id],
    pointers: [["索引", index], ["新区间", newInterval.label ?? ""]],
    invariant: "结果截至新区间为止已经有序且完整。",
  });

  while (index < source.length) {
    const current = source[index];
    result.push({ ...current, id: `R${result.length}` });
    push({
      kind: "build",
      title: "保留右侧区间",
      detail: `${current.start} > ${newInterval.end}，它已经位于插入区间的右侧。`,
      activeLines: [13, 14],
      phase: "右侧",
      currentIds: [current.id],
      acceptedIds: [current.id],
      pointers: [["索引", index]],
      invariant: "剩余区间保持有序，逐个原样复制。",
    });
    index += 1;
  }

  push({
    kind: "done",
    title: "插入完成",
    detail: `返回 ${pairText(result)}。`,
    activeLines: [15],
    phase: "完成",
    invariant: "结果有序且不重叠。",
    result: pairText(result),
  });
  return { frames };
}

export function createRemoveIntervalDryRun(input: unknown): IntervalTraceRun {
  const record = objectValue(input, "input");
  const source = itemsFromPairs(intervalList(record.intervals, "intervals"), "I");
  const [removeStart, removeEnd] = intervalValue(record.toBeRemoved, "toBeRemoved");
  const removed: IntervalItem = { id: "remove", start: removeStart, end: removeEnd, label: `[${removeStart}, ${removeEnd}]` };
  const result: IntervalItem[] = [];
  const frames: IntervalTraceFrame[] = [];
  const lanes = () => [lane("input", "输入区间", source), lane("remove", "待删除区间", [removed], "muted")];
  const push = (input: Omit<FrameInput, "lanes" | "output" | "outputLabel" | "mask">) => {
    frames.push(makeFrame({ ...input, lanes: lanes(), output: result, outputLabel: "剩余片段", mask: removed }));
  };

  push({
    kind: "start",
    title: "标记待删除区间",
    detail: "每个输入区间可能原样保留、失去一侧，或被切成左右两段。",
    activeLines: [1, 2],
    phase: "初始化",
    currentIds: [removed.id],
    pointers: [["删除区间", removed.label ?? ""]],
    invariant: "结果中只保留待删除区间以外的点。",
  });

  source.forEach((current, index) => {
    const disjoint = current.end <= removeStart || current.start >= removeEnd;
    if (disjoint) {
      result.push({ ...current, id: `R${result.length}` });
      push({
        kind: "visit",
        title: "没有重叠：原样保留",
        detail: `${current.label} 完全位于 ${removed.label} 之外。`,
        activeLines: [4, 5],
        phase: "无重叠",
        currentIds: [current.id],
        acceptedIds: [current.id],
        pointers: [["索引", index]],
        invariant: "不相交的区间会原样通过。",
      });
      return;
    }

    push({
      kind: "visit",
      title: "发生重叠：检查左右两侧",
      detail: `${current.label} 与阴影删除区间相交。`,
      activeLines: [7],
      phase: "重叠",
      currentIds: [current.id],
      comparedIds: [removed.id],
      pointers: [["索引", index]],
      invariant: "只有严格位于删除遮罩外的部分可以保留。",
    });

    if (current.start < removeStart) {
      const left: IntervalItem = { id: `R${result.length}`, start: current.start, end: removeStart, label: `[${current.start}, ${removeStart}]` };
      result.push(left);
      push({
        kind: "build",
        title: "保留左侧片段",
        detail: `${current.start} 到 ${removeStart} 位于删除起点之前，因此保留。`,
        activeLines: [8, 9],
        phase: "左侧片段",
        currentIds: [current.id],
        acceptedIds: [current.id],
        pointers: [["左侧片段", left.label ?? ""]],
        invariant: "每个已保存的左侧片段都在 removeStart 处或更早结束。",
      });
    }

    if (current.end > removeEnd) {
      const right: IntervalItem = { id: `R${result.length}`, start: removeEnd, end: current.end, label: `[${removeEnd}, ${current.end}]` };
      result.push(right);
      push({
        kind: "build",
        title: "保留右侧片段",
        detail: `${removeEnd} 到 ${current.end} 位于删除终点之后，因此保留。`,
        activeLines: [11, 12],
        phase: "右侧片段",
        currentIds: [current.id],
        acceptedIds: [current.id],
        pointers: [["右侧片段", right.label ?? ""]],
        invariant: "每个已保存的右侧片段都在 removeEnd 处或更晚开始。",
      });
    }
  });

  push({
    kind: "done",
    title: "删除完成",
    detail: `返回 ${pairText(result)}。`,
    activeLines: [13],
    phase: "完成",
    invariant: "结果恰好等于输入区间减去被遮罩的区间。",
    result: pairText(result),
  });
  return { frames };
}

export function createNonOverlappingIntervalsDryRun(input: unknown): IntervalTraceRun {
  const source = itemsFromPairs(intervalList(input, "intervals"), "I");
  const sorted = sortedByEnd(source);
  const kept: IntervalItem[] = [];
  const rejected: string[] = [];
  const frames: IntervalTraceFrame[] = [];
  const lanes = () => [lane("input", "原始区间", source, "muted"), lane("sorted", "按终点排序", sorted)];
  const push = (input: Omit<FrameInput, "lanes" | "output" | "outputLabel" | "rejectedIds">) => {
    frames.push(makeFrame({ ...input, lanes: lanes(), output: kept, outputLabel: "保留的区间", rejectedIds: rejected }));
  };

  push({
    kind: "start",
    title: "按最早终点排序",
    detail: "优先保留结束最早的区间，可以给后续选择留下最多空间。",
    activeLines: [1],
    phase: "排序",
    invariant: "已保留尾区间在当前可行选择中拥有尽可能早的终点。",
  });

  if (!sorted.length) {
    push({
      kind: "done",
      title: "无需删除",
      detail: "空列表本来就不存在重叠。",
      activeLines: [2],
      phase: "完成",
      result: 0,
      invariant: "空集合中不可能有冲突区间。",
    });
    return { frames };
  }

  kept.push({ ...sorted[0], id: "R0" });
  let keptEnd = sorted[0].end;
  push({
    kind: "build",
    title: "保留最早结束的第一个区间",
    detail: `${sorted[0].label} 建立 keptEnd = ${keptEnd}。`,
    activeLines: [3, 4],
    phase: "初始化",
    currentIds: [sorted[0].id],
    acceptedIds: [sorted[0].id],
    pointers: [["保留终点", keptEnd], ["删除数", 0]],
    invariant: "截至当前扫描位置，保留的区间两两不重叠。",
  });

  for (let index = 1; index < sorted.length; index += 1) {
    const current = sorted[index];
    if (current.start < keptEnd) {
      rejected.push(current.id);
      push({
        kind: "prune",
        title: "删除重叠区间",
        detail: `${current.start} < ${keptEnd}；保留结束更早的选择，删除数加一。`,
        activeLines: [6, 7],
        phase: "重叠",
        currentIds: [current.id],
        comparedIds: [kept[kept.length - 1].id],
        pointers: [["索引", index], ["保留终点", keptEnd], ["删除数", rejected.length]],
        invariant: "由于按终点排序，已有选择的结束时间一定不晚于被删除区间。",
      });
    } else {
      keptEnd = current.end;
      kept.push({ ...current, id: `R${kept.length}` });
      push({
        kind: "build",
        title: "保留兼容区间",
        detail: `${current.start} >= 前一个保留终点，因此它可以无重叠地接在后面。`,
        activeLines: [8, 9],
        phase: "保留",
        currentIds: [current.id],
        acceptedIds: [current.id],
        pointers: [["索引", index], ["保留终点", keptEnd], ["删除数", rejected.length]],
        invariant: "保留的区间继续保持两两不重叠。",
      });
    }
  }

  push({
    kind: "done",
    title: "得到最少删除数量",
    detail: `最少需要删除 ${rejected.length} 个区间。`,
    activeLines: [10],
    phase: "完成",
    pointers: [["删除数", rejected.length]],
    invariant: "最早终点贪心可以最大化可保留的兼容区间数量。",
    result: rejected.length,
  });
  return { frames };
}

export function createRemoveCoveredIntervalsDryRun(input: unknown): IntervalTraceRun {
  const source = itemsFromPairs(intervalList(input, "intervals"), "I");
  const sorted = [...source].sort((left, right) => left.start - right.start || right.end - left.end || left.id.localeCompare(right.id));
  const remaining: IntervalItem[] = [];
  const covered: string[] = [];
  const frames: IntervalTraceFrame[] = [];
  let farthestEnd = Number.NEGATIVE_INFINITY;
  const lanes = () => [lane("input", "原始区间", source, "muted"), lane("sorted", "起点升序，终点降序", sorted)];
  const push = (input: Omit<FrameInput, "lanes" | "output" | "outputLabel" | "coveredIds">) => {
    frames.push(makeFrame({ ...input, lanes: lanes(), output: remaining, outputLabel: "未被覆盖的区间", coveredIds: covered }));
  };

  push({
    kind: "start",
    title: "起点升序、终点降序排序",
    detail: "起点相同时，较长区间必须在前，这样才能覆盖后面的较短区间。",
    activeLines: [1],
    phase: "排序",
    pointers: [["最远终点", "-∞"]],
    invariant: "farthestEnd 是所有已保留区间中的最大终点。",
  });

  sorted.forEach((current, index) => {
    if (current.end > farthestEnd) {
      farthestEnd = current.end;
      remaining.push({ ...current, id: `R${remaining.length}` });
      push({
        kind: "build",
        title: "保留未被覆盖的区间",
        detail: `${current.end} 超过了 ${index === 0 ? "-∞" : "此前最远终点"}，因此它没有被覆盖。`,
        activeLines: [4, 5, 6],
        phase: "保留",
        currentIds: [current.id],
        acceptedIds: [current.id],
        pointers: [["索引", index], ["最远终点", farthestEnd], ["剩余数", remaining.length]],
        invariant: "每个保留区间都会把已见的最远终点向右推进。",
      });
    } else {
      covered.push(current.id);
      push({
        kind: "prune",
        title: "当前区间已被覆盖",
        detail: `${current.end} <= ${farthestEnd}；之前有区间起点不晚于它，终点至少与它一样远。`,
        activeLines: [4],
        phase: "已覆盖",
        currentIds: [current.id],
        pointers: [["索引", index], ["最远终点", farthestEnd], ["剩余数", remaining.length]],
        invariant: "终点不超过 farthestEnd 的当前区间不可能成为新的保留区间。",
      });
    }
  });

  push({
    kind: "done",
    title: "移除被覆盖区间完成",
    detail: `还剩 ${remaining.length} 个区间：${pairText(remaining)}。`,
    activeLines: [7],
    phase: "完成",
    pointers: [["剩余数", remaining.length], ["最远终点", farthestEnd]],
    invariant: "剩余区间恰好是那些创造新最远终点的区间。",
    result: remaining.length,
  });
  return { frames };
}
