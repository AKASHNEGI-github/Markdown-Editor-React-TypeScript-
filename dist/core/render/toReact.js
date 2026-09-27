"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { sanitizeUrl } from "../utils.js";
import { highlight as defaultHighlight } from "../../highlighter/index.js";
const ALERT_LABELS = {
    note: "Note",
    tip: "Tip",
    important: "Important",
    warning: "Warning",
    caution: "Caution",
};
function AlertIcon({ type }) {
    const d = {
        note: "M8 1a7 7 0 100 14A7 7 0 008 1zm.75 10.5h-1.5V7h1.5v4.5zM8 5.75a.9.9 0 110-1.8.9.9 0 010 1.8z",
        tip: "M8 1a4.5 4.5 0 00-2.5 8.25c.32.22.5.58.5.98V11h4v-.77c0-.4.18-.76.5-.98A4.5 4.5 0 008 1zM6 13h4v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-1z",
        important: "M1 8a7 7 0 1114 0A7 7 0 011 8zm7.75-3.25h-1.5v4.5h1.5v-4.5zM8 11.75a.9.9 0 100-1.8.9.9 0 000 1.8z",
        warning: "M8 1.5l7 12.5H1L8 1.5zm.75 5h-1.5v4h1.5v-4zM8 11.75a.9.9 0 100 1.8.9.9 0 000-1.8z",
        caution: "M5 1h6l4 4v6l-4 4H5l-4-4V5l4-4zm2.25 3.5v4.5h1.5V4.5h-1.5zM8 11.75a.9.9 0 100 1.8.9.9 0 000-1.8z",
    };
    return (_jsx("svg", { viewBox: "0 0 16 16", width: 16, height: 16, "aria-hidden": "true", children: _jsx("path", { fill: "currentColor", d: d[type] }) }));
}
/** Small inline glyph: overlapping squares (copy), or a checkmark once copied. */
function CopyGlyph({ copied }) {
    return (_jsx("svg", { viewBox: "0 0 16 16", width: 14, height: 14, fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: copied ? (_jsx("path", { d: "M3.5 8.5l3 3 6-7" })) : (_jsxs(_Fragment, { children: [_jsx("rect", { x: "5.5", y: "5.5", width: "7", height: "7", rx: "1" }), _jsx("rect", { x: "3.5", y: "3.5", width: "7", height: "7", rx: "1" })] })) }));
}
function CopyButton({ code }) {
    const [copied, setCopied] = useState(false);
    const label = copied ? "Copied" : "Copy code";
    return (_jsx("button", { type: "button", className: `mde-copy-btn${copied ? " mde-copied" : ""}`, "aria-label": label, title: label, onClick: async () => {
            try {
                await navigator.clipboard.writeText(code);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
            }
            catch {
                /* clipboard unavailable; ignore */
            }
        }, children: _jsx(CopyGlyph, { copied: copied }) }));
}
function renderTokensReact(tokens) {
    return tokens.map((t, i) => t.type === "plain" ? (_jsx("span", { children: t.text }, i)) : (_jsx("span", { className: `mde-tok-${t.type}`, children: t.text }, i)));
}
function CodeBlockView({ node, ctx }) {
    const tokens = ctx.highlighter(node.code, node.lang);
    return (_jsxs("div", { className: "mde-code-block", children: [node.title && _jsx("div", { className: "mde-code-title", children: node.title }), _jsx(CopyButton, { code: node.code }), _jsx("pre", { className: "mde-pre", children: _jsx("code", { className: "mde-code", "data-lang": node.lang ?? "", children: renderTokensReact(tokens) }) })] }));
}
function CodeGroupView({ node, ctx }) {
    const [active, setActive] = useState(0);
    return (_jsxs("div", { className: "mde-code-group", children: [_jsx("div", { className: "mde-code-group-tabs", role: "tablist", children: node.blocks.map((b, i) => (_jsx("button", { type: "button", role: "tab", "aria-selected": i === active, className: `mde-code-group-tab${i === active ? " mde-active" : ""}`, onClick: () => setActive(i), children: b.title ?? b.lang ?? `Tab ${i + 1}` }, i))) }), node.blocks.map((b, i) => (_jsx("div", { className: `mde-code-group-panel${i === active ? " mde-active" : ""}`, hidden: i !== active, children: _jsx(CodeBlockView, { node: b, ctx: ctx }) }, i)))] }));
}
function DetailsView({ node, ctx }) {
    return (_jsxs("details", { className: "mde-details", open: node.open || undefined, children: [_jsx("summary", { className: "mde-summary", children: renderInlineReact(node.summary, ctx) }), _jsx("div", { className: "mde-details-body", children: renderBlocksReact(node.children, ctx) })] }));
}
function alignStyle(a) {
    return a ? { textAlign: a } : undefined;
}
function TableView({ node, ctx }) {
    return (_jsx("div", { className: "mde-table-wrapper", children: _jsxs("table", { className: "mde-table", children: [_jsx("thead", { children: _jsx("tr", { children: node.header.map((cell, i) => (_jsx("th", { style: alignStyle(node.align[i]), children: renderInlineReact(cell, ctx) }, i))) }) }), _jsx("tbody", { children: node.rows.map((row, ri) => (_jsx("tr", { children: row.map((cell, ci) => (_jsx("td", { style: alignStyle(node.align[ci]), children: renderInlineReact(cell, ctx) }, ci))) }, ri))) })] }) }));
}
function ListItemView({ item, tight, ctx }) {
    const isChecklist = item.checked !== undefined && item.checked !== null;
    const myIndex = isChecklist ? ctx.checklistIndex.n++ : -1;
    const body = renderItemChildrenReact(item.children, tight, ctx);
    return (_jsxs("li", { className: isChecklist ? "mde-li mde-checklist-item" : "mde-li", children: [isChecklist && (_jsx("input", { type: "checkbox", className: "mde-checkbox", checked: !!item.checked, disabled: !ctx.interactiveChecklists, onChange: (e) => ctx.onToggleCheckbox?.(myIndex, e.target.checked), "aria-label": "Toggle task" })), _jsx("span", { className: "mde-li-content", children: body })] }));
}
function ListView({ node, ctx }) {
    const cls = node.ordered ? "mde-list mde-list-ordered" : "mde-list mde-list-unordered";
    const items = node.items.map((item, i) => _jsx(ListItemView, { item: item, tight: node.tight, ctx: ctx }, i));
    return node.ordered ? (_jsx("ol", { className: cls, start: node.start && node.start !== 1 ? node.start : undefined, children: items })) : (_jsx("ul", { className: cls, children: items }));
}
function renderItemChildrenReact(children, tight, ctx) {
    if (tight) {
        return children.map((c, i) => c.type === "paragraph" ? _jsx("span", { children: renderInlineReact(c.children, ctx) }, i) : _jsx(BlockView, { node: c, ctx: ctx }, i));
    }
    return renderBlocksReact(children, ctx);
}
function BlockView({ node, ctx }) {
    switch (node.type) {
        case "heading": {
            const Tag = `h${node.depth}`;
            return (_jsxs(Tag, { id: node.id || undefined, className: `mde-heading mde-h${node.depth}`, children: [node.id && (_jsx("a", { href: `#${node.id}`, className: "mde-heading-anchor", "aria-hidden": "true", tabIndex: -1, children: "#" })), renderInlineReact(node.children, ctx)] }));
        }
        case "paragraph":
            return _jsx("p", { className: "mde-p", children: renderInlineReact(node.children, ctx) });
        case "thematicBreak":
            return _jsx("hr", { className: "mde-hr" });
        case "blockquote":
            return _jsx("blockquote", { className: "mde-blockquote", children: renderBlocksReact(node.children, ctx) });
        case "alert":
            return (_jsxs("div", { className: `mde-alert mde-alert-${node.alertType}`, role: "note", children: [_jsxs("div", { className: "mde-alert-title", children: [_jsx(AlertIcon, { type: node.alertType }), _jsx("span", { children: ALERT_LABELS[node.alertType] })] }), _jsx("div", { className: "mde-alert-body", children: renderBlocksReact(node.children, ctx) })] }));
        case "list":
            return _jsx(ListView, { node: node, ctx: ctx });
        case "codeBlock":
            return _jsx(CodeBlockView, { node: node, ctx: ctx });
        case "codeGroup":
            return _jsx(CodeGroupView, { node: node, ctx: ctx });
        case "table":
            return _jsx(TableView, { node: node, ctx: ctx });
        case "details":
            return _jsx(DetailsView, { node: node, ctx: ctx });
        default:
            return null;
    }
}
function renderBlocksReact(nodes, ctx) {
    return nodes.map((n, i) => _jsx(BlockView, { node: n, ctx: ctx }, i));
}
function renderInlineNodeReact(node, ctx, key) {
    switch (node.type) {
        case "text":
            return node.value;
        case "strong":
            return _jsx("strong", { children: renderInlineReact(node.children, ctx) }, key);
        case "emphasis":
            return _jsx("em", { children: renderInlineReact(node.children, ctx) }, key);
        case "strikethrough":
            return _jsx("del", { children: renderInlineReact(node.children, ctx) }, key);
        case "underline":
            return _jsx("u", { children: renderInlineReact(node.children, ctx) }, key);
        case "subscript":
            return _jsx("sub", { children: renderInlineReact(node.children, ctx) }, key);
        case "superscript":
            return _jsx("sup", { children: renderInlineReact(node.children, ctx) }, key);
        case "inlineCode":
            return (_jsx("code", { className: "mde-inline-code", children: node.value }, key));
        case "link": {
            const url = sanitizeUrl(node.url);
            const isExternal = /^https?:/i.test(url);
            const extra = isExternal && ctx.openExternalLinksInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {};
            return (_jsx("a", { href: url, title: node.title, className: "mde-link", ...extra, children: renderInlineReact(node.children, ctx) }, key));
        }
        case "image": {
            const url = sanitizeUrl(node.url);
            return _jsx("img", { src: url, alt: node.alt, title: node.title, className: "mde-image", loading: "lazy" }, key);
        }
        case "break":
            return _jsx("br", {}, key);
        default:
            return null;
    }
}
function renderInlineReact(nodes, ctx) {
    return nodes.map((n, i) => renderInlineNodeReact(n, ctx, i));
}
/** Renders a parsed document to React elements. Used by the live preview and MarkdownViewer. */
export function renderToReactElements(doc, options = {}) {
    const ctx = {
        highlighter: options.highlighter ?? defaultHighlight,
        openExternalLinksInNewTab: options.openExternalLinksInNewTab ?? true,
        interactiveChecklists: options.interactiveChecklists ?? false,
        onToggleCheckbox: options.onToggleCheckbox,
        keySeed: { n: 0 },
        checklistIndex: { n: 0 },
    };
    return _jsx("div", { className: "mde-content", children: renderBlocksReact(doc.children, ctx) });
}
