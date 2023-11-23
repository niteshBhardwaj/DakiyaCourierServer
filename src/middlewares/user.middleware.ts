import { AuthContext } from '@/interfaces/auth.interface';
import { authMiddleware } from "./auth.middleware";
import { ApolloFastifyContextFunction } from "@as-integrations/fastify";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const apolloContext: ApolloFastifyContextFunction<AuthContext> = async (request) => {
  const user = await authMiddleware(request);
  return { user, prisma };
};