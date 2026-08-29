import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type SlidingWindowMaximumInput } from "./data";
import { createSlidingWindowMaximumDryRun } from "./dryRun";

export default function SlidingWindowMaximumVisualizer({ onBack }: VisualizerProps) {
  const [exampleId, setExampleId] = useState(defaultExample.id);
  const [input, setInput] = useState<SlidingWindowMaximumInput>(defaultExample.input);
  const [text, setText] = useState(JSON.stringify(defaultExample.input));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const run = useMemo(() => createSlidingWindowMaximumDryRun(input.nums, input.k), [input]);
  const frame = run.frames[Math.min(step, run.frames.length - 1)]!;

  useEffect(() => {
    if (!playing || step >= run.frames.length - 1) {
      if (step >= run.frames.length - 1) setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((value) => value + 1), 620);
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
      const candidate = JSON.parse(text) as SlidingWindowMaximumInput;
      if (!candidate || !Array.isArray(candidate.nums) || !candidate.nums.length || !candidate.nums.every(Number.isFinite) || !Number.isInteger(candidate.k) || candidate.k < 1 || candidate.k > candidate.nums.length) throw new Error();
      setInput(candidate);
      setExampleId(0);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError('Use JSON such as {"nums":[1,3,-1,-3,5,3,6,7],"k":3}.');
    }
  }

  return <main className="app-shell"><header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {run.frames.length}</div></header><section className="workspace"><aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={example.id === exampleId ? "active" : ""} key={example.id} onClick={() => load(example)} type="button">{example.id}</button>)}</div></div><div className="input-grid"><label>input JSON<textarea aria-label="input JSON" value={text} onChange={(event) => setText(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load window</button></div><div className="expected-output"><span>{exampleId ? `${examples.find((example) => example.id === exampleId)?.label} output` : "Current result"}</span><code>{JSON.stringify(frame.result.length ? frame.result : examples.find((example) => example.id === exampleId)?.output ?? [])}</code></div></aside><section className="flow-panel product-flow-panel"><div className="panel-heading"><h2>Decreasing Monotonic Deque</h2><span>k = {input.k}</span></div><div className="product-stage"><div className="product-numbers">{input.nums.map((value, index) => <div className={`product-number ${index === frame.index ? "is-current" : ""} ${frame.window && index >= frame.window[0] && index <= frame.window[1] ? "is-window" : ""}`} key={`${index}-${value}`}><span>nums[{index}]</span><strong>{value}</strong></div>)}</div><div className="product-phase"><span>window</span><strong>{frame.window ? `[${frame.window[0]}, ${frame.window[1]}]` : "not started"}</strong><p>{frame.detail}</p></div><div className="product-state-grid"><div className="product-state is-emphasized"><span>deque indices (front = max)</span><strong>{frame.deque.length ? `[${frame.deque.join(", ")}]` : "[]"}</strong><small>{frame.deque.map((index) => input.nums[index]).join("  ")}</small></div><div className="product-state is-result"><span>recorded maxima</span><strong>{frame.result.length ? `[${frame.result.join(", ")}]` : "[]"}</strong></div></div></div></section><aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={run.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside></section></main>;
}
