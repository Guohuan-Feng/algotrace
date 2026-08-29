import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type CourseScheduleIiInput } from "./data";
import { createCourseScheduleIiDryRun } from "./dryRun";

export default function CourseScheduleIiVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState(defaultExample.id);
  const [input, setInput] = useState<CourseScheduleIiInput>(defaultExample.input);
  const [numCoursesInput, setNumCoursesInput] = useState(String(defaultExample.input.numCourses));
  const [prerequisitesInput, setPrerequisitesInput] = useState(JSON.stringify(defaultExample.input.prerequisites));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createCourseScheduleIiDryRun(input.numCourses, input.prerequisites), [input]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)]!;

  useEffect(() => {
    if (!playing || step >= dryRun.frames.length - 1) {
      if (step >= dryRun.frames.length - 1) setPlaying(false);
      return;
    }
    const id = window.setTimeout(() => setStep((current) => current + 1), 650);
    return () => window.clearTimeout(id);
  }, [dryRun.frames.length, playing, step]);

  function loadExample(example: (typeof examples)[number]) {
    setSelectedExampleId(example.id);
    setInput(example.input);
    setNumCoursesInput(String(example.input.numCourses));
    setPrerequisitesInput(JSON.stringify(example.input.prerequisites));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const numCourses = Number(numCoursesInput);
      const prerequisites = JSON.parse(prerequisitesInput) as number[][];
      if (!Number.isInteger(numCourses) || numCourses < 1 || numCourses > 10 || !Array.isArray(prerequisites) || prerequisites.length > 18 || !prerequisites.every((pair) => Array.isArray(pair) && pair.length === 2 && pair.every((course) => Number.isInteger(course) && course >= 0 && course < numCourses))) throw new Error();
      setSelectedExampleId(0);
      setInput({ numCourses, prerequisites });
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError("Use 1-10 courses and pairs such as [[1,0],[2,1]].");
    }
  }

  return <main className="app-shell">
    <header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {dryRun.frames.length}</div></header>
    <section className="workspace">
      <aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)} type="button">{example.id}</button>)}</div></div><div className="panel-heading"><h2>input</h2><span>courses = {input.numCourses}</span></div><div className="input-grid"><label>numCourses<input value={numCoursesInput} onChange={(event) => setNumCoursesInput(event.target.value)} /></label><label>prerequisites JSON<textarea value={prerequisitesInput} onChange={(event) => setPrerequisitesInput(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load courses</button></div><div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{JSON.stringify(selectedExample?.output ?? frame.result ?? "pending")}</code></div></aside>
      <section className="flow-panel course-flow-panel"><div className="panel-heading"><h2>DFS Postorder Topological Sort</h2><span>{frame.result ? `order = [${frame.result.join(", ")}]` : `postorder = [${frame.res.join(", ")}]`}</span></div><div className="course-stage"><div className="course-graph">{Array.from({ length: frame.numCourses }, (_, course) => <div className={["course-node", frame.state[course] === 1 ? "is-visiting" : "", frame.state[course] === 2 ? "is-done" : "", frame.current === course ? "is-current" : "", frame.neighbor === course ? "is-target" : ""].filter(Boolean).join(" ")} key={course}><strong>{course}</strong><span>{frame.state[course] === 0 ? "unvisited" : frame.state[course] === 1 ? "visiting" : "done"}</span></div>)}</div><section className="edge-panel"><h3>graph[pre] - courses</h3><div className="edge-list">{frame.graph.map((neighbors, course) => <div className="edge-row" key={course}><strong>{course}</strong><span>{neighbors.length ? neighbors.join(", ") : "[]"}</span></div>)}</div></section></div></section>
      <aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.kind}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>recursion stack</h3><div className="token-list">{frame.stack.length ? frame.stack.map((course, index) => <span key={`${course}-${index}`}>dfs({course})</span>) : <em>empty</em>}</div></div><div className="state-block"><h3>state</h3><pre className="matrix-state">{JSON.stringify(frame.state)}</pre></div><div className="state-block"><h3>res (postorder)</h3><div className="token-list">{frame.res.length ? frame.res.map((course, index) => <span key={`${course}-${index}`}>{course}</span>) : <em>[]</em>}</div></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside>
    </section>
  </main>;
}
