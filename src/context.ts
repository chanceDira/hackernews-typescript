import { PrismaClient } from "@prisma/client";
import { decodeAuthHeader, AuthTokenPayload } from "./utils/auth"; 
import { Request } from "express";  

export const prisma = new PrismaClient();

export interface Context {    // 1
    prisma: PrismaClient;
    userId?: number;  
}

export const context = ({ req }: { req: Request }): Context => {   // 2
    const token =
        req && req.headers.authorization
            ? decodeAuthHeader(req.headers.authorization)
            : null;

    return {  
        prisma,
        userId: token?.userId, 
    };
};