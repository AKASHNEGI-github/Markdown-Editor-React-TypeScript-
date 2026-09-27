import type { Highlighter } from "../../highlighter/index.js";
export interface MarkdownViewerProps {
    value: string;
    highlighter?: Highlighter;
    openExternalLinksInNewTab?: boolean;
    headingIds?: boolean;
    theme?: "light" | "dark" | "auto";
    className?: string;
}
/** Read-only rendering of a markdown string. Use this for saved/received content you don't need to edit. */
export declare function MarkdownViewer({ value, highlighter, openExternalLinksInNewTab, headingIds, theme, className, }: MarkdownViewerProps): import("react").JSX.Element;
