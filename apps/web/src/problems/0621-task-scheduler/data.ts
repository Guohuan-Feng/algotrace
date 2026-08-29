export type TaskSchedulerInput = { tasks: string[]; n: number };
export const title = "621. Task Scheduler";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { tasks: ["A", "A", "A", "B", "B", "B"], n: 2 }, output: 8 },
  { id: 2, label: "LeetCode 2", input: { tasks: ["A", "A", "A", "B", "B", "B"], n: 0 }, output: 6 },
];
export const defaultExample = examples[0]!;
export const codeLines = ["class Solution:", "    def leastInterval(self, tasks: List[str], n: int) -> int:", "        count = Counter(tasks)", "        heap = [-freq for freq in count.values()]", "        heapq.heapify(heap)", "", "        time = 0", "", "        while heap:", "            temp = []", "", "            for _ in range(n + 1):", "                if heap:", "                    freq = heapq.heappop(heap) + 1", "", "                    if freq < 0:", "                        temp.append(freq)", "", "                time += 1", "", "                if not heap and not temp:", "                    break", "", "            for freq in temp:", "                heapq.heappush(heap, freq)", "", "        return time"];
