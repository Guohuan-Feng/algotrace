import type { FrameKind } from "../../shared/types";
import { parseInput } from "./data";

export type RemoveDuplicatesIIFrame = {
  kind: FrameKind;
  phase: "guard" | "initialize" | "compare" | "write" | "advance" | "skip" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  nums: number[];
  left: number | null;
  right: number | null;
  compareIndex: number | null;
  comparison: { candidate: number; reference: number; keep: boolean } | null;
  writtenIndex: number | null;
  result: { k: number | null; nums: number[] };
};

export function createRemoveDuplicatesIIDryRun(input: number[]): { frames: RemoveDuplicatesIIFrame[] } {
  const nums = parseInput(input);
  const frames: RemoveDuplicatesIIFrame[] = [];
  let left: number | null = null;
  let retained: number[] = [];

  const snapshot = (
    frame: Omit<RemoveDuplicatesIIFrame, "nums" | "left" | "result">,
    resultK: number | null = null,
  ) => {
    frames.push({
      ...frame,
      activeLines: [...frame.activeLines],
      comparison: frame.comparison ? { ...frame.comparison } : null,
      nums: [...nums],
      left,
      result: { k: resultK, nums: [...retained] },
    });
  };

  snapshot({
    kind: "start", phase: "guard", title: "先检查数组长度",
    detail: `数组有 ${nums.length} 项。长度不超过 2 时，每个值自然最多出现两次，直接返回。`,
    activeLines: [3], right: null, compareIndex: null, comparison: null, writtenIndex: null,
  });

  if (nums.length <= 2) {
    retained = [...nums];
    snapshot({
      kind: "done", phase: "done", title: "直接返回数组长度",
      detail: `返回 k = ${nums.length}，整个数组都是结果；left 和 right 均未初始化。`,
      activeLines: [4], right: null, compareIndex: null, comparison: null, writtenIndex: null,
    }, nums.length);
    return { frames };
  }

  left = 2;
  retained = nums.slice(0, left);
  snapshot({
    kind: "start", phase: "initialize", title: "先保留前两项",
    detail: "left = 2 表示已有两项有效元素，也指向下一个写入位置。right 将从索引 2 开始扫描。",
    activeLines: [6], right: null, compareIndex: null, comparison: null, writtenIndex: null,
  });

  for (let right = 2; right < nums.length; right += 1) {
    const compareIndex = left - 2;
    const candidate = nums[right]!;
    const reference = nums[compareIndex]!;
    const comparison = { candidate, reference, keep: candidate !== reference };
    snapshot({
      kind: "visit", phase: "compare", title: `比较 nums[${right}] 与 nums[${compareIndex}]`,
      detail: `${candidate} ${comparison.keep ? "≠" : "="} ${reference}。${comparison.keep ? "可以保留当前值，下一步写入 left 指向的位置。" : "当前值已在有效前缀中保留两次，本轮跳过。"}`,
      activeLines: [8, 9], right, compareIndex, comparison, writtenIndex: null,
    });

    if (comparison.keep) {
      const writtenIndex = left;
      const previousValue = nums[writtenIndex]!;
      nums[writtenIndex] = candidate;
      snapshot({
        kind: "build", phase: "write", title: `把 ${candidate} 写入索引 ${writtenIndex}`,
        detail: writtenIndex === right
          ? `nums[${writtenIndex}] = nums[${right}]，保留在原位置；left 尚未增加。`
          : `nums[${writtenIndex}] 从 ${previousValue} 覆盖为 ${candidate}；只写入这一格，left 尚未增加。`,
        activeLines: [10], right, compareIndex, comparison, writtenIndex,
      });

      left += 1;
      retained = nums.slice(0, left);
      snapshot({
        kind: "build", phase: "advance", title: `left 前进到 ${left}`,
        detail: `执行 left += 1，有效前缀现在是 nums[0:${left}]，共 ${left} 项。`,
        activeLines: [11], right, compareIndex: null, comparison, writtenIndex,
      });
    } else {
      snapshot({
        kind: "prune", phase: "skip", title: `跳过多余的 ${candidate}`,
        detail: `有效前缀的最后两项已经都是 ${candidate}。数组不变，left 保持 ${left}，继续扫描下一项。`,
        activeLines: [9], right, compareIndex, comparison, writtenIndex: null,
      });
    }
  }

  snapshot({
    kind: "done", phase: "done", title: `返回有效长度 ${left}`,
    detail: `答案是 nums[0:${left}] = [${retained.join(", ")}]。原数组长度仍为 ${nums.length}，后缀不属于结果。`,
    activeLines: [13], right: null, compareIndex: null, comparison: null, writtenIndex: null,
  }, left);
  return { frames };
}
