import type { Token } from "./engine.js";
export type { Token, TokenType, LanguageDef } from "./engine.js";
export { githubLightTokenColors, githubDarkTokenColors } from "./themes.js";
/** The list of built-in language aliases, e.g. for building a "language" dropdown. */
export declare function supportedLanguages(): {
    label: string;
    value: string;
}[];
export declare function isLanguageSupported(lang: string | undefined): boolean;
/**
 * A pluggable highlighter function. The editor's default is `highlight`
 * below; a host app may supply its own (e.g. wrapping Shiki) via the
 * `highlighter` prop on MarkdownEditor / MarkdownViewer.
 */
export type Highlighter = (code: string, lang: string | undefined) => Token[];
/** Tokenizes `code` for `lang` using the built-in, dependency-free tokenizer. */
export declare const highlight: Highlighter;
