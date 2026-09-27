"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Popover } from "./Popover.js";
import { HeadingIcon, ChevronDownIcon } from "./Icons.js";
const LEVELS = [
    { level: 0, label: "Paragraph" },
    { level: 1, label: "Heading 1" },
    { level: 2, label: "Heading 2" },
    { level: 3, label: "Heading 3" },
    { level: 4, label: "Heading 4" },
    { level: 5, label: "Heading 5" },
    { level: 6, label: "Heading 6" },
];
export function HeadingMenu({ onPick, disabled, title, theme, }) {
    return (_jsx(Popover, { ariaLabel: "Heading level", theme: theme, trigger: ({ ref, onClick, open }) => (_jsxs("button", { ref: ref, type: "button", className: "mde-toolbar-btn", title: title, "aria-label": title, "aria-haspopup": "true", "aria-expanded": open, disabled: disabled, onClick: onClick, children: [_jsx(HeadingIcon, {}), _jsx(ChevronDownIcon, {})] })), children: (close) => (_jsx("div", { className: "mde-menu", role: "menu", children: LEVELS.map(({ level, label }) => (_jsx("button", { type: "button", role: "menuitem", className: `mde-menu-item mde-heading-menu-item${level > 0 ? ` mde-heading-menu-item-${level}` : ""}`, onClick: () => {
                    onPick(level);
                    close();
                }, children: label }, level))) })) }));
}
