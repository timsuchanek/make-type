/**
 * `Exact` forces a type to comply by another type. It will need to be a subset
 * and must have exactly the same properties, no more, no less.
 */

/**
 * `Exact` forces a type to comply by another type. It will need to be a subset
 * and must have exactly the same properties, no more, no less.
 */
type Exact<A, W> = 
A extends W ? W extends unknown ? 
A extends NotMappableType ? A : {
    [K in keyof A]: K extends keyof W
    ? Exact<A[K], W[K]>
    : never
} : never : W

type NotMappableType =
| string
| number
| bigint
| boolean
| ((...args: any) => any);

export {Exact};

type Try<A, B> = A extends B ? A : never
