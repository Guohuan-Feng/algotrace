import { OperationTrieVisualizer } from "../../components/OperationTrieVisualizer";
import type { VisualizerProps } from "../../types";
import { codeLines, operations, title } from "./data";

export function DesignAddSearchWordsVisualizer({ onBack }: VisualizerProps) {
  return (
    <OperationTrieVisualizer
      codeLines={codeLines}
      mode="word-dictionary"
      operations={operations}
      title={title}
      onBack={onBack}
    />
  );
}
