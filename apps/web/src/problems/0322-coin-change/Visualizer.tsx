import { LinearDpVisualizer } from "../../shared/components/LinearDpVisualizer";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title } from "./data";
import { createCoinChangeDryRun } from "./dryRun";

export default function CoinChangeVisualizer(props: VisualizerProps) {
  return <LinearDpVisualizer {...props} title={title} stageTitle="Minimum-Coin DP" inputLabel="input JSON" codeLines={codeLines} examples={examples} defaultExample={defaultExample} createDryRun={(input) => createCoinChangeDryRun(input.coins, input.amount)} inputSummary={(input) => `coins = [${input.coins.join(", ")}], amount = ${input.amount}`} />;
}
