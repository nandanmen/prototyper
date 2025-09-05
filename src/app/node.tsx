import clsx from "clsx";
import { motion } from "motion/react";
import { produce } from "immer";
import { useEffect, useRef, useState } from "react";
import { fromHtml } from "hast-util-from-html";
import { toHtml } from "hast-util-to-html";

export function Node({ node, onClick, isActive }) {
  const [tree, setTree] = useState(() =>
    fromHtml(node.html.text, { fragment: true }),
  );
  const innerHtml = toHtml(tree);

  const first = tree.children.find((child) => child.type === "element");
  if (!first) return null;

  return (
    <motion.button
      data-node-id={node.id}
      className="text-left absolute"
      drag
      dragMomentum={false}
      key={node.id}
      onClick={onClick}
    >
      <p className="absolute bottom-full font-mono text-xs text-neutral-500 mb-1">
        {node.id.split("-").at(0)}
      </p>
      <div className="absolute top-full mt-2 z-10 left-1/2 -translate-x-1/2">
        <ArrowSvg />
      </div>
      <input
        className="absolute top-full mt-4 rounded-lg ring ring-neutral-950/10 shadow-md bg-white h-10 px-3.5 font-mono shadow-black/5 text-sm left-1/2 -translate-x-1/2 focus-visible:outline-none"
        type="text"
        style={{
          fieldSizing: "content",
        }}
        defaultValue={
          first.properties.className?.join(" ") || "bg-white size-[100px]"
        }
        onChange={(e) => {
          setTree(
            produce(tree, (draft) => {
              const first = draft.children.find(
                (child) => child.type === "element",
              );
              if (!first) return draft;
              first.properties.className = e.target.value
                ? e.target.value.split(" ")
                : ["bg-white", "size-[100px]"];
            }),
          );
        }}
      />
      <div
        dangerouslySetInnerHTML={{ __html: innerHtml }}
        className={clsx(
          "w-max bg-white ring-blue-500",
          // isActive && "ring",
        )}
      />
    </motion.button>
  );
}

function ArrowSvg(props: React.ComponentProps<"svg">) {
  return (
    <svg width="20" height="10" viewBox="0 0 20 10" fill="none" {...props}>
      <path
        d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
        className="fill-[canvas]"
      />
      <path
        d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
        className="fill-gray-200 dark:fill-none"
      />
      <path
        d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
        className="dark:fill-gray-300"
      />
    </svg>
  );
}
