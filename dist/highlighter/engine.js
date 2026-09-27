/**
 * A small, dependency-free tokenizer engine. Each language supplies an
 * ordered list of rules (sticky regexes); the first rule that matches at
 * the current position wins. Unmatched characters are merged into "plain"
 * runs. This is a practical approximation, not a full language grammar.
 */
export function escapeRegExp(literal) {
    return literal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
/** Generic rule-driven tokenizer used by most languages. */
export function tokenizeWithRules(code, rules) {
    const tokens = [];
    let i = 0;
    let plainBuf = "";
    const flushPlain = () => {
        if (plainBuf) {
            tokens.push({ type: "plain", text: plainBuf });
            plainBuf = "";
        }
    };
    while (i < code.length) {
        let matched = false;
        for (const rule of rules) {
            rule.re.lastIndex = i;
            const m = rule.re.exec(code);
            if (m && m.index === i && m[0].length > 0) {
                flushPlain();
                const type = rule.classify ? rule.classify(m[0], code, i + m[0].length) : rule.type;
                tokens.push({ type, text: m[0] });
                i += m[0].length;
                matched = true;
                break;
            }
        }
        if (!matched) {
            plainBuf += code[i];
            i++;
        }
    }
    flushPlain();
    return tokens;
}
/** Builds a reasonable rule set for C-like / brace languages from a keyword table. */
export function buildRules(opts) {
    const rules = [];
    for (const lc of opts.lineComment ?? []) {
        rules.push({ type: "comment", re: new RegExp(`${escapeRegExp(lc)}[^\\n]*`, "y") });
    }
    for (const [open, close] of opts.blockComment ?? []) {
        rules.push({
            type: "comment",
            re: new RegExp(`${escapeRegExp(open)}[\\s\\S]*?(?:${escapeRegExp(close)}|$)`, "y"),
        });
    }
    for (const s of opts.strings ?? [])
        rules.push({ type: "string", re: s });
    for (const r of opts.extraRules ?? [])
        rules.push(r);
    rules.push({ type: "number", re: /0[xX][0-9a-fA-F]+|\d+(\.\d+)?([eE][+-]?\d+)?/y });
    const identifierRe = opts.identifierRe ?? /[A-Za-z_$][A-Za-zA-Z0-9_$]*/y;
    const keywords = opts.keywords ?? new Set();
    const types = opts.types ?? new Set();
    const booleans = opts.booleans ?? new Set();
    const ci = !!opts.caseInsensitiveKeywords;
    rules.push({
        type: "plain",
        re: identifierRe,
        classify: (text, code, end) => {
            const key = ci ? text.toUpperCase() : text;
            if (booleans.has(key))
                return "boolean";
            if (keywords.has(key))
                return "keyword";
            if (types.has(key))
                return "type";
            let j = end;
            while (code[j] === " ")
                j++;
            if (code[j] === "(")
                return "function";
            return "plain";
        },
    });
    rules.push({ type: "punctuation", re: /[{}()[\];,.:]/y });
    rules.push({ type: "operator", re: /[+\-*/%=<>!&|^~?]+/y });
    return rules;
}
function upper(words) {
    return new Set(words.map((w) => w.toUpperCase()));
}
export function kwSet(words, caseInsensitive = false) {
    return caseInsensitive ? upper(words) : new Set(words);
}
