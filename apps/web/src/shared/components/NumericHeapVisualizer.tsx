import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "./CodeTrace";
import { StepControls } from "./StepControls";
import type { FrameKind, VisualizerProps } from "../types";

export type NumericHeapEntry = {
  label: string;
  priority: number;
  detail: string;
};

export type NumericHeapFrame = {
  kind: FrameKind;
  phase: string;
  title: string;
  detail: string;
  activeLines: number[];
  heap: NumericHeapEntry[];
  sourceIndex: number | null;
  currentLabel: string | null;
  removedLabel: string | null;
  output: unknown;
};

type Example<Input> = { id: number; label: string; input: Input; output: unknown };

type Props<Input, Frame extends NumericHeapFrame> = VisualizerProps & {
  title: string;
  sourceLabel: string;
  heapLabel: string;
  heapCaption: string;
  outputLabel: string;
  examples: Example<Input>[];
  defaultExample: Example<Input>;
  codeLines: string[];
  inputToText: (input: Input) => string;
  parseInput: (text: string) => Input;
  sourceItems: (input: Input) => string[];
  createRun: (input: Input) => { frames: Frame[] };
};

export function NumericHeapVisualizer<Input, Frame extends NumericHeapFrame>({
  onBack,
  title,
  sourceLabel,
  heapLabel,
  heapCaption,
  outputLabel,
  examples,
  defaultExample,
  codeLines,
  inputToText,
  parseInput,
  sourceItems,
  createRun,
}: Props<Input, Frame>) {
  const [selectedExampleId, setSelectedExampleId] = useState(defaultExample.id);
  const [input, setInput] = useState(defaultExample.input);
  const [inputText, setInputText] = useState(inputToText(defaultExample.input));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createRun(input), [createRun, input]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)]!;
  const source = sourceItems(input);

  useEffect(() => {
    if (!playing || step >= dryRun.frames.length - 1) {
      if (step >= dryRun.frames.length - 1) setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((current) => current + 1), 620);
    return () => window.clearTimeout(timer);
  }, [dryRun.frames.length, playing, step]);

  function loadExample(example: Example<Input>) {
    setSelectedExampleId(example.id);
    setInput(example.input);
    setInputText(inputToText(example.input));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      setInput(parseInput(inputText));
      setSelectedExampleId(0);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError("Use the JSON format shown by the selected example.");
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button>
          <p className="eyebrow">AlgoTrace dry run</p>
          <h1>{title}</h1>
        </div>
        <div className="step-pill">Step {step + 1} / {dryRun.frames.length}</div>
      </header>
      <section className="workspace">
        <aside className="board-panel">
          <div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)} type="button">{example.id}</button>)}</div></div>
          <div className="panel-heading"><h2>input</h2><span>{source.length} item{source.length === 1 ? "" : "s"}</span></div>
          <div className="input-grid"><label>input JSON<textarea aria-label="input JSON" value={inputText} onChange={(event) => setInputText(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load input</button></div>
          <div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{formatValue(selectedExample?.output ?? frame.output)}</code></div>
        </aside>
        <section className="flow-panel string-heap-flow-panel">
          <div className="panel-heading"><h2>{heapLabel}</h2><span>{frame.phase}</span></div>
          <div className="string-heap-stage">
            <section className="char-source"><h3>{sourceLabel}</h3><div>{source.length ? source.map((item, index) => <span className={index === frame.sourceIndex ? "is-focus" : ""} key={`${item}-${index}`}><b>{index}</b><em>{item}</em></span>) : <em>empty</em>}</div></section>
            <section className="char-heap"><div className="compact-heading"><h3>heap</h3><span>{heapCaption}</span></div><div>{frame.heap.length ? frame.heap.map((entry, index) => <span className={[index === 0 ? "is-top" : "", entry.label === frame.currentLabel ? "is-focus" : ""].filter(Boolean).join(" ")} key={`${entry.priority}-${entry.label}-${index}`}><b>{entry.label}</b><em>{entry.detail}</em></span>) : <em>empty</em>}</div></section>
            <section className="char-answer"><h3>{outputLabel}</h3><div>{frame.output === null || frame.output === undefined ? <em>pending</em> : <span className="is-recent">{formatValue(frame.output)}</span>}</div></section>
          </div>
        </section>
        <aside className="state-panel">
          <div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div>
          <div className="state-block"><h3>current operation</h3><div className="token-list"><span>source index = {frame.sourceIndex ?? "-"}</span>{frame.currentLabel ? <span>current = {frame.currentLabel}</span> : null}{frame.removedLabel ? <span>popped = {frame.removedLabel}</span> : null}</div></div>
          <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
        </aside>
      </section>
    </main>
  );
}

function formatValue(value: unknown) {
  return typeof value === "string" ? value : JSON.stringify(value);
}
