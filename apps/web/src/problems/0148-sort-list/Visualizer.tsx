import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title } from "./data";
import type { SortListExample } from "./data";
import { createSortListDryRun } from "./dryRun";

export default function SortListVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [values, setValues] = useState(defaultExample.values);
  const [valuesInput, setValuesInput] = useState(JSON.stringify(defaultExample.values));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");

  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createSortListDryRun(values), [values]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)];

  useEffect(() => {
    if (!playing) {
      return;
    }
    if (step >= dryRun.frames.length - 1) {
      setPlaying(false);
      return;
    }
    const id = window.setTimeout(() => setStep((current) => current + 1), 650);
    return () => window.clearTimeout(id);
  }, [dryRun.frames.length, playing, step]);

  function loadExample(example: SortListExample) {
    setSelectedExampleId(example.id);
    setValues(example.values);
    setValuesInput(JSON.stringify(example.values));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const parsed = JSON.parse(valuesInput);
      if (!Array.isArray(parsed) || parsed.length < 1 || parsed.length > 8 || !parsed.every(Number.isInteger)) {
        setError("Use a JSON array of 1 to 8 integers, for example [4,2,1,3].");
        return;
      }
      setSelectedExampleId(0);
      setValues(parsed);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError("Use valid JSON, for example [4,2,1,3].");
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <button className="back-link compact" onClick={onBack}>
            <ArrowLeft size={16} />
            Catalog
          </button>
          <p className="eyebrow">AlgoTrace dry run</p>
          <h1>{title}</h1>
        </div>
        <div className="step-pill">
          Step {step + 1} / {dryRun.frames.length}
        </div>
      </header>

      <section className="workspace">
        <aside className="board-panel">
          <div className="example-switcher" aria-label="LeetCode examples">
            <span>LeetCode examples</span>
            <div>
              {examples.map((example) => (
                <button
                  className={selectedExampleId === example.id ? "active" : ""}
                  key={example.id}
                  onClick={() => loadExample(example)}
                  type="button"
                >
                  {example.id}
                </button>
              ))}
            </div>
          </div>

          <div className="panel-heading">
            <h2>head</h2>
            <span>len = {values.length}</span>
          </div>

          <LinkedList values={values} />

          <div className="expected-output">
            <span>phase</span>
            <code>{frame.phase}</code>
          </div>

          <div className="input-grid">
            <label>
              list JSON
              <textarea value={valuesInput} onChange={(event) => setValuesInput(event.target.value)} />
            </label>
            {error ? <p className="error">{error}</p> : null}
            <button className="command load" onClick={loadInput}>
              <Upload size={16} />
              Load list
            </button>
          </div>

          <div className="expected-output">
            <span>{selectedExample ? `${selectedExample.label} output` : "Current output"}</span>
            <code>{JSON.stringify(selectedExample?.output ?? frame.result)}</code>
          </div>
        </aside>

        <section className="flow-panel list-flow-panel">
          <div className="panel-heading">
            <h2>Linked List Merge Sort</h2>
            <span>{frame.phase}</span>
          </div>

          <div className="list-stage">
            <section className="list-zone">
              <div className="panel-heading compact-heading">
                <h3>middleNode / split</h3>
                <span>{frame.cutIndex !== null ? `cut after index ${frame.cutIndex}` : "find middle"}</span>
              </div>
              <LinkedList
                values={frame.list}
                cutIndex={frame.cutIndex}
                fastIndex={frame.fastIndex}
                preIndex={frame.preIndex}
                slowIndex={frame.slowIndex}
              />
            </section>

            <section className="list-zone split-zone">
              <div>
                <h3>left half</h3>
                <LinkedList values={frame.leftList} tone="green" />
              </div>
              <div>
                <h3>right half</h3>
                <LinkedList values={frame.rightList} tone="amber" />
              </div>
            </section>

            <section className="list-zone">
              <div className="panel-heading compact-heading">
                <h3>mergeTwoLists</h3>
                <span>{frame.compare ? `${frame.compare[0]} vs ${frame.compare[1]}` : "append smaller node"}</span>
              </div>
              <div className="merge-grid">
                <div>
                  <h3>list1</h3>
                  <LinkedList values={frame.leftList} compareValue={frame.compare?.[0] ?? null} tone="green" />
                </div>
                <div>
                  <h3>list2</h3>
                  <LinkedList values={frame.rightList} compareValue={frame.compare?.[1] ?? null} tone="amber" />
                </div>
                <div className="merged-row">
                  <h3>merged</h3>
                  <LinkedList values={frame.merged} tone="dark" />
                </div>
              </div>
            </section>
          </div>
        </section>

        <aside className="state-panel">
          <div className="state-sticky">
            <div className={`event-card ${frame.kind}`}>
              <p className="eyebrow">{frame.kind}</p>
              <h2>{frame.title}</h2>
              <p>{frame.detail}</p>
            </div>

            <StepControls
              frameCount={dryRun.frames.length}
              playing={playing}
              step={step}
              onPlayingChange={setPlaying}
              onStepChange={setStep}
            />
          </div>

          <div className="state-block">
            <h3>call stack</h3>
            <div className="token-list">
              {frame.stack.length ? frame.stack.map((item) => <span key={item}>{item}</span>) : <em>empty</em>}
            </div>
          </div>

          <div className="state-block">
            <h3>pointers</h3>
            <div className="token-list">
              <span>slow = {frame.slowIndex ?? "none"}</span>
              <span>fast = {frame.fastIndex ?? "none"}</span>
              <span>pre = {frame.preIndex ?? "none"}</span>
              <span>cut = {frame.cutIndex ?? "none"}</span>
            </div>
          </div>

          <div className="state-block">
            <h3>result</h3>
            <div className="token-list words">
              {frame.result.length ? <span>{JSON.stringify(frame.result)}</span> : <em>[]</em>}
            </div>
          </div>

          <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
        </aside>
      </section>
    </main>
  );
}

type LinkedListProps = {
  values: number[];
  slowIndex?: number | null;
  fastIndex?: number | null;
  preIndex?: number | null;
  cutIndex?: number | null;
  compareValue?: number | null;
  tone?: "green" | "amber" | "dark";
};

function LinkedList({
  values,
  slowIndex = null,
  fastIndex = null,
  preIndex = null,
  cutIndex = null,
  compareValue = null,
  tone,
}: LinkedListProps) {
  if (!values.length) {
    return <div className="linked-list empty-list">None</div>;
  }

  return (
    <div className="linked-list">
      {values.map((value, index) => {
        const className = [
          "list-node",
          tone ? `tone-${tone}` : "",
          slowIndex === index ? "is-slow" : "",
          fastIndex === index ? "is-fast" : "",
          preIndex === index ? "is-pre" : "",
          cutIndex === index ? "is-cut" : "",
          compareValue === value ? "is-compare" : "",
        ]
          .filter(Boolean)
          .join(" ");
        return (
          <div className="list-node-wrap" key={`${value}-${index}`}>
            <div className={className}>
              <strong>{value}</strong>
              <span>{index}</span>
              <div className="pointer-tags">
                {preIndex === index ? <em>pre</em> : null}
                {slowIndex === index ? <em>slow</em> : null}
                {fastIndex === index ? <em>fast</em> : null}
              </div>
            </div>
            {index < values.length - 1 ? <div className={cutIndex === index ? "list-arrow is-cut" : "list-arrow"} /> : null}
          </div>
        );
      })}
    </div>
  );
}
