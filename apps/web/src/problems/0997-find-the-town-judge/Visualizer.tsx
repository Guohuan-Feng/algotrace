import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type FindTownJudgeInput } from "./data";
import { createFindTownJudgeDryRun } from "./dryRun";

export default function FindTownJudgeVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [input, setInput] = useState<FindTownJudgeInput>(defaultExample.input);
  const [nInput, setNInput] = useState(String(defaultExample.input.n));
  const [trustInput, setTrustInput] = useState(JSON.stringify(defaultExample.input.trust));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createFindTownJudgeDryRun(input.n, input.trust), [input]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)]!;

  useEffect(() => { if (!playing || step >= dryRun.frames.length - 1) { if (step >= dryRun.frames.length - 1) setPlaying(false); return; } const timer = window.setTimeout(() => setStep((current) => current + 1), 650); return () => window.clearTimeout(timer); }, [dryRun.frames.length, playing, step]);
  function loadExample(example: (typeof examples)[number]) { setSelectedExampleId(example.id); setInput(example.input); setNInput(String(example.input.n)); setTrustInput(JSON.stringify(example.input.trust)); setStep(0); setPlaying(false); setError(""); }
  function loadInput() { try { const n = Number(nInput); const trust = JSON.parse(trustInput) as number[][]; if (!Number.isInteger(n) || n < 1 || n > 10 || !Array.isArray(trust) || trust.length > 24 || !trust.every((pair) => Array.isArray(pair) && pair.length === 2 && pair.every((person) => Number.isInteger(person) && person >= 1 && person <= n))) throw new Error(); setSelectedExampleId(0); setInput({ n, trust }); setStep(0); setPlaying(false); setError(""); } catch { setError("Use n 1-10 and trust pairs such as [[1,3],[2,3]]."); } }

  return <main className="app-shell"><header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {dryRun.frames.length}</div></header><section className="workspace">
    <aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)} type="button">{example.id}</button>)}</div></div><div className="panel-heading"><h2>input</h2><span>n = {input.n}</span></div><div className="input-grid"><label>n<input value={nInput} onChange={(event) => setNInput(event.target.value)} /></label><label>trust JSON<textarea value={trustInput} onChange={(event) => setTrustInput(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load town</button></div><div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{String(selectedExample?.output ?? frame.result ?? "pending")}</code></div></aside>
    <section className="flow-panel judge-flow-panel"><div className="panel-heading"><h2>In/Out Degree Test</h2><span>{frame.candidate ? `checking ${frame.candidate}` : "build degree arrays"}</span></div><div className="judge-stage"><div className="judge-people">{Array.from({ length: frame.n }, (_, offset) => { const person = offset + 1; const judge = frame.indegree[person] === frame.n - 1 && frame.outdegree[person] === 0; return <div className={["judge-person", frame.candidate === person ? "is-current" : "", judge ? "is-judge" : ""].filter(Boolean).join(" ")} key={person}><strong>{person}</strong><span>in {frame.indegree[person]}</span><span>out {frame.outdegree[person]}</span></div>; })}</div><div className="trust-ledger"><h3>trust edges</h3><div>{frame.trust.length ? frame.trust.map(([from, to], index) => <span className={frame.currentTrust?.[0] === from && frame.currentTrust?.[1] === to ? "is-active" : ""} key={`${from}-${to}-${index}`}>{from} -&gt; {to}</span>) : <em>no trust edges</em>}</div></div></div></section>
    <aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.kind}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>indegree</h3><pre className="matrix-state">{JSON.stringify(frame.indegree)}</pre></div><div className="state-block"><h3>outdegree</h3><pre className="matrix-state">{JSON.stringify(frame.outdegree)}</pre></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside>
  </section></main>;
}
