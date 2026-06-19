import { OperationTrieVisualizer } from "../../components/OperationTrieVisualizer";
import type { VisualizerProps } from "../../types";
import { codeLines, operations, title } from "./data";

export function ImplementTrieVisualizer({ onBack }: VisualizerProps) {
  return (
    <OperationTrieVisualizer
      codeLines={codeLines}
      mode="trie"
      operations={operations}
      title={title}
      onBack={onBack}
    />
  );
}
