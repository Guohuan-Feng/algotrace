import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type TrappingRainWaterInput } from "./data";
import { createTrappingRainWaterDryRun } from "./dryRun";

export default function TrappingRainWaterVisualizer({ onBack }: VisualizerProps) {
  const [exampleId, setExampleId] = useState(defaultExample.id);
  const [input, setInput] = useState<TrappingRainWaterInput>(defaultExample.input);
  const [text, setText] = useState(JSON.stringify(defaultExample.input));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const run = useMemo(() => createTrappingRainWaterDryRun(input.height), [input]);
  const frame = run.frames[Math.min(step, run.frames.length - 1)]!;
  const selectedExample = examples.find((example) => example.id === exampleId);
  const maxHeight = Math.max(...input.height.map((value, index) => value + (frame.waterLevels[index] ?? 0)), 1);

  useEffect(() => {
    if (!playing || step >= run.frames.length - 1) {
      if (step >= run.frames.length - 1) setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((value) => value + 1), 560);
    return () => window.clearTimeout(timer);
  }, [playing, run.frames.length, step]);

  function load(example: (typeof examples)[number]) {
    setExampleId(example.id);
    setInput(example.input);
    setText(JSON.stringify(example.input));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const candidate = JSON.parse(text) as TrappingRainWaterInput;
      if (!candidate || !Array.isArray(candidate.height) || !candidate.height.every((value) => Number.isInteger(value) && value >= 0)) throw new Error();
      setInput(candidate);
      setExampleId(0);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError('Use JSON such as {"height":[0,1,0,2,1,0,1,3,2,1,2,1]}.');
    }
  }

  return <main className="app-shell">
    <header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {run.frames.length}</div></header>
    <section className="workspace">
      <aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={example.id === exampleId ? "active" : ""} key={example.id} onClick={() => load(example)} type="button">{example.id}</button>)}</div></div><div className="input-grid"><label>input JSON<textarea aria-label="input JSON" value={text} onChange={(event) => setText(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load heights</button></div><div className="expected-output"><span>{selectedExample ? selectedExample.label + " output" : "Current result"}</span><code>{frame.result ?? selectedExample?.output ?? "pending"}</code></div></aside>
      <section className="flow-panel water-flow-panel"><div className="panel-heading"><h2>Two-Sided Water Basin</h2><span>water = {frame.water}</span></div><div className="water-stage"><div className="water-bars" style={{ gridTemplateColumns: "repeat(" + input.height.length + ", minmax(44px, 1fr))" }}>{input.height.map((height, index) => { const fill = frame.waterLevels[index] ?? 0; const isPointer = index === frame.left || index === frame.right; return <div className={["water-column", isPointer ? "is-boundary" : "", index === frame.current ? "is-current" : "", fill > 0 ? "is-trapped" : ""].filter(Boolean).join(" ")} key={index}><div className="water-pointer">{index === frame.left ? "left" : index === frame.right ? "right" : ""}</div><div className="water-track">{fill > 0 ? <div className="water-fill" style={{ height: (fill / maxHeight) * 100 + "%" }} /> : null}<div className="water-bar" style={{ height: Math.max(7, (height / maxHeight) * 100) + "%" }}><strong>{height}</strong></div></div><span>{fill > 0 ? "+" + fill : "i = " + index}</span></div>; })}</div><div className="water-readout"><div><span>left_max</span><strong>{frame.leftMax}</strong></div><div><span>right_max</span><strong>{frame.rightMax}</strong></div><div><span>added now</span><strong>{frame.added ?? "-"}</strong></div></div><div className="product-phase"><span>current action</span><strong>{frame.current === null ? "ready" : "index " + frame.current}</strong><p>{frame.detail}</p></div></div></section>
      <aside className="state-panel"><div className="state-sticky"><div className={"event-card " + frame.kind}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={run.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>two-pointer state</h3><div className="token-list"><span>left = {frame.left}</span><span>right = {frame.right}</span><span>left_max = {frame.leftMax}</span><span>right_max = {frame.rightMax}</span><span>water = {frame.water}</span></div></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside>
    </section>
  </main>;
}
