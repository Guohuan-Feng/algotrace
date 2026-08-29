export type CarFleetInput = { target: number; position: number[]; speed: number[] };

export const title = "853. Car Fleet";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { target: 12, position: [10, 8, 0, 5, 3], speed: [2, 4, 1, 1, 3] }, output: 3 },
  { id: 2, label: "LeetCode 2", input: { target: 10, position: [3], speed: [3] }, output: 1 },
  { id: 3, label: "LeetCode 3", input: { target: 100, position: [0, 2, 4], speed: [4, 2, 1] }, output: 1 },
] satisfies Array<{ id: number; label: string; input: CarFleetInput; output: number }>;

export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def carFleet(self, target, position, speed):",
  "        cars = sorted(zip(position, speed), reverse=True)",
  "        fleet_arrivals = []",
  "        for position, speed in cars:",
  "            arrival = (target - position) / speed",
  "            if not fleet_arrivals or arrival > fleet_arrivals[-1]:",
  "                fleet_arrivals.append(arrival)",
  "            else:",
  "                continue",
  "        return len(fleet_arrivals)",
];
