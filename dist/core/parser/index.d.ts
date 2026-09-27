import type { DocumentNode, ParseOptions } from "../types.js";
export { parseInline } from "./inline.js";
export { parseBlockList } from "./block.js";
/**
 * Parses a markdown string into our AST ("our flavor": practical CommonMark
 * + GFM subset, plus underline/sub/sup via whitelisted HTML, GitHub-style
 * alerts, and explicit ::: code-group blocks). See /docs/SYNTAX.md.
 */
export declare function parseMarkdown(source: string, options?: ParseOptions): DocumentNode;
