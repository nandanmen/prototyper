import { atom, useAtom } from "jotai";
import { useMemo } from "react";

type HtmlNode = {
  id: string;
  html: string;
};

type Tool = "text" | "add" | null;

const storeAtom = atom<{
  nodes: HtmlNode[];
  tool: Tool;
  activeNode: string | null;
}>({
  nodes: [],
  tool: null,
  activeNode: null,
});

export const useStore = () => {
  const [store, setStore] = useAtom(storeAtom);

  const actions = useMemo(() => {
    return {
      setTool: (tool: Tool) => setStore((prev) => ({ ...prev, tool })),
      setActiveNode: (activeNode: string | null) =>
        setStore((prev) => ({ ...prev, activeNode })),
      addNode: (html: string) => {
        setStore((prev) => ({
          ...prev,
          nodes: [...prev.nodes, { id: crypto.randomUUID(), html }],
        }));
      },
    };
  }, [setStore]);

  return { store, actions };
};
