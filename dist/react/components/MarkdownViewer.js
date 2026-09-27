"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from "react";
import { parseMarkdown } from "../../core/parser/index.js";
import { renderToReactElements } from "../../core/render/toReact.js";
/** Read-only rendering of a markdown string. Use this for saved/received content you don't need to edit. */
export function MarkdownViewer({ value, highlighter, openExternalLinksInNewTab = true, headingIds = true, theme = "auto", className, }) {
    const doc = useMemo(() => parseMarkdown(value, { headingIds }), [value, headingIds]);
    const content = useMemo(() => renderToReactElements(doc, { highlighter, openExternalLinksInNewTab }), [doc, highlighter, openExternalLinksInNewTab]);
    return (_jsx("div", { className: `mde-root mde-viewer-root${className ? ` ${className}` : ""}`, "data-theme": theme, children: _jsx("div", { className: "mde-preview", children: content }) }));
}
