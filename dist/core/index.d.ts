export * from "./types.js";
export { parseMarkdown, parseInline, parseBlockList } from "./parser/index.js";
export { renderToHtml, type RenderOptions } from "./render/toHtml.js";
export { renderToReactElements, type ReactRenderOptions } from "./render/toReact.js";
export { escapeHtml, sanitizeUrl, slugify, inlineToPlainText } from "./utils.js";
export { supportedLanguages, isLanguageSupported, type Highlighter, type Token } from "../highlighter/index.js";
import { type RenderOptions } from "./render/toHtml.js";
import type { ParseOptions } from "./types.js";
/**
 * Convenience one-shot: markdown source -> HTML string. Equivalent to
 * `renderToHtml(parseMarkdown(source, parseOptions), renderOptions)`.
 * Works in Node (SSR) and the browser; no DOM required.
 */
export declare function markdownToHtml(source: string, parseOptions?: ParseOptions, renderOptions?: RenderOptions): string;
