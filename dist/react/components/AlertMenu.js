"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Popover } from "./Popover.js";
import { AlertIcon, ChevronDownIcon } from "./Icons.js";
import { ALERT_KINDS } from "../../editor/commands.js";
const LABELS = {
    note: "Note",
    tip: "Tip",
    important: "Important",
    warning: "Warning",
    caution: "Caution",
};
export function AlertMenu({ onPick, disabled, title, theme, }) {
    return (_jsx(Popover, { ariaLabel: "Insert alert", theme: theme, trigger: ({ ref, onClick, open }) => (_jsxs("button", { ref: ref, type: "button", className: "mde-toolbar-btn", title: title, "aria-label": title, "aria-haspopup": "true", "aria-expanded": open, disabled: disabled, onClick: onClick, children: [_jsx(AlertIcon, {}), _jsx(ChevronDownIcon, {})] })), children: (close) => (_jsx("div", { className: "mde-menu", role: "menu", children: ALERT_KINDS.map((kind) => (_jsx("button", { type: "button", role: "menuitem", className: `mde-menu-item mde-alert-menu-item mde-alert-${kind}`, onClick: () => {
                    onPick(kind);
                    close();
                }, children: LABELS[kind] }, kind))) })) }));
}
