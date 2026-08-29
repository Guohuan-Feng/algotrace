import { NumericBacktrackingVisualizer } from "../../shared/components/NumericBacktrackingVisualizer";
import { codeLines, defaultExample, examples, title } from "./data";
import { createSubsetsIiDryRun } from "./dryRun";
export default function SubsetsIiVisualizer(props: { onBack: () => void }) { return <NumericBacktrackingVisualizer {...props} title={title} valueName="nums" examples={examples} defaultExample={defaultExample} codeLines={codeLines} inputToText={JSON.stringify} parseInput={(text) => { const value = JSON.parse(text); if (!Array.isArray(value) || !value.every(Number.isInteger) || value.length > 10) throw new Error(); return value as number[]; }} createRun={createSubsetsIiDryRun} values={(frame) => frame.nums ?? []} />; }
