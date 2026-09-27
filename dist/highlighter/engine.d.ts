/**
 * A small, dependency-free tokenizer engine. Each language supplies an
 * ordered list of rules (sticky regexes); the first rule that matches at
 * the current position wins. Unmatched characters are merged into "plain"
 * runs. This is a practical approximation, not a full language grammar.
 */
export type TokenType = "plain" | "keyword" | "type" | "string" | "comment" | "number" | "function" | "operator" | "punctuation" | "tag" | "attr" | "variable" | "boolean" | "property" | "inserted" | "deleted" | "meta";
export interface Token {
    type: TokenType;
    text: string;
}
export interface LangRule {
    type: TokenType;
    re: RegExp;
    classify?: (matchedText: string, code: string, matchEndIndex: number) => TokenType;
}
export interface LanguageDef {
    name: string;
    aliases: string[];
    /** Custom tokenizer for languages that don't fit the generic rule model (html, diff, ...). */
    tokenize?: (code: string) => Token[];
    rules?: LangRule[];
}
export declare function escapeRegExp(literal: string): string;
/** Generic rule-driven tokenizer used by most languages. */
export declare function tokenizeWithRules(code: string, rules: LangRule[]): Token[];
export interface CommonRuleOptions {
    lineComment?: string[];
    blockComment?: [string, string][];
    strings?: RegExp[];
    keywords?: Set<string>;
    types?: Set<string>;
    booleans?: Set<string>;
    /** Case-insensitive keyword matching (e.g. SQL). */
    caseInsensitiveKeywords?: boolean;
    identifierRe?: RegExp;
    extraRules?: LangRule[];
}
/** Builds a reasonable rule set for C-like / brace languages from a keyword table. */
export declare function buildRules(opts: CommonRuleOptions): LangRule[];
export declare function kwSet(words: string[], caseInsensitive?: boolean): Set<string>;
