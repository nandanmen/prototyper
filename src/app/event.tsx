const HIGHLIGHT_ELEMENT = "highlight-element";

type HighlightElementEvent = {
  nodeId: string;
  element: HTMLElement;
};

export const dispatchHighlightElement = ({
  nodeId,
  element,
}: {
  nodeId: string;
  element: HTMLElement;
}) => {
  const event = new CustomEvent<HighlightElementEvent>(HIGHLIGHT_ELEMENT, {
    detail: {
      nodeId,
      element,
    },
  });
  document.dispatchEvent(event);
};

export const onHighlightElement = (
  callback: (event: CustomEvent<HighlightElementEvent>) => void
) => {
  const cb = (e: Event) => callback(e as CustomEvent<HighlightElementEvent>);
  document.addEventListener(HIGHLIGHT_ELEMENT, cb);
  return () => {
    document.removeEventListener(HIGHLIGHT_ELEMENT, cb);
  };
};
