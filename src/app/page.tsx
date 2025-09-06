"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Node } from "./node";
import type { HtmlNode } from "./types";
import { CanvasProvider, useCanvasContext } from "./context";
import { Toolbar } from "./toolbar";
import { Tree } from "./tree";

export default function Home() {
  const [nodes, setNodes] = useState<HtmlNode[]>([]);

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
    <div className="h-screen">
      <aside className="fixed h-screen w-80 flex flex-col left-0 top-0 z-10 p-10 pr-0">
        <div className="ring-neutral-950/10 ring grow bg-white rounded-xl overflow-auto shadow-lg shadow-black/5">
          <ul className="px-6 py-3 divide-y divide-neutral-950/10">
            {nodes.map((n) => (
              <li className="py-3" key={n.id}>
                <Tree nodeId={n.id} />
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <CanvasProvider>
        <Canvas nodes={nodes} setNodes={setNodes} />
      </CanvasProvider>
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
    <div className="relative bg-neutral-100 h-full">
      <div
        ref={canvasRef}
        className="isolate relative flex items-center justify-center h-full"
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
