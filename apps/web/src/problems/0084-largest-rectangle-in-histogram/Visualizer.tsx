import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type LargestRectangleInput } from "./data";
import { createLargestRectangleDryRun } from "./dryRun";

export default function LargestRectangleVisualizer({ onBack }: VisualizerProps) {
  const [exampleId, setExampleId] = useState(defaultExample.id);
  const [input, setInput] = useState<LargestRectangleInput>(defaultExample.input);
  const [text, setText] = useState(JSON.stringify(defaultExample.input));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const run = useMemo(() => createLargestRectangleDryRun(input.heights), [input]);
  const frame = run.frames[Math.min(step, run.frames.length - 1)]!;
  const maxHeight = Math.max(...input.heights, 1);

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
      const candidate = JSON.parse(text) as LargestRectangleInput;
      if (!Array.isArray(candidate.heights) || !candidate.heights.length || !candidate.heights.every((height) => Number.isInteger(height) && height >= 0)) throw new Error();
      setInput(candidate);
      setExampleId(0);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError('Use JSON such as {"heights":[2,1,5,6,2,3]}.');
    }
  }

  return <main className="app-shell"><header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {run.frames.length}</div></header><section className="workspace"><aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={example.id === exampleId ? "active" : ""} key={example.id} onClick={() => load(example)} type="button">{example.id}</button>)}</div></div><div className="input-grid"><label>input JSON<textarea aria-label="input JSON" value={text} onChange={(event) => setText(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load heights</button></div><div className="expected-output"><span>{exampleId ? `${examples.find((example) => example.id === exampleId)?.label} output` : "Current result"}</span><code>{frame.result ?? examples.find((example) => example.id === exampleId)?.output ?? "pending"}</code></div></aside><section className="flow-panel product-flow-panel"><div className="panel-heading"><h2>Increasing Index Stack</h2><span>max area = {frame.maxArea}</span></div><div className="product-stage"><div className="histogram-chart" aria-label="histogram">{input.heights.map((height, index) => <div className={`histogram-column ${index === frame.index ? "is-current" : ""} ${frame.range && index >= frame.range[0] && index <= frame.range[1] ? "is-range" : ""}`} key={`${index}-${height}`}><strong>{height}</strong><div className="histogram-bar" style={{ height: `${Math.max(20, (height / maxHeight) * 170)}px` }} /><span>{index}</span></div>)}</div><div className="product-phase"><span>pending indices</span><strong>{frame.stack.length ? `[${frame.stack.join(", ")}]` : "[]"}</strong><p>{frame.detail}</p></div><div className="product-state-grid"><div className="product-state is-emphasized"><span>settled rectangle</span><strong>{frame.area === null ? "-" : `${frame.height} x ${frame.width} = ${frame.area}`}</strong></div><div className="product-state is-result"><span>max_area</span><strong>{frame.maxArea}</strong></div></div></div></section><aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={run.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside></section></main>;
}
