export function isOfType<T>(
    target: unknown,
    prop: keyof T
): target is T {
    return (target as T)[prop] !== undefined;
}