import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type AddTwoNumbersInput } from "./data";
import { createAddTwoNumbersDryRun } from "./dryRun";

export default function AddTwoNumbersVisualizer({ onBack }: VisualizerProps) {
  const [exampleId, setExampleId] = useState(defaultExample.id);
  const [input, setInput] = useState<AddTwoNumbersInput>(defaultExample.input);
  const [text, setText] = useState(JSON.stringify(defaultExample.input));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const run = useMemo(() => createAddTwoNumbersDryRun(input.l1, input.l2), [input]);
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
      const candidate = JSON.parse(text) as AddTwoNumbersInput;
      if (!candidate || !Array.isArray(candidate.l1) || !Array.isArray(candidate.l2) || !candidate.l1.length || !candidate.l2.length || ![...candidate.l1, ...candidate.l2].every((value) => Number.isInteger(value) && value >= 0 && value <= 9)) throw new Error();
      setInput(candidate);
      setExampleId(0);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError('Use JSON such as {"l1":[2,4,3],"l2":[5,6,4]}.');
    }
  }

  return <main className="app-shell"><header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {run.frames.length}</div></header><section className="workspace"><aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={example.id === exampleId ? "active" : ""} key={example.id} onClick={() => load(example)} type="button">{example.id}</button>)}</div></div><div className="input-grid"><label>input JSON<textarea aria-label="input JSON" value={text} onChange={(event) => setText(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load lists</button></div><div className="expected-output"><span>{exampleId ? `${examples.find((example) => example.id === exampleId)?.label} output` : "Current result"}</span><code>{JSON.stringify(frame.result.length ? frame.result : examples.find((example) => example.id === exampleId)?.output ?? [])}</code></div></aside><section className="flow-panel list-flow-panel"><div className="panel-heading"><h2>Reverse-Order Digit Addition</h2><span>carry = {frame.carry}</span></div><div className="list-stage"><LinkedList label="l1" values={input.l1} activeIndex={frame.leftIndex} tone="green" /><LinkedList label="l2" values={input.l2} activeIndex={frame.rightIndex} tone="amber" /><LinkedList label="result" values={frame.result} activeIndex={frame.index} tone="dark" /></div></section><aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={run.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>addition state</h3><div className="token-list"><span>left = {frame.leftValue ?? "None"}</span><span>right = {frame.rightValue ?? "None"}</span><span>sum = {frame.sum ?? "-"}</span><span>digit = {frame.digit ?? "-"}</span><span>carry = {frame.carry}</span></div></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside></section></main>;
}

function LinkedList({ label, values, activeIndex, tone }: { label: string; values: number[]; activeIndex: number | null; tone: "green" | "amber" | "dark" }) {
  return <div className="list-run"><span>{label}</span><div className="linked-list">{values.length ? values.map((value, index) => <div className="list-node-wrap" key={`${label}-${value}-${index}`}><div className={["list-node", `tone-${tone}`, activeIndex === index ? "is-cur" : ""].join(" ")}><strong>{value}</strong><span>{index}</span></div>{index < values.length - 1 ? <div className="list-arrow" /> : null}</div>) : <div className="empty-list">None</div>}</div></div>;
}
