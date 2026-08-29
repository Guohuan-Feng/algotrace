import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type EvaluateDivisionInput } from "./data";
import { createEvaluateDivisionDryRun } from "./dryRun";

export default function EvaluateDivisionVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState(defaultExample.id);
  const [input, setInput] = useState<EvaluateDivisionInput>(defaultExample.input);
  const [equationsInput, setEquationsInput] = useState(JSON.stringify(defaultExample.input.equations));
  const [valuesInput, setValuesInput] = useState(JSON.stringify(defaultExample.input.values));
  const [queriesInput, setQueriesInput] = useState(JSON.stringify(defaultExample.input.queries));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createEvaluateDivisionDryRun(input.equations, input.values, input.queries), [input]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)]!;
  const nodes = Object.keys(frame.graph);

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
    setEquationsInput(JSON.stringify(example.input.equations));
    setValuesInput(JSON.stringify(example.input.values));
    setQueriesInput(JSON.stringify(example.input.queries));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const equations = JSON.parse(equationsInput) as string[][];
      const values = JSON.parse(valuesInput) as number[];
      const queries = JSON.parse(queriesInput) as string[][];
      const validPairs = (pairs: unknown) => Array.isArray(pairs) && pairs.length <= 12 && pairs.every((pair) => Array.isArray(pair) && pair.length === 2 && pair.every((word) => typeof word === "string" && /^[a-z]+$/.test(word)));
      if (!validPairs(equations) || !Array.isArray(values) || values.length !== equations.length || !values.every(Number.isFinite) || !validPairs(queries)) throw new Error();
      setSelectedExampleId(0);
      setInput({ equations, values, queries });
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError("Use equation/query pairs such as [[\"a\",\"b\"]] and matching numeric values.");
    }
  }

  return <main className="app-shell">
    <header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {dryRun.frames.length}</div></header>
    <section className="workspace">
      <aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)} type="button">{example.id}</button>)}</div></div><div className="panel-heading"><h2>input</h2><span>{input.equations.length} equations</span></div><div className="input-grid"><label>equations JSON<textarea value={equationsInput} onChange={(event) => setEquationsInput(event.target.value)} /></label><label>values JSON<textarea value={valuesInput} onChange={(event) => setValuesInput(event.target.value)} /></label><label>queries JSON<textarea value={queriesInput} onChange={(event) => setQueriesInput(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load equations</button></div><div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{JSON.stringify(selectedExample?.output ?? frame.result ?? frame.results)}</code></div></aside>
      <section className="flow-panel query-flow-panel"><div className="panel-heading"><h2>Weighted DFS Path</h2><span>{frame.query ? `${frame.query[0]} / ${frame.query[1]}` : "build graph"}</span></div><div className="query-stage"><div className="query-graph division-graph" aria-label="Weighted variable graph"><svg aria-hidden="true" className="query-edges" viewBox="0 0 100 100" preserveAspectRatio="none"><defs><marker id="division-arrow" markerHeight="6" markerWidth="6" orient="auto" refX="5" refY="3"><path d="M0,0 L0,6 L6,3 z" /></marker></defs>{frame.equations.map(([from, to], index) => { const fromPosition = positionOf(nodes.indexOf(from), nodes.length); const toPosition = positionOf(nodes.indexOf(to), nodes.length); const active = frame.current === from && frame.neighbor === to; const weight = frame.values[index]!; return <g key={`${from}-${to}-${index}`}><line className={active ? "query-edge is-active" : "query-edge"} markerEnd="url(#division-arrow)" x1={fromPosition.x} x2={toPosition.x} y1={fromPosition.y} y2={toPosition.y} /><text className="division-edge-label" x={(fromPosition.x + toPosition.x) / 2} y={(fromPosition.y + toPosition.y) / 2}>{format(weight)}</text></g>; })}</svg>{nodes.map((node, index) => { const position = positionOf(index, nodes.length); return <div className={["query-node division-node", frame.visited.includes(node) ? "is-visited" : "", frame.current === node ? "is-current" : "", frame.target === node ? "is-target" : ""].filter(Boolean).join(" ")} key={node} style={{ left: `${position.x}%`, top: `${position.y}%` }}><strong>{node}</strong><span>{frame.current === node ? "current" : frame.target === node ? "target" : frame.visited.includes(node) ? "visited" : "unvisited"}</span></div>; })}</div><section className="edge-panel"><h3>graph[var] - (next, weight)</h3><div className="edge-list">{nodes.map((node) => <div className="edge-row" key={node}><strong>{node}</strong><span>{frame.graph[node]!.map(([next, weight]) => `(${next},${format(weight)})`).join(" ")}</span></div>)}</div></section></div></section>
      <aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.kind}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>DFS stack</h3><div className="token-list words">{frame.stack.length ? frame.stack.map((word, index) => <span key={`${word}-${index}`}>dfs({word})</span>) : <em>empty</em>}</div></div><div className="state-block"><h3>visited</h3><div className="token-list words">{frame.visited.length ? frame.visited.map((word) => <span key={word}>{word}</span>) : <em>empty</em>}</div></div><div className="state-block"><h3>ans</h3><div className="token-list">{frame.results.length ? frame.results.map((result, index) => <span key={index}>{format(result)}</span>) : <em>[]</em>}</div></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside>
    </section>
  </main>;
}

function positionOf(index: number, total: number) {
  if (total <= 1) return { x: 50, y: 50 };
  const angle = -Math.PI / 2 + (index * Math.PI * 2) / total;
  return { x: 50 + Math.cos(angle) * 36, y: 50 + Math.sin(angle) * 36 };
}

function format(value: number) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(4)));
}
