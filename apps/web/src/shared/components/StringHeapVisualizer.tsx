import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "./CodeTrace";
import { StepControls } from "./StepControls";
import type { FrameKind, VisualizerProps } from "../types";

export type StringHeapFrame = {
  kind: FrameKind;
  phase: string;
  title: string;
  detail: string;
  activeLines: number[];
  heap: Array<[number, string]>;
  ans: string[];
  focusA: [number, string] | null;
  focusB: [number, string] | null;
  held: [number, string] | null;
  result: string | null;
};

type Example<Input> = { id: number; label: string; input: Input; output: string };
type Props<Input> = VisualizerProps & {
  title: string;
  inputLabel: string;
  examples: Example<Input>[];
  defaultExample: Example<Input>;
  codeLines: string[];
  inputToText: (input: Input) => string;
  parseInput: (text: string) => Input;
  inputTokens: (input: Input) => Array<[string, string | number]>;
  createRun: (input: Input) => { frames: StringHeapFrame[] };
};

export function StringHeapVisualizer<Input>({ onBack, title, inputLabel, examples, defaultExample, codeLines, inputToText, parseInput, inputTokens, createRun }: Props<Input>) {
  const [selectedExampleId, setSelectedExampleId] = useState(defaultExample.id);
  const [input, setInput] = useState(defaultExample.input);
  const [inputText, setInputText] = useState(inputToText(defaultExample.input));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createRun(input), [createRun, input]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)]!;

  useEffect(() => {
    if (!playing || step >= dryRun.frames.length - 1) {
      if (step >= dryRun.frames.length - 1) setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((current) => current + 1), 620);
    return () => window.clearTimeout(timer);
  }, [dryRun.frames.length, playing, step]);

  const loadExample = (example: Example<Input>) => { setSelectedExampleId(example.id); setInput(example.input); setInputText(inputToText(example.input)); setStep(0); setPlaying(false); setError(""); };
  const loadInput = () => { try { setInput(parseInput(inputText)); setSelectedExampleId(0); setStep(0); setPlaying(false); setError(""); } catch { setError("Use the JSON format shown by the selected example."); } };
  const focus = new Set([frame.focusA?.[1], frame.focusB?.[1], frame.held?.[1]].filter(Boolean));

  return <main className="app-shell"><header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {dryRun.frames.length}</div></header><section className="workspace"><aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)} type="button">{example.id}</button>)}</div></div><div className="panel-heading"><h2>{inputLabel}</h2><span>max-heap</span></div><div className="input-grid"><label>input JSON<textarea value={inputText} onChange={(event) => setInputText(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load input</button></div><div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{JSON.stringify(selectedExample?.output ?? frame.result ?? "pending")}</code></div></aside><section className="flow-panel string-heap-flow-panel"><div className="panel-heading"><h2>Deferred Character Heap</h2><span>{frame.phase}</span></div><div className="string-heap-stage"><section className="char-source"><h3>input counts</h3><div>{inputTokens(input).map(([label, value]) => <span key={label}><b>{label}</b><em>{value}</em></span>)}</div></section><section className="char-heap"><div className="compact-heading"><h3>heap</h3><span>(-frequency, character)</span></div><div>{frame.heap.length ? frame.heap.map(([frequency, char], index) => <span className={[index === 0 ? "is-top" : "", focus.has(char) ? "is-focus" : ""].filter(Boolean).join(" ")} key={`${char}-${frequency}-${index}`}><b>{char}</b><em>{Math.abs(frequency)} left</em></span>) : <em>empty</em>}</div></section><section className="char-answer"><h3>ans</h3><div>{frame.ans.length ? frame.ans.map((char, index) => <span className={index >= frame.ans.length - 2 ? "is-recent" : ""} key={`${char}-${index}`}>{char}</span>) : <em>empty</em>}</div></section></div></section><aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>selected heap entries</h3><div className="token-list">{frame.focusA ? <span>first = ({frame.focusA.join(", ")})</span> : null}{frame.focusB ? <span>second = ({frame.focusB.join(", ")})</span> : null}{frame.held ? <span>prev = ({frame.held.join(", ")})</span> : null}{!frame.focusA && !frame.focusB && !frame.held ? <em>waiting</em> : null}</div></div><div className="state-block"><h3>answer</h3><pre className="matrix-state">{frame.ans.join("") || "empty"}</pre></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside></section></main>;
}
