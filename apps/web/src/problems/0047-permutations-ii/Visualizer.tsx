import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type PermutationsIiInput } from "./data";
import { createPermutationsIiDryRun } from "./dryRun";

export default function PermutationsIiVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [input, setInput] = useState<PermutationsIiInput>(defaultExample.input);
  const [numsInput, setNumsInput] = useState(JSON.stringify(defaultExample.input.nums));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createPermutationsIiDryRun(input.nums), [input]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)]!;

  useEffect(() => { if (!playing || step >= dryRun.frames.length - 1) { if (step >= dryRun.frames.length - 1) setPlaying(false); return; } const timer = window.setTimeout(() => setStep((current) => current + 1), 540); return () => window.clearTimeout(timer); }, [dryRun.frames.length, playing, step]);
  function loadExample(example: (typeof examples)[number]) { setSelectedExampleId(example.id); setInput(example.input); setNumsInput(JSON.stringify(example.input.nums)); setStep(0); setPlaying(false); setError(""); }
  function loadInput() { try { const nums = JSON.parse(numsInput) as number[]; if (!Array.isArray(nums) || nums.length < 1 || nums.length > 6 || !nums.every(Number.isInteger)) throw new Error(); setSelectedExampleId(0); setInput({ nums }); setStep(0); setPlaying(false); setError(""); } catch { setError("Use a JSON array of 1 to 6 integers, for example [1,1,2]."); } }

  return <main className="app-shell"><header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {dryRun.frames.length}</div></header><section className="workspace">
    <aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)} type="button">{example.id}</button>)}</div></div><div className="panel-heading"><h2>nums</h2><span>sorted in line 3</span></div><div className="input-grid"><label>nums JSON<textarea value={numsInput} onChange={(event) => setNumsInput(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load nums</button></div><div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{JSON.stringify(selectedExample?.output ?? frame.result ?? "pending")}</code></div></aside>
    <section className="flow-panel permutation-ii-flow-panel"><div className="panel-heading"><h2>Sorted Index Choices</h2><span>path = [{frame.path.join(", ")}]</span></div><div className="permutation-ii-stage"><div className="permutation-index-strip">{frame.nums.map((value, index) => <div className={[frame.used[index] ? "is-used" : "", frame.currentIndex === index ? "is-current" : "", frame.skippedIndex === index ? "is-skipped" : ""].filter(Boolean).join(" ")} key={`${value}-${index}`}><strong>{value}</strong><span>i = {index}</span><em>used = {String(frame.used[index])}</em></div>)}</div><div className="partition-path permutation-path"><h3>path</h3><div>{frame.path.length ? frame.path.map((value, index) => <span key={`${value}-${index}`}>{value}</span>) : <em>[]</em>}</div></div><div className="permutation-results"><h3>res</h3><div>{frame.results.length ? frame.results.map((result, index) => <span key={`${result.join("-")}-${index}`}>[{result.join(", ")}]</span>) : <em>none yet</em>}</div></div></div></section>
    <aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.kind}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>current state</h3><div className="token-list"><span>nums = [{frame.nums.join(", ")}]</span><span>used = [{frame.used.map(String).join(", ")}]</span><span>i = {frame.currentIndex ?? "-"}</span></div></div><div className="state-block"><h3>call stack</h3><div className="token-list">{frame.stack.length ? frame.stack.map((item, index) => <span key={`${item}-${index}`}>{item}</span>) : <em>empty</em>}</div></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside>
  </section></main>;
}
