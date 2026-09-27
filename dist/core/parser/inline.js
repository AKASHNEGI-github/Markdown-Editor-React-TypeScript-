/** Sentinel character inserted by joinParagraphLines() to mark a hard line break. */
export const HARD_BREAK = "\u0002";
/**
 * Joins the raw lines of a paragraph (or any multi-line inline context) into
 * a single string, turning "line ends with 2+ spaces" or "line ends with a
 * backslash" into a hard-break sentinel, and everything else into a soft
 * break (a single space), matching standard markdown paragraph behavior.
 */
export function joinParagraphLines(lines) {
    return lines
        .map((line, idx) => {
        const isLast = idx === lines.length - 1;
        if (isLast)
            return line;
        if (/ {2,}$/.test(line))
            return line.replace(/ +$/, "") + HARD_BREAK;
        if (/\\$/.test(line))
            return line.replace(/\\$/, "") + HARD_BREAK;
        return line + " ";
    })
        .join("");
}
const WHITELISTED_TAGS = {
    u: "underline",
    sub: "subscript",
    sup: "superscript",
};
function isAlnum(ch) {
    return !!ch && /[A-Za-z0-9]/.test(ch);
}
function isEscapable(ch) {
    return /[!"#$%&'()*+,\-./:;<=>?@[\]\\^_`{|}~]/.test(ch);
}
function tryInlineCode(text, i) {
    let n = 0;
    while (text[i + n] === "`")
        n++;
    const openEnd = i + n;
    let j = openEnd;
    while (j < text.length) {
        if (text[j] === "`") {
            let runLen = 0;
            const runStart = j;
            while (text[j] === "`") {
                j++;
                runLen++;
            }
            if (runLen === n) {
                let content = text.slice(openEnd, runStart);
                // CommonMark: strip one leading+trailing space if content has non-space chars.
                if (content.length > 0 && content.startsWith(" ") && content.endsWith(" ") && content.trim() !== "") {
                    content = content.slice(1, -1);
                }
                content = content.replace(/\n/g, " ");
                return { node: { type: "inlineCode", value: content }, end: j };
            }
            continue;
        }
        j++;
    }
    return null;
}
function tryAutolinkOrTag(text, i) {
    const rest = text.slice(i);
    const autolink = rest.match(/^<((?:https?:\/\/|mailto:)[^\s<>]+)>/);
    if (autolink) {
        const url = autolink[1];
        return {
            node: { type: "link", url, children: [{ type: "text", value: url }] },
            end: i + autolink[0].length,
        };
    }
    const tagMatch = rest.match(/^<(u|sub|sup)>/);
    if (tagMatch) {
        const tag = tagMatch[1];
        const closeTag = `</${tag}>`;
        const openEnd = i + tagMatch[0].length;
        const closeIdx = text.indexOf(closeTag, openEnd);
        if (closeIdx !== -1) {
            const inner = text.slice(openEnd, closeIdx);
            return {
                node: { type: WHITELISTED_TAGS[tag], children: parseInline(inner) },
                end: closeIdx + closeTag.length,
            };
        }
    }
    return null; // not autolink/whitelisted tag -> '<' falls through as literal text
}
/** Parses `[label](url "title")` starting at `(`. Returns null if malformed. */
function parseUrlTitle(text, openParenIdx) {
    let j = openParenIdx + 1;
    while (text[j] === " ")
        j++;
    let url = "";
    let depth = 0;
    while (j < text.length) {
        const c = text[j];
        if (c === "(") {
            depth++;
            url += c;
            j++;
            continue;
        }
        if (c === ")" && depth > 0) {
            depth--;
            url += c;
            j++;
            continue;
        }
        if (c === ")" && depth === 0)
            break;
        if (c === " " && depth === 0)
            break;
        if (c === "\\" && j + 1 < text.length) {
            url += text[j + 1];
            j += 2;
            continue;
        }
        url += c;
        j++;
    }
    while (text[j] === " ")
        j++;
    let title;
    if (text[j] === '"' || text[j] === "'") {
        const quote = text[j];
        const start = j + 1;
        const end = text.indexOf(quote, start);
        if (end === -1)
            return null;
        title = text.slice(start, end);
        j = end + 1;
        while (text[j] === " ")
            j++;
    }
    if (text[j] !== ")")
        return null;
    return { url, title, end: j + 1 };
}
/** Finds the index of the `]` that closes a `[` opened at `openIdx`, respecting nested brackets. */
function findClosingBracket(text, openIdx) {
    let depth = 0;
    for (let j = openIdx; j < text.length; j++) {
        if (text[j] === "\\") {
            j++;
            continue;
        }
        if (text[j] === "[")
            depth++;
        else if (text[j] === "]") {
            depth--;
            if (depth === 0)
                return j;
        }
    }
    return -1;
}
function tryImage(text, i) {
    // text[i] === '!' and text[i+1] === '['
    const closeBracket = findClosingBracket(text, i + 1);
    if (closeBracket === -1 || text[closeBracket + 1] !== "(")
        return null;
    const alt = text.slice(i + 2, closeBracket);
    const parsed = parseUrlTitle(text, closeBracket + 1);
    if (!parsed)
        return null;
    return {
        node: { type: "image", alt, url: parsed.url, title: parsed.title },
        end: parsed.end,
    };
}
function tryLink(text, i) {
    const closeBracket = findClosingBracket(text, i);
    if (closeBracket === -1 || text[closeBracket + 1] !== "(")
        return null;
    const label = text.slice(i + 1, closeBracket);
    const parsed = parseUrlTitle(text, closeBracket + 1);
    if (!parsed)
        return null;
    return {
        node: { type: "link", url: parsed.url, title: parsed.title, children: parseInline(label) },
        end: parsed.end,
    };
}
function tryStrikethrough(text, i) {
    const j = text.indexOf("~~", i + 2);
    if (j === -1 || j === i + 2)
        return null;
    return {
        node: { type: "strikethrough", children: parseInline(text.slice(i + 2, j)) },
        end: j + 2,
    };
}
function runLength(text, i, ch) {
    let n = 0;
    while (text[i + n] === ch)
        n++;
    return n;
}
function tryEmphasis(text, i) {
    const ch = text[i];
    const left = runLength(text, i, ch);
    if (ch === "_" && isAlnum(text[i - 1]))
        return null; // mid-word underscore: treat literally
    const tryLen = (len) => {
        if (left < len)
            return null;
        const delim = ch.repeat(len);
        const searchStart = i + len;
        let j = searchStart;
        while (j < text.length) {
            if (text.startsWith(delim, j)) {
                if (ch === "_" && isAlnum(text[j + len])) {
                    j++;
                    continue;
                } // mid-word close: keep scanning
                if (j === searchStart)
                    return null; // empty content
                const inner = text.slice(searchStart, j);
                const innerNodes = parseInline(inner);
                const node = len === 3
                    ? { type: "strong", children: [{ type: "emphasis", children: innerNodes }] }
                    : len === 2
                        ? { type: "strong", children: innerNodes }
                        : { type: "emphasis", children: innerNodes };
                return { node, end: j + len };
            }
            j++;
        }
        return null;
    };
    return tryLen(3) ?? tryLen(2) ?? tryLen(1);
}
function mergeAdjacentText(nodes) {
    const out = [];
    for (const node of nodes) {
        const prev = out[out.length - 1];
        if (node.type === "text" && prev && prev.type === "text") {
            prev.value += node.value;
        }
        else {
            out.push(node);
        }
    }
    return out;
}
/** Parses a single logical line (or joined paragraph string) of inline markdown into an AST. */
export function parseInline(text) {
    const nodes = [];
    let buf = "";
    let i = 0;
    const flush = () => {
        if (buf) {
            nodes.push({ type: "text", value: buf });
            buf = "";
        }
    };
    while (i < text.length) {
        const ch = text[i];
        if (ch === HARD_BREAK) {
            flush();
            nodes.push({ type: "break" });
            i++;
            continue;
        }
        if (ch === "\\" && i + 1 < text.length && isEscapable(text[i + 1])) {
            buf += text[i + 1];
            i += 2;
            continue;
        }
        if (ch === "`") {
            const res = tryInlineCode(text, i);
            if (res) {
                flush();
                nodes.push(res.node);
                i = res.end;
                continue;
            }
        }
        if (ch === "<") {
            const res = tryAutolinkOrTag(text, i);
            if (res) {
                flush();
                nodes.push(res.node);
                i = res.end;
                continue;
            }
        }
        if (ch === "!" && text[i + 1] === "[") {
            const res = tryImage(text, i);
            if (res) {
                flush();
                nodes.push(res.node);
                i = res.end;
                continue;
            }
        }
        if (ch === "[") {
            const res = tryLink(text, i);
            if (res) {
                flush();
                nodes.push(res.node);
                i = res.end;
                continue;
            }
        }
        if (ch === "~" && text[i + 1] === "~") {
            const res = tryStrikethrough(text, i);
            if (res) {
                flush();
                nodes.push(res.node);
                i = res.end;
                continue;
            }
        }
        if (ch === "*" || ch === "_") {
            const res = tryEmphasis(text, i);
            if (res) {
                flush();
                nodes.push(res.node);
                i = res.end;
                continue;
            }
        }
        buf += ch;
        i++;
    }
    flush();
    return mergeAdjacentText(nodes);
}
