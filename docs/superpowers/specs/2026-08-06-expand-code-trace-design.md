# Expandable Code Trace

## Goal

Let a learner expand the code trace so it fills the available height of the right-hand state column while they step through an algorithm.

## Interaction

- Add an icon-only expand/collapse control in the `Code trace` header.
- In its normal state, the code trace keeps its existing compact height.
- When expanded, it occupies all remaining vertical space in the right-hand column below the sticky controls.
- The event summary and step controls remain fixed at the top of that column.
- Code continues to scroll inside its own panel and follows the active execution lines.
- The expanded state is local to the current visualizer view and resets when that view unmounts.

## Implementation

- Put the interaction state and the header button in the shared `CodeTrace` component so every existing problem receives the feature.
- Pass the expanded state to the surrounding right-column layout through a small wrapper or callback, allowing the code panel to become a flexible row only when expanded.
- Add scoped CSS for the expanded right-column layout, code-panel height, icon button, keyboard focus, and reduced-motion-safe transition.

## Verification

- Add a component-level regression test covering the expand and collapse control.
- Build the application.
- Check a Trie visualizer in the browser: expand the code trace, confirm it fills the right column, verify the controls remain reachable, and collapse it again.
