import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../components/CodeTrace";
import { StepControls } from "../../components/StepControls";
import type { VisualizerProps } from "../../types";
import { codeLines, defaultExample, examples, title } from "./data";
import type { SearchRotatedExample } from "./data";
import { createSearchRotatedDryRun } from "./dryRun";

export function SearchRotatedArrayVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [nums, setNums] = useState(defaultExample.nums);
  const [target, setTarget] = useState(defaultExample.target);
  const [numsInput, setNumsInput] = useState(JSON.stringify(defaultExample.nums));
  const [targetInput, setTargetInput] = useState(String(defaultExample.target));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createSearchRotatedDryRun(nums, target), [nums, target]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)];

  useEffect(() => {
    if (!playing) return;
    if (step >= dryRun.frames.length - 1) {
      setPlaying(false);
      return;
    }
    const id = window.setTimeout(() => setStep((current) => current + 1), 750);
    return () => window.clearTimeout(id);
  }, [dryRun.frames.length, playing, step]);

  function loadExample(example: SearchRotatedExample) {
    setSelectedExampleId(example.id);
    setNums(example.nums);
    setTarget(example.target);
    setNumsInput(JSON.stringify(example.nums));
    setTargetInput(String(example.target));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const parsedNums = JSON.parse(numsInput);
      const parsedTarget = Number(targetInput);
      if (
        !Array.isArray(parsedNums) ||
        parsedNums.length < 1 ||
        parsedNums.length > 14 ||
        !parsedNums.every(Number.isInteger) ||
        !Number.isInteger(parsedTarget)
      ) {
        setError("Use a JSON array of 1 to 14 integers and an integer target.");
        return;
      }
      setSelectedExampleId(0);
      setNums(parsedNums);
      setTarget(parsedTarget);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError("Use valid JSON, for example [4,5,6,7,0,1,2].");
    }
  }

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
          <div className="panel-heading"><h2>input</h2><span>target = {target}</span></div>
          <div className="expected-output"><span>search window</span><code>[{frame.left}, {frame.right}]</code></div>
          <div className="input-grid">
            <label>nums JSON<textarea value={numsInput} onChange={(event) => setNumsInput(event.target.value)} /></label>
            <label>target<input value={targetInput} onChange={(event) => setTargetInput(event.target.value)} /></label>
            {error ? <p className="error">{error}</p> : null}
            <button className="command load" onClick={loadInput}><Upload size={16} />Load input</button>
          </div>
          <div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{selectedExample?.output ?? frame.result ?? "pending"}</code></div>
        </aside>
        <section className="flow-panel binary-flow-panel">
          <div className="panel-heading"><h2>Rotated Binary Search</h2><span>mid: {frame.mid ?? "none"}</span></div>
          <div className="binary-stage">
            <div className="binary-array">
              {frame.nums.map((value, index) => {
                const inWindow = index >= frame.left && index <= frame.right;
                const inSortedHalf =
                  frame.sortedHalf === "left"
                    ? index >= frame.left && frame.mid !== null && index <= frame.mid
                    : frame.sortedHalf === "right" && frame.mid !== null && index >= frame.mid && index <= frame.right;
                const inTargetRange = frame.targetRange ? index >= frame.targetRange[0] && index <= frame.targetRange[1] : false;
                return (
                  <div
                    className={[
                      "binary-cell",
                      inWindow ? "in-window" : "",
                      inSortedHalf ? "is-sorted-half" : "",
                      inTargetRange ? "is-target-range" : "",
                      frame.left === index ? "is-left" : "",
                      frame.mid === index ? "is-mid" : "",
                      frame.right === index ? "is-right" : "",
                      frame.result === index ? "is-found" : "",
                    ].filter(Boolean).join(" ")}
                    key={`${value}-${index}`}
                  >
                    <strong>{value}</strong>
                    <span>{index}</span>
                    <div className="pointer-tags">
                      {frame.left === index ? <em>L</em> : null}
                      {frame.mid === index ? <em>M</em> : null}
                      {frame.right === index ? <em>R</em> : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        <aside className="state-panel">
          <div className="state-sticky">
            <div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.kind}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div>
            <StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} />
          </div>
          <div className="state-block"><h3>state</h3><div className="token-list"><span>left = {frame.left}</span><span>mid = {frame.mid ?? "none"}</span><span>right = {frame.right}</span><span>target = {target}</span></div></div>
          <div className="state-block"><h3>decision</h3><div className="token-list"><span>sorted half = {frame.sortedHalf ?? "unknown"}</span><span>result = {frame.result ?? "pending"}</span></div></div>
          <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
        </aside>
      </section>
    </main>
  );
}
