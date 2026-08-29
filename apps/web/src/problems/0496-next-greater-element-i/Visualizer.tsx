import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type NextGreaterInput } from "./data";
import { createNextGreaterDryRun } from "./dryRun";

export default function NextGreaterElementVisualizer({ onBack }: VisualizerProps) {
  const [input, setInput] = useState<NextGreaterInput>(defaultExample.input);
  const [text, setText] = useState(JSON.stringify(defaultExample.input));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const run = useMemo(() => createNextGreaterDryRun(input.nums1, input.nums2), [input]);
  const frame = run.frames[Math.min(step, run.frames.length - 1)]!;

  useEffect(() => {
    if (!playing || step >= run.frames.length - 1) {
      if (step >= run.frames.length - 1) setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((current) => current + 1), 620);
    return () => window.clearTimeout(timer);
  }, [playing, run.frames.length, step]);

  function selectExample(example: (typeof examples)[number]) {
    setInput(example.input);
    setText(JSON.stringify(example.input));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const candidate = JSON.parse(text) as NextGreaterInput;
      if (!Array.isArray(candidate.nums1) || !Array.isArray(candidate.nums2) || !candidate.nums1.every(Number.isFinite) || !candidate.nums2.every(Number.isFinite)) throw new Error();
      setInput(candidate);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError('Use JSON such as {"nums1":[4,1,2],"nums2":[1,3,4,2]}.');
    }
  }

  return <main className="app-shell"><header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {run.frames.length}</div></header><section className="workspace"><aside className="board-panel"><div className="example-tabs">{examples.map((example) => <button className={example.id === examples.find((item) => JSON.stringify(item.input) === JSON.stringify(input))?.id ? "active" : ""} key={example.id} onClick={() => selectExample(example)} type="button">{example.label}</button>)}</div><div className="input-grid"><label>input JSON<textarea aria-label="input JSON" value={text} onChange={(event) => setText(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load input</button></div><div className="expected-output"><span>Expected output</span><code>{JSON.stringify(frame.result ?? examples.find((example) => JSON.stringify(example.input) === JSON.stringify(input))?.output ?? [])}</code></div></aside><section className="flow-panel product-flow-panel"><div className="panel-heading"><h2>Monotonic Stack and Mapping</h2><span>phase: {frame.phase}</span></div><div className="product-stage"><div className="product-numbers">{input.nums2.map((value, index) => <div className={`product-number ${index === frame.index ? "is-current" : ""}`} key={`${value}-${index}`}><span>nums2[{index}]</span><strong>{value}</strong></div>)}</div><div className="product-phase"><span>unresolved stack</span><strong>{frame.stack.length ? `[${frame.stack.join(", ")}]` : "[]"}</strong><span>next-greater map</span><strong>{Object.keys(frame.mapping).length ? `{ ${Object.entries(frame.mapping).map(([from, to]) => `${from}: ${to}`).join(", ")} }` : "{}"}</strong><p>{frame.detail}</p></div><div className="product-phase"><span>nums1 query results</span><strong>{input.nums1.map((value, index) => `${value} -> ${frame.result?.[index] ?? "?"}`).join("   ")}</strong></div></div></section><aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={run.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside></section></main>;
}
