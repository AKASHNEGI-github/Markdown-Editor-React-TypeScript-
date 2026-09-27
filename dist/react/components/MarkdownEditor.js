"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useMarkdownEditorState } from "../hooks/useMarkdownEditorState.js";
import { useControllableState } from "../hooks/useControllableState.js";
import { Toolbar } from "./Toolbar.js";
import { Preview } from "./Preview.js";
import { TableTools } from "./TableTools.js";
import { matchShortcut } from "../../editor/shortcuts.js";
import { toggleBold, toggleItalic, toggleUnderline, toggleStrikethrough, toggleInlineCode, toggleUnorderedList, toggleOrderedList, toggleChecklist, toggleBlockquote, setHeadingLevel, insertLink, continueList, indentLines, outdentLines, } from "../../editor/commands.js";
import { toggleCheckboxInMarkdown } from "../../editor/checklist.js";
import { markdownToHtml } from "../../core/index.js";
import { CopyIconSmall, CheckIconSmall } from "./Icons.js";
const SHORTCUT_COMMANDS = {
    bold: toggleBold,
    italic: toggleItalic,
    underline: toggleUnderline,
    strikethrough: toggleStrikethrough,
    inlineCode: toggleInlineCode,
    link: insertLink,
    heading1: (s) => setHeadingLevel(s, 1),
    heading2: (s) => setHeadingLevel(s, 2),
    heading3: (s) => setHeadingLevel(s, 3),
    orderedList: toggleOrderedList,
    unorderedList: toggleUnorderedList,
    checklist: toggleChecklist,
    blockquote: toggleBlockquote,
};
export const MarkdownEditor = forwardRef(function MarkdownEditor(props, ref) {
    const { value, defaultValue = "", onChange, mode: modeProp, defaultMode = "split", onModeChange, fullscreen: fullscreenProp, defaultFullscreen = false, onFullscreenChange, theme: themeProp, defaultTheme = "auto", onThemeChange, toolbar, highlighter, placeholder, readOnly = false, disabled = false, height, minHeight = "320px", className, labels, interactiveChecklists = false, openExternalLinksInNewTab = true, headingIds = true, showTableTools = true, tabIndentation = true, autoContinueList = true, showThemeToggle = true, showResetButton = true, showHtmlView = true, showDownloadButton = true, showHelpButton = true, showLineNumbers = true, showEditorCopyButton = true, onReset, } = props;
    const editor = useMarkdownEditorState({ value, defaultValue, onChange });
    const [mode, setMode] = useControllableState(modeProp, defaultMode, onModeChange);
    const [fullscreen, setFullscreen] = useControllableState(fullscreenProp, defaultFullscreen, onFullscreenChange);
    const [theme, setTheme] = useControllableState(themeProp, defaultTheme, onThemeChange);
    const [mobilePane, setMobilePane] = useState("edit");
    // Captured once, on mount, so the "reset" button has an original value to return to.
    const initialValueRef = useRef(value ?? defaultValue);
    const getHtml = useCallback(() => markdownToHtml(editor.value, { headingIds }, { highlighter, openExternalLinksInNewTab }), [editor.value, headingIds, highlighter, openExternalLinksInNewTab]);
    const handleReset = useCallback(() => {
        editor.setValue(initialValueRef.current);
        onReset?.();
    }, [editor, onReset]);
    // Printing (used for "download as PDF"): there is no bundled PDF library
    // (this package ships with zero runtime dependencies), so this uses the
    // browser's own print dialog — which every browser can also "Save as PDF"
    // from — against a dedicated, always-up-to-date render of the preview.
    //
    // That render is portaled straight to document.body (see printContainer
    // below) instead of being mounted inside .mde-root like everything else
    // in this component. This matters because .mde-root can sit anywhere in
    // a host page's own layout — below a page heading, above a footer, inside
    // a sidebar, and so on. Print CSS can only hide elements it knows about,
    // so hiding just .mde-root's own siblings (as an earlier version of this
    // did) leaves every *other* ancestor's content fully visible on the
    // printed page. Rendering the print-only content outside that layout
    // entirely, then hiding everything else in the page during print (see
    // the `body > *:not(.mde-print-root)` rule in styles.css), is what
    // guarantees the printed output is only ever this editor's own content.
    //
    // The container is only created for the brief duration of a print, not
    // kept alive on every keystroke, so it doesn't cost anything otherwise.
    const [printing, setPrinting] = useState(false);
    const [printContainer, setPrintContainer] = useState(null);
    const printTimerRef = useRef(undefined);
    const handleDownloadPdf = useCallback(() => setPrinting(true), []);
    // Create/remove the body-level print container exactly while printing.
    useEffect(() => {
        if (!printing || typeof document === "undefined")
            return;
        const node = document.createElement("div");
        node.className = "mde-print-root";
        document.body.appendChild(node);
        setPrintContainer(node);
        return () => {
            node.remove();
            setPrintContainer(null);
        };
    }, [printing]);
    // Once the container exists and the portaled preview below has had a
    // chance to commit and paint into it, trigger the actual print. Gating
    // on `printContainer` (not just `printing`) avoids ever calling print()
    // against an empty container.
    useEffect(() => {
        if (!printing || !printContainer)
            return;
        // A short delay so the print-only preview is guaranteed to have
        // painted before print() fires.
        printTimerRef.current = setTimeout(() => window.print(), 50);
        const handleAfterPrint = () => setPrinting(false);
        window.addEventListener("afterprint", handleAfterPrint);
        return () => {
            clearTimeout(printTimerRef.current);
            window.removeEventListener("afterprint", handleAfterPrint);
        };
    }, [printing, printContainer]);
    const gutterRef = useRef(null);
    const handleTextareaScroll = useCallback((e) => {
        if (gutterRef.current)
            gutterRef.current.scrollTop = e.currentTarget.scrollTop;
    }, []);
    const lineCount = useMemo(() => editor.value.split("\n").length, [editor.value]);
    const currentLine = useMemo(() => editor.value.slice(0, editor.selection.start).split("\n").length, [editor.value, editor.selection.start]);
    useImperativeHandle(ref, () => ({
        getMarkdown: () => editor.value,
        getHTML: () => getHtml(),
        focus: () => editor.textareaRef.current?.focus(),
        undo: editor.undo,
        redo: editor.redo,
        setMode: (m) => setMode(m),
        reset: handleReset,
    }), [editor, getHtml, setMode, handleReset]);
    const handleToggleCheckbox = useCallback((index, checked) => {
        editor.setValue(toggleCheckboxInMarkdown(editor.value, index, checked));
    }, [editor]);
    const handleKeyDown = useCallback((e) => {
        const cmdId = matchShortcut(e);
        if (cmdId === "undo") {
            e.preventDefault();
            editor.undo();
            return;
        }
        if (cmdId === "redo") {
            e.preventDefault();
            editor.redo();
            return;
        }
        if (cmdId && SHORTCUT_COMMANDS[cmdId]) {
            e.preventDefault();
            editor.runCommand(SHORTCUT_COMMANDS[cmdId]);
            return;
        }
        if (e.key === "Tab" && tabIndentation) {
            const ta = e.currentTarget;
            const hasSelection = ta.selectionStart !== ta.selectionEnd;
            const lineStart = ta.value.lastIndexOf("\n", ta.selectionStart - 1) + 1;
            const isListLine = /^\s*([-*+]|\d+[.)])\s+/.test(ta.value.slice(lineStart, ta.selectionEnd));
            if (hasSelection || isListLine) {
                e.preventDefault();
                editor.runCommand(e.shiftKey ? outdentLines : indentLines);
            }
            // Otherwise let Tab move focus normally, so keyboard users are never trapped.
            return;
        }
        if (e.key === "Enter" && !e.shiftKey && autoContinueList) {
            const ta = e.currentTarget;
            const state = { value: ta.value, selection: { start: ta.selectionStart, end: ta.selectionEnd } };
            const next = continueList(state);
            if (next) {
                e.preventDefault();
                editor.runCommand(() => next);
            }
        }
    }, [editor, tabIndentation, autoContinueList]);
    const toggleFullscreenHandler = useCallback(() => setFullscreen(!fullscreen), [fullscreen, setFullscreen]);
    const toggleThemeHandler = useCallback(() => setTheme(theme === "dark" ? "light" : "dark"), [theme, setTheme]);
    // Fullscreen is a fixed overlay covering the viewport; without this, the
    // page behind it can still scroll, showing a second scrollbar alongside
    // the editor's own. Lock body scroll for as long as we're fullscreen.
    useEffect(() => {
        if (!fullscreen || typeof document === "undefined")
            return;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prevOverflow;
        };
    }, [fullscreen]);
    const rootStyle = {
        height: fullscreen ? undefined : height,
        minHeight: fullscreen ? undefined : minHeight,
    };
    const showEdit = mode === "edit" || mode === "split";
    const showPreview = mode === "preview" || mode === "split";
    const showHtmlPane = mode === "html";
    const htmlOutput = useMemo(() => (showHtmlPane ? getHtml() : ""), [showHtmlPane, getHtml]);
    return (_jsxs("div", { className: `mde-root${fullscreen ? " mde-fullscreen" : ""}${className ? ` ${className}` : ""}`, "data-theme": theme, style: rootStyle, children: [toolbar !== false && (_jsx(Toolbar, { runCommand: editor.runCommand, undo: editor.undo, redo: editor.redo, canUndo: editor.canUndo, canRedo: editor.canRedo, disabled: disabled || readOnly, buttons: toolbar === undefined ? undefined : toolbar, labels: labels, mode: mode, onModeChange: setMode, fullscreen: fullscreen, onToggleFullscreen: toggleFullscreenHandler, theme: theme, onToggleTheme: toggleThemeHandler, onReset: handleReset, onDownloadPdf: handleDownloadPdf, showThemeToggle: showThemeToggle, showResetButton: showResetButton, showHtmlView: showHtmlView, showDownloadButton: showDownloadButton, showHelpButton: showHelpButton })), _jsxs("div", { className: `mde-body mde-mode-${mode}`, "data-mobile-pane": mode === "split" ? mobilePane : undefined, children: [mode === "split" && (_jsxs("div", { className: "mde-mobile-tabs", "data-visible": "true", children: [_jsx("button", { type: "button", className: `mde-toolbar-btn mde-text-btn${mobilePane === "edit" ? " mde-active" : ""}`, onClick: () => setMobilePane("edit"), "aria-pressed": mobilePane === "edit", children: "Edit" }), _jsx("button", { type: "button", className: `mde-toolbar-btn mde-text-btn${mobilePane === "preview" ? " mde-active" : ""}`, onClick: () => setMobilePane("preview"), "aria-pressed": mobilePane === "preview", children: "Preview" })] })), showEdit && (_jsxs("div", { className: "mde-edit-pane", children: [showTableTools && !readOnly && !disabled && (_jsx(TableTools, { value: editor.value, selection: editor.selection, runCommand: editor.runCommand })), _jsxs("div", { className: "mde-textarea-wrap", children: [showLineNumbers && (_jsx("div", { className: "mde-gutter", ref: gutterRef, "aria-hidden": "true", children: Array.from({ length: lineCount }, (_, i) => (_jsx("div", { className: `mde-gutter-line${i + 1 === currentLine ? " mde-gutter-line-active" : ""}`, children: i + 1 }, i))) })), _jsx("textarea", { ref: editor.textareaRef, className: `mde-textarea${showLineNumbers ? " mde-textarea-nowrap" : ""}`, wrap: showLineNumbers ? "off" : undefined, value: editor.value, onChange: editor.handleTextareaChange, onSelect: editor.handleSelect, onKeyDown: handleKeyDown, onScroll: showLineNumbers ? handleTextareaScroll : undefined, placeholder: placeholder, readOnly: readOnly, disabled: disabled, spellCheck: true, "aria-label": "Markdown source" }), showEditorCopyButton && !readOnly && _jsx(CopyMarkdownButton, { value: editor.value })] })] })), showPreview && (_jsx(Preview, { value: editor.value, highlighter: highlighter, openExternalLinksInNewTab: openExternalLinksInNewTab, interactiveChecklists: interactiveChecklists && !readOnly, onToggleCheckbox: handleToggleCheckbox, headingIds: headingIds, className: "mde-preview-pane" })), showHtmlPane && (_jsxs("div", { className: "mde-html-pane", children: [_jsx(CopyHtmlButton, { html: htmlOutput }), _jsx("pre", { className: "mde-html-view", children: _jsx("code", { children: htmlOutput }) })] }))] }), printContainer &&
                createPortal(
                // mde-theme-scope re-establishes the --mde-* variable scope outside
                // .mde-root's own DOM subtree (see styles.css), the same pattern
                // Popover.tsx uses for its own document.body portals. The print
                // media query then forces these to plain light-on-white values
                // regardless of `theme`, so data-theme here is just for
                // consistency, not because the printed result depends on it.
                _jsx("div", { className: "mde-print-only mde-theme-scope", "data-theme": theme, children: _jsx(Preview, { value: editor.value, highlighter: highlighter, openExternalLinksInNewTab: openExternalLinksInNewTab, headingIds: headingIds, className: "mde-preview-pane" }) }), printContainer)] }));
});
function CopyMarkdownButton({ value }) {
    const [copied, setCopied] = useState(false);
    const label = copied ? "Copied" : "Copy markdown";
    return (_jsx("button", { type: "button", className: `mde-copy-btn mde-editor-copy-btn${copied ? " mde-copied" : ""}`, "aria-label": label, title: label, onClick: async () => {
            try {
                await navigator.clipboard.writeText(value);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
            }
            catch {
                /* clipboard unavailable; ignore */
            }
        }, children: copied ? _jsx(CheckIconSmall, {}) : _jsx(CopyIconSmall, {}) }));
}
function CopyHtmlButton({ html }) {
    const [copied, setCopied] = useState(false);
    const label = copied ? "Copied" : "Copy HTML";
    return (_jsx("button", { type: "button", className: `mde-copy-btn mde-html-copy-btn${copied ? " mde-copied" : ""}`, "aria-label": label, title: label, onClick: async () => {
            try {
                await navigator.clipboard.writeText(html);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
            }
            catch {
                /* clipboard unavailable; ignore */
            }
        }, children: copied ? _jsx(CheckIconSmall, {}) : _jsx(CopyIconSmall, {}) }));
}
