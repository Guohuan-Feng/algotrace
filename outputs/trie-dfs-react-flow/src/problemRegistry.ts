import { lazy } from "react";
import type { ComponentType, LazyExoticComponent } from "react";
import type { VisualizerKey, VisualizerProps } from "./types";

type VisualizerComponent = LazyExoticComponent<ComponentType<VisualizerProps>>;

export const visualizerRegistry: Record<VisualizerKey, VisualizerComponent> = {
  "letter-combinations-of-a-phone-number": lazy(() =>
    import("./problems/0017-letter-combinations-of-a-phone-number/Visualizer").then((module) => ({
      default: module.LetterCombinationsVisualizer,
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
  "permutations": lazy(() =>
    import("./problems/0046-permutations/Visualizer").then((module) => ({
      default: module.PermutationsVisualizer,
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
