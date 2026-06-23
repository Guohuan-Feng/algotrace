import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../components/CodeTrace";
import { StepControls } from "../../components/StepControls";
import type { Cell, VisualizerProps } from "../../types";
import { codeLines, defaultExample, examples, title } from "./data";
import type { TriangleExample } from "./data";
import { createTriangleDryRun } from "./dryRun";

const key = (cell: Cell | null) => (cell ? `${cell[0]},${cell[1]}` : "");

export function TriangleVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [triangle, setTriangle] = useState(defaultExample.triangle);
  const [triangleInput, setTriangleInput] = useState(JSON.stringify(defaultExample.triangle));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createTriangleDryRun(triangle), [triangle]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)];
  const cacheKeys = new Set(Object.keys(frame.cache));

  useEffect(() => {
    if (!playing) return;
    if (step >= dryRun.frames.length - 1) {
      setPlaying(false);
      return;
    }
    const id = window.setTimeout(() => setStep((current) => current + 1), 750);
    return () => window.clearTimeout(id);
  }, [dryRun.frames.length, playing, step]);

  function loadExample(example: TriangleExample) {
    setSelectedExampleId(example.id);
    setTriangle(example.triangle);
    setTriangleInput(JSON.stringify(example.triangle));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const parsed = JSON.parse(triangleInput);
      const valid =
        Array.isArray(parsed) &&
        parsed.length >= 1 &&
        parsed.length <= 7 &&
        parsed.every((row, index) => Array.isArray(row) && row.length === index + 1 && row.every(Number.isInteger));
      if (!valid) {
        setError("Use a triangle JSON array with 1 to 7 rows.");
        return;
      }
      setSelectedExampleId(0);
      setTriangle(parsed);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError("Use valid JSON, for example [[2],[3,4],[6,5,7],[4,1,8,3]].");
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div><button className="back-link compact" onClick={onBack}><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div>
        <div className="step-pill">Step {step + 1} / {dryRun.frames.length}</div>
      </header>
      <section className="workspace">
        <aside className="board-panel">
          <div className="example-switcher"><span>LeetCode examples</span><div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)}>{example.id}</button>)}</div></div>
          <div className="panel-heading"><h2>triangle</h2><span>rows = {triangle.length}</span></div>
          <div className="input-grid"><label>triangle JSON<textarea value={triangleInput} onChange={(event) => setTriangleInput(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput}><Upload size={16} />Load triangle</button></div>
          <div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{selectedExample?.output ?? frame.result ?? "pending"}</code></div>
        </aside>
        <section className="flow-panel triangle-flow-panel">
          <div className="panel-heading"><h2>Memoized DFS</h2><span>cache = {cacheKeys.size}</span></div>
          <div className="triangle-stage">
            <div className="triangle-grid">
              {frame.triangle.map((row, i) => (
                <div className="triangle-row" key={i}>
                  {row.map((value, j) => {
                    const cellKey = `${i},${j}`;
                    return (
                      <div
                        className={[
                          "triangle-cell",
                          key(frame.current) === cellKey ? "is-current" : "",
                          key(frame.leftChild) === cellKey ? "is-left-child" : "",
                          key(frame.rightChild) === cellKey ? "is-right-child" : "",
                          cacheKeys.has(cellKey) ? "is-cached" : "",
                        ].filter(Boolean).join(" ")}
                        key={cellKey}
                      >
                        <strong>{value}</strong>
                        <span>{cacheKeys.has(cellKey) ? `dfs=${frame.cache[cellKey]}` : `(${i},${j})`}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </section>
        <aside className="state-panel">
          <div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.kind}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div>
          <div className="state-block"><h3>call stack</h3><div className="token-list">{frame.stack.length ? frame.stack.map((item) => <span key={item}>{item}</span>) : <em>empty</em>}</div></div>
          <div className="state-block"><h3>cache</h3><div className="token-list">{Object.entries(frame.cache).length ? Object.entries(frame.cache).map(([cell, value]) => <span key={cell}>{cell}: {value}</span>) : <em>empty</em>}</div></div>
          <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
        </aside>
      </section>
    </main>
  );
}
