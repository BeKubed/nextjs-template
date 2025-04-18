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
export type StaffInput = Prisma.StaffCreateInput
export type StaffUpdate = Prisma.StaffUpdateInput
export type ClientInput = Prisma.ClientCreateInput
export type ClientUpdate = Prisma.ClientUpdateInput
export type UserInput = Prisma.UserCreateInput
export type UserUpdate = Prisma.UserUpdateInput
export type AuditLogInput = Prisma.AuditLogCreateInput

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
