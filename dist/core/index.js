export * from "./types.js";
export { parseMarkdown, parseInline, parseBlockList } from "./parser/index.js";
export { renderToHtml } from "./render/toHtml.js";
export { renderToReactElements } from "./render/toReact.js";
export { escapeHtml, sanitizeUrl, slugify, inlineToPlainText } from "./utils.js";
export { supportedLanguages, isLanguageSupported } from "../highlighter/index.js";
import { parseMarkdown } from "./parser/index.js";
import { renderToHtml } from "./render/toHtml.js";
/**
 * Convenience one-shot: markdown source -> HTML string. Equivalent to
 * `renderToHtml(parseMarkdown(source, parseOptions), renderOptions)`.
 * Works in Node (SSR) and the browser; no DOM required.
 */
export function markdownToHtml(source, parseOptions, renderOptions) {
    return renderToHtml(parseMarkdown(source, parseOptions), renderOptions);
}
