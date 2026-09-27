import type { EditorSelection, EditorState } from "../../editor/types.js";
export interface TableToolsProps {
    value: string;
    selection: EditorSelection;
    runCommand: (fn: (s: EditorState) => EditorState) => void;
}
export declare function TableTools({ value, selection, runCommand }: TableToolsProps): import("react").JSX.Element | null;
