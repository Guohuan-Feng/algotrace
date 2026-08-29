export type AsteroidExample = { id: number; label: string; asteroids: number[]; output: number[] };
export const title = "735. Asteroid Collision";
export const examples: AsteroidExample[] = [{ id: 1, label: "LeetCode 1", asteroids: [5, 10, -5], output: [5, 10] }, { id: 2, label: "LeetCode 2", asteroids: [8, -8], output: [] }, { id: 3, label: "LeetCode 3", asteroids: [10, 2, -5], output: [10] }];
export const defaultExample = examples[0];
export const codeLines = ["class Solution:", "    def asteroidCollision(self, asteroids: List[int]) -> List[int]:", "        stack = []", "        for ast in asteroids:", "            while stack and stack[-1] > 0 and ast < 0:", "                if stack[-1] < -ast:", "                    stack.pop()", "                elif stack[-1] == -ast:", "                    stack.pop()", "                    break", "                else:", "                    break", "            else:", "                stack.append(ast)", "        return stack"];
