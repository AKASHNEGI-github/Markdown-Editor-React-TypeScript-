/** Escape text for safe insertion into an HTML document. */
export declare function escapeHtml(value: string): string;
/**
 * Only allow http(s), mailto, and relative/anchor URLs through.
 * Blocks javascript:, data:, vbscript:, and other script-executing schemes.
 */
export declare function sanitizeUrl(url: string): string;
/** GitHub-style heading slug: lowercase, spaces -> hyphens, strip punctuation, dedupe. */
export declare function slugify(text: string, seen: Map<string, number>): string;
/** Plain-text content of a list of inline nodes (used for heading ids, alt text fallback). */
export declare function inlineToPlainText(nodes: {
    type: string;
    value?: string;
    children?: unknown[];
}[]): string;
