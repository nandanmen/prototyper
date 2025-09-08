import { motion } from "motion/react";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import type { HtmlNode } from "./types";
import clsx from "clsx";
import { onHighlightElement } from "./event";
import { useStore } from "./store";

export function Node({ node }: { node: HtmlNode }) {
  const {
    store: { tool, activeNode },
    actions: { setTool, setActiveNode, deleteNode },
  } = useStore();

  const nodeRef = useRef<HTMLButtonElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [element, setElement] = useState<HTMLElement | null>(null);

  const isActive = activeNode === node.id;

  useEffect(() => {
    if (!contentWrapperRef.current) return;
    contentWrapperRef.current.innerHTML = node.html;
    setElement(
      contentWrapperRef.current.querySelector(":first-child") as HTMLElement,
    );
  }, [node.html]);

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
      /* setTimeout(() => {
        inputRef.current?.focus();
      }, 10); */
    } else {
      const timeout = setTimeout(
        () => {
          setElement(null);
        },
        // wait until the animation completes
        150,
      );
      return () => clearTimeout(timeout);
    }
  }, [element, isActive]);

  useEffect(() => {
    if (!element || !isActive) return;
    element.style.outline = "1px solid var(--color-blue-500)";
    return () => {
      element.style.outline = "";
    };
  }, [element, isActive]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!element || !isActive) return;
      const activeElement = document.activeElement as HTMLElement;
      if (
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA" ||
        activeElement?.contentEditable === "true"
      )
        /**
         * We want to ignore the keydown event if the user is currently
         * focused on an input or contentEditable element.
         */
        return;
      if (e.key === "Backspace" || e.key === "Delete") {
        /**
         * Delete the node altogether if it's the first child of the node,
         * otherwise just remove the element.
         */
        if (element.parentElement === contentWrapperRef.current) {
          deleteNode(node.id);
        } else {
          element.remove();
        }
        return;
      }
      if (e.metaKey && e.key === "c") {
        navigator.clipboard.writeText(element.outerHTML);
        return;
      }
      if (e.metaKey && e.key === "v") {
        e.preventDefault();
        navigator.clipboard.readText().then((text) => {
          const div = document.createElement("div");
          div.innerHTML = text;
          element?.appendChild(div);
        });
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <motion.button
      ref={nodeRef}
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
          "absolute top-full mt-2 rounded-lg ring ring-neutral-950/10 bg-neutral-50 min-h-9 w-max max-w-[500px] px-3.5 py-2.5 font-mono text-xs focus-visible:outline-none transition-all origin-top left-1/2 -translate-x-1/2 resize-none shadow-lg shadow-black/5",
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
      <div
        ref={contentWrapperRef}
        className={clsx(
          "w-max ring-blue-500 hover:not-has-hover:ring",
          "[&_*]:hover:not-has-hover:outline [&_*]:focus:outline [&_*]:outline-blue-500",
          isActive && element !== contentWrapperRef.current?.firstChild
            ? "ring-2"
            : "hover:ring",
        )}
        onMouseDown={(e) => {
          setActiveNode(node.id);
          if (!tool) {
            setElement(e.target as HTMLElement);
          }
        }}
        onDoubleClick={(e) => {
          e.preventDefault();
          const target = e.target as HTMLElement;
          // Make the clicked element editable
          if (target.tagName === "P" || target.tagName === "SPAN") {
            target.contentEditable = "true";
            target.focus();
            // Select all text for easy editing
            const range = document.createRange();
            range.selectNodeContents(target);
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(range);
          }
        }}
        onKeyDown={(e) => {
          if (!element || !isActive) return;
          if (
            e.key === "Enter" &&
            (e.target as HTMLElement).contentEditable === "true"
          ) {
            // Handle Enter key to finish editing
            e.preventDefault();
            (e.target as HTMLElement).blur();
            return;
          }
        }}
        onBlur={(e) => {
          // When an element loses focus, make it non-editable and update the node
          const target = e.target as HTMLElement;
          if (target.contentEditable === "true") {
            target.contentEditable = "false";
          }
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
          }
        }}
      />
    </motion.button>
  );
}
