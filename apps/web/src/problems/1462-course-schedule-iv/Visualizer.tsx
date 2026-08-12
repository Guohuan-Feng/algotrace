import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title } from "./data";
import type { CourseScheduleIvExample } from "./data";
import { createCourseScheduleIvDryRun } from "./dryRun";

export default function CourseScheduleIvVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [numCourses, setNumCourses] = useState(defaultExample.numCourses);
  const [prerequisites, setPrerequisites] = useState(defaultExample.prerequisites);
  const [queries, setQueries] = useState(defaultExample.queries);
  const [numCoursesInput, setNumCoursesInput] = useState(String(defaultExample.numCourses));
  const [prerequisitesInput, setPrerequisitesInput] = useState(JSON.stringify(defaultExample.prerequisites));
  const [queriesInput, setQueriesInput] = useState(JSON.stringify(defaultExample.queries));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createCourseScheduleIvDryRun(numCourses, prerequisites, queries), [numCourses, prerequisites, queries]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)];

  useEffect(() => {
    if (!playing) return;
    if (step >= dryRun.frames.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((current) => current + 1), 700);
    return () => window.clearTimeout(timer);
  }, [dryRun.frames.length, playing, step]);

  function loadExample(example: CourseScheduleIvExample) {
    setSelectedExampleId(example.id);
    setNumCourses(example.numCourses);
    setPrerequisites(example.prerequisites);
    setQueries(example.queries);
    setNumCoursesInput(String(example.numCourses));
    setPrerequisitesInput(JSON.stringify(example.prerequisites));
    setQueriesInput(JSON.stringify(example.queries));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const parsedNumCourses = Number(numCoursesInput);
      const parsedPrerequisites = JSON.parse(prerequisitesInput);
      const parsedQueries = JSON.parse(queriesInput);
      const validPairs = (value: unknown) => Array.isArray(value) && value.length <= 14 && value.every((pair) => Array.isArray(pair) && pair.length === 2 && pair.every((course) => Number.isInteger(course) && course >= 0 && course < parsedNumCourses));
      if (!Number.isInteger(parsedNumCourses) || parsedNumCourses < 1 || parsedNumCourses > 8 || !validPairs(parsedPrerequisites) || !validPairs(parsedQueries)) {
        setError("Use courses 1-8 and JSON pairs like [[0,1],[1,2]].");
        return;
      }
      setSelectedExampleId(0);
      setNumCourses(parsedNumCourses);
      setPrerequisites(parsedPrerequisites);
      setQueries(parsedQueries);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError("Use valid JSON pairs, for example [[0,1],[1,2]].");
    }
  }

  return <main className="app-shell">
    <header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {dryRun.frames.length}</div></header>
    <section className="workspace">
      <aside className="board-panel">
        <div className="example-switcher"><span>LeetCode examples</span><div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)} type="button">{example.id}</button>)}</div></div>
        <div className="panel-heading"><h2>input</h2><span>courses = {numCourses}</span></div>
        <div className="input-grid"><label>numCourses<input value={numCoursesInput} onChange={(event) => setNumCoursesInput(event.target.value)} /></label><label>prerequisites JSON<textarea value={prerequisitesInput} onChange={(event) => setPrerequisitesInput(event.target.value)} /></label><label>queries JSON<textarea value={queriesInput} onChange={(event) => setQueriesInput(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load courses</button></div>
        <div className="graph-legend"><span>white unvisited</span><span>yellow current DFS</span><span>green visited in query</span><span>blue target</span></div>
        <div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{JSON.stringify(selectedExample?.output ?? frame.result ?? frame.results)}</code></div>
      </aside>
      <section className="flow-panel query-flow-panel">
        <div className="panel-heading"><h2>Per-query DFS</h2><span>{frame.query ? `query ${frame.queryIndex! + 1}: ${frame.query[0]} -> ${frame.query[1]}` : "build graph"}</span></div>
        <div className="query-stage">
          <div className="query-graph" aria-label="Course prerequisite graph">
            <svg aria-hidden="true" className="query-edges" viewBox="0 0 100 100" preserveAspectRatio="none"><defs><marker id="query-arrow" markerHeight="6" markerWidth="6" orient="auto" refX="5" refY="3"><path d="M0,0 L0,6 L6,3 z" /></marker></defs>{frame.prerequisites.map(([pre, course], index) => { const from = nodePosition(pre, frame.numCourses); const to = nodePosition(course, frame.numCourses); const active = frame.current === pre && frame.nextCourse === course; return <line className={active ? "query-edge is-active" : "query-edge"} key={`${pre}-${course}-${index}`} markerEnd="url(#query-arrow)" x1={from.x} x2={to.x} y1={from.y} y2={to.y} />; })}</svg>
            {Array.from({ length: frame.numCourses }, (_, course) => { const position = nodePosition(course, frame.numCourses); const visited = frame.visited.includes(course); const current = frame.current === course; const target = frame.target === course; return <div className={["query-node", visited ? "is-visited" : "", current ? "is-current" : "", target ? "is-target" : ""].filter(Boolean).join(" ")} key={course} style={{ left: `${position.x}%`, top: `${position.y}%` }}><strong>{course}</strong><span>{current ? "current" : target ? "target" : visited ? "visited" : "unvisited"}</span></div>; })}
          </div>
          <section className="edge-panel"><h3>graph[pre] - courses</h3><div className="edge-list">{frame.graph.map((neighbors, course) => <div className="edge-row" key={course}><strong>{course}</strong><span>{neighbors.length ? neighbors.join(", ") : "[]"}</span></div>)}</div></section>
        </div>
      </section>
      <aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.kind}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>current query</h3><div className="token-list">{frame.query ? <span>{frame.query[0]} {"->"} {frame.query[1]}</span> : <em>waiting</em>}</div></div><div className="state-block"><h3>dfs stack</h3><div className="token-list">{frame.stack.length ? frame.stack.map((course, index) => <span key={`${course}-${index}`}>dfs({course})</span>) : <em>empty</em>}</div></div><div className="state-block"><h3>visited for this query</h3><div className="token-list words">{frame.visited.length ? frame.visited.map((course) => <span key={course}>{course}</span>) : <em>empty</em>}</div></div><div className="state-block"><h3>res</h3><div className="token-list">{frame.results.length ? frame.results.map((result, index) => <span key={index}>{String(result)}</span>) : <em>[]</em>}</div></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside>
    </section>
  </main>;
}

function nodePosition(node: number, total: number) {
  if (total === 1) return { x: 50, y: 50 };
  const angle = -Math.PI / 2 + (node * Math.PI * 2) / total;
  return { x: 50 + Math.cos(angle) * 36, y: 50 + Math.sin(angle) * 36 };
}
