import type { StockFrame } from "../../shared/components/StockTradingVisualizer";

export function createBestTimeToBuySellDryRun(prices: number[]): { frames: StockFrame[] } {
  let buy = Number.NEGATIVE_INFINITY;
  let sell = 0;
  const frames: StockFrame[] = [];
  const push = (frame: Omit<StockFrame, "prices" | "buy" | "sell" | "result">) => frames.push({ ...frame, prices: [...prices], buy, sell, result: sell });
  push({ kind: "start", phase: "initialize", title: "Initialize buy and sell", detail: "buy is negative infinity before any stock is bought; sell starts at zero profit.", activeLines: [3, 4], index: null, price: null });
  prices.forEach((price, index) => {
    const oldBuy = buy;
    buy = Math.max(buy, -price);
    push({ kind: buy === -price && buy !== oldBuy ? "build" : "visit", phase: "buy", title: `Update buy to ${buy}`, detail: `buy = max(${format(oldBuy)}, -${price}) = ${buy}. This keeps the cheapest single purchase seen so far.`, activeLines: [5, 6], index, price });
    const oldSell = sell;
    sell = Math.max(sell, buy + price);
    push({ kind: sell > oldSell ? "found" : "visit", phase: "sell", title: `Update sell to ${sell}`, detail: `sell = max(${oldSell}, ${buy} + ${price}) = ${sell}. Only one completed transaction is allowed.`, activeLines: [7], index, price });
  });
  push({ kind: "done", phase: "done", title: `Return ${sell}`, detail: "sell is the best profit after considering every price.", activeLines: [8], index: null, price: null });
  return { frames };
}

function format(value: number) { return value === Number.NEGATIVE_INFINITY ? "-inf" : String(value); }
