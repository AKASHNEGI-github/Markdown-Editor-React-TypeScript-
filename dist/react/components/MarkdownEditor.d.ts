import { type EditorMode, type EditorTheme, type ToolbarLabels } from "./Toolbar.js";
import type { Highlighter } from "../../highlighter/index.js";
export type { EditorMode, EditorTheme } from "./Toolbar.js";
export interface MarkdownEditorProps {
    /** Controlled markdown value. Omit (with `defaultValue`) for uncontrolled use. */
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    mode?: EditorMode;
    defaultMode?: EditorMode;
    onModeChange?: (mode: EditorMode) => void;
    fullscreen?: boolean;
    defaultFullscreen?: boolean;
    onFullscreenChange?: (fullscreen: boolean) => void;
    theme?: EditorTheme;
    defaultTheme?: EditorTheme;
    onThemeChange?: (theme: EditorTheme) => void;
    /** Which toolbar buttons to show, and in what order. `false` hides the toolbar entirely. */
    toolbar?: string[] | false;
    /** Custom syntax highlighter (e.g. wrapping Shiki). Defaults to the built-in tokenizer. */
    highlighter?: Highlighter;
    placeholder?: string;
    readOnly?: boolean;
    disabled?: boolean;
    height?: string | number;
    minHeight?: string | number;
    className?: string;
    labels?: ToolbarLabels;
    /** Let the preview's checkboxes be clicked to toggle the underlying markdown. Off by default. */
    interactiveChecklists?: boolean;
    openExternalLinksInNewTab?: boolean;
    headingIds?: boolean;
    showTableTools?: boolean;
    /** Tab/Shift+Tab indents list lines; otherwise Tab moves focus normally. Default true. */
    tabIndentation?: boolean;
    /** Pressing Enter in a list continues it with the same marker. Default true. */
    autoContinueList?: boolean;
    /** Show the light/dark theme toggle button in the toolbar. Default true. */
    showThemeToggle?: boolean;
    /** Show the "reset to original content" button in the toolbar. Default true. */
    showResetButton?: boolean;
    /** Show the "view rendered HTML source" mode button in the toolbar. Default true. */
    showHtmlView?: boolean;
    /** Show the "download/print preview as PDF" button in the toolbar. Default true. */
    showDownloadButton?: boolean;
    /** Show the "?" markdown syntax guide button in the toolbar. Default true. */
    showHelpButton?: boolean;
    /** Show line numbers in the gutter next to the markdown source. Default true. Disables textarea soft-wrap so numbers stay aligned with their line, matching GitHub's file editor. */
    showLineNumbers?: boolean;
    /** Show a "copy markdown source" button over the writing area. Default true. */
    showEditorCopyButton?: boolean;
    /** Called when the reset button is used, after content has been reset. */
    onReset?: () => void;
}
export interface MarkdownEditorHandle {
    getMarkdown: () => string;
    getHTML: () => string;
    focus: () => void;
    undo: () => void;
    redo: () => void;
    setMode: (mode: EditorMode) => void;
    reset: () => void;
}
export declare const MarkdownEditor: import("react").ForwardRefExoticComponent<MarkdownEditorProps & import("react").RefAttributes<MarkdownEditorHandle>>;
