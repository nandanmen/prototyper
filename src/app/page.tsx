"use client";

import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Node } from "./node";
import type { HtmlNode } from "./types";
import { CanvasProvider, useCanvasContext } from "./context";
import { Toolbar } from "./toolbar";
import { Tree } from "./tree";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
  type ImperativePanelHandle,
} from "react-resizable-panels";

export default function Home() {
  const [nodes, setNodes] = useState<HtmlNode[]>([]);
  const sidebarRef = useRef<ImperativePanelHandle>(null);

  useEffect(() => {
    // on paste, create a new node with the pasted html
    const handlePaste = (event: ClipboardEvent) => {
      const text = event.clipboardData?.getData("text/plain");
      if (!text) return;
      const newNode: HtmlNode = {
        id: crypto.randomUUID(),
        html: text,
      };
      setNodes((prevNodes) => [...prevNodes, newNode]);
    };
    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  return (
    <div className="h-screen bg-neutral-100">
      <PanelGroup direction="horizontal">
        <Panel
          defaultSize={18}
          minSize={18}
          className="bg-neutral-100 relative z-10"
          collapsible
          ref={sidebarRef}
        >
          <aside className="border-r h-full border-neutral-950/10">
            <ul className="px-4 py-1.5 divide-y divide-neutral-950/10">
              {nodes.map((n) => (
                <li className="py-2" key={n.id}>
                  <Tree nodeId={n.id} />
                </li>
              ))}
            </ul>
          </aside>
        </Panel>
        <PanelResizeHandle className="flex items-center">
          <button type="button" className="text-neutral-500">
            <span className="sr-only">Toggle sidebar</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              width="16"
              aria-hidden="true"
            >
              <path
                d="M10 2v20"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </PanelResizeHandle>
        <Panel minSize={70} className="!overflow-visible">
          <CanvasProvider>
            <Canvas nodes={nodes} setNodes={setNodes} />
          </CanvasProvider>
        </Panel>
      </PanelGroup>
    </div>
  );
}

function Canvas({
  nodes,
  setNodes,
}: {
  nodes: HtmlNode[];
  setNodes: Dispatch<SetStateAction<HtmlNode[]>>;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { tool, setTool } = useCanvasContext();
  return (
    <div className="isolate relative h-full">
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div
        ref={canvasRef}
        className="relative flex items-center justify-center h-full"
        onClick={(e) => {
          if (tool !== "add") return;
          if (e.target !== canvasRef.current) return;
          setNodes((p) => [
            ...p,
            {
              id: crypto.randomUUID(),
              html: "<div class='bg-white size-[100px]'></div>",
            },
          ]);
          setTool(null);
        }}
      >
        {nodes.map((node) => (
          <Node node={node} key={node.id} />
        ))}
      </div>
      <Toolbar />
    </div>
  );
}
