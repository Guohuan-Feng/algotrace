import { lazy } from "react";
import type { ComponentType, LazyExoticComponent } from "react";
import type { ReadyProblemDefinition } from "../catalog/types";
import type { VisualizerProps } from "../shared/types";

type DefinitionModule = {
  definition: ReadyProblemDefinition;
};

type VisualizerModule = {
  default: ComponentType<VisualizerProps>;
};

type VisualizerLoader = () => Promise<VisualizerModule>;
type VisualizerComponent = LazyExoticComponent<ComponentType<VisualizerProps>>;

const definitionModules = import.meta.glob("./*/definition.ts", { eager: true }) as Record<string, DefinitionModule>;
const visualizerLoaders = import.meta.glob<VisualizerModule>("./*/Visualizer.tsx") as Record<string, VisualizerLoader>;

export const readyProblems = Object.entries(definitionModules)
  .map(([definitionPath, module]) => ({
    definitionPath,
    definition: module.definition,
  }))
  .sort((left, right) => left.definition.id - right.definition.id)
  .map(({ definition }) => definition);

const visualizersBySlug = new Map<string, VisualizerComponent>();

Object.entries(definitionModules).forEach(([definitionPath, module]) => {
  const visualizerPath = definitionPath.replace("definition.ts", "Visualizer.tsx");
  const loadVisualizer = visualizerLoaders[visualizerPath];

  if (loadVisualizer) {
    visualizersBySlug.set(module.definition.slug, lazy(loadVisualizer));
  }
});

export function getVisualizerBySlug(slug: string): VisualizerComponent | null {
  return visualizersBySlug.get(slug) ?? null;
}
