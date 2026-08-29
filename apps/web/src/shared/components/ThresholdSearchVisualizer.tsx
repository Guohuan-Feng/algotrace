import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "./CodeTrace";
import { StepControls } from "./StepControls";
import type { FrameKind, VisualizerProps } from "../types";

export type ThresholdFrame = { kind: FrameKind; phase: string; title: string; detail: string; activeLines: number[]; left: number; right: number; mid: number | null; verdict: string; result: number | null };
type Example<Input> = { id: number; label: string; input: Input; output: number };
type Props<Input, Frame extends ThresholdFrame> = VisualizerProps & { title: string; examples: Example<Input>[]; defaultExample: Example<Input>; codeLines: string[]; inputToText: (input: Input) => string; parseInput: (value: string) => Input; createRun: (input: Input) => { frames: Frame[] }; candidateLimit: (input: Input) => number; inputSummary: (input: Input) => string; };

export function ThresholdSearchVisualizer<Input, Frame extends ThresholdFrame>({ onBack, title, examples, defaultExample, codeLines, inputToText, parseInput, createRun, candidateLimit, inputSummary }: Props<Input, Frame>) {
  const [selectedExampleId, setSelectedExampleId] = useState(defaultExample.id);
  const [input, setInput] = useState(defaultExample.input);
  const [inputText, setInputText] = useState(inputToText(defaultExample.input));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const run = useMemo(() => createRun(input), [createRun, input]);
  const frame = run.frames[Math.min(step, run.frames.length - 1)]!;
  const example = examples.find((item) => item.id === selectedExampleId);
  const candidates = Array.from({ length: candidateLimit(input) + 1 }, (_, index) => index).filter((value) => value > 0);
  useEffect(() => { if (!playing || step >= run.frames.length - 1) { if (step >= run.frames.length - 1) setPlaying(false); return; } const timer = window.setTimeout(() => setStep((current) => current + 1), 620); return () => window.clearTimeout(timer); }, [playing, run.frames.length, step]);
  function loadExample(next: Example<Input>) { setSelectedExampleId(next.id); setInput(next.input); setInputText(inputToText(next.input)); setStep(0); setPlaying(false); setError(""); }
  function loadInput() { try { setInput(parseInput(inputText)); setSelectedExampleId(0); setStep(0); setPlaying(false); setError(""); } catch { setError("Use the JSON format shown by the selected example."); } }
  return <main className="app-shell"><header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {run.frames.length}</div></header><section className="workspace"><aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((item) => <button className={selectedExampleId === item.id ? "active" : ""} key={item.id} onClick={() => loadExample(item)} type="button">{item.id}</button>)}</div></div><div className="panel-heading"><h2>input</h2><span>{inputSummary(input)}</span></div><div className="input-grid"><label>input JSON<textarea aria-label="input JSON" value={inputText} onChange={(event) => setInputText(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load input</button></div><div className="expected-output"><span>{example ? `${example.label} output` : "Current result"}</span><code>{example?.output ?? frame.result ?? "pending"}</code></div></aside><section className="flow-panel binary-flow-panel"><div className="panel-heading"><h2>Feasibility Boundary</h2><span>{frame.verdict}</span></div><div className="binary-stage"><div className="binary-array">{candidates.map((value) => <div className={["binary-cell", value >= frame.left && value <= frame.right ? "in-window" : "is-discarded", value === frame.left ? "is-left" : "", value === frame.mid ? "is-mid" : "", value === frame.right ? "is-right" : "", frame.result === value ? "is-found" : ""].filter(Boolean).join(" ")} key={value}><strong>{value}</strong><span>{value === frame.left ? "left" : value === frame.mid ? "mid" : value === frame.right ? "right" : ""}</span></div>)}</div></div></section><aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={run.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>binary-search boundary</h3><div className="token-list"><span>left = {frame.left}</span><span>mid = {frame.mid ?? "-"}</span><span>right = {frame.right}</span><span>return = {frame.result ?? "pending"}</span></div></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside></section></main>;
}
