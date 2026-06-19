import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { createOperationDryRun } from "../lib/trieOperationDryRun";
import type { TrieOperation, TrieOperationMode, VisualizerProps } from "../types";
import { CodeTrace } from "./CodeTrace";
import { StepControls } from "./StepControls";
import { TrieFlow } from "./TrieFlow";

type OperationTrieVisualizerProps = VisualizerProps & {
  codeLines: string[];
  mode: TrieOperationMode;
  operations: TrieOperation[];
  title: string;
};

export function OperationTrieVisualizer({ codeLines, mode, onBack, operations, title }: OperationTrieVisualizerProps) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const dryRun = useMemo(() => createOperationDryRun({ codeLines, mode, operations }), [codeLines, mode, operations]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)];
  const activeOperation = dryRun.operations[frame.operationIndex];

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
          <div className="panel-heading">
            <h2>LeetCode Example</h2>
            <span>official sample</span>
          </div>

          <div className="operation-list">
            {dryRun.operations.map((operation, index) => (
              <button
                className={index === frame.operationIndex ? "operation-row active" : "operation-row"}
                key={`${operation.name}-${index}`}
                onClick={() => {
                  const nextStep = dryRun.frames.findIndex((item) => item.operationIndex === index);
                  if (nextStep >= 0) {
                    setStep(nextStep);
                    setPlaying(false);
                  }
                }}
                type="button"
              >
                <span>#{index}</span>
                <strong>{operation.name}({operation.args.map((arg) => `"${arg}"`).join(", ")})</strong>
                <code>{operation.output}</code>
              </button>
            ))}
          </div>

          <div className="expected-output">
            <span>Input</span>
            <code>{JSON.stringify(dryRun.operations.map((operation) => operation.name))}</code>
          </div>
          <div className="expected-output">
            <span>Arguments</span>
            <code>{JSON.stringify(dryRun.operations.map((operation) => operation.args))}</code>
          </div>
          <div className="expected-output">
            <span>Output</span>
            <code>{JSON.stringify(dryRun.operations.map((operation) => parseOperationOutput(operation.output)))}</code>
          </div>
        </aside>

        <TrieFlow activeTrieId={frame.activeTrieId} path={frame.path} root={frame.root} />

        <aside className="state-panel">
          <div className="state-sticky">
            <div className={`event-card ${frame.kind}`}>
              <p className="eyebrow">{activeOperation.name}</p>
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
            <h3>outputs so far</h3>
            <div className="token-list words">
              {frame.results.map((result, index) => (
                <span key={`${result}-${index}`}>{result}</span>
              ))}
            </div>
          </div>

          <CodeTrace activeLines={frame.activeLines} codeLines={dryRun.code} />
        </aside>
      </section>
    </main>
  );
}

function parseOperationOutput(output: string): boolean | null {
  if (output === "null") {
    return null;
  }

  return output === "true";
}
