export type SumLeftLeavesExample = { id: number; label: string; input: Array<number | null>; output: number };
export const title = "404. Sum of Left Leaves";
export const examples: SumLeftLeavesExample[] = [{ id: 1, label: "LeetCode 1", input: [3, 9, 20, null, null, 15, 7], output: 24 }, { id: 2, label: "LeetCode 2", input: [1], output: 0 }];
export const defaultExample = examples[0]!;
export const codeLines = ["class Solution:", "    def sumOfLeftLeaves(self, root: Optional[TreeNode]) -> int:", "        def dfs(node, is_left):", "            if not node:", "                return 0", "            if is_left and not node.left and not node.right:", "                return node.val", "            return dfs(node.left, True) + dfs(node.right, False)", "", "        return dfs(root, False)"];
