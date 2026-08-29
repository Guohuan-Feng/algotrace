import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "./CodeTrace";
import { StepControls } from "./StepControls";
import type { FrameKind, VisualizerProps } from "../types";

export type LinearDpValue = number | boolean;

export type LinearDpFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  dp: LinearDpValue[];
  currentIndex: number | null;
  previousIndex: number | null;
  outerLabel: string;
  innerLabel: string;
  candidateLabel: string | null;
  result: LinearDpValue | null;
};

export type LinearDpExample<Input> = {
  id: number;
  label: string;
  input: Input;
  output: LinearDpValue;
};

type LinearDpVisualizerProps<Input, Frame extends LinearDpFrame> = VisualizerProps & {
  title: string;
  stageTitle: string;
  inputLabel: string;
  codeLines: string[];
  examples: LinearDpExample<Input>[];
  defaultExample: LinearDpExample<Input>;
  createDryRun: (input: Input) => { frames: Frame[] };
  inputSummary: (input: Input) => string;
};

export function LinearDpVisualizer<Input, Frame extends LinearDpFrame>({
  onBack,
  title,
  stageTitle,
  inputLabel,
  codeLines,
  examples,
  defaultExample,
  createDryRun,
  inputSummary,
}: LinearDpVisualizerProps<Input, Frame>) {
  const [selectedExampleId, setSelectedExampleId] = useState(defaultExample.id);
  const [input, setInput] = useState(defaultExample.input);
  const [inputText, setInputText] = useState(JSON.stringify(defaultExample.input));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createDryRun(input), [createDryRun, input]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)];

  useEffect(() => {
    if (!playing || step >= dryRun.frames.length - 1) {
      if (step >= dryRun.frames.length - 1) setPlaying(false);
      return;
    }
    const id = window.setTimeout(() => setStep((current) => current + 1), 620);
    return () => window.clearTimeout(id);
  }, [dryRun.frames.length, playing, step]);

  function loadExample(example: LinearDpExample<Input>) {
    setSelectedExampleId(example.id);
    setInput(example.input);
    setInputText(JSON.stringify(example.input));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      setInput(JSON.parse(inputText) as Input);
      setSelectedExampleId(0);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError("Use valid JSON for this problem's input.");
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
          <div className="panel-heading"><h2>input</h2><span>{inputSummary(input)}</span></div>
          <div className="input-grid">
            <label>{inputLabel}<textarea aria-label={inputLabel} value={inputText} onChange={(event) => setInputText(event.target.value)} /></label>
            {error ? <p className="error">{error}</p> : null}
            <button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load input</button>
          </div>
          <div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{formatValue(selectedExample?.output ?? frame.result)}</code></div>
          <div className="linear-dp-legend"><span><i className="linear-dp-current-key" />current index</span><span><i className="linear-dp-source-key" />source state</span><span><i className="linear-dp-idle-key" />other state</span></div>
        </aside>

        <section className="flow-panel linear-dp-flow-panel">
          <div className="panel-heading"><h2>{stageTitle}</h2><span>{frame.result === null ? "in progress" : `result = ${formatValue(frame.result)}`}</span></div>
          <LinearDpStage frame={frame} />
        </section>

        <aside className="state-panel">
          <div className="state-sticky">
            <div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.kind}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div>
            <StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} />
          </div>
          <div className="state-block"><h3>loop state</h3><div className="token-list"><span>{frame.outerLabel}</span><span>{frame.innerLabel}</span>{frame.candidateLabel ? <span>{frame.candidateLabel}</span> : null}</div></div>
          <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
        </aside>
      </section>
    </main>
  );
}

function LinearDpStage({ frame }: { frame: LinearDpFrame }) {
  return (
    <div className="linear-dp-stage">
      <div className="linear-dp-readout"><div><span>active</span><strong>{frame.currentIndex === null ? "-" : `dp[${frame.currentIndex}]`}</strong></div><div><span>source</span><strong>{frame.previousIndex === null ? "-" : `dp[${frame.previousIndex}]`}</strong></div><div><span>candidate</span><strong>{frame.candidateLabel ?? "-"}</strong></div></div>
      <div className="linear-dp-scroll" aria-label="dynamic programming array">
        <div className="linear-dp-array">
          {frame.dp.map((value, index) => <div className={["linear-dp-cell", index === frame.currentIndex ? "is-current" : "", index === frame.previousIndex ? "is-source" : ""].filter(Boolean).join(" ")} key={index}><span>dp[{index}]</span><strong>{formatValue(value)}</strong></div>)}
        </div>
      </div>
      <p className="linear-dp-caption">{frame.currentIndex === null ? "Initialize the DP state, then follow each code line." : `The highlighted states are the exact array entries used by this step.`}</p>
    </div>
  );
}

function formatValue(value: LinearDpValue | null | undefined) {
  if (value === Number.POSITIVE_INFINITY) return "inf";
  if (value === true) return "T";
  if (value === false) return "F";
  return value === null || value === undefined ? "pending" : String(value);
}
