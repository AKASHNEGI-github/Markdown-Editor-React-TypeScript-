export declare function useControllableState<T>(value: T | undefined, defaultValue: T, onChange?: (v: T) => void): [T, (v: T) => void];
