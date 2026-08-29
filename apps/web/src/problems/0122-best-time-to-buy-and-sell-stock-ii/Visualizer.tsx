import { StockTradingVisualizer } from "../../shared/components/StockTradingVisualizer";
import { codeLines, defaultExample, examples, title } from "./data";
import { createBestTimeToBuySellIIRun } from "./dryRun";

export default function BestTimeToBuySellStockIIVisualizer(props: { onBack: () => void }) {
  return <StockTradingVisualizer {...props} title={title} codeLines={codeLines} examples={examples} defaultExample={defaultExample} strategyLabel="sell profit can fund the next buy" createDryRun={createBestTimeToBuySellIIRun} />;
}
