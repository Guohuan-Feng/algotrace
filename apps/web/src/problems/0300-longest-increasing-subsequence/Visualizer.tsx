import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title } from "./data";
import type { LisExample } from "./data";
import { createLisDryRun } from "./dryRun";

export default function LongestIncreasingSubsequenceVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [nums, setNums] = useState(defaultExample.nums);
  const [numsInput, setNumsInput] = useState(JSON.stringify(defaultExample.nums));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createLisDryRun(nums), [nums]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)];

  useEffect(() => {
    if (!playing) return;
    if (step >= dryRun.frames.length - 1) { setPlaying(false); return; }
    const id = window.setTimeout(() => setStep((current) => current + 1), 650);
    return () => window.clearTimeout(id);
  }, [dryRun.frames.length, playing, step]);

  function loadExample(example: LisExample) {
    setSelectedExampleId(example.id); setNums(example.nums); setNumsInput(JSON.stringify(example.nums)); setStep(0); setPlaying(false); setError("");
  }

  function loadInput() {
    try {
      const parsed = JSON.parse(numsInput);
      if (!Array.isArray(parsed) || parsed.length < 1 || parsed.length > 12 || !parsed.every(Number.isInteger)) { setError("Use a JSON array of 1 to 12 integers."); return; }
      setSelectedExampleId(0); setNums(parsed); setStep(0); setPlaying(false); setError("");
    } catch { setError("Use valid JSON, for example [10,9,2,5,3,7,101,18]."); }
  }

  return (
    <main className="app-shell">
      <header className="topbar"><div><button className="back-link compact" onClick={onBack}><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {dryRun.frames.length}</div></header>
      <section className="workspace">
        <aside className="board-panel">
          <div className="example-switcher"><span>LeetCode examples</span><div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)}>{example.id}</button>)}</div></div>
          <div className="panel-heading"><h2>input</h2><span>n = {nums.length}</span></div>
          <div className="input-grid"><label>nums JSON<textarea value={numsInput} onChange={(event) => setNumsInput(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput}><Upload size={16} />Load nums</button></div>
          <div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{selectedExample?.output ?? frame.result ?? "pending"}</code></div>
        </aside>
        <section className="flow-panel sequence-flow-panel"><div className="panel-heading"><h2>LIS DP</h2><span>max dp: {Math.max(0, ...frame.dp)}</span></div><div className="sequence-stage"><div className="dp-strip">{frame.nums.map((value, index) => <div className={["dp-card", frame.i === index ? "is-current" : "", frame.j === index ? "is-previous" : ""].filter(Boolean).join(" ")} key={index}><strong>{value}</strong><span>i={index}</span><em>dp={frame.dp[index]}</em></div>)}</div></div></section>
        <aside className="state-panel">
          <div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.kind}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div>
          <div className="state-block"><h3>state</h3><div className="token-list"><span>i = {frame.i ?? "none"}</span><span>j = {frame.j ?? "none"}</span><span>max dp = {Math.max(0, ...frame.dp)}</span></div></div>
          <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
        </aside>
      </section>
    </main>
  );
}
