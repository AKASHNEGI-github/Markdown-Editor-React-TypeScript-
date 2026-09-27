"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Popover } from "./Popover.js";
import { ChevronDownIcon } from "./Icons.js";
import { supportedLanguages } from "../../highlighter/index.js";
const LANGS = supportedLanguages();
export function CodeLangMenu({ value, onChange, disabled, theme, }) {
    const current = LANGS.find((l) => l.value === value) ?? LANGS[0];
    return (_jsx(Popover, { ariaLabel: "Code block language", theme: theme, trigger: ({ ref, onClick, open }) => (_jsxs("button", { ref: ref, type: "button", className: "mde-toolbar-btn mde-code-lang-trigger", title: "Code block language", "aria-label": `Code block language: ${current.label}`, "aria-haspopup": "true", "aria-expanded": open, disabled: disabled, onClick: onClick, children: [_jsx("span", { className: "mde-code-lang-trigger-label", children: current.label }), _jsx(ChevronDownIcon, {})] })), children: (close) => (_jsx("div", { className: "mde-menu mde-lang-menu", role: "menu", children: LANGS.map((l) => (_jsx("button", { type: "button", role: "menuitem", className: `mde-menu-item${l.value === value ? " mde-menu-item-selected" : ""}`, onClick: () => {
                    onChange(l.value);
                    close();
                }, children: l.label }, l.value))) })) }));
}
