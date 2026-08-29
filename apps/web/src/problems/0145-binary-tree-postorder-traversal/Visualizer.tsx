import { TreeTraversalVisualizer } from "../../shared/components/TreeTraversalVisualizer";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, examples, title } from "./data";
import { createPostorderTraversalDryRun } from "./dryRun";
export default function BinaryTreePostorderTraversalVisualizer(props: VisualizerProps) { return <TreeTraversalVisualizer {...props} title={title} examples={examples} codeLines={codeLines} rule={["left subtree", "right subtree", "root"]} createRun={createPostorderTraversalDryRun} />; }
