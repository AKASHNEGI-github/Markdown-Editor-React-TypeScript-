"use client";
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { findTableAt, addTableRow, addTableColumn, removeTableRow, removeTableColumn, setTableColumnAlign, formatTable, } from "../../editor/tableHelpers.js";
function currentColumnIndex(value, pos) {
    const lineStart = value.lastIndexOf("\n", pos - 1) + 1;
    const before = value.slice(lineStart, pos);
    let count = 0;
    for (let i = 0; i < before.length; i++) {
        if (before[i] === "\\") {
            i++;
            continue;
        }
        if (before[i] === "|")
            count++;
    }
    return Math.max(0, count - 1);
}
function currentRowIndex(value, pos, loc) {
    const block = value.slice(loc.start, loc.end).split("\n");
    let offset = loc.start;
    for (let i = 0; i < block.length; i++) {
        const lineEnd = offset + block[i].length;
        if (pos <= lineEnd)
            return i - 2; // -2: skip header + delimiter rows
        offset = lineEnd + 1;
    }
    return loc.rows.length - 1;
}
export function TableTools({ value, selection, runCommand }) {
    const loc = findTableAt(value, selection.start);
    if (!loc)
        return null;
    const col = Math.min(Math.max(currentColumnIndex(value, selection.start), 0), loc.header.length - 1);
    const row = currentRowIndex(value, selection.start, loc);
    return (_jsxs("div", { className: "mde-table-tools", role: "toolbar", "aria-label": "Table tools", children: [_jsxs("span", { className: "mde-table-tools-label", children: ["Table \u00B7 col ", col + 1] }), _jsx("button", { type: "button", className: "mde-toolbar-btn mde-text-btn", onClick: () => runCommand(addTableRow), children: "+ Row" }), _jsx("button", { type: "button", className: "mde-toolbar-btn mde-text-btn", onClick: () => runCommand(addTableColumn), children: "+ Col" }), _jsx("button", { type: "button", className: "mde-toolbar-btn mde-text-btn", disabled: loc.rows.length <= 1 || row < 0, onClick: () => runCommand((s) => removeTableRow(s, row)), children: "\u2212 Row" }), _jsx("button", { type: "button", className: "mde-toolbar-btn mde-text-btn", disabled: loc.header.length <= 1, onClick: () => runCommand((s) => removeTableColumn(s, col)), children: "\u2212 Col" }), _jsx("span", { className: "mde-table-tools-sep", "aria-hidden": "true" }), _jsx("button", { type: "button", className: "mde-toolbar-btn mde-text-btn", onClick: () => runCommand((s) => setTableColumnAlign(s, col, "left")), children: "Left" }), _jsx("button", { type: "button", className: "mde-toolbar-btn mde-text-btn", onClick: () => runCommand((s) => setTableColumnAlign(s, col, "center")), children: "Center" }), _jsx("button", { type: "button", className: "mde-toolbar-btn mde-text-btn", onClick: () => runCommand((s) => setTableColumnAlign(s, col, "right")), children: "Right" }), _jsx("span", { className: "mde-table-tools-sep", "aria-hidden": "true" }), _jsx("button", { type: "button", className: "mde-toolbar-btn mde-text-btn", onClick: () => runCommand(formatTable), children: "Format" })] }));
}
