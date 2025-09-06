import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { dispatchHighlightElement } from "./event";

export function Tree({ nodeId }: { nodeId: string }) {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [, setKey] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      const el = document.querySelector(
        `[data-node-id="${nodeId}"] > div > :first-child`,
      );
      const observer = new MutationObserver(() => {
        setKey((k) => k + 1);
      });
      observer.observe(el as HTMLElement, {
        childList: true,
        subtree: true,
        attributes: true,
      });
      setElement(el as HTMLElement);
    }, 50);
  }, [nodeId]);

  if (!element) return null;
  return <ElementInfo nodeId={nodeId} element={element} />;
}

function ElementInfo({
  nodeId,
  element,
}: {
  nodeId: string;
  element: HTMLElement | ChildNode;
}) {
  if (element.nodeType === element.TEXT_NODE) {
    return <p className="italic text-neutral-500">{element.textContent}</p>;
  }
  const el = element as HTMLElement;
  return (
    <div className="font-mono text-sm">
      <motion.button
        className="flex gap-2 w-full hover:bg-neutral-200"
        onHoverStart={() => {
          el.style.outlineWidth = "1px";
          el.style.outlineStyle = "solid";
        }}
        onHoverEnd={() => {
          el.style.outlineWidth = "";
          el.style.outlineStyle = "";
        }}
        onClick={() => dispatchHighlightElement({ nodeId, element: el })}
      >
        <span className="lowercase font-medium">{el.tagName}</span>
        <span className="text-neutral-500 whitespace-nowrap truncate">
          {String(el.className)}
        </span>
      </motion.button>
      <ul className="pl-4">
        {[...el.childNodes].map((c, i) => {
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <li key={i}>
              <ElementInfo nodeId={nodeId} element={c} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
