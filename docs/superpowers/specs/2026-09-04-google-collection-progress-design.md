# Google Collection and Cross-Device Progress Design

## Goal

Add LeetCode's Google "3 months" company collection to AlgoTrace and let each
learner track completed problems across devices by signing in with Google.

## Scope

- Import the complete 495-problem Google three-month snapshot from the
  user-provided LeetCode collection.
- Expose it as the `Google · 3 months` catalog collection.
- Add a completion control at the far left of every directory row.
- Persist completion state per user with Google OAuth and a cloud database.
- Keep all existing collections, visualizers, search, filters, and routes
  working without requiring sign-in.

## Identity and Storage

Use Supabase Auth with Google OAuth. The application never hardcodes a user's
email address: Google owns account selection, and the user can sign in with any
authorized Google account.

Store progress in a `problem_progress` table:

| Column | Purpose |
| --- | --- |
| `user_id` | Supabase Auth user UUID |
| `problem_id` | LeetCode problem number |
| `completed_at` | UTC timestamp when the problem was marked complete |

`(user_id, problem_id)` is the primary key. Supabase Row Level Security allows
users to read, insert, and delete only rows whose `user_id` equals their own
authenticated ID. The browser uses only the Supabase URL and publishable anon
key; no service-role key is shipped to Vercel or the client bundle.

## Authentication Experience

- A compact account control in the catalog header shows `Sign in with Google`
  when anonymous and the current user avatar/name plus `Sign out` when signed
  in.
- Clicking a completion circle while anonymous records the intended problem in
  memory, opens the Google sign-in flow, and applies the check after the OAuth
  redirect succeeds.
- While auth state is loading, completion controls are disabled with an
  accessible busy label rather than showing an incorrect state.
- If network or database writes fail, the row reverts and exposes a concise,
  actionable error. Local optimistic state is never presented as synchronized
  until the database mutation succeeds.

## Directory Experience

Every problem row begins with a small circular checkbox separate from the row
link. It stops click propagation so marking a problem does not navigate away.

- Empty circle: not completed.
- Green check: completed, with `completed_at` available to screen readers.
- The row title remains the primary click target for opening a visualizer.
- A new `Completion` filter offers `All`, `Completed`, and `Not completed`.
- The collection rail and List selector include `Google · 3 months`.
- The header shows `completed / total` when the Google collection is selected.

The appearance follows the existing light AlgoTrace catalog, not the dark
NeetCode screenshot. The screenshot is a workflow reference: a leading status
control, grouped list, filtering, and visible completion count.

## Google Collection Data

Create a versioned catalog module containing the problem IDs, English titles,
Chinese title when already known, difficulty, tags, source URL, and
`Google · 3 months` collection label. It is a snapshot of the supplied list,
not a claim that LeetCode's live frequency ranking will remain unchanged.

Existing catalog entries merge by problem ID. For each Google problem already
in AlgoTrace, preserve its visualizer status and local metadata. Google-only
problems appear as catalog placeholders with `hasVisualizer: false`, so users
can track work immediately and later attach dry-run visualizations in their
own problem folders.

## Architecture

- `catalog/googleThreeMonths.ts`: the source snapshot and collection metadata.
- `auth/`: Supabase client, auth provider, and typed progress repository.
- `shared/components/ProblemDirectory.tsx`: row checkbox, account control,
  collection progress, and completion filter.
- `catalog/problems.ts`: merge Google items with the current catalog without
  duplicate IDs.
- `supabase/migrations/`: SQL schema, indexes, and RLS policies committed with
  the application.

The auth provider owns session restoration and a `Set<number>` of completed
problem IDs. It exposes asynchronous `toggleCompletion(problemId)` rather than
letting individual rows call Supabase directly.

## Configuration and Deployment

The Supabase project must enable the Google provider and contain the Vercel
production URL plus local development URL in its redirect allowlist. Vercel
receives the following public build-time environment variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Before any external setup is saved, the user must confirm the Google OAuth and
Supabase configuration in the relevant browser dashboard. The implementation
can be completed and tested locally with an explicitly documented unconfigured
state; it must never fabricate credentials.

## Testing and Verification

- Catalog tests verify exactly 495 unique Google collection entries, merge
  behavior for existing IDs, and a stable collection count.
- Progress repository tests cover signed-in loading, insert, delete, duplicate
  toggles, and mutation rollback.
- Directory tests cover the leading completion control, anonymous sign-in
  prompt, completion filter, and no navigation when the control is clicked.
- Run the full web test suite and production build.
- Browser-check Google filtering, sign-in entry point, completed/uncompleted
  filtering, and responsive row layout.
- After configuration, authenticate with Google, mark a test problem complete,
  then verify it from a second browser session. Confirm the user explicitly
  before the OAuth provider or cloud project configuration is saved.

## Out of Scope

- Importing LeetCode submission history automatically.
- Copying the NeetCode visual design or source code.
- Adding a backend server beyond Supabase's managed auth/database service.
- Marking LeetCode problems as solved on the LeetCode site.
