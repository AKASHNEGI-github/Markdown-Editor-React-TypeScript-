"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { HistoryStack } from "../../editor/history.js";
/** Applies `sel` to the live DOM textarea on the next frame (after React commits the new value). */
function syncDomSelection(ref, sel) {
    requestAnimationFrame(() => {
        const ta = ref.current;
        if (ta && document.activeElement === ta) {
            ta.setSelectionRange(sel.start, sel.end);
        }
    });
}
export function useMarkdownEditorState(opts) {
    const isControlled = opts.value !== undefined;
    const [internalValue, setInternalValue] = useState(opts.value ?? opts.defaultValue ?? "");
    const [selection, setSelection] = useState({ start: 0, end: 0 });
    const [, forceRender] = useState(0);
    const value = isControlled ? opts.value : internalValue;
    const textareaRef = useRef(null);
    const historyRef = useRef(new HistoryStack({ value, selection: { start: 0, end: 0 } }));
    const onChangeRef = useRef(opts.onChange);
    onChangeRef.current = opts.onChange;
    const lastSyncedControlledValue = useRef(value);
    useEffect(() => {
        if (isControlled && opts.value !== lastSyncedControlledValue.current) {
            lastSyncedControlledValue.current = opts.value;
            setInternalValue(opts.value);
            historyRef.current.reset({ value: opts.value, selection });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [opts.value]);
    const commit = useCallback((next, options = {}) => {
        lastSyncedControlledValue.current = next.value;
        setInternalValue(next.value);
        setSelection(next.selection);
        if (options.pushHistory !== false) {
            historyRef.current.push(next, options.coalesce ?? false);
        }
        onChangeRef.current?.(next.value);
        syncDomSelection(textareaRef, next.selection);
        forceRender((n) => n + 1);
    }, []);
    const runCommand = useCallback((fn) => {
        const ta = textareaRef.current;
        const currentSelection = ta ? { start: ta.selectionStart, end: ta.selectionEnd } : selection;
        const current = { value, selection: currentSelection };
        const next = fn(current);
        commit(next, { pushHistory: true, coalesce: false });
        ta?.focus();
    }, [value, selection, commit]);
    const handleTextareaChange = useCallback((e) => {
        const next = {
            value: e.target.value,
            selection: { start: e.target.selectionStart, end: e.target.selectionEnd },
        };
        lastSyncedControlledValue.current = next.value;
        setInternalValue(next.value);
        setSelection(next.selection);
        historyRef.current.push(next, true);
        onChangeRef.current?.(next.value);
    }, []);
    const handleSelect = useCallback((e) => {
        const target = e.currentTarget;
        setSelection({ start: target.selectionStart, end: target.selectionEnd });
    }, []);
    const undo = useCallback(() => {
        const prev = historyRef.current.undo();
        if (prev)
            commit(prev, { pushHistory: false });
    }, [commit]);
    const redo = useCallback(() => {
        const next = historyRef.current.redo();
        if (next)
            commit(next, { pushHistory: false });
    }, [commit]);
    const setValue = useCallback((v) => {
        const next = { value: v, selection: { start: v.length, end: v.length } };
        commit(next, { pushHistory: true, coalesce: false });
    }, [commit]);
    return {
        value,
        selection,
        textareaRef,
        runCommand,
        handleTextareaChange,
        handleSelect,
        undo,
        redo,
        canUndo: historyRef.current.canUndo(),
        canRedo: historyRef.current.canRedo(),
        setValue,
    };
}
