"use client";

import { createContext, useContext, useState } from "react";

const CanvasContext = createContext<{
	tool: "text" | null;
	setTool: (tool: "text" | null) => void;
	activeNode: string | null;
	setActiveNode: (node: string | null) => void;
}>({
	tool: null,
	setTool: () => {},
	activeNode: null,
	setActiveNode: () => {},
});

export function CanvasProvider({ children }: { children: React.ReactNode }) {
	const [tool, setTool] = useState<"text" | null>(null);
	const [activeNode, setActiveNode] = useState<string | null>(null);
	return (
		<CanvasContext.Provider
			value={{ tool, setTool, activeNode, setActiveNode }}
		>
			{children}
		</CanvasContext.Provider>
	);
}

export function useCanvasContext() {
	const ctx = useContext(CanvasContext);
	if (!ctx) {
		throw new Error(
			"useCanvasContext must be used within a CanvasContextProvider",
		);
	}
	return ctx;
}
