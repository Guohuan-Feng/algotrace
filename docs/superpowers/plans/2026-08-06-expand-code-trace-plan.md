# Expandable Code Trace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let learners expand the shared Code trace panel until it uses the available height of the right-hand state column.

**Architecture:** `CodeTrace` owns one local boolean, rendering an accessible icon button and an expanded CSS class. The existing flex layout then lets the panel fill the space below the sticky event and controls section; CSS hides only supplemental state blocks while expanded. A focused component test verifies both state changes.

**Tech Stack:** React 18, TypeScript, Vite, Lucide React, Vitest, Testing Library.

## Global Constraints

- Keep the step controls and event explanation visible at the top of the right-hand panel.
- Apply the feature through the shared component, without editing individual problem visualizers.
- Keep Code trace code scrolling within the panel.
- Use an icon-only control with accessible text and keyboard focus.
- Respect the existing neutral/green visual system and 8px-or-less control corners.

---

### Task 1: Add a focused component-test harness

**Files:**
- Modify: `outputs/trie-dfs-react-flow/package.json`
- Modify: `outputs/trie-dfs-react-flow/pnpm-lock.yaml`
- Create: `outputs/trie-dfs-react-flow/vitest.config.ts`
- Create: `outputs/trie-dfs-react-flow/src/components/CodeTrace.test.tsx`

**Interfaces:**
- Consumes: `CodeTrace` props `{ codeLines: string[]; activeLines: number[] }`.
- Produces: `pnpm test` for a component regression suite and a red test that describes the missing expand control.

- [ ] **Step 1: Add test dependencies and script**

Update `package.json` with the exact development dependencies and script:

```json
{
  "scripts": {
    "test": "vitest run",
    "dev": "vite --host 127.0.0.1",
    "build": "tsc && vite build",
    "preview": "vite preview --host 127.0.0.1"
  },
  "devDependencies": {
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.6.1",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "jsdom": "^25.0.1",
    "typescript": "^5.7.2",
    "vitest": "^3.0.5"
  }
}
```

Run `pnpm install` from `outputs/trie-dfs-react-flow` to regenerate the lockfile.

- [ ] **Step 2: Configure jsdom and write the failing behavior test**

Create `vitest.config.ts`:

```ts
/// <reference types="vitest/config" />
import { defineConfig } from "vite";

export default defineConfig({
  test: { environment: "jsdom", globals: false },
});
```

Create `src/components/CodeTrace.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CodeTrace } from "./CodeTrace";

describe("CodeTrace", () => {
  it("expands the code panel and restores its compact state", async () => {
    const user = userEvent.setup();
    render(<CodeTrace activeLines={[2]} codeLines={["class Solution:", "  return 2"]} />);

    const codeTrace = screen.getByRole("region", { name: "Code trace" });
    const toggle = screen.getByRole("button", { name: "Expand code trace" });

    expect(codeTrace.className).not.toContain("is-expanded");
    await user.click(toggle);
    expect(codeTrace.className).toContain("is-expanded");
    expect(screen.getByRole("button", { name: "Collapse code trace" }).getAttribute("aria-expanded")).toBe("true");

    await user.click(screen.getByRole("button", { name: "Collapse code trace" }));
    expect(codeTrace.className).not.toContain("is-expanded");
  });
});
```

- [ ] **Step 3: Run the test and verify it fails for the missing interaction**

Run: `pnpm test src/components/CodeTrace.test.tsx`

Expected: FAIL because no `region` named `Code trace` or no button named `Expand code trace` exists.

- [ ] **Step 4: Commit the red test and test setup**

```bash
git add outputs/trie-dfs-react-flow/package.json outputs/trie-dfs-react-flow/pnpm-lock.yaml outputs/trie-dfs-react-flow/vitest.config.ts outputs/trie-dfs-react-flow/src/components/CodeTrace.test.tsx
git commit -m "Add code trace expansion test"
```

### Task 2: Implement the shared expand and collapse control

**Files:**
- Modify: `outputs/trie-dfs-react-flow/src/components/CodeTrace.tsx`
- Modify: `outputs/trie-dfs-react-flow/src/styles.css`
- Test: `outputs/trie-dfs-react-flow/src/components/CodeTrace.test.tsx`

**Interfaces:**
- Consumes: the test harness from Task 1 and the existing `CodeTrace` props.
- Produces: `CodeTrace` with a local `expanded` state, accessible expand/collapse button, and class `is-expanded` for the state-column layout.

- [ ] **Step 1: Add the minimal component state and accessible icon button**

Replace the component shell with the following structure, preserving the existing snippet and code-line rendering inside the `pre` element:

```tsx
import { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

export function CodeTrace({ codeLines, activeLines }: CodeTraceProps) {
  const [expanded, setExpanded] = useState(false);
  const label = expanded ? "Collapse code trace" : "Expand code trace";

  return (
    <div aria-label="Code trace" className={`code-window${expanded ? " is-expanded" : ""}`} role="region">
      <div className="code-title">
        <h3>Code trace</h3>
        <div className="code-title-actions">
          <span>{activeLines.length ? `line ${activeLines.join(", ")}` : "idle"}</span>
          <button
            aria-expanded={expanded}
            aria-label={label}
            className="code-trace-expand"
            onClick={() => setExpanded((current) => !current)}
            title={label}
            type="button"
          >
            {expanded ? <Minimize2 aria-hidden="true" size={15} /> : <Maximize2 aria-hidden="true" size={15} />}
          </button>
        </div>
      </div>
      {/* Keep the existing active snippet and preformatted code here unchanged. */}
    </div>
  );
}
```

- [ ] **Step 2: Make the panel use the available state-column height**

Append scoped rules to `styles.css`:

```css
.code-title-actions {
  align-items: center;
  display: flex;
  gap: 8px;
}

.code-trace-expand {
  align-items: center;
  background: transparent;
  border: 1px solid rgba(220, 235, 226, 0.35);
  border-radius: 6px;
  color: #dcebe2;
  cursor: pointer;
  display: inline-flex;
  height: 28px;
  justify-content: center;
  padding: 0;
  width: 28px;
}

.code-trace-expand:hover {
  background: rgba(220, 235, 226, 0.12);
}

.code-trace-expand:focus-visible {
  outline: 2px solid #9ecaae;
  outline-offset: 2px;
}

.state-panel:has(.code-window.is-expanded) > .state-block {
  display: none;
}

.state-panel:has(.code-window.is-expanded) > .code-window {
  flex: 1 1 auto;
  min-height: 0;
}
```

The existing sticky controls remain the first state-panel child and the existing code-window scrolling remains internal. The selector targets direct `state-block` children only, leaving the controls visible.

- [ ] **Step 3: Run the focused test and confirm it passes**

Run: `pnpm test src/components/CodeTrace.test.tsx`

Expected: PASS with one test passing.

- [ ] **Step 4: Run the full unit suite and production build**

Run: `pnpm test && pnpm build`

Expected: both commands exit with status 0.

- [ ] **Step 5: Commit the behavior and styling**

```bash
git add outputs/trie-dfs-react-flow/src/components/CodeTrace.tsx outputs/trie-dfs-react-flow/src/styles.css
git commit -m "Add expandable code trace panel"
```

### Task 3: Browser acceptance check and deployment

**Files:**
- No source changes expected.

**Interfaces:**
- Consumes: the shared implementation from Task 2.
- Produces: verified local interaction and the updated production deployment.

- [ ] **Step 1: Start the development server**

Run from `outputs/trie-dfs-react-flow`:

```bash
pnpm dev -- --host 127.0.0.1
```

- [ ] **Step 2: Check the Trie page interaction in a browser**

Open `http://127.0.0.1:5173/#/problems/design-add-and-search-words-data-structure` and confirm all of the following:

1. The Code trace header contains a compact expand icon with the tooltip “Expand code trace”.
2. Clicking it hides only the call-stack and output blocks, while the event explanation and step controls remain fixed above the expanded code panel.
3. The code panel reaches the lower edge of the right column and scrolls internally for long code.
4. Clicking the collapse icon restores the compact layout.

- [ ] **Step 3: Deploy the verified application to the existing Vercel alias**

Run the project’s existing production deploy and alias commands, then open `https://algotrace-dryrun.vercel.app` and repeat the expand/collapse check.

- [ ] **Step 4: Record the verification result**

Run `git status --short` and report the commit identifiers, build output, and deployed URL. Preserve the pre-existing untracked `outputs/trie-dfs-react-flow/.gitignore` file.
