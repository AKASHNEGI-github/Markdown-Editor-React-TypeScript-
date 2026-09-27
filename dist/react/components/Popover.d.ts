import type { ReactNode, RefObject } from "react";
export interface PopoverTriggerArgs {
    ref: RefObject<HTMLButtonElement>;
    onClick: () => void;
    open: boolean;
}
export interface PopoverProps {
    trigger: (args: PopoverTriggerArgs) => ReactNode;
    children: (close: () => void) => ReactNode;
    ariaLabel: string;
    /**
     * The editor's current theme ("light" | "dark" | "auto"). Stamped onto the
     * portaled content as `data-theme`, alongside the `.mde-theme-scope` class
     * that independently re-declares the `--mde-*` custom properties (see
     * styles.css). The portal escapes `.mde-root` in the DOM tree, so without
     * this the popover would have no theme variables in scope at all and fall
     * back to transparent/unstyled.
     */
    theme?: string;
    /** Extra class name appended to the portaled panel (e.g. to widen it for content-heavy popovers like the help guide). */
    panelClassName?: string;
}
/**
 * A trigger button + popover that portals its content to document.body and
 * positions it with `position: fixed`, computed from the trigger's own
 * bounding rect. This deliberately escapes every ancestor's `overflow`
 * (including the toolbar's horizontally-scrolling row), so the popover can
 * never be clipped or trigger a spurious scrollbar on a parent container.
 */
export declare function Popover({ trigger, children, ariaLabel, theme, panelClassName }: PopoverProps): import("react").JSX.Element;
