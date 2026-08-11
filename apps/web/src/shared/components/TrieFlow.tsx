import { useCallback, useEffect, useMemo, useRef } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import type { ReactFlowInstance } from "reactflow";
import { flattenTrie } from "../lib/trieModel";
import type { TrieNodeModel } from "../types";

type TrieFlowProps = {
  activeTrieId: string;
  path: string;
  root: TrieNodeModel;
};

export function TrieFlow({ activeTrieId, path, root }: TrieFlowProps) {
  const flowPanelRef = useRef<HTMLElement | null>(null);
  const flowInstanceRef = useRef<ReactFlowInstance | null>(null);
  const trieGraph = useMemo(() => flattenTrie(root), [root]);

  const resetTrieViewport = useCallback((duration = 0) => {
    const panelWidth = flowPanelRef.current?.clientWidth ?? 900;
    flowInstanceRef.current?.setViewport(
      {
        x: panelWidth / 2,
        y: 42,
        zoom: 1,
      },
      { duration },
    );
  }, []);

  const flowNodes = useMemo(
    () =>
      trieGraph.nodes.map((node) => {
        const isActive = node.id === activeTrieId;
        const isInPath = Boolean(node.data.prefix && path && path.startsWith(node.data.prefix));
        const isWord = Boolean(node.data.word);

        return {
          ...node,
          className: [
            "trie-node",
            isActive ? "is-active" : "",
            isInPath ? "is-path" : "",
            isWord ? "is-word" : "",
          ]
            .filter(Boolean)
            .join(" "),
          data: {
            label: (
              <div className="trie-node-content">
                <strong>{node.data.label === "root" ? "root" : node.data.label}</strong>
                <span>{node.data.prefix || "root"}</span>
              </div>
            ),
          },
        };
      }),
    [activeTrieId, path, trieGraph.nodes],
  );

  const flowEdges = useMemo(
    () =>
      trieGraph.edges.map((edge) => {
        const isPathEdge = flowNodes.some((node) => node.id === edge.target && node.className?.includes("is-path"));

        return {
          ...edge,
          animated: isPathEdge,
          className: isPathEdge ? "edge-path" : "",
        };
      }),
    [flowNodes, trieGraph.edges],
  );

  useEffect(() => {
    const id = window.requestAnimationFrame(() => resetTrieViewport());
    return () => window.cancelAnimationFrame(id);
  }, [resetTrieViewport, trieGraph.nodes.length]);

  return (
    <section className="flow-panel" ref={flowPanelRef}>
      <div className="panel-heading">
        <h2>Trie</h2>
        <span>active prefix: {path || "root"}</span>
      </div>
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        defaultViewport={{ x: 450, y: 42, zoom: 1 }}
        minZoom={0.25}
        maxZoom={1.8}
        nodeOrigin={[0.5, 0]}
        onInit={(instance) => {
          flowInstanceRef.current = instance;
          window.requestAnimationFrame(() => resetTrieViewport());
        }}
      >
        <Background gap={22} size={1} />
        <Controls />
      </ReactFlow>
    </section>
  );
}
