export type PostorderTraversalExample = { id: number; label: string; input: Array<number | null>; output: number[] };
export const title = "145. Binary Tree Postorder Traversal";
export const examples: PostorderTraversalExample[] = [{ id: 1, label: "LeetCode 1", input: [1, null, 2, 3], output: [3, 2, 1] }, { id: 2, label: "LeetCode 2", input: [], output: [] }, { id: 3, label: "LeetCode 3", input: [1], output: [1] }];
export const codeLines = ["class Solution:", "    def postorderTraversal(self, root: Optional[TreeNode]) -> List[int]:", "        res = []", "", "        def dfs(node):", "            if not node:", "                return", "", "            dfs(node.left)", "            dfs(node.right)", "            res.append(node.val)", "", "        dfs(root)", "        return res"];
