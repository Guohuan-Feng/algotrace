import { lazy } from "react";
import type { ComponentType, LazyExoticComponent } from "react";
import type { VisualizerKey, VisualizerProps } from "./types";

type VisualizerComponent = LazyExoticComponent<ComponentType<VisualizerProps>>;

export const visualizerRegistry: Record<VisualizerKey, VisualizerComponent> = {
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
