/**
 * Flips the checked state of the `index`-th checklist item found in `source`,
 * scanning top-to-bottom. This matches the parser's document (depth-first)
 * order because nested list lines always appear, indented, before the next
 * sibling line in the raw text.
 */
export declare function toggleCheckboxInMarkdown(source: string, index: number, checked?: boolean): string;
