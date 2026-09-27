"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from "react";
import { parseMarkdown } from "../../core/parser/index.js";
import { renderToReactElements } from "../../core/render/toReact.js";
export function Preview({ value, highlighter, openExternalLinksInNewTab, interactiveChecklists, onToggleCheckbox, headingIds, className, }) {
    const doc = useMemo(() => parseMarkdown(value, { headingIds }), [value, headingIds]);
    const content = useMemo(() => renderToReactElements(doc, {
        highlighter,
        openExternalLinksInNewTab,
        interactiveChecklists,
        onToggleCheckbox,
    }), [doc, highlighter, openExternalLinksInNewTab, interactiveChecklists, onToggleCheckbox]);
    return _jsx("div", { className: `mde-preview${className ? ` ${className}` : ""}`, children: content });
}
