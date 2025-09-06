"use client";

import { clsx } from "clsx";
import { useCanvasContext } from "./context";

export function Toolbar() {
  const { setTool, tool } = useCanvasContext();
  return (
    <div className="absolute bottom-16 w-fit rounded-xl ring ring-neutral-950/10 shadow-lg shadow-black/5 h-12 bg-white left-1/2 -translate-x-1/2 flex p-2 gap-2">
      <button
        className={clsx(
          "flex items-center justify-center aspect-square rounded-md",
          tool === "add" ? "bg-blue-500 text-white" : "hover:bg-neutral-100"
        )}
        type="button"
        onClick={() => setTool("add")}
      >
        <span className="sr-only">Add a new node</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          width="24"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.7587 3H15.2413C16.0463 2.99999 16.7106 2.99998 17.2518 3.0442C17.8139 3.09012 18.3306 3.18868 18.816 3.43598C19.5686 3.81947 20.1805 4.43139 20.564 5.18404C20.8113 5.66938 20.9099 6.18608 20.9558 6.74818C21 7.28937 21 7.95372 21 8.75868V15.2413C21 16.0463 21 16.7106 20.9558 17.2518C20.9099 17.8139 20.8113 18.3306 20.564 18.816C20.1805 19.5686 19.5686 20.1805 18.816 20.564C18.3306 20.8113 17.8139 20.9099 17.2518 20.9558C16.7106 21 16.0463 21 15.2413 21H8.75868C7.95372 21 7.28937 21 6.74818 20.9558C6.18608 20.9099 5.66938 20.8113 5.18404 20.564C4.43139 20.1805 3.81947 19.5686 3.43598 18.816C3.18868 18.3306 3.09012 17.8139 3.0442 17.2518C2.99998 16.7106 2.99999 16.0463 3 15.2413V8.75869C2.99999 7.95373 2.99998 7.28936 3.0442 6.74818C3.09012 6.18608 3.18868 5.66938 3.43598 5.18404C3.81947 4.43139 4.43139 3.81947 5.18404 3.43598C5.66938 3.18868 6.18608 3.09012 6.74818 3.0442C7.28936 2.99998 7.95375 2.99999 8.7587 3ZM9.00005 11C8.44777 11 8.00004 11.4477 8.00002 11.9999C7.99999 12.5522 8.44769 13 8.99998 13L11 13.0001L11 15C11 15.5523 11.4477 16 12 16C12.5523 16 13 15.5523 13 15L13 13.0001L15 13.0002C15.5523 13.0002 16 12.5525 16 12.0003C16.0001 11.448 15.5524 11.0002 15.0001 11.0002L13 11.0001L13 9.00022C13 8.44793 12.5523 8.00022 12 8.00021C11.4478 8.00021 11 8.44792 11 9.00021L11 11.0001L9.00005 11Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <button
        className={clsx(
          "flex items-center justify-center aspect-square rounded-md",
          tool === "text" ? "bg-blue-500 text-white" : "hover:bg-neutral-100"
        )}
        type="button"
        onClick={() => setTool("text")}
      >
        <span className="sr-only">Add a text node</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          width="20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3 4C3 3.44772 3.44772 3 4 3H20C20.5523 3 21 3.44772 21 4V6C21 6.55228 20.5523 7 20 7C19.4477 7 19 6.55228 19 6V5H13V19H14C14.5523 19 15 19.4477 15 20C15 20.5523 14.5523 21 14 21H10C9.44772 21 9 20.5523 9 20C9 19.4477 9.44772 19 10 19H11V5H5V6C5 6.55228 4.55228 7 4 7C3.44772 7 3 6.55228 3 6V4Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );
}
