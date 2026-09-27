"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Popover } from "./Popover.js";
import { TableIcon, ChevronDownIcon } from "./Icons.js";
const MAX = 8;
export function TableGridPicker({ onPick, disabled, title, theme, }) {
    const [hover, setHover] = useState({ r: 0, c: 0 });
    return (_jsx(Popover, { ariaLabel: "Insert table", theme: theme, trigger: ({ ref, onClick, open }) => (_jsxs("button", { ref: ref, type: "button", className: "mde-toolbar-btn", title: title, "aria-label": title, "aria-haspopup": "true", "aria-expanded": open, disabled: disabled, onClick: onClick, children: [_jsx(TableIcon, {}), _jsx(ChevronDownIcon, {})] })), children: (close) => (_jsxs("div", { className: "mde-table-picker", children: [_jsx("div", { className: "mde-table-picker-grid", role: "grid", "aria-label": "Table size", children: Array.from({ length: MAX }, (_, r) => Array.from({ length: MAX }, (_, c) => (_jsx("button", { type: "button", className: `mde-table-picker-cell${r <= hover.r && c <= hover.c ? " mde-active" : ""}`, "aria-label": `${r + 1} by ${c + 1} table`, onMouseEnter: () => setHover({ r, c }), onFocus: () => setHover({ r, c }), onClick: () => {
                            // Use this cell's own row/col rather than `hover`: on
                            // touch devices mouseenter may never fire before the
                            // tap, which would otherwise insert whatever size was
                            // last hovered (or the 1x1 default) instead of the size
                            // actually tapped.
                            onPick(r + 1, c + 1);
                            close();
                        } }, `${r}-${c}`)))) }), _jsxs("div", { className: "mde-table-picker-label", children: [hover.r + 1, " x ", hover.c + 1] })] })) }));
}
