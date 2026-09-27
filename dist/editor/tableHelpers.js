function splitRow(line) {
    let s = line.trim();
    if (s.startsWith("|"))
        s = s.slice(1);
    if (s.endsWith("|")) {
        const b = s.slice(0, -1);
        if (!b.endsWith("\\"))
            s = b;
    }
    const cells = [];
    let cur = "";
    for (let k = 0; k < s.length; k++) {
        if (s[k] === "\\" && s[k + 1] === "|") {
            cur += "|";
            k++;
            continue;
        }
        if (s[k] === "|") {
            cells.push(cur.trim());
            cur = "";
            continue;
        }
        cur += s[k];
    }
    cells.push(cur.trim());
    return cells;
}
function isDelimiterRow(line) {
    const t = line.trim();
    if (!t.includes("-") || !t.includes("|"))
        return false;
    return splitRow(t).every((c) => /^:?-+:?$/.test(c));
}
function parseAlign(cell) {
    const l = cell.startsWith(":");
    const r = cell.endsWith(":");
    if (l && r)
        return "center";
    if (r)
        return "right";
    if (l)
        return "left";
    return null;
}
/** Finds the markdown table containing (or adjacent to) `pos`, if any. */
export function findTableAt(value, pos) {
    const lines = value.split("\n");
    let offset = 0;
    let lineIdx = 0;
    for (let i = 0; i < lines.length; i++) {
        const lineEnd = offset + lines[i].length;
        lineIdx = i;
        if (pos <= lineEnd)
            break;
        offset = lineEnd + 1;
    }
    let delimIdx = -1;
    for (let i = Math.max(0, lineIdx - 1); i <= Math.min(lines.length - 1, lineIdx + 1); i++) {
        if (isDelimiterRow(lines[i])) {
            delimIdx = i;
            break;
        }
    }
    if (delimIdx <= 0)
        return null;
    const headerIdx = delimIdx - 1;
    if (!lines[headerIdx].includes("|"))
        return null;
    let bodyEnd = delimIdx + 1;
    while (bodyEnd < lines.length && lines[bodyEnd].includes("|") && lines[bodyEnd].trim() !== "")
        bodyEnd++;
    const header = splitRow(lines[headerIdx]);
    const align = splitRow(lines[delimIdx]).map(parseAlign);
    const rows = lines.slice(delimIdx + 1, bodyEnd).map(splitRow);
    let start = 0;
    for (let i = 0; i < headerIdx; i++)
        start += lines[i].length + 1;
    let endOffset = 0;
    for (let i = 0; i < bodyEnd; i++)
        endOffset += lines[i].length + 1;
    const end = endOffset > 0 ? endOffset - 1 : endOffset;
    return { start, end, header, align, rows };
}
function pad(s, width, align) {
    const diff = Math.max(0, width - s.length);
    if (align === "right")
        return " ".repeat(diff) + s;
    if (align === "center") {
        const l = Math.floor(diff / 2);
        return " ".repeat(l) + s + " ".repeat(diff - l);
    }
    return s + " ".repeat(diff);
}
/** Re-serializes a table with aligned/padded pipes (auto-format). */
export function serializeTable(header, align, rows) {
    const cols = header.length;
    const widths = Array.from({ length: cols }, (_, c) => {
        let w = Math.max(3, header[c]?.length ?? 0);
        for (const r of rows)
            w = Math.max(w, (r[c] ?? "").length);
        return w;
    });
    const headerLine = "| " + header.map((h, c) => pad(h, widths[c], align[c])).join(" | ") + " |";
    const delimLine = "| " +
        widths
            .map((w, c) => {
            const a = align[c];
            const dashes = "-".repeat(Math.max(3, w - (a === "center" ? 2 : a ? 1 : 0)));
            if (a === "center")
                return `:${dashes}:`;
            if (a === "right")
                return `${dashes}:`;
            if (a === "left")
                return `:${dashes}`;
            return dashes;
        })
            .join(" | ") +
        " |";
    const rowLines = rows.map((r) => "| " + Array.from({ length: cols }, (_, c) => pad(r[c] ?? "", widths[c], align[c])).join(" | ") + " |");
    return [headerLine, delimLine, ...rowLines].join("\n");
}
function replaceTable(value, loc, header, align, rows) {
    const serialized = serializeTable(header, align, rows);
    const newValue = value.slice(0, loc.start) + serialized + value.slice(loc.end);
    const pos = loc.start + serialized.length;
    return { value: newValue, selection: { start: pos, end: pos } };
}
export function addTableRow(state) {
    const loc = findTableAt(state.value, state.selection.start);
    if (!loc)
        return state;
    const rows = [...loc.rows, loc.header.map(() => "Cell")];
    return replaceTable(state.value, loc, loc.header, loc.align, rows);
}
export function addTableColumn(state) {
    const loc = findTableAt(state.value, state.selection.start);
    if (!loc)
        return state;
    const header = [...loc.header, `Header ${loc.header.length + 1}`];
    const align = [...loc.align, null];
    const rows = loc.rows.map((r) => [...r, "Cell"]);
    return replaceTable(state.value, loc, header, align, rows);
}
export function removeTableRow(state, rowIndex) {
    const loc = findTableAt(state.value, state.selection.start);
    if (!loc || loc.rows.length <= 1)
        return state;
    const rows = loc.rows.filter((_, i) => i !== rowIndex);
    return replaceTable(state.value, loc, loc.header, loc.align, rows);
}
export function removeTableColumn(state, colIndex) {
    const loc = findTableAt(state.value, state.selection.start);
    if (!loc || loc.header.length <= 1)
        return state;
    const header = loc.header.filter((_, i) => i !== colIndex);
    const align = loc.align.filter((_, i) => i !== colIndex);
    const rows = loc.rows.map((r) => r.filter((_, i) => i !== colIndex));
    return replaceTable(state.value, loc, header, align, rows);
}
export function setTableColumnAlign(state, colIndex, value) {
    const loc = findTableAt(state.value, state.selection.start);
    if (!loc)
        return state;
    const align = loc.align.map((a, i) => (i === colIndex ? value : a));
    return replaceTable(state.value, loc, loc.header, align, loc.rows);
}
export function formatTable(state) {
    const loc = findTableAt(state.value, state.selection.start);
    if (!loc)
        return state;
    return replaceTable(state.value, loc, loc.header, loc.align, loc.rows);
}
