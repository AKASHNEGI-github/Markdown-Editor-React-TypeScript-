import type { EditorState } from "./types.js";
/** Returns the [start, end) character offsets of the line containing `pos`. */
export declare function lineBoundsAt(value: string, pos: number): {
    start: number;
    end: number;
};
/** Returns the [start, end) offsets covering every full line touched by [selStart, selEnd]. */
export declare function expandToLines(value: string, selStart: number, selEnd: number): {
    start: number;
    end: number;
};
export declare function getSelectedText(state: EditorState): string;
/** Replaces [start, end) with `text` and returns the new state, selecting the inserted text by default. */
export declare function replaceRange(value: string, start: number, end: number, text: string, select?: "all" | "collapse-end" | "collapse-start"): EditorState;
