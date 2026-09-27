import type { InlineNode } from "../types.js";
/** Sentinel character inserted by joinParagraphLines() to mark a hard line break. */
export declare const HARD_BREAK = "\u0002";
/**
 * Joins the raw lines of a paragraph (or any multi-line inline context) into
 * a single string, turning "line ends with 2+ spaces" or "line ends with a
 * backslash" into a hard-break sentinel, and everything else into a soft
 * break (a single space), matching standard markdown paragraph behavior.
 */
export declare function joinParagraphLines(lines: string[]): string;
/** Parses a single logical line (or joined paragraph string) of inline markdown into an AST. */
export declare function parseInline(text: string): InlineNode[];
