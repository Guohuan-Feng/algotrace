import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title } from "./data";
import type { OpenLockExample } from "./data";
import { createOpenLockDryRun } from "./dryRun";

export default function OpenLockVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [deadends, setDeadends] = useState(defaultExample.deadends);
  const [target, setTarget] = useState(defaultExample.target);
  const [deadendsInput, setDeadendsInput] = useState(JSON.stringify(defaultExample.deadends));
  const [targetInput, setTargetInput] = useState(defaultExample.target);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createOpenLockDryRun(deadends, target), [deadends, target]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)];
  const displayLock = frame.current ?? "0000";

  useEffect(() => {
    if (!playing) return;
    if (step >= dryRun.frames.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((current) => current + 1), 500);
    return () => window.clearTimeout(timer);
  }, [dryRun.frames.length, playing, step]);

  function loadExample(example: OpenLockExample) {
    setSelectedExampleId(example.id);
    setDeadends(example.deadends);
    setTarget(example.target);
    setDeadendsInput(JSON.stringify(example.deadends));
    setTargetInput(example.target);
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const parsedDeadends = JSON.parse(deadendsInput);
      if (!Array.isArray(parsedDeadends) || parsedDeadends.length > 40 || !parsedDeadends.every(isLock) || !isLock(targetInput)) {
        setError("Use up to 40 four-digit strings, for example [\"0201\",\"0101\"], and a four-digit target.");
        return;
      }
      setSelectedExampleId(0);
      setDeadends(parsedDeadends);
      setTarget(targetInput);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError('Use valid JSON, for example ["0201","0101"].');
    }
  }

  return <main className="app-shell">
    <header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {dryRun.frames.length}</div></header>
    <section className="workspace">
      <aside className="board-panel"><div className="example-switcher"><span>LeetCode examples</span><div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)} type="button">{example.id}</button>)}</div></div><div className="panel-heading"><h2>input</h2><span>4-digit lock</span></div><div className="input-grid"><label>deadends JSON<textarea value={deadendsInput} onChange={(event) => setDeadendsInput(event.target.value)} /></label><label>target<input value={targetInput} onChange={(event) => setTargetInput(event.target.value)} maxLength={4} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load lock</button></div><div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{String(selectedExample?.output ?? frame.result ?? "pending")}</code></div></aside>
      <section className="flow-panel lock-flow-panel"><div className="panel-heading"><h2>Level-order BFS</h2><span>steps: {frame.steps}</span></div><div className="lock-stage"><div className="lock-wheels">{displayLock.split("").map((digit, index) => <div className={["lock-wheel", frame.wheelIndex === index ? "is-active" : ""].filter(Boolean).join(" ")} key={index}><span>{(Number(digit) + 1) % 10}</span><strong>{digit}</strong><span>{(Number(digit) + 9) % 10}</span></div>)}</div><div className="lock-readout"><span>current: <strong>{frame.current ?? "none"}</strong></span><span>target: <strong>{target}</strong></span>{frame.neighbor ? <span>neighbor: <strong>{frame.neighbor}</strong></span> : null}</div></div></section>
      <aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">level {frame.steps}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>queue</h3><div className="token-list">{frame.queue.length ? frame.queue.map((lock, index) => <span key={`${lock}-${index}`}>{lock}</span>) : <em>empty</em>}</div></div><div className="state-block"><h3>visited ({frame.visited.length})</h3><div className="token-list">{frame.visited.slice(-36).map((lock) => <span key={lock}>{lock}</span>)}</div></div><div className="state-block"><h3>deadends ({frame.deadends.length})</h3><div className="token-list">{frame.deadends.map((lock) => <span key={lock}>{lock}</span>)}</div></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside>
    </section>
  </main>;
}

function isLock(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}$/.test(value);
}
