"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { h } from "hastscript";
import { toHtml } from "hast-util-to-html";
import clsx from "clsx";
import { Node } from "./node";

type Node = {
  id: string;
  html: {
    text: string;
    tree: null;
  };
  loc: {
    x: number;
    y: number;
  };
};

export default function Home() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [currentNode, setCurrentNode] = useState<string | null>(null);
  const activeNodeEl = document?.querySelector(
    `[data-node-id="${currentNode}"] > div > :first-child`,
  ) as HTMLElement | null;

  // useEffect(() => {
  //   // on paste, create a new node with the pasted html
  //   const handlePaste = (event: ClipboardEvent) => {
  //     const text = event.clipboardData?.getData("text/plain");
  //     if (!text) return;
  //     const newNode: Node = {
  //       id: crypto.randomUUID(),
  //       html: { text, tree: null },
  //       loc: { x: 0, y: 0 },
  //     };
  //     setNodes((prevNodes) => [...prevNodes, newNode]);
  //   };
  //   document.addEventListener("paste", handlePaste);
  //   return () => {
  //     document.removeEventListener("paste", handlePaste);
  //   };
  // }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click target is outside of any node
      const target = event.target as Element;
      const isClickingOnNode = target.closest("[data-node-id]");

      if (!isClickingOnNode && currentNode) {
        setCurrentNode(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [currentNode]);

  return (
    <div className="h-screen grid grid-cols-[1fr]">
      <div className="relative bg-neutral-50 h-full flex items-center justify-center">
        {nodes.map((node) => (
          <Node
            node={node}
            key={node.id}
            onClick={() => setCurrentNode(node.id)}
            isActive={currentNode === node.id}
          />
        ))}
        <div className="absolute bottom-16 w-[300px] rounded-xl ring ring-neutral-950/10 shadow-lg shadow-black/5 h-12 bg-white left-1/2 -translate-x-1/2 flex p-2">
          <button
            className="flex items-center justify-center hover:bg-neutral-100 aspect-square rounded-md"
            onClick={() => {
              const tree = h("div", {
                class: "bg-white size-[100px]",
              });
              setNodes((p) => [
                ...p,
                {
                  id: crypto.randomUUID(),
                  html: {
                    text: toHtml(tree),
                    tree: null,
                  },
                  loc: { x: 0, y: 0 },
                },
              ]);
            }}
          >
            {/*<svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              width="24"
            >
              <path
                d="M20 15.2V8.8C20 7.11984 20 6.27976 19.673 5.63803C19.3854 5.07354 18.9265 4.6146 18.362 4.32698C17.7202 4 16.8802 4 15.2 4H8.8C7.11984 4 6.27976 4 5.63803 4.32698C5.07354 4.6146 4.6146 5.07354 4.32698 5.63803C4 6.27976 4 7.11984 4 8.8V15.2C4 16.8802 4 17.7202 4.32698 18.362C4.6146 18.9265 5.07354 19.3854 5.63803 19.673C6.27976 20 7.11984 20 8.8 20H15.2C16.8802 20 17.7202 20 18.362 19.673C18.9265 19.3854 19.3854 18.9265 19.673 18.362C20 17.7202 20 16.8802 20 15.2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>*/}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              width="24"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.7587 3H15.2413C16.0463 2.99999 16.7106 2.99998 17.2518 3.0442C17.8139 3.09012 18.3306 3.18868 18.816 3.43598C19.5686 3.81947 20.1805 4.43139 20.564 5.18404C20.8113 5.66938 20.9099 6.18608 20.9558 6.74818C21 7.28937 21 7.95372 21 8.75868V15.2413C21 16.0463 21 16.7106 20.9558 17.2518C20.9099 17.8139 20.8113 18.3306 20.564 18.816C20.1805 19.5686 19.5686 20.1805 18.816 20.564C18.3306 20.8113 17.8139 20.9099 17.2518 20.9558C16.7106 21 16.0463 21 15.2413 21H8.75868C7.95372 21 7.28937 21 6.74818 20.9558C6.18608 20.9099 5.66938 20.8113 5.18404 20.564C4.43139 20.1805 3.81947 19.5686 3.43598 18.816C3.18868 18.3306 3.09012 17.8139 3.0442 17.2518C2.99998 16.7106 2.99999 16.0463 3 15.2413V8.75869C2.99999 7.95373 2.99998 7.28936 3.0442 6.74818C3.09012 6.18608 3.18868 5.66938 3.43598 5.18404C3.81947 4.43139 4.43139 3.81947 5.18404 3.43598C5.66938 3.18868 6.18608 3.09012 6.74818 3.0442C7.28936 2.99998 7.95375 2.99999 8.7587 3ZM9.00005 11C8.44777 11 8.00004 11.4477 8.00002 11.9999C7.99999 12.5522 8.44769 13 8.99998 13L11 13.0001L11 15C11 15.5523 11.4477 16 12 16C12.5523 16 13 15.5523 13 15L13 13.0001L15 13.0002C15.5523 13.0002 16 12.5525 16 12.0003C16.0001 11.448 15.5524 11.0002 15.0001 11.0002L13 11.0001L13 9.00022C13 8.44793 12.5523 8.00022 12 8.00021C11.4478 8.00021 11 8.44792 11 9.00021L11 11.0001L9.00005 11Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>
      {/*<aside className="bg-white border-l border-neutral-950/10">
        <section>
          <div className="flex">
            <p>Width</p>
            <p>{activeNodeEl?.computedStyleMap().get("width")?.toString()}</p>
          </div>
          <div>
            <p>Height</p>
            <p>{activeNodeEl?.computedStyleMap().get("height")?.toString()}</p>
          </div>
        </section>
      </aside>*/}
    </div>
  );
}
