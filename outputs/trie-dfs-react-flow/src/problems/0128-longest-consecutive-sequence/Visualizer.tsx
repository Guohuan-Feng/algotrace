import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../components/CodeTrace";
import { StepControls } from "../../components/StepControls";
import type { VisualizerProps } from "../../types";
import { codeLines, defaultExample, examples, title } from "./data";
import type { LongestConsecutiveExample } from "./data";
import { createLongestConsecutiveDryRun } from "./dryRun";

export function LongestConsecutiveVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [nums, setNums] = useState(defaultExample.nums);
  const [numsInput, setNumsInput] = useState(JSON.stringify(defaultExample.nums));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createLongestConsecutiveDryRun(nums), [nums]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)];
  const run = new Set(frame.currentRun);
  const skipped = new Set(frame.skipped);

  useEffect(() => {
    if (!playing) return;
    if (step >= dryRun.frames.length - 1) {
      setPlaying(false);
      return;
    }
    const id = window.setTimeout(() => setStep((current) => current + 1), 700);
    return () => window.clearTimeout(id);
  }, [dryRun.frames.length, playing, step]);

  function loadExample(example: LongestConsecutiveExample) {
    setSelectedExampleId(example.id);
    setNums(example.nums);
    setNumsInput(JSON.stringify(example.nums));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const parsed = JSON.parse(numsInput);
      if (!Array.isArray(parsed) || parsed.length > 18 || !parsed.every(Number.isInteger)) {
        setError("Use a JSON array of at most 18 integers.");
        return;
      }
      setSelectedExampleId(0);
      setNums(parsed);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError("Use valid JSON, for example [100,4,200,1,3,2].");
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div><button className="back-link compact" onClick={onBack}><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div>
        <div className="step-pill">Step {step + 1} / {dryRun.frames.length}</div>
      </header>
      <section className="workspace">
        <aside className="board-panel">
          <div className="example-switcher"><span>LeetCode examples</span><div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)}>{example.id}</button>)}</div></div>
          <div className="panel-heading"><h2>input</h2><span>unique = {frame.setValues.length}</span></div>
          <div className="input-grid"><label>nums JSON<textarea value={numsInput} onChange={(event) => setNumsInput(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput}><Upload size={16} />Load nums</button></div>
          <div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{selectedExample?.output ?? frame.res}</code></div>
        </aside>
        <section className="flow-panel sequence-flow-panel">
          <div className="panel-heading"><h2>num_set</h2><span>res = {frame.res}</span></div>
          <div className="sequence-stage">
            <div className="sequence-grid">
              {frame.setValues.length ? frame.setValues.map((value) => (
                <div className={["sequence-cell", run.has(value) ? "is-run" : "", skipped.has(value) ? "is-discarded" : "", frame.currentNum === value ? "is-current" : ""].filter(Boolean).join(" ")} key={value}>
                  <strong>{value}</strong>
                </div>
              )) : <p className="heap-empty">empty set</p>}
            </div>
          </div>
        </section>
        <aside className="state-panel">
          <div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.kind}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div>
          <div className="state-block"><h3>state</h3><div className="token-list"><span>current = {frame.currentNum ?? "none"}</span><span>run length = {frame.currentRun.length}</span><span>res = {frame.res}</span></div></div>
          <div className="state-block"><h3>current run</h3><div className="token-list">{frame.currentRun.length ? frame.currentRun.map((value) => <span key={value}>{value}</span>) : <em>empty</em>}</div></div>
          <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
        </aside>
      </section>
    </main>
  );
}
