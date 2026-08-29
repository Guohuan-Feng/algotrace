import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "./CodeTrace";
import { StepControls } from "./StepControls";
import type { FrameKind, VisualizerProps } from "../types";

export type StockFrame = {
  kind: FrameKind;
  phase: "initialize" | "buy" | "sell" | "done";
  title: string;
  detail: string;
  activeLines: number[];
  prices: number[];
  index: number | null;
  price: number | null;
  buy: number | null;
  sell: number;
  result: number | null;
};

type StockExample = { id: number; label: string; input: number[]; output: number };

type StockTradingVisualizerProps = VisualizerProps & {
  title: string;
  codeLines: string[];
  examples: StockExample[];
  defaultExample: StockExample;
  strategyLabel: string;
  createDryRun: (prices: number[]) => { frames: StockFrame[] };
};

export function StockTradingVisualizer({ onBack, title, codeLines, examples, defaultExample, strategyLabel, createDryRun }: StockTradingVisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState(defaultExample.id);
  const [prices, setPrices] = useState(defaultExample.input);
  const [inputText, setInputText] = useState(JSON.stringify(defaultExample.input));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createDryRun(prices), [createDryRun, prices]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)]!;

  useEffect(() => {
    if (!playing || step >= dryRun.frames.length - 1) {
      if (step >= dryRun.frames.length - 1) setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((current) => current + 1), 620);
    return () => window.clearTimeout(timer);
  }, [dryRun.frames.length, playing, step]);

  function loadExample(example: StockExample) {
    setSelectedExampleId(example.id);
    setPrices(example.input);
    setInputText(JSON.stringify(example.input));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const nextPrices = JSON.parse(inputText);
      if (!Array.isArray(nextPrices) || !nextPrices.length || !nextPrices.every(Number.isFinite)) throw new Error();
      setPrices(nextPrices);
      setSelectedExampleId(0);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError("Use a nonempty price array, such as [7,1,5,3,6,4].");
    }
  }

  return <main className="app-shell">
    <header className="topbar">
      <div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div>
      <div className="step-pill">Step {step + 1} / {dryRun.frames.length}</div>
    </header>
    <section className="workspace">
      <aside className="board-panel">
        <div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={example.id === selectedExampleId ? "active" : ""} key={example.id} onClick={() => loadExample(example)} type="button">{example.id}</button>)}</div></div>
        <div className="panel-heading"><h2>input</h2><span>prices = [{prices.join(", ")}]</span></div>
        <div className="input-grid"><label>prices JSON<textarea aria-label="prices JSON" value={inputText} onChange={(event) => setInputText(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load prices</button></div>
        <div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{selectedExample?.output ?? frame.result ?? "pending"}</code></div>
      </aside>
      <section className="flow-panel product-flow-panel">
        <div className="panel-heading"><h2>Two-State Trading DP</h2><span>{strategyLabel}</span></div>
        <div className="product-stage">
          <div className="product-numbers" aria-label="daily prices">{frame.prices.map((price, index) => <div className={`product-number ${index === frame.index ? "is-current" : ""}`} key={`${index}-${price}`}><span>day {index + 1}</span><strong>${price}</strong></div>)}</div>
          <div className="product-phase"><span>current day</span><strong>{frame.index === null ? "return sell" : `price = ${frame.price}`}</strong><p>{frame.detail}</p></div>
          <div className="product-state-grid"><StockState name="buy" value={frame.buy} emphasized /><StockState name="sell" value={frame.sell} result /></div>
        </div>
      </section>
      <aside className="state-panel">
        <div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div>
        <div className="state-block"><h3>loop state</h3><div className="token-list"><span>day = {frame.index === null ? "-" : frame.index + 1}</span><span>price = {frame.price ?? "-"}</span><span>buy = {frame.buy === null ? "-inf" : frame.buy}</span><span>sell = {frame.sell}</span></div></div>
        <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
      </aside>
    </section>
  </main>;
}

function StockState({ name, value, emphasized = false, result = false }: { name: string; value: number | null; emphasized?: boolean; result?: boolean }) {
  return <div className={`product-state ${emphasized ? "is-emphasized" : ""} ${result ? "is-result" : ""}`}><span>{name}</span><strong>{value === null ? "-inf" : value}</strong></div>;
}
