import { type AlertKind } from "../../editor/commands.js";
export declare function AlertMenu({ onPick, disabled, title, theme, }: {
    onPick: (kind: AlertKind) => void;
    disabled?: boolean;
    title: string;
    theme?: string;
}): import("react").JSX.Element;
