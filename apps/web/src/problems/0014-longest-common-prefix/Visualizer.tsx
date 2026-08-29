import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type LongestCommonPrefixInput } from "./data";
import { createLongestCommonPrefixDryRun } from "./dryRun";

export default function LongestCommonPrefixVisualizer({ onBack }: VisualizerProps) {
  const [exampleId, setExampleId] = useState(defaultExample.id);
  const [input, setInput] = useState<LongestCommonPrefixInput>(defaultExample.input);
  const [text, setText] = useState(JSON.stringify(defaultExample.input));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const run = useMemo(() => createLongestCommonPrefixDryRun(input.strs), [input]);
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
      const candidate = JSON.parse(text) as LongestCommonPrefixInput;
      if (!candidate || !Array.isArray(candidate.strs) || !candidate.strs.every((value) => typeof value === "string")) throw new Error();
      setInput(candidate);
      setExampleId(0);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError('Use JSON such as {"strs":["flower","flow","flight"]}.');
    }
  }

  return <main className="app-shell"><header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {run.frames.length}</div></header><section className="workspace"><aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={example.id === exampleId ? "active" : ""} key={example.id} onClick={() => load(example)} type="button">{example.id}</button>)}</div></div><div className="input-grid"><label>input JSON<textarea aria-label="input JSON" value={text} onChange={(event) => setText(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load strings</button></div><div className="expected-output"><span>{selectedExample ? selectedExample.label + " output" : "Current result"}</span><code>{JSON.stringify(frame.result ?? selectedExample?.output ?? "pending")}</code></div></aside><section className="flow-panel prefix-flow-panel"><div className="panel-heading"><h2>Prefix Shrinking</h2><span>candidate = {JSON.stringify(frame.prefix)}</span></div><div className="prefix-stage"><div className="prefix-candidate"><span>current prefix</span><strong>{frame.prefix || '""'}</strong></div><div className="prefix-word-list">{frame.words.map((word, index) => <div className={["prefix-word", frame.wordIndex === index ? "is-current" : ""].filter(Boolean).join(" ")} key={index}><span>strs[{index}]</span><strong>{word || '""'}</strong><em>{word.startsWith(frame.prefix) ? "matches" : "needs shrink"}</em></div>)}</div><div className="product-phase"><span>comparison</span><strong>{frame.wordIndex === null ? "complete" : "checking strs[" + frame.wordIndex + "]"}</strong><p>{frame.detail}</p></div></div></section><aside className="state-panel"><div className="state-sticky"><div className={"event-card " + frame.kind}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={run.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>loop state</h3><div className="token-list"><span>word index = {frame.wordIndex ?? "-"}</span><span>prefix = {JSON.stringify(frame.prefix)}</span></div></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside></section></main>;
}
