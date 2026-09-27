import type { DocumentNode } from "../types.js";
import { type Highlighter } from "../../highlighter/index.js";
export interface RenderOptions {
    /** Custom syntax highlighter. Defaults to the built-in dependency-free tokenizer. */
    highlighter?: Highlighter;
    /** Whether external links open in a new tab. Default true. */
    openExternalLinksInNewTab?: boolean;
}
/** Renders a parsed document to a self-contained HTML string (no <html>/<body> wrapper). */
export declare function renderToHtml(doc: DocumentNode, options?: RenderOptions): string;
