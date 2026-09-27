"use client";
import { useCallback, useState } from "react";
export function useControllableState(value, defaultValue, onChange) {
    const [internal, setInternal] = useState(defaultValue);
    const isControlled = value !== undefined;
    const current = isControlled ? value : internal;
    const set = useCallback((v) => {
        if (!isControlled)
            setInternal(v);
        onChange?.(v);
    }, [isControlled, onChange]);
    return [current, set];
}
