import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type PalindromePartitioningInput } from "./data";
import { createPalindromePartitioningDryRun } from "./dryRun";

export default function PalindromePartitioningVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [input, setInput] = useState<PalindromePartitioningInput>(defaultExample.input);
  const [textInput, setTextInput] = useState(defaultExample.input.s);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createPalindromePartitioningDryRun(input.s), [input]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)]!;
  const candidateEnd = frame.end ?? -1;

  useEffect(() => { if (!playing || step >= dryRun.frames.length - 1) { if (step >= dryRun.frames.length - 1) setPlaying(false); return; } const timer = window.setTimeout(() => setStep((current) => current + 1), 580); return () => window.clearTimeout(timer); }, [dryRun.frames.length, playing, step]);
  function loadExample(example: (typeof examples)[number]) { setSelectedExampleId(example.id); setInput(example.input); setTextInput(example.input.s); setStep(0); setPlaying(false); setError(""); }
  function loadInput() { if (!/^[a-z]{1,9}$/.test(textInput)) { setError("Use 1 to 9 lowercase English letters, for example aab."); return; } setSelectedExampleId(0); setInput({ s: textInput }); setStep(0); setPlaying(false); setError(""); }

  return <main className="app-shell"><header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {dryRun.frames.length}</div></header><section className="workspace">
    <aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)} type="button">{example.id}</button>)}</div></div><div className="panel-heading"><h2>s</h2><span>len = {input.s.length}</span></div><div className="input-grid"><label>s<input className="text-input" value={textInput} onChange={(event) => setTextInput(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load string</button></div><div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{JSON.stringify(selectedExample?.output ?? frame.result ?? "pending")}</code></div></aside>
    <section className="flow-panel palindrome-flow-panel"><div className="panel-heading"><h2>Substring Decision Path</h2><span>start = {frame.start}</span></div><div className="palindrome-stage"><div className="palindrome-ruler">{[...frame.text].map((letter, index) => <div className={[index >= frame.start && index <= candidateEnd ? "is-candidate" : "", index === frame.start ? "is-start" : ""].filter(Boolean).join(" ")} key={`${letter}-${index}`}><strong>{letter}</strong><span>{index}</span></div>)}</div><div className="partition-path"><h3>path</h3><div>{frame.path.length ? frame.path.map((segment, index) => <span key={`${segment}-${index}`}>{segment}</span>) : <em>[]</em>}</div></div><div className="candidate-card"><span>candidate</span><strong>{frame.candidate ? JSON.stringify(frame.candidate) : "-"}</strong></div><div className="partition-results"><h3>found partitions</h3>{frame.results.length ? frame.results.map((result, index) => <span key={`${result.join("-")}-${index}`}>[{result.map((segment) => JSON.stringify(segment)).join(", ")}]</span>) : <em>none yet</em>}</div></div></section>
    <aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.kind}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>current state</h3><div className="token-list"><span>start = {frame.start}</span><span>end = {frame.end ?? "-"}</span><span>path = [{frame.path.join(", ")}]</span></div></div><div className="state-block"><h3>call stack</h3><div className="token-list">{frame.stack.length ? frame.stack.map((item, index) => <span key={`${item}-${index}`}>{item}</span>) : <em>empty</em>}</div></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside>
  </section></main>;
}
