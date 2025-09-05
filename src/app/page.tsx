"use client";

import { useEffect, useState } from "react";
import { Node } from "./node";
import type { HtmlNode } from "./types";
import { CanvasProvider } from "./context";
import { Toolbar } from "./toolbar";

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
		<div className="h-screen grid grid-cols-[1fr]">
			<div className="relative bg-neutral-100 h-full">
				<CanvasProvider>
					<div className="isolate relative flex items-center justify-center h-full">
						{nodes.map((node) => (
							<Node node={node} key={node.id} />
						))}
					</div>
					<Toolbar
						onAddNode={() => {
							setNodes((p) => [
								...p,
								{
									id: crypto.randomUUID(),
									html: "<div class='bg-white size-[100px]'></div>",
								},
							]);
						}}
					/>
				</CanvasProvider>
			</div>
		</div>
	);
}
