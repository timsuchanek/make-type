/**
 * `Narrow` is a tool that forces TS not to widen an object. It is used to
 * preserve the exact same shape of an object. It preserves, numbers, strings,
 * booleans, and tuples in nested objects and structures so that they are kept
 * as is. It is meant to be used on function parameters.
 *
 * [info] https://github.com/microsoft/TypeScript/issues/30680
 *
 * The following implementation supports the full OP and the additions that we
 * discussed in comments.
 */
type Narrow<A, W = unknown> =
    A & {[K in keyof A]: NarrowAt<A, W, K>};

type NarrowAt<A, W, K extends keyof A, AK = A[K], WK = At<W, K>> =
    WK extends Widen<infer T> ? T :
    AK extends Narrowable ? AK & WK :
    Narrow<AK, WK>;

type At<O, K> = K extends keyof O ? O[K] : unknown;

type Widen<A> = {[type]: A};

type Narrowable =
| string
| number
| bigint
| boolean
| [];

declare const type: unique symbol;

export {Narrow};