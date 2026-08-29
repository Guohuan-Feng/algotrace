import { TreeTraversalVisualizer } from "../../shared/components/TreeTraversalVisualizer";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, examples, title } from "./data";
import { createPreorderTraversalDryRun } from "./dryRun";
export default function BinaryTreePreorderTraversalVisualizer(props: VisualizerProps) { return <TreeTraversalVisualizer {...props} title={title} examples={examples} codeLines={codeLines} rule={["root", "left subtree", "right subtree"]} createRun={createPreorderTraversalDryRun} />; }
