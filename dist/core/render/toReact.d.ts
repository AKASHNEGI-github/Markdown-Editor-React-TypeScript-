import { type ReactNode } from "react";
import type { DocumentNode } from "../types.js";
import { type Highlighter } from "../../highlighter/index.js";
export interface ReactRenderOptions {
    /** Custom syntax highlighter. Defaults to the built-in dependency-free tokenizer. */
    highlighter?: Highlighter;
    /** Whether external links open in a new tab. Default true. */
    openExternalLinksInNewTab?: boolean;
    /** Let the viewer click checkboxes to toggle them. Off by default. */
    interactiveChecklists?: boolean;
    /** Called with the checklist item's document-order index and its new checked state. */
    onToggleCheckbox?: (index: number, checked: boolean) => void;
}
/** Renders a parsed document to React elements. Used by the live preview and MarkdownViewer. */
export declare function renderToReactElements(doc: DocumentNode, options?: ReactRenderOptions): ReactNode;
