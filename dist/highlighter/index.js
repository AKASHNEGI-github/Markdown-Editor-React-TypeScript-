import { tokenizeWithRules } from "./engine.js";
import { javascript } from "./languages/javascript.js";
import { typescript } from "./languages/typescript.js";
import { json } from "./languages/json.js";
import { html } from "./languages/html.js";
import { css } from "./languages/css.js";
import { c } from "./languages/c.js";
import { cpp } from "./languages/cpp.js";
import { csharp } from "./languages/csharp.js";
import { java } from "./languages/java.js";
import { go } from "./languages/go.js";
import { rust } from "./languages/rust.js";
import { php } from "./languages/php.js";
import { python } from "./languages/python.js";
import { bash } from "./languages/bash.js";
import { sql } from "./languages/sql.js";
import { yaml } from "./languages/yaml.js";
import { markdown } from "./languages/markdown.js";
import { diff } from "./languages/diff.js";
import { text } from "./languages/text.js";
export { githubLightTokenColors, githubDarkTokenColors } from "./themes.js";
const LANGUAGES = [
    javascript, typescript, json, html, css, c, cpp, csharp, java, go, rust, php,
    python, bash, sql, yaml, markdown, diff, text,
];
const REGISTRY = new Map();
for (const lang of LANGUAGES) {
    for (const alias of lang.aliases)
        REGISTRY.set(alias.toLowerCase(), lang);
}
/** The list of built-in language aliases, e.g. for building a "language" dropdown. */
export function supportedLanguages() {
    return LANGUAGES.map((l) => ({ label: l.name, value: l.aliases[0] }));
}
export function isLanguageSupported(lang) {
    return !!lang && REGISTRY.has(lang.toLowerCase());
}
/** Tokenizes `code` for `lang` using the built-in, dependency-free tokenizer. */
export const highlight = (code, lang) => {
    const def = lang ? REGISTRY.get(lang.toLowerCase()) : undefined;
    if (!def)
        return [{ type: "plain", text: code }];
    if (def.tokenize)
        return def.tokenize(code);
    if (def.rules)
        return tokenizeWithRules(code, def.rules);
    return [{ type: "plain", text: code }];
};
