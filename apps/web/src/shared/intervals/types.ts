import type { FrameKind } from "../types";

export type Interval = [number, number];

export type IntervalItem = {
  id: string;
  start: number;
  end: number;
  label?: string;
  owner?: string;
  height?: number;
};

export type IntervalLane = {
  id: string;
  label: string;
  intervals: IntervalItem[];
  tone?: "input" | "result" | "muted" | "employee";
};

export type TraceEvent = {
  id: string;
  time: number;
  delta: number;
  label: string;
};

export type HeapEntry = {
  id: string;
  height: number;
  right: number;
  label: string;
};

export type IntervalTraceFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  phase: string;
  lanes: IntervalLane[];
  output: IntervalItem[];
  outputLabel: string;
  currentIds: string[];
  comparedIds: string[];
  acceptedIds: string[];
  rejectedIds: string[];
  coveredIds: string[];
  pointers: Array<[string, string | number]>;
  invariant: string;
  sweep?: number | null;
  events?: TraceEvent[];
  eventIndex?: number | null;
  mask?: IntervalItem | null;
  heap?: HeapEntry[];
  skyline?: Array<[number, number]>;
  result?: string | number | boolean | null;
};

export type IntervalTraceRun = {
  frames: IntervalTraceFrame[];
};

export type IntervalTraceExample<TInput = unknown> = {
  id: number;
  label: string;
  input: TInput;
  output: string;
};

export type IntervalTraceDefinition<TInput = unknown> = {
  title: string;
  cnTitle: string;
  order: number;
  inputHint: string;
  examples: IntervalTraceExample<TInput>[];
  defaultExample: IntervalTraceExample<TInput>;
  codeLines: string[];
  createDryRun: (input: unknown) => IntervalTraceRun;
};
