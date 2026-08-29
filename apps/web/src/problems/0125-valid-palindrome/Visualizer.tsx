import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type ValidPalindromeExample } from "./data";
import { createValidPalindromeDryRun } from "./dryRun";

export default function ValidPalindromeVisualizer({ onBack }: VisualizerProps) {
  const [exampleId, setExampleId] = useState(defaultExample.id);
  const [value, setValue] = useState(defaultExample.input);
  const [input, setInput] = useState(defaultExample.input);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const run = useMemo(() => createValidPalindromeDryRun(value), [value]);
  const frame = run.frames[Math.min(step, run.frames.length - 1)]!;
  const selected = examples.find((example) => example.id === exampleId);

  useEffect(() => {
    if (!playing || step >= run.frames.length - 1) {
      if (step >= run.frames.length - 1) setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((current) => current + 1), 650);
    return () => window.clearTimeout(timer);
  }, [playing, run.frames.length, step]);

  function load(example: ValidPalindromeExample) {
    setExampleId(example.id);
    setValue(example.input);
    setInput(example.input);
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    if (input.length > 80) {
      setError("Use up to 80 characters so each two-pointer move remains readable.");
      return;
    }
    setExampleId(0);
    setValue(input);
    setStep(0);
    setPlaying(false);
    setError("");
  }

  return <main className="app-shell"><header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {run.frames.length}</div></header><section className="workspace">
    <aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={example.id === exampleId ? "active" : ""} key={example.id} onClick={() => load(example)} type="button">{example.id}</button>)}</div></div><div className="input-grid"><label>s<input aria-label="string input" className="text-input" value={input} onChange={(event) => setInput(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load string</button></div><div className="expected-output"><span>{selected ? `${selected.label} output` : "Current result"}</span><code>{String(frame.result ?? "pending")}</code></div><div className="expected-output"><span>normalized letters and digits</span><code>{frame.normalized || '""'}</code></div></aside>
    <section className="flow-panel center-expansion-flow-panel"><div className="panel-heading"><h2>Filtered two pointers</h2><span>yellow: compare, green: matched</span></div><div className="center-expansion-stage"><div className="center-string-scroll"><div className="center-string" aria-label={`string ${value}`}>{value.split("").map((character, index) => <StringCell character={character} frame={frame} index={index} key={`${character}-${index}`} />)}</div></div><div className="center-range-caption"><span>left = {frame.left}</span><strong>{frame.leftChar === null ? "no character" : `${JSON.stringify(frame.leftChar.toLowerCase())} vs ${JSON.stringify((frame.rightChar ?? "").toLowerCase())}`}</strong><span>right = {frame.right}</span></div><div className="longest-readout"><div><span>left character</span><strong>{visibleCharacter(frame.leftChar)}</strong></div><div><span>right character</span><strong>{visibleCharacter(frame.rightChar)}</strong></div><div className="is-best"><span>result</span><strong>{frame.result === null ? "pending" : String(frame.result)}</strong></div></div></div></section>
    <aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={run.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>pointer state</h3><div className="token-list"><span>left = {frame.left}</span><span>right = {frame.right}</span><span>skipped = {frame.skippedIndices.length}</span><span>matched pairs = {Math.floor(frame.matchedIndices.length / 2)}</span></div></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside>
  </section></main>;
}

function StringCell({ character, frame, index }: { character: string; frame: ReturnType<typeof createValidPalindromeDryRun>["frames"][number]; index: number }) {
  const active = frame.activeIndices.includes(index);
  const matched = frame.matchedIndices.includes(index);
  const mismatch = frame.phase === "mismatch" && frame.activeIndices.includes(index);
  const skipped = frame.skippedIndices.includes(index);
  return <div className={["center-string-cell", active ? "is-active" : "", matched ? "is-success" : "", mismatch ? "is-mismatch" : ""].filter(Boolean).join(" ")}><span>index {index}</span><strong>{visibleCharacter(character)}</strong><em>{skipped ? "skip" : index === frame.left ? "left" : index === frame.right ? "right" : " "}</em></div>;
}

function visibleCharacter(character: string | null): string { return character === null ? "-" : character === " " ? "space" : character; }
