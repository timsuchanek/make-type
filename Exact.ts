import {Cast} from "./Cast";
import {Narrowable} from "./Narrowable";

/**
 * `Exact` forces a type to comply by another type. It will need to be a subset
 * and must have exactly the same properties, no more, no less.
 */
type Exact<A, W = unknown> = 
W extends unknown ? A extends Narrowable ? Cast<A, W> : Cast<
{[K in keyof A]: K extends keyof W ? Exact<A[K], W[K]> : never},
{[K in keyof W]: K extends keyof A ? Exact<A[K], W[K]> : W[K]}>
: never;

export {Exact};
