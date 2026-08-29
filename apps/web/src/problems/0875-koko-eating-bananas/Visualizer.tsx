import { ThresholdSearchVisualizer } from "../../shared/components/ThresholdSearchVisualizer";
import { codeLines, defaultExample, examples, title, type KokoInput } from "./data";
import { createKokoDryRun } from "./dryRun";
export default function KokoVisualizer(props: { onBack: () => void }) { return <ThresholdSearchVisualizer {...props} title={title} examples={examples} defaultExample={defaultExample} codeLines={codeLines} inputToText={JSON.stringify} parseInput={parseInput} createRun={(input) => createKokoDryRun(input.piles, input.h)} candidateLimit={(input) => Math.max(...input.piles)} inputSummary={(input) => `h = ${input.h}`} />; }
function parseInput(text: string): KokoInput { const input = JSON.parse(text) as KokoInput; if (!Array.isArray(input.piles) || !input.piles.length || !input.piles.every((value) => Number.isInteger(value) && value > 0) || !Number.isInteger(input.h) || input.h < input.piles.length) throw new Error(); return input; }
