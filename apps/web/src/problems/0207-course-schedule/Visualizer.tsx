import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { bfsCodeLines, defaultExample, dfsCodeLines, examples, title } from "./data";
import type { CourseScheduleExample } from "./data";
import { createCourseScheduleBfsDryRun, createCourseScheduleDfsDryRun } from "./dryRun";
import type { CourseScheduleMode } from "./dryRun";

export default function CourseScheduleVisualizer({ onBack }: VisualizerProps) {
  const [mode, setMode] = useState<CourseScheduleMode>("dfs");
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [numCourses, setNumCourses] = useState(defaultExample.numCourses);
  const [prerequisites, setPrerequisites] = useState(defaultExample.prerequisites);
  const [numCoursesInput, setNumCoursesInput] = useState(String(defaultExample.numCourses));
  const [prerequisitesInput, setPrerequisitesInput] = useState(JSON.stringify(defaultExample.prerequisites));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(
    () => (mode === "dfs"
      ? createCourseScheduleDfsDryRun(numCourses, prerequisites)
      : createCourseScheduleBfsDryRun(numCourses, prerequisites)),
    [mode, numCourses, prerequisites],
  );
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

  function loadExample(example: CourseScheduleExample) {
    setSelectedExampleId(example.id);
    setNumCourses(example.numCourses);
    setPrerequisites(example.prerequisites);
    setNumCoursesInput(String(example.numCourses));
    setPrerequisitesInput(JSON.stringify(example.prerequisites));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const parsedNumCourses = Number(numCoursesInput);
      const parsedPrerequisites = JSON.parse(prerequisitesInput);
      const valid =
        Number.isInteger(parsedNumCourses) &&
        parsedNumCourses >= 1 &&
        parsedNumCourses <= 10 &&
        Array.isArray(parsedPrerequisites) &&
        parsedPrerequisites.length <= 18 &&
        parsedPrerequisites.every((pair) =>
          Array.isArray(pair) &&
          pair.length === 2 &&
          pair.every(Number.isInteger) &&
          pair[0] >= 0 &&
          pair[0] < parsedNumCourses &&
          pair[1] >= 0 &&
          pair[1] < parsedNumCourses,
        );
      if (!valid) {
        setError("Use numCourses 1-10 and prerequisites like [[1,0],[2,1]].");
        return;
      }
      setSelectedExampleId(0);
      setNumCourses(parsedNumCourses);
      setPrerequisites(parsedPrerequisites);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError("Use valid JSON, for example [[1,0],[2,1]].");
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
          <div className="example-switcher"><span>algorithm</span><div><button className={mode === "dfs" ? "active" : ""} onClick={() => { setMode("dfs"); setStep(0); setPlaying(false); }}>DFS</button><button className={mode === "bfs" ? "active" : ""} onClick={() => { setMode("bfs"); setStep(0); setPlaying(false); }}>BFS</button></div></div>
          <div className="example-switcher"><span>LeetCode examples</span><div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)}>{example.id}</button>)}</div></div>
          <div className="panel-heading"><h2>input</h2><span>courses = {numCourses}</span></div>
          <div className="input-grid">
            <label>numCourses<input value={numCoursesInput} onChange={(event) => setNumCoursesInput(event.target.value)} /></label>
            <label>prerequisites JSON<textarea value={prerequisitesInput} onChange={(event) => setPrerequisitesInput(event.target.value)} /></label>
            {error ? <p className="error">{error}</p> : null}
            <button className="command load" onClick={loadInput}><Upload size={16} />Load graph</button>
          </div>
          <div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{String(selectedExample?.output ?? frame.result ?? "pending")}</code></div>
        </aside>
        <section className="flow-panel course-flow-panel">
          <div className="panel-heading"><h2>{mode === "dfs" ? "DFS Three Colors" : "BFS Topological Sort"}</h2><span>result: {String(frame.result ?? "pending")}</span></div>
          <div className="course-stage">
            <div className="course-graph">
              {Array.from({ length: frame.numCourses }, (_, course) => (
                <div
                  className={[
                    "course-node",
                    frame.visited[course] === 1 ? "is-visiting" : "",
                    frame.visited[course] === 2 ? "is-done" : "",
                    frame.current === course ? "is-current" : "",
                    frame.target === course ? "is-target" : "",
                    frame.cycleEdge?.includes(course) ? "is-cycle" : "",
                  ].filter(Boolean).join(" ")}
                  key={course}
                >
                  <strong>{course}</strong>
                  <span>{mode === "dfs" ? `state=${frame.visited[course]}` : frame.visited[course] === 2 ? "taken" : frame.visited[course] === 1 ? "queued" : `in=${frame.indegree[course]}`}</span>
                </div>
              ))}
            </div>
            <section className="edge-panel">
              <h3>graph[pre] {"->"} courses</h3>
              <div className="edge-list">
                {frame.graph.map((nextCourses, pre) => (
                  <div className="edge-row" key={pre}><strong>{pre}</strong><span>{nextCourses.length ? nextCourses.join(", ") : "[]"}</span></div>
                ))}
              </div>
            </section>
          </div>
        </section>
        <aside className="state-panel">
          <div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.kind}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div>
          {mode === "dfs" ? <><div className="state-block"><h3>recursion stack</h3><div className="token-list">{frame.stack.length ? frame.stack.map((course, index) => <span key={`${course}-${index}`}>dfs({course})</span>) : <em>empty</em>}</div></div><div className="state-block"><h3>legend</h3><div className="token-list"><span>0 unvisited</span><span>1 visiting</span><span>2 done</span></div></div></> : <><div className="state-block"><h3>queue</h3><div className="token-list">{frame.queue.length ? frame.queue.map((course, index) => <span key={`${course}-${index}`}>{course}</span>) : <em>empty</em>}</div></div><div className="state-block"><h3>indegree / count</h3><pre className="matrix-state">{JSON.stringify(frame.indegree)}{`\ncount = ${frame.count}`}</pre></div><div className="state-block"><h3>legend</h3><div className="token-list"><span>queued</span><span>taken</span><span>indegree 0 unlocks a course</span></div></div></>}
          <CodeTrace activeLines={frame.activeLines} codeLines={mode === "dfs" ? dfsCodeLines : bfsCodeLines} />
        </aside>
      </section>
    </main>
  );
}
