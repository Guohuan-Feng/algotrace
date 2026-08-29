import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type MajorityElementInput } from "./data";
import { createMajorityElementDryRun } from "./dryRun";

export default function MajorityElementVisualizer({ onBack }: VisualizerProps) {
  const [exampleId, setExampleId] = useState(defaultExample.id);
  const [input, setInput] = useState<MajorityElementInput>(defaultExample.input);
  const [text, setText] = useState(JSON.stringify(defaultExample.input));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const run = useMemo(() => createMajorityElementDryRun(input.nums), [input]);
  const frame = run.frames[Math.min(step, run.frames.length - 1)]!;
  const selected = examples.find((example) => example.id === exampleId);

  useEffect(() => {
    if (!playing || step >= run.frames.length - 1) {
      if (step >= run.frames.length - 1) setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((current) => current + 1), 650);
    return () => window.clearTimeout(timer);
  }, [playing, run.frames.length, step]);

  const load = (example: typeof defaultExample) => {
    setExampleId(example.id);
    setInput(example.input);
    setText(JSON.stringify(example.input));
    setStep(0);
    setPlaying(false);
    setError("");
  };

  const loadInput = () => {
    try {
      const parsed: unknown = JSON.parse(text);
      if (!valid(parsed)) throw new Error();
      setExampleId(0);
      setInput(parsed);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError('Use {"nums":[2,2,1,1,1,2,2]}; a majority element must exist.');
    }
  };

  return <main className="app-shell"><header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {run.frames.length}</div></header><section className="workspace"><aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={example.id === exampleId ? "active" : ""} key={example.id} onClick={() => load(example)} type="button">{example.id}</button>)}</div></div><div className="input-grid"><label>input JSON<textarea aria-label="majority element input JSON" value={text} onChange={(event) => setText(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load input</button></div><div className="expected-output"><span>{selected ? `${selected.label} output` : "Current result"}</span><code>{frame.result ?? "pending"}</code></div></aside><section className="flow-panel majority-flow-panel"><div className="panel-heading"><h2>Boyer-Moore voting</h2><span>processed {frame.processed} / {input.nums.length}</span></div><div className="majority-stage"><div className="majority-array">{input.nums.map((value, index) => <div className={["majority-cell", index === frame.index ? "is-current" : "", index < frame.processed ? "is-processed" : "", index < frame.processed && value === frame.candidate ? "is-candidate" : ""].filter(Boolean).join(" ")} key={index}><span>i = {index}</span><strong>{value}</strong><em>{index === frame.index ? "current" : index < frame.processed ? "counted" : "waiting"}</em></div>)}</div><div className="majority-readout"><section className="majority-counter is-candidate"><span>candidate</span><strong>{frame.candidate ?? "-"}</strong><p>{frame.candidate === null ? "not chosen" : "surviving value"}</p></section><section className="majority-counter is-count"><span>count</span><strong>{frame.count}</strong><p>{frame.count === 0 ? "ready to replace" : "uncancelled votes"}</p></section></div><div className="product-phase"><span>current operation</span><strong>{frame.title}</strong><p>{frame.detail}</p></div></div></section><aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={run.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>voting state</h3><div className="token-list"><span>candidate = {frame.candidate ?? "None"}</span><span>count = {frame.count}</span><span>num = {frame.index === null ? "-" : input.nums[frame.index]}</span></div></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside></section></main>;
}

function valid(value: unknown): value is MajorityElementInput {
  return typeof value === "object" && value !== null && "nums" in value && Array.isArray(value.nums) && value.nums.length > 0 && value.nums.length <= 20 && value.nums.every((item) => typeof item === "number" && Number.isInteger(item)) && hasMajority(value.nums);
}

function hasMajority(nums: number[]) {
  const counts = new Map<number, number>();
  nums.forEach((num) => counts.set(num, (counts.get(num) ?? 0) + 1));
  return [...counts.values()].some((count) => count > nums.length / 2);
}
