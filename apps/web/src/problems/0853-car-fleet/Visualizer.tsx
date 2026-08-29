import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type CarFleetInput } from "./data";
import { createCarFleetDryRun } from "./dryRun";

const formatTime = (value: number) => Number.isInteger(value) ? String(value) : value.toFixed(2);

export default function CarFleetVisualizer({ onBack }: VisualizerProps) {
  const [exampleId, setExampleId] = useState(defaultExample.id);
  const [input, setInput] = useState<CarFleetInput>(defaultExample.input);
  const [text, setText] = useState(JSON.stringify(defaultExample.input));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const run = useMemo(() => createCarFleetDryRun(input.target, input.position, input.speed), [input]);
  const frame = run.frames[Math.min(step, run.frames.length - 1)]!;

  useEffect(() => {
    if (!playing || step >= run.frames.length - 1) {
      if (step >= run.frames.length - 1) setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((value) => value + 1), 620);
    return () => window.clearTimeout(timer);
  }, [playing, run.frames.length, step]);

  function load(example: (typeof examples)[number]) {
    setExampleId(example.id);
    setInput(example.input);
    setText(JSON.stringify(example.input));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const candidate = JSON.parse(text) as CarFleetInput;
      if (!candidate || !Number.isFinite(candidate.target) || candidate.target <= 0 || !Array.isArray(candidate.position) || !Array.isArray(candidate.speed) || !candidate.position.length || candidate.position.length !== candidate.speed.length || !candidate.position.every((value) => Number.isFinite(value) && value >= 0 && value < candidate.target) || !candidate.speed.every((value) => Number.isFinite(value) && value > 0)) throw new Error();
      setInput(candidate);
      setExampleId(0);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError('Use JSON such as {"target":12,"position":[10,8,0,5,3],"speed":[2,4,1,1,3]}.');
    }
  }

  return <main className="app-shell"><header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {run.frames.length}</div></header><section className="workspace"><aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={example.id === exampleId ? "active" : ""} key={example.id} onClick={() => load(example)} type="button">{example.id}</button>)}</div></div><div className="input-grid"><label>input JSON<textarea aria-label="input JSON" value={text} onChange={(event) => setText(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load cars</button></div><div className="expected-output"><span>{exampleId ? `${examples.find((example) => example.id === exampleId)?.label} output` : "Current result"}</span><code>{frame.result ?? examples.find((example) => example.id === exampleId)?.output ?? "pending"}</code></div></aside><section className="flow-panel product-flow-panel"><div className="panel-heading"><h2>Arrival-Time Fleet Stack</h2><span>target = {input.target}</span></div><div className="product-stage"><div className="fleet-road" aria-label="road to target"><span className="fleet-origin">0</span><span className="fleet-target">target {input.target}</span>{frame.cars.map((car) => <div className={`fleet-car ${car.index === frame.carIndex ? "is-current" : ""}`} key={car.index} style={{ left: `${(car.position / input.target) * 100}%` }}><strong>#{car.index + 1}</strong><small>p {car.position}</small><small>v {car.speed}</small></div>)}</div><div className="product-phase"><span>current arrival time</span><strong>{frame.arrival === null ? "-" : formatTime(frame.arrival)}</strong><p>{frame.detail}</p></div><div className="product-state-grid"><div className="product-state is-emphasized"><span>fleet arrival times</span><strong>{frame.fleetArrivals.length ? `[${frame.fleetArrivals.map(formatTime).join(", ")}]` : "[]"}</strong></div><div className="product-state is-result"><span>fleets</span><strong>{frame.fleetArrivals.length}</strong></div></div></div></section><aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={run.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside></section></main>;
}
