import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type ReverseWordsInput } from "./data";
import { createReverseWordsDryRun } from "./dryRun";

export default function ReverseWordsVisualizer({ onBack }: VisualizerProps) {
  const [exampleId, setExampleId] = useState(defaultExample.id);
  const [input, setInput] = useState<ReverseWordsInput>(defaultExample.input);
  const [text, setText] = useState(JSON.stringify(defaultExample.input));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const run = useMemo(() => createReverseWordsDryRun(input.s), [input.s]);
  const frame = run.frames[Math.min(step, run.frames.length - 1)]!;
  const selected = examples.find((example) => example.id === exampleId);
  useEffect(() => { if (!playing || step >= run.frames.length - 1) { if (step >= run.frames.length - 1) setPlaying(false); return; } const timer = window.setTimeout(() => setStep((current) => current + 1), 650); return () => window.clearTimeout(timer); }, [playing, run.frames.length, step]);
  const load = (example: typeof defaultExample) => { setExampleId(example.id); setInput(example.input); setText(JSON.stringify(example.input)); setStep(0); setPlaying(false); setError(""); };
  const loadInput = () => { try { const parsed: unknown = JSON.parse(text); if (typeof parsed !== "object" || parsed === null || !("s" in parsed) || typeof parsed.s !== "string" || parsed.s.length > 100) throw new Error(); setExampleId(0); setInput(parsed as ReverseWordsInput); setStep(0); setPlaying(false); setError(""); } catch { setError('Use JSON such as {"s":"the sky is blue"}.'); } };

  return <main className="app-shell"><header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {run.frames.length}</div></header><section className="workspace"><aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={example.id === exampleId ? "active" : ""} key={example.id} onClick={() => load(example)} type="button">{example.id}</button>)}</div></div><div className="input-grid"><label>input JSON<textarea aria-label="reverse words input JSON" value={text} onChange={(event) => setText(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load string</button></div><div className="expected-output"><span>{selected ? `${selected.label} output` : "Current output"}</span><code>{frame.result ?? "pending"}</code></div></aside><section className="flow-panel product-flow-panel"><div className="panel-heading"><h2>Whitespace-normalized word reversal</h2><span>{frame.words.length} word{frame.words.length === 1 ? "" : "s"}</span></div><div className="product-stage"><div className="product-phase"><span>original string</span><strong>{JSON.stringify(input.s)}</strong><p>Repeated whitespace becomes a single word boundary in the next frame.</p></div><div className="product-numbers">{frame.words.length ? frame.words.map((word, index) => <div className="product-number" key={`${word}-${index}`}><span>word {index}</span><strong>{word}</strong></div>) : <p className="heap-empty">words = []</p>}</div><div className="product-state-grid"><div className="product-state is-emphasized"><span>words</span><strong>{JSON.stringify(frame.words)}</strong></div><div className="product-state is-result"><span>joined result</span><strong>{frame.result ?? "pending"}</strong></div></div></div></section><aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={run.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>variables</h3><div className="token-list"><span>words = {JSON.stringify(frame.words)}</span><span>result = {frame.result ?? "pending"}</span></div></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside></section></main>;
}
