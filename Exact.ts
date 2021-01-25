/**
 * `Exact` forces a type to comply by another type. It will need to be a subset
 * and must have exactly the same properties, no more, no less.
 */
type Exact<A, W> = W & {
    [K in keyof A]: K extends keyof W ? A[K] : never
}

export {Exact};