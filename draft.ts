import { PrismaClient, Prisma } from '@prisma/client'
import { Exact } from './Exact';
import { Narrow } from './Narrow';

/**
 * The ideal way of doing is the one you pointed out, of course. But we are
 * limited by the language, we would need to wait for the sigil/optional type
 * parameters proposal that is in discussion for years.
 */
declare function validateType<V, S>(select: Narrow<S, V>): S;

/**
 * And this is impossible ATM because TypeScript wants all or nothing when it
 * comes to type parameters - and it will not help to give `S` a default type:
 * 
 * [info] https://github.com/microsoft/TypeScript/issues/14400
 */
const test0 = validateType<Prisma.UserSelect>({ id: true });

/**
 * TS has a limitations, we cannot 'just' pass one of the generics. So we have
 * to split the generic input into virtual functions like demonstrated below:
 */
declare function validator<V>(): <S>(select: Narrow<Exact<S, V>>) => S;

const userValidator = validator<Prisma.UserSelect>();

/**
 * Otherwise, since the .find methods also perform type checks, then why not
 * just use `Narrow` and let it do its job. This is a more elegant solution:
 */
declare function select<S>(select: Narrow<S>): S;

async function main() {
  const prisma = new PrismaClient()

  // So here are the options we can have so far:
  // - A generic validator factory function
  // - Just a function that narrows the values
  //   This is not something ts does by default
  //   It's enabled by `Narrow`, see `Narrow.ts`
  const select0 = userValidator({ id: true, name: true });  // narrowed
  const select1 = userValidator({ id: true, xxx: true });   // and error

  const data0 = await prisma.user.findFirst({ select: select0 });
  const data1 = await prisma.user.findFirst({ select: select1 });

  const select2 = select({ id: true, name: true }); // narrowed
  const select3 = select({ id: true, xxx: true });  // no errors

  const data2 = await prisma.user.findFirst({ select: select2 });
  const data3 = await prisma.user.findFirst({ select: select3 });
  
  const select4 = userValidator({ asd: true });  // now errors

  prisma.$disconnect();
}

main();
