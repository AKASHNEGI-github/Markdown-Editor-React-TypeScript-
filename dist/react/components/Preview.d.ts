import type { Highlighter } from "../../highlighter/index.js";
export interface PreviewProps {
    value: string;
    highlighter?: Highlighter;
    openExternalLinksInNewTab?: boolean;
    interactiveChecklists?: boolean;
    onToggleCheckbox?: (index: number, checked: boolean) => void;
    headingIds?: boolean;
    className?: string;
}
export declare function Preview({ value, highlighter, openExternalLinksInNewTab, interactiveChecklists, onToggleCheckbox, headingIds, className, }: PreviewProps): import("react").JSX.Element;
