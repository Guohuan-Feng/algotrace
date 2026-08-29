import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type RemoveNthInput } from "./data";
import { createRemoveNthFromEndDryRun } from "./dryRun";

export default function RemoveNthFromEndVisualizer({ onBack }: VisualizerProps) {
  const [exampleId, setExampleId] = useState(defaultExample.id);
  const [input, setInput] = useState<RemoveNthInput>(defaultExample.input);
  const [text, setText] = useState(JSON.stringify(defaultExample.input));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const run = useMemo(() => createRemoveNthFromEndDryRun(input.head, input.n), [input]);
  const frame = run.frames[Math.min(step, run.frames.length - 1)]!;
  const selectedExample = examples.find((example) => example.id === exampleId);

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
      const candidate = JSON.parse(text) as RemoveNthInput;
      if (!candidate || !Array.isArray(candidate.head) || !candidate.head.length || candidate.head.length > 12 || !candidate.head.every(Number.isFinite) || !Number.isInteger(candidate.n) || candidate.n < 1 || candidate.n > candidate.head.length) throw new Error();
      setInput(candidate);
      setExampleId(0);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError('Use JSON such as {"head":[1,2,3,4,5],"n":2}.');
    }
  }

  const pointerLabel = (index: number | -1 | null) => index === -1 ? "dummy" : index === null ? "None" : "node " + frame.values[index];

  return <main className="app-shell"><header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {run.frames.length}</div></header><section className="workspace"><aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={example.id === exampleId ? "active" : ""} key={example.id} onClick={() => load(example)} type="button">{example.id}</button>)}</div></div><div className="input-grid"><label>input JSON<textarea aria-label="input JSON" value={text} onChange={(event) => setText(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load list</button></div><div className="expected-output"><span>{selectedExample ? selectedExample.label + " output" : "Current result"}</span><code>{JSON.stringify(frame.result)}</code></div></aside><section className="flow-panel remove-nth-flow-panel"><div className="panel-heading"><h2>Fixed-Gap Pointers</h2><span>remove n = {input.n}</span></div><div className="remove-stage"><div className="remove-chain"><div className={["remove-node", "is-dummy", frame.slowIndex === -1 ? "is-slow" : "", frame.fastIndex === -1 ? "is-fast" : ""].filter(Boolean).join(" ")}><strong>dummy</strong><span>{frame.slowIndex === -1 ? "slow" : frame.fastIndex === -1 ? "fast" : ""}</span></div>{frame.liveIndices.length ? <ArrowRight aria-hidden="true" size={22} /> : null}{frame.liveIndices.map((index, offset) => <div className="remove-link" key={index}><div className={["remove-node", frame.slowIndex === index ? "is-slow" : "", frame.fastIndex === index ? "is-fast" : ""].filter(Boolean).join(" ")}><strong>{frame.values[index]}</strong><span>{frame.slowIndex === index ? "slow" : frame.fastIndex === index ? "fast" : "node " + index}</span></div>{offset < frame.liveIndices.length - 1 ? <ArrowRight aria-hidden="true" size={22} /> : <ArrowRight aria-hidden="true" className="is-null" size={22} />}</div>)}</div>{frame.removedIndex !== null ? <div className="removed-node"><span>unlinked</span><strong>{frame.values[frame.removedIndex]}</strong><em>slow.next skips this node</em></div> : null}<div className="product-phase"><span>pointer gap</span><strong>fast = {pointerLabel(frame.fastIndex)} | slow = {pointerLabel(frame.slowIndex)}</strong><p>{frame.detail}</p></div></div></section><aside className="state-panel"><div className="state-sticky"><div className={"event-card " + frame.kind}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={run.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>pointers</h3><div className="token-list"><span>fast = {pointerLabel(frame.fastIndex)}</span><span>slow = {pointerLabel(frame.slowIndex)}</span><span>removed = {frame.removedIndex === null ? "-" : frame.values[frame.removedIndex]}</span></div></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside></section></main>;
}
