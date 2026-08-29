import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type MergeTwoListsInput } from "./data";
import { createMergeTwoListsDryRun } from "./dryRun";

export default function MergeTwoListsVisualizer({ onBack }: VisualizerProps) {
  const [exampleId, setExampleId] = useState(defaultExample.id);
  const [input, setInput] = useState<MergeTwoListsInput>(defaultExample.input);
  const [text, setText] = useState(JSON.stringify(defaultExample.input));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const run = useMemo(() => createMergeTwoListsDryRun(input.list1, input.list2), [input]);
  const frame = run.frames[Math.min(step, run.frames.length - 1)]!;
  const selectedExample = examples.find((example) => example.id === exampleId);

  useEffect(() => {
    if (!playing || step >= run.frames.length - 1) {
      if (step >= run.frames.length - 1) setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((value) => value + 1), 620);
    return () => window.clearTimeout(timer);
  }, [playing, run.frames.length, step]);

  function load(example: (typeof examples)[number]) {
    setExampleId(example.id); setInput(example.input); setText(JSON.stringify(example.input)); setStep(0); setPlaying(false); setError("");
  }
  function loadInput() {
    try {
      const candidate = JSON.parse(text) as MergeTwoListsInput;
      if (!candidate || !Array.isArray(candidate.list1) || !Array.isArray(candidate.list2) || !candidate.list1.every(Number.isFinite) || !candidate.list2.every(Number.isFinite) || !isSorted(candidate.list1) || !isSorted(candidate.list2)) throw new Error();
      setInput(candidate); setExampleId(0); setStep(0); setPlaying(false); setError("");
    } catch {
      setError('Use sorted lists, for example {"list1":[1,2,4],"list2":[1,3,4]}.');
    }
  }

  return <main className="app-shell"><header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {run.frames.length}</div></header><section className="workspace"><aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={example.id === exampleId ? "active" : ""} key={example.id} onClick={() => load(example)} type="button">{example.id}</button>)}</div></div><div className="input-grid"><label>input JSON<textarea aria-label="input JSON" value={text} onChange={(event) => setText(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load lists</button></div><div className="expected-output"><span>{selectedExample ? selectedExample.label + " output" : "Current result"}</span><code>{JSON.stringify(selectedExample?.output ?? frame.result)}</code></div></aside><section className="flow-panel merge-lists-flow-panel"><div className="panel-heading"><h2>Front-Node Merge</h2><span>merged = {frame.result.length}</span></div><div className="merge-lists-stage"><ListRow activeIndex={frame.leftIndex} label="list1" values={frame.list1} /><ListRow activeIndex={frame.rightIndex} label="list2" values={frame.list2} /><ListRow activeIndex={frame.result.length - 1} label="merged" tone="result" values={frame.result} /><div className="product-phase"><span>current operation</span><strong>{frame.phase}</strong><p>{frame.detail}</p></div></div></section><aside className="state-panel"><div className="state-sticky"><div className={"event-card " + frame.kind}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={run.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>front pointers</h3><div className="token-list"><span>list1 = {frame.list1[frame.leftIndex] ?? "None"}</span><span>list2 = {frame.list2[frame.rightIndex] ?? "None"}</span><span>cur = {frame.result[frame.result.length - 1] ?? "dummy"}</span></div></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside></section></main>;
}

function isSorted(values: number[]) { return values.every((value, index) => index === 0 || values[index - 1]! <= value); }
function ListRow({ activeIndex, label, tone, values }: { activeIndex: number; label: string; tone?: "result"; values: number[] }) {
  return <div className={"merge-list-row " + (tone === "result" ? "is-result" : "")}><span>{label}</span><div>{values.length ? values.map((value, index) => <div className={index === activeIndex ? "is-current" : ""} key={index}><strong>{value}</strong>{index < values.length - 1 ? <ArrowRight aria-hidden="true" size={15} /> : null}</div>) : <em>None</em>}</div></div>;
}
