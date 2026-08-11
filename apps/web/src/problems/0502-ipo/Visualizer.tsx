import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title } from "./data";
import type { IpoExample } from "./data";
import { createIpoDryRun } from "./dryRun";
import type { IpoProject } from "./dryRun";

const projectKey = (project: IpoProject | null) => (project ? project.id : -1);

export default function IpoVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [k, setK] = useState(defaultExample.k);
  const [w, setW] = useState(defaultExample.w);
  const [profits, setProfits] = useState(defaultExample.profits);
  const [capital, setCapital] = useState(defaultExample.capital);
  const [kInput, setKInput] = useState(String(defaultExample.k));
  const [wInput, setWInput] = useState(String(defaultExample.w));
  const [profitsInput, setProfitsInput] = useState(JSON.stringify(defaultExample.profits));
  const [capitalInput, setCapitalInput] = useState(JSON.stringify(defaultExample.capital));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createIpoDryRun(k, w, profits, capital), [capital, k, profits, w]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)];
  const currentId = projectKey(frame.currentProject);
  const chosenIds = new Set(frame.chosen.map((project) => project.id));
  const affordableIds = new Set(frame.profitHeap.map((project) => project.id));
  const lockedIds = new Set(frame.capitalHeap.map((project) => project.id));

  useEffect(() => {
    if (!playing) return;
    if (step >= dryRun.frames.length - 1) {
      setPlaying(false);
      return;
    }
    const id = window.setTimeout(() => setStep((current) => current + 1), 750);
    return () => window.clearTimeout(id);
  }, [dryRun.frames.length, playing, step]);

  function loadExample(example: IpoExample) {
    setSelectedExampleId(example.id);
    setK(example.k);
    setW(example.w);
    setProfits(example.profits);
    setCapital(example.capital);
    setKInput(String(example.k));
    setWInput(String(example.w));
    setProfitsInput(JSON.stringify(example.profits));
    setCapitalInput(JSON.stringify(example.capital));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const parsedK = Number(kInput);
      const parsedW = Number(wInput);
      const parsedProfits = JSON.parse(profitsInput);
      const parsedCapital = JSON.parse(capitalInput);
      if (
        !Number.isInteger(parsedK) ||
        parsedK < 0 ||
        parsedK > 8 ||
        !Number.isInteger(parsedW) ||
        !Array.isArray(parsedProfits) ||
        !Array.isArray(parsedCapital) ||
        parsedProfits.length < 1 ||
        parsedProfits.length > 10 ||
        parsedProfits.length !== parsedCapital.length ||
        !parsedProfits.every(Number.isInteger) ||
        !parsedCapital.every(Number.isInteger)
      ) {
        setError("Use k 0-8, equal-length integer arrays, and at most 10 projects.");
        return;
      }
      setSelectedExampleId(0);
      setK(parsedK);
      setW(parsedW);
      setProfits(parsedProfits);
      setCapital(parsedCapital);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError("Use valid JSON arrays, for example [1,2,3].");
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
          <div className="panel-heading"><h2>input</h2><span>k = {k}, w = {frame.w}</span></div>
          <div className="input-grid">
            <label>k<input value={kInput} onChange={(event) => setKInput(event.target.value)} /></label>
            <label>w<input value={wInput} onChange={(event) => setWInput(event.target.value)} /></label>
            <label>profits JSON<textarea value={profitsInput} onChange={(event) => setProfitsInput(event.target.value)} /></label>
            <label>capital JSON<textarea value={capitalInput} onChange={(event) => setCapitalInput(event.target.value)} /></label>
            {error ? <p className="error">{error}</p> : null}
            <button className="command load" onClick={loadInput}><Upload size={16} />Load input</button>
          </div>
          <div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{selectedExample?.output ?? frame.result ?? "pending"}</code></div>
        </aside>
        <section className="flow-panel heap-flow-panel">
          <div className="panel-heading"><h2>Two Heaps</h2><span>round: {frame.round} / {k}</span></div>
          <div className="heap-stage">
            <section className="project-board">
              <h3>projects</h3>
              <div className="project-grid">
                {frame.projects.map((project) => (
                  <div
                    className={[
                      "project-card",
                      lockedIds.has(project.id) ? "is-locked" : "",
                      affordableIds.has(project.id) ? "is-affordable" : "",
                      chosenIds.has(project.id) ? "is-chosen" : "",
                      currentId === project.id ? "is-current" : "",
                    ].filter(Boolean).join(" ")}
                    key={project.id}
                  >
                    <strong>P{project.id}</strong>
                    <span>capital {project.capital}</span>
                    <span>profit {project.profit}</span>
                  </div>
                ))}
              </div>
            </section>
            <div className="heap-columns">
              <HeapList title="capital_heap" subtitle="smallest capital first" projects={frame.capitalHeap} mode="capital" />
              <HeapList title="profit_heap" subtitle="largest profit first" projects={frame.profitHeap} mode="profit" />
            </div>
          </div>
        </section>
        <aside className="state-panel">
          <div className="state-sticky">
            <div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.kind}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div>
            <StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} />
          </div>
          <div className="state-block"><h3>state</h3><div className="token-list"><span>w = {frame.w}</span><span>round = {frame.round}</span><span>chosen = {frame.chosen.length}</span><span>result = {frame.result ?? "pending"}</span></div></div>
          <div className="state-block"><h3>chosen projects</h3><div className="token-list">{frame.chosen.length ? frame.chosen.map((project) => <span key={project.id}>P{project.id}: +{project.profit}</span>) : <em>empty</em>}</div></div>
          <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
        </aside>
      </section>
    </main>
  );
}

function HeapList({ title, subtitle, projects, mode }: { title: string; subtitle: string; projects: IpoProject[]; mode: "capital" | "profit" }) {
  return (
    <section className="heap-list">
      <div className="compact-heading">
        <h3>{title}</h3>
        <span>{subtitle}</span>
      </div>
      <div className="heap-items">
        {projects.length ? projects.map((project) => (
          <div className="heap-item" key={project.id}>
            <strong>P{project.id}</strong>
            <span>{mode === "capital" ? `c=${project.capital}` : `-p=${-project.profit}`}</span>
            <em>{mode === "capital" ? `p=${project.profit}` : `profit ${project.profit}`}</em>
          </div>
        )) : <p className="heap-empty">empty</p>}
      </div>
    </section>
  );
}
