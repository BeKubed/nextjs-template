import { fieldEncryptionExtension } from "prisma-field-encryption";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient().$extends(fieldEncryptionExtension())

async function main() {
  /*
  [].forEach(async (s: SeedData) => {
    const record: T = {
    }
    const data: TR = {
      createdBy: {
        connect: {
          id: user?.id,
        }
      },
      org: {
        connect: {
          id: org?.id
        }
      },
      ...record
    }
    await prisma.T.create({ data })
  })
  */
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
