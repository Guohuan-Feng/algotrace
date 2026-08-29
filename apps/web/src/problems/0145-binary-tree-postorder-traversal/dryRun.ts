import { createRecursiveTreeTraversalDryRun, type TreeTraversalFrame } from "../../shared/treeTraversal";

export type PostorderTraversalFrame = TreeTraversalFrame;
export function createPostorderTraversalDryRun(values: Array<number | null>): { frames: PostorderTraversalFrame[] } { return createRecursiveTreeTraversalDryRun(values, "postorder"); }
