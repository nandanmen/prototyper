import { motion } from "motion/react";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import type { HtmlNode } from "./types";
import clsx from "clsx";
import { onHighlightElement } from "./event";
import { useStore } from "./store";

export function Node({ node }: { node: HtmlNode }) {
  const {
    store: { tool, activeNode },
    actions: { setTool, setActiveNode },
  } = useStore();
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [element, setElement] = useState<HTMLElement | null>(null);

  const isActive = activeNode === node.id;

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = node.html;
    setElement(ref.current.querySelector(":first-child") as HTMLElement);
  }, [node.html]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!element) return;
      // if cmd + c
      if (e.metaKey && e.key === "c") {
        navigator.clipboard.writeText(element.outerHTML);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [element]);

  useEffect(() => {
    return onHighlightElement((e) => {
      if (e.detail.nodeId === node.id) {
        setActiveNode(node.id);
        setElement(e.detail.element);
      }
    });
  }, [node.id, setActiveNode]);

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.value = element?.className ?? "";
    if (isActive) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    }
  }, [element, isActive]);

  useEffect(() => {
    if (!element) return;
    if (!isActive) return;
    element.style.outlineWidth = "1px";
    element.style.outlineStyle = "solid";
    return () => {
      element.style.outlineWidth = "";
      element.style.outlineStyle = "";
    };
  }, [element, isActive]);

  return (
    <motion.button
      data-node-id={node.id}
      className={clsx("text-left absolute", isActive && "z-10")}
      drag
      dragMomentum={false}
      key={node.id}
    >
      <p className="absolute bottom-full font-mono text-xs text-neutral-500 mb-1">
        {node.id.split("-").at(0)?.slice(0, 4)}
      </p>
      <textarea
        ref={inputRef}
        className={clsx(
          "absolute top-full mt-2 rounded-lg ring ring-neutral-950/10 bg-neutral-50 min-h-9 w-max max-w-[500px] px-3.5 py-2.5 font-mono text-xs focus-visible:outline-none transition-all origin-top left-1/2 -translate-x-1/2 resize-none",
          isActive ? "scale-100 opacity-100" : "scale-95 opacity-0",
        )}
        spellCheck={false}
        placeholder="Type a Tailwind class..."
        style={
          {
            fieldSizing: "content",
          } as CSSProperties
        }
        onChange={(e) => {
          if (!element) return;
          element.className = e.target.value;
        }}
        onPaste={(e) => e.stopPropagation()}
        onPointerMove={(e) => e.stopPropagation()}
      />
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: only capturing the click event here */}
      <div
        ref={ref}
        className={clsx(
          "w-max ring-blue-500 hover:not-has-hover:ring",
          "[&_*]:hover:not-has-hover:outline [&_*]:focus:outline [&_*]:outline-blue-500",
          isActive && element !== ref.current?.firstChild
            ? "ring-2"
            : "hover:ring",
        )}
        onMouseDown={() => setActiveNode(node.id)}
        onPaste={(e) => {
          e.stopPropagation();
          // TODO: insert the pasted content as a child of the element
        }}
        onClick={(e) => {
          e.preventDefault();
          const parent = e.target as HTMLElement;
          if (tool === "text") {
            const newText = document.createElement("p");
            newText.contentEditable = "true";
            parent.appendChild(newText);
            newText.focus();
            setTool(null);
          } else if (tool === "add") {
            if (getComputedStyle(parent).padding === "0px") {
              parent.classList.add("p-2");
            }
            const newDiv = document.createElement("div");
            newDiv.className = "size-[100px]";
            parent.appendChild(newDiv);
            setElement(newDiv);
            setTool(null);
          } else {
            setElement(parent);
          }
        }}
      />
    </motion.button>
  );
}
