import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "./CodeTrace";
import { StepControls } from "./StepControls";
import type { KSumExample, KSumFrame, KSumInput } from "../kSum";
import type { VisualizerProps } from "../types";

type Props = VisualizerProps & {
  title: string;
  codeLines: string[];
  examples: KSumExample[];
  defaultExample: KSumExample;
  k: 3 | 4;
  createDryRun: (input: KSumInput) => { frames: KSumFrame[] };
};

export function KSumVisualizer({ codeLines, createDryRun, defaultExample, examples, k, onBack, title }: Props) {
  const [exampleId, setExampleId] = useState(defaultExample.id);
  const [input, setInput] = useState<KSumInput>(defaultExample.input);
  const [text, setText] = useState(JSON.stringify(defaultExample.input));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const run = useMemo(() => createDryRun(input), [createDryRun, input]);
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

  function load(example: KSumExample) {
    setExampleId(example.id);
    setInput(example.input);
    setText(JSON.stringify(example.input));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const candidate = JSON.parse(text) as KSumInput;
      if (!candidate || !Array.isArray(candidate.nums) || !candidate.nums.every((value) => Number.isFinite(value)) || candidate.nums.length < k || (k === 4 && !Number.isFinite(candidate.target))) throw new Error();
      setInput({ nums: candidate.nums, ...(k === 4 ? { target: candidate.target } : {}) });
      setExampleId(0);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError(k === 4 ? 'Use JSON such as {"nums":[1,0,-1,0,-2,2],"target":0}.' : 'Use JSON such as {"nums":[-1,0,1,2,-1,-4]}.');
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
        <div className="step-pill">Step {step + 1} / {run.frames.length}</div>
      </header>
      <section className="workspace">
        <aside className="board-panel">
          <div className="example-switcher" aria-label="LeetCode examples">
            <span>LeetCode examples</span>
            <div>{examples.map((example) => <button className={example.id === exampleId ? "active" : ""} key={example.id} onClick={() => load(example)} type="button">{example.id}</button>)}</div>
          </div>
          <div className="input-grid">
            <label>input JSON<textarea aria-label="input JSON" value={text} onChange={(event) => setText(event.target.value)} /></label>
            {error ? <p className="error">{error}</p> : null}
            <button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load numbers</button>
          </div>
          <div className="expected-output"><span>{selectedExample ? selectedExample.label + " output" : "Current result"}</span><code>{JSON.stringify(frame.result ?? selectedExample?.output ?? "pending")}</code></div>
        </aside>
        <section className="flow-panel ksum-flow-panel">
          <div className="panel-heading"><h2>{k}-Sum Pointer Search</h2><span>{k === 4 ? "target = " + frame.target : "target = 0"}</span></div>
          <div className="ksum-stage">
            <div className="ksum-array">
              {frame.nums.map((value, index) => {
                const labels = [
                  frame.anchors[0] === index ? "i" : "",
                  frame.anchors[1] === index ? "j" : "",
                  frame.left === index ? "left" : "",
                  frame.right === index ? "right" : "",
                ].filter(Boolean);
                return <div className={["ksum-number", frame.anchors.includes(index) ? "is-anchor" : "", frame.left === index || frame.right === index ? "is-pointer" : ""].filter(Boolean).join(" ")} key={index}><span>{labels.join(" + ") || " "}</span><strong>{value}</strong><small>index {index}</small></div>;
              })}
            </div>
            <div className="ksum-equation">
              <span>current sum</span>
              <strong>{frame.total === null ? "waiting" : [...frame.anchors, frame.left, frame.right].filter((index): index is number => index !== null).map((index) => frame.nums[index]).join(" + ") + " = " + frame.total}</strong>
              <p>{frame.detail}</p>
            </div>
            <div className="ksum-results"><h3>unique answers</h3><div>{frame.results.length ? frame.results.map((result, index) => <span key={result.join("-") + "-" + index}>[{result.join(", ")}]</span>) : <em>none yet</em>}</div></div>
          </div>
        </section>
        <aside className="state-panel">
          <div className="state-sticky">
            <div className={"event-card " + frame.kind}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div>
            <StepControls frameCount={run.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} />
          </div>
          <div className="state-block"><h3>pointer state</h3><div className="token-list"><span>anchors = [{frame.anchors.map((index) => frame.nums[index]).join(", ")}]</span><span>left = {frame.left === null ? "-" : frame.nums[frame.left]}</span><span>right = {frame.right === null ? "-" : frame.nums[frame.right]}</span><span>sum = {frame.total ?? "-"}</span></div></div>
          <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
        </aside>
      </section>
    </main>
  );
}
