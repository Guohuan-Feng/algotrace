import type { FrameKind } from "./types";

export type KSumInput = {
  nums: number[];
  target?: number;
};

export type KSumExample = {
  id: number;
  label: string;
  input: KSumInput;
  output: number[][];
};

export type KSumFrame = {
  kind: FrameKind;
  phase: "initialize" | "anchor" | "inspect" | "found" | "move-left" | "move-right" | "skip" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  k: 3 | 4;
  target: number;
  nums: number[];
  anchors: number[];
  left: number | null;
  right: number | null;
  total: number | null;
  results: number[][];
  result: number[][] | null;
};
