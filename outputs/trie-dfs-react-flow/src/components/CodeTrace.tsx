import { Maximize2, Minimize2 } from "lucide-react";
import { useState } from "react";

type CodeTraceProps = {
  codeLines: string[];
  activeLines: number[];
};

export function CodeTrace({ codeLines, activeLines }: CodeTraceProps) {
  const [expanded, setExpanded] = useState(false);
  const toggleLabel = expanded ? "Collapse code trace" : "Expand code trace";

  return (
    <div aria-label="Code trace" className={`code-window${expanded ? " is-expanded" : ""}`} role="region">
      <div className="code-title">
        <h3>Code trace</h3>
        <div className="code-title-actions">
          <span>{activeLines.length ? `line ${activeLines.join(", ")}` : "idle"}</span>
          <button
            aria-expanded={expanded}
            aria-label={toggleLabel}
            className="code-trace-expand"
            onClick={() => setExpanded((current) => !current)}
            title={toggleLabel}
            type="button"
          >
            {expanded ? <Minimize2 aria-hidden="true" size={15} /> : <Maximize2 aria-hidden="true" size={15} />}
          </button>
        </div>
      </div>
      <div className="active-snippet">
        {activeLines.length ? (
          activeLines.map((lineNumber) => (
            <div key={lineNumber}>
              <span>{lineNumber}</span>
              <code>{codeLines[lineNumber - 1]}</code>
            </div>
          ))
        ) : (
          <div>
            <span>-</span>
            <code>Waiting for the next dry-run step</code>
          </div>
        )}
      </div>
      <pre>
        {codeLines.map((line, index) => {
          const lineNumber = index + 1;
          const isActive = activeLines.includes(lineNumber);
          return (
            <span className={isActive ? "code-line active" : "code-line"} key={`${lineNumber}-${line}`}>
              <span className="code-number">{lineNumber}</span>
              <code>{line || " "}</code>
            </span>
          );
        })}
      </pre>
    </div>
  );
}
