# AlgoTrace

AlgoTrace is a visual dry-run playground for algorithm problems. It currently includes Trie and DFS visualizers for LeetCode-style examples, with step controls, code-line highlighting, and animated state changes.

## Local Development

```bash
cd outputs/trie-dfs-react-flow
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

The project is configured for Vercel through `vercel.json`.

## Architecture

See `docs/ARCHITECTURE.md` for the 500-problem folder structure and the steps for adding a new visualizer.
