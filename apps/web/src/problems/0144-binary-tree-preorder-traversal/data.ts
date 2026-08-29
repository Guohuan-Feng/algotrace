export type PreorderTraversalExample = { id: number; label: string; input: Array<number | null>; output: number[] };
export const title = "144. Binary Tree Preorder Traversal";
export const examples: PreorderTraversalExample[] = [{ id: 1, label: "LeetCode 1", input: [1, null, 2, 3], output: [1, 2, 3] }, { id: 2, label: "LeetCode 2", input: [], output: [] }, { id: 3, label: "LeetCode 3", input: [1], output: [1] }];
export const codeLines = ["class Solution:", "    def preorderTraversal(self, root: Optional[TreeNode]) -> List[int]:", "        res = []", "", "        def dfs(node):", "            if not node:", "                return", "", "            res.append(node.val)", "            dfs(node.left)", "            dfs(node.right)", "", "        dfs(root)", "        return res"];
