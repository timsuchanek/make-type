import { PrismaClient, Prisma } from '@prisma/client'
import { Exact } from './Exact';

/**
 * The ideal way of doing is the one you pointed out, of course. But we are
 * limited by the language, we would need to wait for the sigil/optional type
 * parameters proposal that is in discussion for years.
 */
declare function validateType<V, S>(select: Exact<S, V>): S;

/**
 * And this is impossible ATM because TypeScript wants all or nothing when it
 * comes to type parameters - and it will not help to give `S` a default type:
 * 
 * [info] https://github.com/microsoft/TypeScript/issues/14400
 */
validateType<Prisma.UserSelect>({ id: true });

/**
 * TS has a limitations, we cannot 'just' pass one of the generics. So we have
 * to split the generic input into virtual functions like demonstrated below:
 */
declare function validator<V>(): <S>(select: Exact<S, V>) => S;

const userValidator = validator<Prisma.UserSelect>();

async function main() {
  const prisma = new PrismaClient();

  const select0 = userValidator({ id: true, name: true });
  const select1 = userValidator({ id: true, xxx: true });
  const select2 = userValidator({ id: 42 });

  const data0 = await prisma.user.findFirst({ select: select0 });
  const data1 = await prisma.user.findFirst({ select: select1 });

  const select4 = userValidator({ asd: true });

  prisma.$disconnect();
}

const test0 = validator<{a: number}>()({ a: '2', b: 2 });
const test1 = validator<{a: number}>()({ a: 2, b: 2 });
const test2 = validator<{a: number}>()({ a: 1 });
const test3 = validator<{a: number}>()({ });
const test4 = validator<{a?: number} | number>()({ });
const test5 = validator<{a?: number} | number>()({ a: 1 });
const test6 = validator<{a?: number} | number>()(1);
const test7 = validator<{a?: number} | [1?]>()(1);
const test8 = validator<{a?: number} | [1?]>()([2]);
const test9 = validator<{a?: number} | [1?]>()([1]);
const test10 = validator<{a?: number} | [1?]>()([]);
const test11 = validator<{a: {a: number}}>()({ a: { a: 42 } });
const test12 = validator<{a: {a: number}}>()({ a: { a: '42' } });

// The following is only relevant for type system discussions
// `Exactify` is an `Exact` utility proposed by the community
// Below, we highlight its limitations in real-world scenarios

type Exactify<T, X extends T> = T & {
  [K in keyof X]: K extends keyof T ? X[K] : never
}

declare function validatorExactify<V>(): <S extends Exactify<V, S>>(select: S) => S;

const testE0 = validatorExactify<{a: number}>()({ a: 2, b: 2 });
const testE1 = validatorExactify<{a: number}>()({ a: '2', b: 2 }); // can't tell why it's wrong
const testE2 = validatorExactify<{a: number}>()({ a: 1 });
const testE3 = validatorExactify<{a: number}>()({ });
const testE4 = validatorExactify<{a?: number} | number>()({ });
const testE5 = validatorExactify<{a?: number} | number>()({ a: 1 }); // fails on mixed unions!
const testE6 = validatorExactify<{a?: number} | number>()(1);
const testE7 = validatorExactify<{a?: number} | [1?]>()(1); // does not fail when it should!
const testE8 = validatorExactify<{a?: number} | [1?]>()([2]); // can't tell why it's wrong
const testE9 = validatorExactify<{a?: number} | [1?]>()([1]); // can't tell why it's wrong
const testE10 = validatorExactify<{a?: number} | [1?]>()([]);
const testE11 = validatorExactify<{a: {a: number}}>()({ a: { a: 42 } }); // does not narrow user input
const testE12 = validatorExactify<{a: {a: number}}>()({ a: { a: '42' } }); // can't tell why it's wrong

main();
