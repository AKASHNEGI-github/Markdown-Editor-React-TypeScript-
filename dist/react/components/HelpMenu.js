"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Popover } from "./Popover.js";
import { HelpIcon } from "./Icons.js";
const ROWS = [
    { syntax: "**bold**", label: "Bold" },
    { syntax: "*italic*", label: "Italic" },
    { syntax: "<u>underline</u>", label: "Underline" },
    { syntax: "~~strikethrough~~", label: "Strikethrough" },
    { syntax: "<sub>2</sub>", label: "Subscript" },
    { syntax: "<sup>2</sup>", label: "Superscript" },
    { syntax: "`code`", label: "Inline code" },
    { syntax: "[text](url)", label: "Link" },
    { syntax: "![alt](url)", label: "Image" },
    { syntax: "# … ######", label: "Heading 1–6" },
    { syntax: "---", label: "Horizontal rule" },
    { syntax: "> quote", label: "Quote" },
    { syntax: "> [!NOTE]", label: "Alert (also TIP, IMPORTANT, WARNING, CAUTION)" },
    { syntax: "<details>…</details>", label: "Collapsible section (dropdown)" },
    { syntax: "1. item", label: "Ordered list" },
    { syntax: "- item", label: "Unordered list" },
    { syntax: "- [ ] item", label: "Checklist" },
    { syntax: "| a | b |", label: "Table" },
    { syntax: "```lang", label: "Code block" },
    { syntax: "::: code-group", label: "Tabbed code group" },
];
export function HelpMenu({ disabled, title, theme }) {
    return (_jsx(Popover, { ariaLabel: "About and syntax guide", theme: theme, panelClassName: "mde-help-popover", trigger: ({ ref, onClick, open }) => (_jsx("button", { ref: ref, type: "button", className: "mde-toolbar-btn", title: title, "aria-label": title, "aria-haspopup": "true", "aria-expanded": open, disabled: disabled, onClick: onClick, children: _jsx(HelpIcon, {}) })), children: () => (_jsxs("div", { className: "mde-help-panel", children: [_jsxs("p", { className: "mde-help-intro", children: ["A practical subset of CommonMark + GFM, plus GitHub-style alerts, collapsible sections, and tabbed code groups. Only ", _jsx("code", { children: "<u>" }), ", ", _jsx("code", { children: "<sub>" }), ", ", _jsx("code", { children: "<sup>" }), ", and", " ", _jsx("code", { children: "<details>" }), "/", _jsx("code", { children: "<summary>" }), " are recognized as HTML \u2014 everything else is shown as plain text."] }), _jsx("table", { className: "mde-help-table", children: _jsx("tbody", { children: ROWS.map((row) => (_jsxs("tr", { children: [_jsx("td", { children: _jsx("code", { children: row.syntax }) }), _jsx("td", { children: row.label })] }, row.label))) }) })] })) }));
}
