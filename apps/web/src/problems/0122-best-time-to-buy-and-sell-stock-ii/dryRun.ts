import type { StockFrame } from "../../shared/components/StockTradingVisualizer";

export function createBestTimeToBuySellIIRun(prices: number[]): { frames: StockFrame[] } {
  let buy = Number.NEGATIVE_INFINITY;
  let sell = 0;
  const frames: StockFrame[] = [];
  const push = (frame: Omit<StockFrame, "prices" | "buy" | "sell" | "result">) => frames.push({ ...frame, prices: [...prices], buy, sell, result: sell });
  push({ kind: "start", phase: "initialize", title: "Initialize buy and sell", detail: "buy is negative infinity before a first purchase; sell is zero before any completed transaction.", activeLines: [3, 4], index: null, price: null });
  prices.forEach((price, index) => {
    const oldBuy = buy;
    const sellBeforeBuy = sell;
    buy = Math.max(buy, sell - price);
    push({ kind: buy > oldBuy ? "build" : "visit", phase: "buy", title: `Update buy to ${buy}`, detail: `buy = max(${format(oldBuy)}, ${sellBeforeBuy} - ${price}) = ${buy}. Previous profit can fund another purchase.`, activeLines: [5, 6], index, price });
    const oldSell = sell;
    sell = Math.max(sell, buy + price);
    push({ kind: sell > oldSell ? "found" : "visit", phase: "sell", title: `Update sell to ${sell}`, detail: `sell = max(${oldSell}, ${buy} + ${price}) = ${sell}. This realizes the best profit through today.`, activeLines: [7], index, price });
  });
  push({ kind: "done", phase: "done", title: `Return ${sell}`, detail: "sell includes the best sequence of completed transactions.", activeLines: [8], index: null, price: null });
  return { frames };
}

function format(value: number) { return value === Number.NEGATIVE_INFINITY ? "-inf" : String(value); }
