import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

export interface Context {    // 1
    prisma: PrismaClient;
}

export const context: Context = {   // 2
    prisma,
};