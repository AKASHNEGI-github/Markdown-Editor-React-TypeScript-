import { parseBlockList } from "./block.js";
export { parseInline } from "./inline.js";
export { parseBlockList } from "./block.js";
const DEFAULT_OPTIONS = {
    headingIds: true,
};
/**
 * Parses a markdown string into our AST ("our flavor": practical CommonMark
 * + GFM subset, plus underline/sub/sup via whitelisted HTML, GitHub-style
 * alerts, and explicit ::: code-group blocks). See /docs/SYNTAX.md.
 */
export function parseMarkdown(source, options = {}) {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const normalized = source.replace(/\r\n?/g, "\n");
    const lines = normalized.split("\n");
    const slugSeen = new Map();
    const children = parseBlockList(lines, slugSeen, opts);
    return { type: "document", children };
}
