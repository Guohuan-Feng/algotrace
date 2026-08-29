import { createRecursiveTreeTraversalDryRun, type TreeTraversalFrame } from "../../shared/treeTraversal";

export type PreorderTraversalFrame = TreeTraversalFrame;
export function createPreorderTraversalDryRun(values: Array<number | null>): { frames: PreorderTraversalFrame[] } { return createRecursiveTreeTraversalDryRun(values, "preorder"); }
