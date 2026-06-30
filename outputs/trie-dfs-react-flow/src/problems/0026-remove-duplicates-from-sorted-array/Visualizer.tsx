import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../components/CodeTrace";
import { StepControls } from "../../components/StepControls";
import type { VisualizerProps } from "../../types";
import { codeLines, defaultExample, examples, title } from "./data";
import type { RemoveDuplicatesSortedArrayExample } from "./data";
import { createRemoveDuplicatesDryRun } from "./dryRun";

export function RemoveDuplicatesSortedArrayVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [nums, setNums] = useState(defaultExample.nums);
  const [numsInput, setNumsInput] = useState(JSON.stringify(defaultExample.nums));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createRemoveDuplicatesDryRun(nums), [nums]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)];

  useEffect(() => {
    if (!playing) return;
    if (step >= dryRun.frames.length - 1) {
      setPlaying(false);
      return;
    }
    const id = window.setTimeout(() => setStep((current) => current + 1), 700);
    return () => window.clearTimeout(id);
  }, [dryRun.frames.length, playing, step]);

  function loadExample(example: RemoveDuplicatesSortedArrayExample) {
    setSelectedExampleId(example.id);
    setNums(example.nums);
    setNumsInput(JSON.stringify(example.nums));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const parsed = JSON.parse(numsInput);
      if (!Array.isArray(parsed) || parsed.length < 1 || parsed.length > 16 || !parsed.every(Number.isInteger)) {
        setError("Use a JSON array of 1 to 16 integers.");
        return;
      }
      if (!parsed.every((value, index) => index === 0 || parsed[index - 1] <= value)) {
        setError("This problem requires nums to be sorted non-decreasing.");
        return;
      }
      setSelectedExampleId(0);
      setNums(parsed);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError("Use valid JSON, for example [1,1,2].");
    }
  }

  const output = selectedExample?.output ?? frame.result;
  const compareText =
    frame.fast === null || frame.compareIndex === null
      ? "none"
      : `${frame.nums[frame.fast]} vs ${frame.nums[frame.compareIndex]}`;

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <button className="back-link compact" onClick={onBack}><ArrowLeft size={16} />Catalog</button>
          <p className="eyebrow">AlgoTrace dry run</p>
          <h1>{title}</h1>
        </div>
        <div className="step-pill">Step {step + 1} / {dryRun.frames.length}</div>
      </header>
      <section className="workspace">
        <aside className="board-panel">
          <div className="example-switcher" aria-label="examples">
            <span>LeetCode examples</span>
            <div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)}>{example.id}</button>)}</div>
          </div>
          <div className="panel-heading"><h2>input</h2><span>n = {nums.length}</span></div>
          <div className="input-grid">
            <label>nums JSON<textarea value={numsInput} onChange={(event) => setNumsInput(event.target.value)} /></label>
            {error ? <p className="error">{error}</p> : null}
            <button className="command load" onClick={loadInput}><Upload size={16} />Load nums</button>
          </div>
          <div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current output"}</span><code>k = {output.k ?? "?"}, nums = {JSON.stringify(output.nums)}</code></div>
        </aside>
        <section className="flow-panel dedupe-flow-panel">
          <div className="panel-heading"><h2>In-place Write Pointer</h2><span>valid prefix length: {frame.prefixLength}</span></div>
          <div className="dedupe-stage">
            <div className="dedupe-array">
              {frame.nums.map((value, index) => (
                <div
                  className={[
                    "dedupe-cell",
                    index < frame.prefixLength ? "is-prefix" : "",
                    frame.fast === index ? "is-fast" : "",
                    frame.slow === index ? "is-slow" : "",
                    frame.compareIndex === index ? "is-compare" : "",
                    frame.writeIndex === index ? "is-write" : "",
                    frame.result.k !== null && index >= frame.result.k ? "is-ignored" : "",
                  ].filter(Boolean).join(" ")}
                  key={`${index}-${value}`}
                >
                  <strong>{value}</strong>
                  <span>i={index}</span>
                  <div className="pointer-tags">
                    {frame.slow === index ? <em>slow</em> : null}
                    {frame.fast === index ? <em>fast</em> : null}
                  </div>
                </div>
              ))}
            </div>
            <div className="dedupe-result-row">
              <span>nums[0:{frame.result.k ?? frame.prefixLength}]</span>
              <code>{JSON.stringify(frame.result.nums)}</code>
            </div>
          </div>
        </section>
        <aside className="state-panel">
          <div className="state-sticky">
            <div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.kind}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div>
            <StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} />
          </div>
          <div className="state-block"><h3>pointers</h3><div className="token-list"><span>slow = {frame.slow}</span><span>fast = {frame.fast ?? "none"}</span><span>compare = {compareText}</span></div></div>
          <div className="state-block"><h3>return</h3><div className="token-list"><span>k = {frame.result.k ?? "pending"}</span><span>prefix = {JSON.stringify(frame.result.nums)}</span></div></div>
          <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
        </aside>
      </section>
    </main>
  );
}
