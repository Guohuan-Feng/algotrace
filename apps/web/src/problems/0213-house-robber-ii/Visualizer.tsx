import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type HouseRobberIiInput } from "./data";
import { createHouseRobberIiDryRun } from "./dryRun";

export default function HouseRobberIiVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState(defaultExample.id);
  const [input, setInput] = useState<HouseRobberIiInput>(defaultExample.input);
  const [inputText, setInputText] = useState(JSON.stringify(defaultExample.input));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createHouseRobberIiDryRun(input.nums), [input]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)]!;
  const activeHouseIndex = frame.activeIndex === null ? null : frame.caseKey === "exclude-first" ? frame.activeIndex + 1 : frame.activeIndex;

  useEffect(() => {
    if (!playing || step >= dryRun.frames.length - 1) {
      if (step >= dryRun.frames.length - 1) setPlaying(false);
      return;
    }
    const id = window.setTimeout(() => setStep((current) => current + 1), 620);
    return () => window.clearTimeout(id);
  }, [dryRun.frames.length, playing, step]);

  function loadExample(example: (typeof examples)[number]) {
    setSelectedExampleId(example.id);
    setInput(example.input);
    setInputText(JSON.stringify(example.input));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const nextInput = JSON.parse(inputText) as HouseRobberIiInput;
      if (!Array.isArray(nextInput.nums) || nextInput.nums.length === 0) throw new Error();
      setInput(nextInput);
      setSelectedExampleId(0);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError("Use JSON such as {\"nums\":[2,3,2]}.");
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div>
        <div className="step-pill">Step {step + 1} / {dryRun.frames.length}</div>
      </header>
      <section className="workspace">
        <aside className="board-panel">
          <div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)} type="button">{example.id}</button>)}</div></div>
          <div className="panel-heading"><h2>input</h2><span>nums = [{input.nums.join(", ")}]</span></div>
          <div className="input-grid"><label>input JSON<textarea aria-label="input JSON" value={inputText} onChange={(event) => setInputText(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load input</button></div>
          <div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{selectedExample?.output ?? frame.result ?? "pending"}</code></div>
          <div className="robber-legend"><span><i className="robber-active-key" />current house</span><span><i className="robber-excluded-key" />excluded endpoint</span><span><i className="robber-source-key" />DP source</span></div>
        </aside>
        <section className="flow-panel robber-flow-panel">
          <div className="panel-heading"><h2>Two Linear Cases</h2><span>{frame.result === null ? frame.caseLabel : `result = ${frame.result}`}</span></div>
          <div className="robber-stage">
            <div className="robber-case-results"><span>exclude last <strong>{frame.caseOneResult ?? "-"}</strong></span><span>exclude first <strong>{frame.caseTwoResult ?? "-"}</strong></span></div>
            <div className="robber-ring" aria-label="circular houses">{frame.allHouses.map((value, index) => <div className={`robber-house ${index === activeHouseIndex ? "is-active" : ""} ${isExcluded(frame.caseKey, index, frame.allHouses.length) ? "is-excluded" : ""}`} key={`${index}-${value}`}><span>house {index}</span><strong>{value}</strong></div>)}</div>
            <div className="robber-current-case"><span>{frame.caseLabel}</span><strong>{frame.houses.length ? `[${frame.houses.join(", ")}]` : "compare both cases"}</strong></div>
            <div className="robber-dp" aria-label="robber dynamic programming array">{frame.dp.length ? frame.dp.map((value, index) => <div className={`robber-dp-cell ${index === frame.activeIndex ? "is-active" : ""} ${frame.sourceIndexes.includes(index) ? "is-source" : ""}`} key={`${index}-${value}`}><span>dp[{index}]</span><strong>{value}</strong></div>) : <p>Both calls are complete. Compare their returned values.</p>}</div>
          </div>
        </section>
        <aside className="state-panel">
          <div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.caseKey}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div>
          <div className="state-block"><h3>current case</h3><div className="token-list"><span>{frame.caseLabel}</span><span>i = {frame.activeIndex ?? "-"}</span>{frame.caseResult !== null ? <span>return = {frame.caseResult}</span> : null}</div></div>
          <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
        </aside>
      </section>
    </main>
  );
}

function isExcluded(caseKey: "exclude-last" | "exclude-first" | "final" | "single", index: number, length: number) {
  return (caseKey === "exclude-last" && index === length - 1) || (caseKey === "exclude-first" && index === 0);
}
