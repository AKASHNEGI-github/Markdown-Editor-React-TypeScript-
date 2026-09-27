const DEFAULT_COALESCE_WINDOW_MS = 500;
const MAX_HISTORY = 500;
/**
 * A simple linear undo/redo stack of {value, selection} snapshots.
 * Toolbar/command edits always start a new step; plain typing coalesces
 * consecutive keystrokes (within `coalesceWindowMs`) into one step so a
 * single Ctrl+Z undoes a whole burst of typing, not one character.
 */
export class HistoryStack {
    constructor(initial, coalesceWindowMs = DEFAULT_COALESCE_WINDOW_MS) {
        Object.defineProperty(this, "stack", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "index", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "lastPushTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "coalesceWindowMs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.stack = [initial];
        this.index = 0;
        this.coalesceWindowMs = coalesceWindowMs;
    }
    get current() {
        return this.stack[this.index];
    }
    canUndo() {
        return this.index > 0;
    }
    canRedo() {
        return this.index < this.stack.length - 1;
    }
    push(state, coalesce = false) {
        const now = Date.now();
        const canCoalesce = coalesce && this.index === this.stack.length - 1 && now - this.lastPushTime < this.coalesceWindowMs;
        if (canCoalesce) {
            this.stack[this.index] = state;
        }
        else {
            this.stack = this.stack.slice(0, this.index + 1);
            this.stack.push(state);
            this.index++;
            if (this.stack.length > MAX_HISTORY) {
                this.stack = this.stack.slice(this.stack.length - MAX_HISTORY);
                this.index = this.stack.length - 1;
            }
        }
        this.lastPushTime = now;
    }
    undo() {
        if (!this.canUndo())
            return null;
        this.index--;
        return this.current;
    }
    redo() {
        if (!this.canRedo())
            return null;
        this.index++;
        return this.current;
    }
    /** Resets the whole stack to a single new initial state (e.g. after a controlled `value` change from outside). */
    reset(state) {
        this.stack = [state];
        this.index = 0;
    }
}
