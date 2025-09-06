import { motion } from "motion/react";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import type { HtmlNode } from "./types";
import { useCanvasContext } from "./context";
import clsx from "clsx";
import { onHighlightElement } from "./event";

export function Node({ node }: { node: HtmlNode }) {
  const { tool, setTool, activeNode, setActiveNode } = useCanvasContext();
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [element, setElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = node.html;
    setElement(ref.current.querySelector(":first-child") as HTMLElement);
  }, [node.html]);

  const isActive = activeNode === node.id;

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
  }, [element]);

  useEffect(() => {
    if (isActive) {
      inputRef.current?.focus();
    }
  }, [isActive]);

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
      {/* {isActive && (
				<div className="absolute top-full mt-2 z-10 left-1/2 -translate-x-1/2">
					<ArrowSvg />
				</div>
			)} */}
      <input
        ref={inputRef}
        className={clsx(
          "absolute top-full mt-2 rounded-lg ring ring-neutral-950/10 bg-neutral-50 h-9 px-3.5 font-mono shadow-black/5 text-xs focus-visible:outline-none transition-all origin-top left-1/2 -translate-x-1/2",
          isActive ? "scale-100 opacity-100" : "scale-95 opacity-0",
        )}
        type="text"
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
      />
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: only capturing the click event here */}
      <div
        ref={ref}
        className={clsx(
          "w-max ring-blue-500 hover:not-has-hover:ring",
          "[&_*]:hover:not-has-hover:outline [&_*]:focus:outline [&_*]:outline-blue-500",
          isActive ? "ring-2" : "hover:ring",
        )}
        onMouseDown={() => setActiveNode(node.id)}
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
            setTool(null);
          } else {
            setElement(parent);
          }
        }}
      />
    </motion.button>
  );
}

/* function ArrowSvg() {
	return (
		<svg
			width="20"
			height="10"
			viewBox="0 0 20 10"
			fill="none"
			aria-hidden="true"
		>
			<path
				d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
				className="fill-[canvas]"
			/>
			<path
				d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
				className="fill-gray-200"
			/>
			<path
				d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
				fill="none"
			/>
		</svg>
	);
}
 */
