import { StringHeapVisualizer, type StringHeapFrame } from "../../shared/components/StringHeapVisualizer";
import { codeLines, defaultExample, examples, title } from "./data";
import { createReorganizeStringDryRun } from "./dryRun";

export default function ReorganizeStringVisualizer(props: { onBack: () => void }) {
  return <StringHeapVisualizer {...props} title={title} inputLabel="string s" examples={examples} defaultExample={defaultExample} codeLines={codeLines} inputToText={JSON.stringify} parseInput={(text) => { const value = JSON.parse(text); if (typeof value !== "string" || !/^[a-z]{1,20}$/.test(value)) throw new Error(); return value; }} inputTokens={characterCounts} createRun={(input) => { const run = createReorganizeStringDryRun(input); return { frames: run.frames.map((frame) => ({ ...frame, focusA: frame.current, focusB: null, held: frame.prev })) as StringHeapFrame[] }; }} />;
}

function characterCounts(input: string): Array<[string, number]> {
  const counts = new Map<string, number>();
  for (const char of input) counts.set(char, (counts.get(char) ?? 0) + 1);
  return Array.from(counts.entries());
}
