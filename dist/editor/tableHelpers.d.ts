import type { EditorState } from "./types.js";
export type CellAlign = "left" | "center" | "right" | null;
export interface TableLocation {
    start: number;
    end: number;
    header: string[];
    align: CellAlign[];
    rows: string[][];
}
/** Finds the markdown table containing (or adjacent to) `pos`, if any. */
export declare function findTableAt(value: string, pos: number): TableLocation | null;
/** Re-serializes a table with aligned/padded pipes (auto-format). */
export declare function serializeTable(header: string[], align: CellAlign[], rows: string[][]): string;
export declare function addTableRow(state: EditorState): EditorState;
export declare function addTableColumn(state: EditorState): EditorState;
export declare function removeTableRow(state: EditorState, rowIndex: number): EditorState;
export declare function removeTableColumn(state: EditorState, colIndex: number): EditorState;
export declare function setTableColumnAlign(state: EditorState, colIndex: number, value: CellAlign): EditorState;
export declare function formatTable(state: EditorState): EditorState;
