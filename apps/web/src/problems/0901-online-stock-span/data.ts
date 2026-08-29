export type StockSpanInput = { prices: number[] };
export const title = "901. Online Stock Span";
export const examples = [{ id: 1, label: "LeetCode 1", input: { prices: [100, 80, 60, 70, 60, 75, 85] }, output: [1, 1, 1, 2, 1, 4, 6] }] satisfies Array<{ id: number; label: string; input: StockSpanInput; output: number[] }>;
export const defaultExample = examples[0]!;
export const codeLines = ["class StockSpanner:", "    def __init__(self):", "        self.stack = []", "", "    def next(self, price: int) -> int:", "        span = 1", "        while self.stack and self.stack[-1][0] <= price:", "            span += self.stack.pop()[1]", "        self.stack.append((price, span))", "        return span"];
