import { lazy } from "react";
import type { ComponentType, LazyExoticComponent } from "react";
import type { VisualizerKey, VisualizerProps } from "./types";

type VisualizerComponent = LazyExoticComponent<ComponentType<VisualizerProps>>;

export const visualizerRegistry: Record<VisualizerKey, VisualizerComponent> = {
  "remove-duplicates-from-sorted-array": lazy(() =>
    import("./problems/0026-remove-duplicates-from-sorted-array/Visualizer").then((module) => ({
      default: module.RemoveDuplicatesSortedArrayVisualizer,
    })),
  ),
  "generate-parentheses": lazy(() =>
    import("./problems/0022-generate-parentheses/Visualizer").then((module) => ({
      default: module.GenerateParenthesesVisualizer,
    })),
  ),
  "letter-combinations-of-a-phone-number": lazy(() =>
    import("./problems/0017-letter-combinations-of-a-phone-number/Visualizer").then((module) => ({
      default: module.LetterCombinationsVisualizer,
    })),
  ),
  "word-search": lazy(() =>
    import("./problems/0079-word-search/Visualizer").then((module) => ({
      default: module.WordSearchVisualizer,
    })),
  ),
  "combinations": lazy(() =>
    import("./problems/0077-combinations/Visualizer").then((module) => ({
      default: module.CombinationsVisualizer,
    })),
  ),
  "combination-sum": lazy(() =>
    import("./problems/0039-combination-sum/Visualizer").then((module) => ({
      default: module.CombinationSumVisualizer,
    })),
  ),
  "convert-sorted-array-to-binary-search-tree": lazy(() =>
    import("./problems/0108-convert-sorted-array-to-binary-search-tree/Visualizer").then((module) => ({
      default: module.SortedArrayToBstVisualizer,
    })),
  ),
  "course-schedule": lazy(() =>
    import("./problems/0207-course-schedule/Visualizer").then((module) => ({
      default: module.CourseScheduleVisualizer,
    })),
  ),
  "find-minimum-in-rotated-sorted-array": lazy(() =>
    import("./problems/0153-find-minimum-in-rotated-sorted-array/Visualizer").then((module) => ({
      default: module.FindMinimumRotatedArrayVisualizer,
    })),
  ),
  "ipo": lazy(() =>
    import("./problems/0502-ipo/Visualizer").then((module) => ({
      default: module.IpoVisualizer,
    })),
  ),
  "longest-consecutive-sequence": lazy(() =>
    import("./problems/0128-longest-consecutive-sequence/Visualizer").then((module) => ({
      default: module.LongestConsecutiveVisualizer,
    })),
  ),
  "longest-continuous-increasing-subsequence": lazy(() =>
    import("./problems/0674-longest-continuous-increasing-subsequence/Visualizer").then((module) => ({
      default: module.LongestContinuousIncreasingSubsequenceVisualizer,
    })),
  ),
  "longest-increasing-subsequence": lazy(() =>
    import("./problems/0300-longest-increasing-subsequence/Visualizer").then((module) => ({
      default: module.LongestIncreasingSubsequenceVisualizer,
    })),
  ),
  "path-with-minimum-effort": lazy(() =>
    import("./problems/1631-path-with-minimum-effort/Visualizer").then((module) => ({
      default: module.MinimumEffortPathVisualizer,
    })),
  ),
  "n-queens-ii": lazy(() =>
    import("./problems/0052-n-queens-ii/Visualizer").then((module) => ({
      default: module.NQueensIiVisualizer,
    })),
  ),
  "quick-sort": lazy(() =>
    import("./problems/9001-quick-sort/Visualizer").then((module) => ({
      default: module.QuickSortVisualizer,
    })),
  ),
  "reverse-linked-list": lazy(() =>
    import("./problems/0206-reverse-linked-list/Visualizer").then((module) => ({
      default: module.ReverseLinkedListVisualizer,
    })),
  ),
  "search-in-rotated-sorted-array": lazy(() =>
    import("./problems/0033-search-in-rotated-sorted-array/Visualizer").then((module) => ({
      default: module.SearchRotatedArrayVisualizer,
    })),
  ),
  "permutations": lazy(() =>
    import("./problems/0046-permutations/Visualizer").then((module) => ({
      default: module.PermutationsVisualizer,
    })),
  ),
  "sort-list": lazy(() =>
    import("./problems/0148-sort-list/Visualizer").then((module) => ({
      default: module.SortListVisualizer,
    })),
  ),
  "shortest-path-binary-matrix-with-weight": lazy(() =>
    import("./problems/9002-shortest-path-binary-matrix-with-weight/Visualizer").then((module) => ({
      default: module.WeightedBinaryMatrixVisualizer,
    })),
  ),
  "triangle": lazy(() =>
    import("./problems/0120-triangle/Visualizer").then((module) => ({
      default: module.TriangleVisualizer,
    })),
  ),
  "implement-trie-prefix-tree": lazy(() =>
    import("./problems/0208-implement-trie-prefix-tree/Visualizer").then((module) => ({
      default: module.ImplementTrieVisualizer,
    })),
  ),
  "design-add-and-search-words-data-structure": lazy(() =>
    import("./problems/0211-design-add-and-search-words-data-structure/Visualizer").then((module) => ({
      default: module.DesignAddSearchWordsVisualizer,
    })),
  ),
  "word-search-ii": lazy(() =>
    import("./problems/0212-word-search-ii/Visualizer").then((module) => ({
      default: module.WordSearchIiVisualizer,
    })),
  ),
};
