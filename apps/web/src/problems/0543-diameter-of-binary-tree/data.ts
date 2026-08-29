export type DiameterExample = { id: number; label: string; input: Array<number | null>; output: number };
export const title = "543. Diameter of Binary Tree";
export const examples: DiameterExample[] = [{ id: 1, label: "LeetCode 1", input: [1, 2, 3, 4, 5], output: 3 }, { id: 2, label: "LeetCode 2", input: [1, 2], output: 1 }];
export const defaultExample = examples[0]!;
export const codeLines = ["class Solution:", "    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:", "        diameter = 0", "        def height(node):", "            if not node:", "                return 0", "            left_height = height(node.left)", "            right_height = height(node.right)", "            diameter = max(diameter, left_height + right_height)", "            return 1 + max(left_height, right_height)", "        height(root)", "        return diameter"];
