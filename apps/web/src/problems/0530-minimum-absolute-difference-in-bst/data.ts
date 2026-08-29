export type MinimumDifferenceExample = { id: number; label: string; input: Array<number | null>; output: number };
export const title = "530. Minimum Absolute Difference in BST";
export const examples: MinimumDifferenceExample[] = [{ id: 1, label: "LeetCode 1", input: [4, 2, 6, 1, 3], output: 1 }, { id: 2, label: "LeetCode 2", input: [1, 0, 48, null, null, 12, 49], output: 1 }];
export const defaultExample = examples[0]!;
export const codeLines = ["class Solution:", "    def getMinimumDifference(self, root: Optional[TreeNode]) -> int:", "        prev, answer = None, float('inf')", "        def inorder(node):", "            if not node:", "                return", "            inorder(node.left)", "            if prev is not None:", "                answer = min(answer, node.val - prev)", "            prev = node.val", "            inorder(node.right)", "        inorder(root)", "        return answer"];
