type CodeTraceProps = {
  codeLines: string[];
  activeLines: number[];
};

export function CodeTrace({ codeLines, activeLines }: CodeTraceProps) {
  return (
    <div className="code-window">
      <div className="code-title">
        <h3>Code trace</h3>
        <span>{activeLines.length ? `line ${activeLines.join(", ")}` : "idle"}</span>
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
