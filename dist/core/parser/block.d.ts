import type { BlockNode, ParseOptions } from "../types.js";
/** Parses a flat sequence of lines (already stripped of any container prefix) into block nodes. */
export declare function parseBlockList(lines: string[], slugSeen: Map<string, number>, options: Required<ParseOptions>): BlockNode[];
