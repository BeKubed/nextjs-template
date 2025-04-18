import { PrismaClient, Prisma } from "@prisma/client";
import { fieldEncryptionExtension } from "prisma-field-encryption";

const prismaClientSingleton = () => {
  const c = new PrismaClient();
  return c.$extends(fieldEncryptionExtension())
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;
export type UserInput = Prisma.UserCreateInput
export type UserUpdate = Prisma.UserUpdateInput

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
