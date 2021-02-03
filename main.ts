import {PrismaClient, Prisma} from '@prisma/client'

// optimally we get a generic type here and don't need to hardcode Prisma.UserSelect
function makeUserSelect<T extends Prisma.UserSelect>(
  select: Prisma.Subset<T, Prisma.UserSelect>,
): T {
  return select
};

/**
 * I would like something like this:
 * const select = validateType<Prisma.UserSelect>({id: true})
 *
 * But haven't gotten that working yet
 */

async function main() {
  const prisma = new PrismaClient();

  const select0 = makeUserSelect({id: true, name: true});
  const select1 = makeUserSelect({id: true, xxx: true});

  const data0 = await prisma.user.findFirst({select: select0});
  const data1 = await prisma.user.findFirst({select: select1});

  data0?.id;
  data1?.id;

  prisma.$disconnect();
};

main();
