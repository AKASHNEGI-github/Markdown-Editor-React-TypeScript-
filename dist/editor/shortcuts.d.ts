export interface ShortcutDef {
    combo: string;
    commandId: string;
}
/** "mod" = Ctrl on Windows/Linux, Cmd on macOS. */
export declare const SHORTCUTS: ShortcutDef[];
interface KeyLike {
    key: string;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
    altKey: boolean;
}
export declare function normalizeShortcut(e: KeyLike): string;
export declare function matchShortcut(e: KeyLike): string | null;
export {};
