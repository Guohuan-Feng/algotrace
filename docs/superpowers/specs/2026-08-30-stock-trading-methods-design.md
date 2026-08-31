# Stock Trading Methods Visualizers Design

## Goal

Add faithful, step-by-step visualizations for the stock-trading problem family
using the exact algorithms supplied by the user. Learners can switch among the
top-down, bottom-up, and greedy/state-compressed implementations without
leaving the problem page.

## Scope

- Upgrade existing visualizers for LeetCode 121 and 122.
- Add independent visualizers for LeetCode 123, 188, 309, and 714.
- Preserve the catalog's numerical ordering and each problem's own folder
  under `apps/web/src/problems`.
- Deploy the completed bundle to the existing AlgoTrace Vercel project.

## Method Availability

| Problem | Methods |
| --- | --- |
| 121. Best Time to Buy and Sell Stock | Top-down, Bottom-up, Greedy |
| 122. Best Time to Buy and Sell Stock II | Top-down, Bottom-up, Greedy |
| 123. Best Time to Buy and Sell Stock III | Top-down, Bottom-up, State Compression |
| 188. Best Time to Buy and Sell Stock IV | Top-down, Bottom-up, State Compression |
| 309. Best Time to Buy and Sell Stock with Cooldown | Top-down, Bottom-up |
| 714. Best Time to Buy and Sell Stock with Transaction Fee | Top-down, Bottom-up, Greedy |

`309` intentionally has no greedy tab: a sale changes the next day's legal
actions, so a local rising-price rule does not preserve the algorithm's
correctness.

## User Experience

Each problem keeps the current three-column AlgoTrace layout:

- The left panel provides official LeetCode examples and validated custom input.
- The center panel displays daily prices and the state representation for the
  selected method.
- The right panel contains sticky playback controls, event explanation, current
  state values, and code with active-line highlighting.

A segmented method control is placed above the center panel. Changing methods
resets playback to that method's first frame but retains the selected example
or custom input.

### Top-down

Top-down frames show the active memoized state and decision being evaluated.
State labels are `dfs(day, holding)` for unlimited or single transactions and
`dfs(day, holding, remainingSells)` for bounded transactions. Every frame
identifies whether it is a base case, cache hit, buy, sell, skip, hold, or
resolved `max` decision. The state table records resolved results; it does not
render an exponentially duplicated recursive tree.

### Bottom-up

Bottom-up frames update a day-by-day DP table. Two-state problems expose
`cash`/`hold`; bounded-transaction problems expose a compact transaction row;
the cooldown visualizer shows the required two-days-back source when buying.
Frames are emitted after each transition so the corresponding code line and
candidate values are visible before the row is committed.

### Greedy and State Compression

Greedy frames expose the exact compact variables from the submitted method:
`minPrice`/`profit` for 121, accumulated gains for 122, and effective purchase
cost for 714. Problems 123 and 188 label their optimized DP accurately as
State Compression and show `buy1/sell1/buy2/sell2` or `buy[j]/sell[j]`; they
are not described as a simple greedy rule.

## Architecture

Create a shared `StockMethodsVisualizer` and small method-specific frame
builders. A common frame type holds the selected strategy, current day,
current price, transition candidates, state snapshot, event detail, and code
line numbers. Problem folders own their definition, examples, algorithm code,
dry-run builders, tests, and a thin `Visualizer.tsx` adapter.

The generic visualizer receives a list of method descriptors. It renders the
appropriate center state surface through explicit strategy metadata rather than
using a generic string-only representation. This preserves a single playback,
input, and code-trace implementation while keeping each algorithm's variables
visible.

Existing `StockTradingVisualizer` remains available until the two existing
problems have migrated. Its behavior must not change for unrelated consumers.

## Inputs and Examples

Use LeetCode examples for each new problem. 188 also accepts `k`; 714 accepts
`fee`. Input validation rejects empty arrays, non-numeric values, negative
transaction limits, and negative fees. The input state remains unchanged after
a validation error.

## Testing and Verification

- Write a failing dry-run test before each builder.
- Assert each method's final profit against its official example.
- Assert at least one signature transition for each rule: one-time sale,
  reinvestment, decrement-on-sell, cooldown skip, and fee deduction.
- Add focused visualizer tests for method switching and preserved input.
- Run the full web test suite and production build.
- Verify the six production routes in a browser: title, strategy control,
  code line advance, and final result frame.

## Out of Scope

- No server, authentication, persistence, or user-progress changes.
- No unrelated catalog or UI redesign.
- No artificial greedy visualizer for cooldown.
