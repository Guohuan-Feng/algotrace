export type SameTreeExample = { id: number; label: string; p: Array<number | null>; q: Array<number | null>; output: boolean };
export const title = "100. Same Tree";
export const examples: SameTreeExample[] = [{ id: 1, label: "LeetCode 1", p: [1, 2, 3], q: [1, 2, 3], output: true }, { id: 2, label: "LeetCode 2", p: [1, 2], q: [1, null, 2], output: false }, { id: 3, label: "LeetCode 3", p: [1, 2, 1], q: [1, 1, 2], output: false }];
export const defaultExample = examples[0]!;
export const codeLines = ["class Solution:", "    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:", "        def same(p, q):", "            if not p and not q:", "                return True", "", "            if not p or not q or p.val != q.val:", "                return False", "", "            return same(p.left, q.left) and same(p.right, q.right)", "", "        return same(p, q)"];
