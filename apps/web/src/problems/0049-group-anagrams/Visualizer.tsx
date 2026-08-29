import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type GroupAnagramsInput } from "./data";
import { createGroupAnagramsDryRun } from "./dryRun";

export default function GroupAnagramsVisualizer({ onBack }: VisualizerProps) {
  const [exampleId, setExampleId] = useState(defaultExample.id);
  const [input, setInput] = useState<GroupAnagramsInput>(defaultExample.input);
  const [text, setText] = useState(JSON.stringify(defaultExample.input));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const run = useMemo(() => createGroupAnagramsDryRun(input.strs), [input]);
  const frame = run.frames[Math.min(step, run.frames.length - 1)]!;
  const selectedExample = examples.find((example) => example.id === exampleId);

  useEffect(() => {
    if (!playing || step >= run.frames.length - 1) {
      if (step >= run.frames.length - 1) setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((value) => value + 1), 560);
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
      const candidate = JSON.parse(text) as GroupAnagramsInput;
      if (!candidate || !Array.isArray(candidate.strs) || !candidate.strs.every((word) => typeof word === "string" && /^[a-z]*$/.test(word))) throw new Error();
      setInput(candidate);
      setExampleId(0);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError('Use lowercase-word JSON such as {"strs":["eat","tea","tan","ate","nat","bat"]}.');
    }
  }

  return <main className="app-shell">
    <header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {run.frames.length}</div></header>
    <section className="workspace">
      <aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={example.id === exampleId ? "active" : ""} key={example.id} onClick={() => load(example)} type="button">{example.id}</button>)}</div></div><div className="input-grid"><label>input JSON<textarea aria-label="input JSON" value={text} onChange={(event) => setText(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load words</button></div><div className="expected-output"><span>{selectedExample ? selectedExample.label + " output" : "Current result"}</span><code>{JSON.stringify(frame.result ?? selectedExample?.output ?? "pending")}</code></div></aside>
      <section className="flow-panel anagram-flow-panel"><div className="panel-heading"><h2>Sorted Signature Map</h2><span>{frame.key === null ? "waiting" : "key = " + frame.key}</span></div><div className="anagram-stage"><section className="anagram-input"><h3>input words</h3><div>{frame.strs.map((word, index) => <span className={index === frame.wordIndex ? "is-current" : index < (frame.wordIndex ?? 0) ? "is-processed" : ""} key={word + "-" + index}><b>{word || '""'}</b><em>#{index}</em></span>)}</div></section><section className="anagram-key"><span>sorted signature</span><strong>{frame.key === null ? "-" : frame.key || '""'}</strong><p>{frame.word === null ? "Choose the next word." : "sort(" + (frame.word || '""') + ") = " + (frame.key || '""')}</p></section><section className="anagram-buckets"><div className="compact-heading"><h3>groups</h3><span>hash map</span></div><div>{frame.buckets.length ? frame.buckets.map((bucket) => <div className={bucket.key === frame.key ? "is-current" : ""} key={bucket.key || "empty"}><b>{bucket.key || '""'}</b><span>{bucket.words.map((word, index) => <em key={word + "-" + index}>{word || '""'}</em>)}</span></div>) : <em>empty map</em>}</div></section><div className="product-phase"><span>current action</span><strong>{frame.title}</strong><p>{frame.detail}</p></div></div></section>
      <aside className="state-panel"><div className="state-sticky"><div className={"event-card " + frame.kind}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={run.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>variables</h3><div className="token-list"><span>word = {frame.word ?? "-"}</span><span>key = {frame.key ?? "-"}</span><span>buckets = {frame.buckets.length}</span></div></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside>
    </section>
  </main>;
}
