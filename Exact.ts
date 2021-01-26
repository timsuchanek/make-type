import { Cast } from "./Cast";

/**
 * `Exact` forces a type to comply by another type. It will need to be a subset
 * and must have exactly the same properties, no more, no less.
 */
type Exact<A, W> =
W extends unknown ? A extends W ? Cast<{
    [K in keyof A]: K extends keyof W
    ? Exact<A[K], W[K]>
    : never
}, A> : W : never;

export {Exact};
