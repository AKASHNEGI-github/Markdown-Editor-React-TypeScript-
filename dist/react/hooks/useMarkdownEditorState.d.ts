import type { ChangeEvent, RefObject, SyntheticEvent } from "react";
import type { EditorSelection, EditorState } from "../../editor/types.js";
export interface UseMarkdownEditorStateOptions {
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
}
export interface MarkdownEditorController {
    value: string;
    selection: EditorSelection;
    textareaRef: RefObject<HTMLTextAreaElement>;
    runCommand: (fn: (state: EditorState) => EditorState) => void;
    handleTextareaChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    handleSelect: (e: SyntheticEvent<HTMLTextAreaElement>) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    setValue: (value: string) => void;
}
export declare function useMarkdownEditorState(opts: UseMarkdownEditorStateOptions): MarkdownEditorController;
