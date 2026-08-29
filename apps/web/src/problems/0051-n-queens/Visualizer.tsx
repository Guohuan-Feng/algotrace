import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title } from "./data";
import { createNQueensDryRun } from "./dryRun";

export default function NQueensVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [n, setN] = useState(defaultExample.n);
  const [nInput, setNInput] = useState(String(defaultExample.n));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createNQueensDryRun(n), [n]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)]!;

  useEffect(() => { if (!playing || step >= dryRun.frames.length - 1) { if (step >= dryRun.frames.length - 1) setPlaying(false); return; } const timer = window.setTimeout(() => setStep((current) => current + 1), 480); return () => window.clearTimeout(timer); }, [dryRun.frames.length, playing, step]);
  function loadExample(example: (typeof examples)[number]) { setSelectedExampleId(example.id); setN(example.n); setNInput(String(example.n)); setStep(0); setPlaying(false); setError(""); }
  function loadInput() { const next = Number(nInput); if (!Number.isInteger(next) || next < 1 || next > 5) { setError("Use an integer n from 1 to 5 so every branch remains readable."); return; } setSelectedExampleId(0); setN(next); setStep(0); setPlaying(false); setError(""); }

  return <main className="app-shell"><header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {dryRun.frames.length}</div></header><section className="workspace">
    <aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)} type="button">{example.id}</button>)}</div></div><div className="panel-heading"><h2>n</h2><span>{n} x {n} board</span></div><div className="input-grid"><label>n<input className="text-input" value={nInput} onChange={(event) => setNInput(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load n</button></div><div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{JSON.stringify(selectedExample?.output ?? frame.result ?? "pending")}</code></div></aside>
    <section className="flow-panel queen-flow-panel"><div className="panel-heading"><h2>Row-by-Row Board</h2><span>solutions = {frame.solutions.length}</span></div><div className="queen-board-wrap"><div className="queen-board" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>{frame.board.flatMap((row, rowIndex) => row.map((value, colIndex) => { const current = frame.current?.[0] === rowIndex && frame.current?.[1] === colIndex; const blocked = frame.blocked?.[0] === rowIndex && frame.blocked?.[1] === colIndex; return <div className={["queen-cell", (rowIndex + colIndex) % 2 ? "dark" : "light", current ? "target" : "", blocked ? "blocked" : "", value === "Q" ? "has-queen" : ""].filter(Boolean).join(" ")} key={`${rowIndex}-${colIndex}`}><strong>{value === "Q" ? "Q" : ""}</strong><span>{rowIndex},{colIndex}</span></div>; }))}</div></div></section>
    <aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.kind}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>constraint sets</h3><div className="token-list"><span>{`cols = {${frame.cols.join(", ")}}`}</span><span>{`diag1 = {${frame.diag1.join(", ")}}`}</span><span>{`diag2 = {${frame.diag2.join(", ")}}`}</span></div></div><div className="state-block"><h3>call stack</h3><div className="token-list">{frame.stack.length ? frame.stack.map((item, index) => <span key={`${item}-${index}`}>{item}</span>) : <em>empty</em>}</div></div><div className="state-block"><h3>res</h3><div className="token-list words">{frame.solutions.length ? frame.solutions.map((solution, index) => <span key={`${solution.join("-")}-${index}`}>{solution.join(" / ")}</span>) : <em>[]</em>}</div></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside>
  </section></main>;
}
