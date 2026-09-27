import type { EditorState } from "./types.js";
/**
 * A simple linear undo/redo stack of {value, selection} snapshots.
 * Toolbar/command edits always start a new step; plain typing coalesces
 * consecutive keystrokes (within `coalesceWindowMs`) into one step so a
 * single Ctrl+Z undoes a whole burst of typing, not one character.
 */
export declare class HistoryStack {
    private stack;
    private index;
    private lastPushTime;
    private coalesceWindowMs;
    constructor(initial: EditorState, coalesceWindowMs?: number);
    get current(): EditorState;
    canUndo(): boolean;
    canRedo(): boolean;
    push(state: EditorState, coalesce?: boolean): void;
    undo(): EditorState | null;
    redo(): EditorState | null;
    /** Resets the whole stack to a single new initial state (e.g. after a controlled `value` change from outside). */
    reset(state: EditorState): void;
}
