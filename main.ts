import { PrismaClient, Prisma } from '@prisma/client'

// optimally we get a generic type here and don't need to hardcode Prisma.UserSelect
function makeUserSelect<T extends Prisma.UserSelect>(
  select: Prisma.Subset<T, Prisma.UserSelect>,
): T {
  return select
}

/**
 * I would like something like this:
 * const select = validateType<Prisma.UserSelect>({ id: true })
 *
 * But haven't gotten that working yet
 */

async function main() {
  const prisma = new PrismaClient()

  const select = makeUserSelect({ id: true })

  const data = await prisma.user.findFirst({
    select,
  })

  data?.id

  prisma.$disconnect()
}

main()
