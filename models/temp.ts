import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // add user
  //   const user = await prisma.accounts.create({
  //     data: {
  //       username: 'test3',
  //       password: 'test3',
  //     },
  //   })
  //   console.log(user)
  // getAll
  //const users = await prisma.accounts.findMany()
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    // process.exit(1)
  })

export { prisma }
