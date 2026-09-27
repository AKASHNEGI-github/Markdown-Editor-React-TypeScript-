/** Returns the [start, end) character offsets of the line containing `pos`. */
export function lineBoundsAt(value, pos) {
    const start = value.lastIndexOf("\n", pos - 1) + 1;
    let end = value.indexOf("\n", pos);
    if (end === -1)
        end = value.length;
    return { start, end };
}
/** Returns the [start, end) offsets covering every full line touched by [selStart, selEnd]. */
export function expandToLines(value, selStart, selEnd) {
    const start = value.lastIndexOf("\n", selStart - 1) + 1;
    let end = value.indexOf("\n", Math.max(selEnd - 1, start));
    if (end === -1)
        end = value.length;
    return { start, end };
}
export function getSelectedText(state) {
    return state.value.slice(state.selection.start, state.selection.end);
}
/** Replaces [start, end) with `text` and returns the new state, selecting the inserted text by default. */
export function replaceRange(value, start, end, text, select = "all") {
    const newValue = value.slice(0, start) + text + value.slice(end);
    const selection = select === "all"
        ? { start, end: start + text.length }
        : select === "collapse-end"
            ? { start: start + text.length, end: start + text.length }
            : { start, end: start };
    return { value: newValue, selection };
}
