import type { EditorState } from "./types.js";
/**
 * Toggles `before`/`after` marks around the selection. If the selection is
 * already wrapped (or the marks sit immediately outside it), the marks are
 * removed instead. With no selection, inserts `before + placeholder + after`
 * and selects the placeholder so the person can type straight over it.
 */
export declare function toggleInlineWrap(state: EditorState, before: string, after: string, placeholder?: string): EditorState;
export declare const toggleBold: (s: EditorState) => EditorState;
export declare const toggleItalic: (s: EditorState) => EditorState;
export declare const toggleStrikethrough: (s: EditorState) => EditorState;
export declare const toggleUnderline: (s: EditorState) => EditorState;
export declare const toggleSubscript: (s: EditorState) => EditorState;
export declare const toggleSuperscript: (s: EditorState) => EditorState;
export declare const toggleInlineCode: (s: EditorState) => EditorState;
/** Always sets the current line's heading level (0 = plain paragraph). Used by the heading dropdown. */
export declare function setHeadingLevel(state: EditorState, level: 0 | 1 | 2 | 3 | 4 | 5 | 6): EditorState;
export declare function setHeading(state: EditorState, level: 1 | 2 | 3 | 4 | 5 | 6): EditorState;
export declare function toggleBlockquote(state: EditorState): EditorState;
export declare const toggleUnorderedList: (s: EditorState) => EditorState;
export declare const toggleOrderedList: (s: EditorState) => EditorState;
export declare const toggleChecklist: (s: EditorState) => EditorState;
export declare function indentLines(state: EditorState): EditorState;
export declare function outdentLines(state: EditorState): EditorState;
export declare function insertHorizontalRule(state: EditorState): EditorState;
export declare function insertCodeBlock(state: EditorState, lang?: string): EditorState;
export declare function insertCodeGroup(state: EditorState): EditorState;
export declare function insertTable(state: EditorState, rows: number, cols: number): EditorState;
export declare function insertLink(state: EditorState): EditorState;
export declare function insertImage(state: EditorState): EditorState;
export declare const ALERT_KINDS: readonly ["note", "tip", "important", "warning", "caution"];
export type AlertKind = (typeof ALERT_KINDS)[number];
export declare function insertAlert(state: EditorState, kind: AlertKind): EditorState;
export declare function insertDetails(state: EditorState): EditorState;
export declare function insertText(state: EditorState, text: string): EditorState;
/**
 * If the cursor is at the end of a list-item line, returns a new state with
 * the next line pre-seeded with the same list marker (auto-incrementing
 * ordered lists). Pressing Enter on an *empty* item instead removes the
 * marker and exits the list. Returns null when the cursor isn't in a list
 * line, so the caller can fall back to a plain newline.
 */
export declare function continueList(state: EditorState): EditorState | null;
