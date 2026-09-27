"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { createPortal } from "react-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
// useLayoutEffect warns when it runs during SSR (it never actually fires
// there); fall back to useEffect on the server so importing this file in a
// server-rendered tree (e.g. Next.js) never prints that warning.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
/**
 * A trigger button + popover that portals its content to document.body and
 * positions it with `position: fixed`, computed from the trigger's own
 * bounding rect. This deliberately escapes every ancestor's `overflow`
 * (including the toolbar's horizontally-scrolling row), so the popover can
 * never be clipped or trigger a spurious scrollbar on a parent container.
 */
export function Popover({ trigger, children, ariaLabel, theme, panelClassName }) {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const popoverRef = useRef(null);
    const [pos, setPos] = useState(null);
    useIsomorphicLayoutEffect(() => {
        if (!open)
            return;
        const update = () => {
            const el = anchorRef.current;
            if (!el)
                return;
            const r = el.getBoundingClientRect();
            const maxLeft = window.innerWidth - 8;
            setPos({ top: r.bottom + 4, left: Math.min(r.left, maxLeft) });
        };
        update();
        window.addEventListener("scroll", update, true);
        window.addEventListener("resize", update);
        return () => {
            window.removeEventListener("scroll", update, true);
            window.removeEventListener("resize", update);
        };
    }, [open]);
    // Second pass: the first pass above only keeps the anchor's left edge
    // on-screen (computed before the popover has any real size). Once it's
    // actually mounted, clamp its right/bottom edges to the viewport too —
    // needed for wide panels (e.g. the help guide) and triggers sitting near
    // the viewport's right or bottom edge. Guarded by a value comparison so
    // it settles after one correction instead of looping.
    useIsomorphicLayoutEffect(() => {
        if (!open || !pos)
            return;
        const el = popoverRef.current;
        const anchor = anchorRef.current;
        if (!el || !anchor)
            return;
        const r = el.getBoundingClientRect();
        const anchorRect = anchor.getBoundingClientRect();
        const margin = 8;
        let { top, left } = pos;
        if (left + r.width > window.innerWidth - margin) {
            left = Math.max(margin, window.innerWidth - margin - r.width);
        }
        if (top + r.height > window.innerHeight - margin) {
            top = Math.max(margin, anchorRect.top - r.height - 4);
        }
        if (top !== pos.top || left !== pos.left) {
            setPos({ top, left });
        }
    }, [open, pos]);
    useEffect(() => {
        if (!open)
            return;
        function handlePointer(e) {
            const target = e.target;
            if (anchorRef.current?.contains(target))
                return;
            if (popoverRef.current?.contains(target))
                return;
            setOpen(false);
        }
        function handleKey(e) {
            if (e.key === "Escape")
                setOpen(false);
        }
        document.addEventListener("mousedown", handlePointer);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handlePointer);
            document.removeEventListener("keydown", handleKey);
        };
    }, [open]);
    return (_jsxs(_Fragment, { children: [trigger({ ref: anchorRef, onClick: () => setOpen((o) => !o), open }), open &&
                pos &&
                typeof document !== "undefined" &&
                createPortal(_jsx("div", { ref: popoverRef, className: `mde-popover mde-theme-scope${panelClassName ? ` ${panelClassName}` : ""}`, "data-theme": theme, role: "dialog", "aria-label": ariaLabel, style: { position: "fixed", top: pos.top, left: pos.left }, children: children(() => setOpen(false)) }), document.body)] }));
}
