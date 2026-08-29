export type BinaryTreePathsInput = { root: Array<number | null> };
export const title = "257. Binary Tree Paths";
export const examples = [{ id: 1, label: "LeetCode 1", input: { root: [1, 2, 3, null, 5] }, output: ["1->2->5", "1->3"] }, { id: 2, label: "LeetCode 2", input: { root: [1] }, output: ["1"] }] satisfies Array<{ id: number; label: string; input: BinaryTreePathsInput; output: string[] }>;
export const defaultExample = examples[0]!;
export const codeLines = ["class Solution:", "    def binaryTreePaths(self, root: Optional[TreeNode]) -> List[str]:", "        res = []", "", "        def dfs(node, path):", "            if not node:", "                return", "            path.append(str(node.val))", "            if not node.left and not node.right:", "                res.append('->'.join(path))", "            else:", "                dfs(node.left, path)", "                dfs(node.right, path)", "            path.pop()", "", "        dfs(root, [])", "        return res"];
