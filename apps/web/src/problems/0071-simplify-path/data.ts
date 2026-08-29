export type SimplifyPathInput = { path: string };

export const title = "71. Simplify Path";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { path: "/home/" }, output: "/home" },
  { id: 2, label: "LeetCode 2", input: { path: "/../" }, output: "/" },
  { id: 3, label: "LeetCode 3", input: { path: "/home//foo/" }, output: "/home/foo" },
  { id: 4, label: "Nested parents", input: { path: "/a/./b/../../c/" }, output: "/c" },
] satisfies Array<{ id: number; label: string; input: SimplifyPathInput; output: string }>;

export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def simplifyPath(self, path):",
  "        stack = []",
  "        for segment in path.split('/'):",
  "            if segment == '' or segment == '.':",
  "                continue",
  "            if segment == '..':",
  "                if stack:",
  "                    stack.pop()",
  "            else:",
  "                stack.append(segment)",
  "        return '/' + '/'.join(stack)",
];
