import { OperationTrieVisualizer } from "../../shared/components/OperationTrieVisualizer";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, operations, title } from "./data";

export default function ImplementTrieVisualizer({ onBack }: VisualizerProps) {
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
