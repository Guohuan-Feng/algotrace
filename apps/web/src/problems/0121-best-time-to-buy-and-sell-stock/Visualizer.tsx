import { StockTradingVisualizer } from "../../shared/components/StockTradingVisualizer";
import { codeLines, defaultExample, examples, title } from "./data";
import { createBestTimeToBuySellDryRun } from "./dryRun";

export default function BestTimeToBuySellStockVisualizer(props: { onBack: () => void }) {
  return <StockTradingVisualizer {...props} title={title} codeLines={codeLines} examples={examples} defaultExample={defaultExample} strategyLabel="one buy, then one sell" createDryRun={createBestTimeToBuySellDryRun} />;
}
