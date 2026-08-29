import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type MatchsticksToSquareInput } from "./data";
import { createMatchsticksToSquareDryRun } from "./dryRun";

export default function MatchsticksToSquareVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [input, setInput] = useState<MatchsticksToSquareInput>(defaultExample.input);
  const [sticksInput, setSticksInput] = useState(JSON.stringify(defaultExample.input.matchsticks));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createMatchsticksToSquareDryRun(input.matchsticks), [input]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)]!;
  const currentStick = frame.sticks[frame.index] ?? null;

  useEffect(() => { if (!playing || step >= dryRun.frames.length - 1) { if (step >= dryRun.frames.length - 1) setPlaying(false); return; } const timer = window.setTimeout(() => setStep((current) => current + 1), 570); return () => window.clearTimeout(timer); }, [dryRun.frames.length, playing, step]);
  function loadExample(example: (typeof examples)[number]) { setSelectedExampleId(example.id); setInput(example.input); setSticksInput(JSON.stringify(example.input.matchsticks)); setStep(0); setPlaying(false); setError(""); }
  function loadInput() { try { const matchsticks = JSON.parse(sticksInput) as number[]; if (!Array.isArray(matchsticks) || matchsticks.length < 1 || matchsticks.length > 12 || !matchsticks.every((value) => Number.isInteger(value) && value > 0 && value <= 30)) throw new Error(); setSelectedExampleId(0); setInput({ matchsticks }); setStep(0); setPlaying(false); setError(""); } catch { setError("Use 1 to 12 positive integer lengths, for example [1,1,2,2,2]."); } }

  return <main className="app-shell"><header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {dryRun.frames.length}</div></header><section className="workspace">
    <aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)} type="button">{example.id}</button>)}</div></div><div className="panel-heading"><h2>matchsticks</h2><span>{input.matchsticks.length} sticks</span></div><div className="matchstick-strip">{frame.sticks.map((stick, index) => <span className={[index === frame.index ? "is-current" : "", index < frame.index ? "is-consumed" : ""].filter(Boolean).join(" ")} key={`${stick}-${index}`}>{stick}</span>)}</div><div className="input-grid"><label>matchsticks JSON<textarea value={sticksInput} onChange={(event) => setSticksInput(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load sticks</button></div><div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{String(selectedExample?.output ?? frame.result ?? "pending")}</code></div></aside>
    <section className="flow-panel matchsticks-flow-panel"><div className="panel-heading"><h2>Four Side Assignments</h2><span>target = {frame.target ?? "-"}</span></div><div className="matchsticks-stage"><div className="matchstick-square">{frame.sideSticks.map((sticks, side) => <div className={["matchstick-side", `side-${side}`, frame.currentSide === side ? "is-current" : ""].filter(Boolean).join(" ")} key={side}><div>{sticks.length ? sticks.map((stick, index) => <span key={`${stick}-${index}`}>{stick}</span>) : <em>empty</em>}</div><strong>{frame.sides[side]} / {frame.target ?? "?"}</strong></div>)}<div className="square-core">{currentStick === null ? "done" : `stick ${currentStick}`}</div></div></div></section>
    <aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.kind}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>assignment state</h3><div className="token-list"><span>index = {frame.index}</span><span>length = {currentStick ?? "-"}</span><span>sides = [{frame.sides.join(", ")}]</span></div></div><div className="state-block"><h3>call stack</h3><div className="token-list">{frame.stack.length ? frame.stack.map((item, index) => <span key={`${item}-${index}`}>{item}</span>) : <em>empty</em>}</div></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside>
  </section></main>;
}
