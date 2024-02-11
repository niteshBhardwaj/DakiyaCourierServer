import { AuthContext } from '@/interfaces/auth.interface';
import { authMiddleware } from "./auth.middleware";
import { ApolloFastifyContextFunction } from "@as-integrations/fastify";
import { FastifyRequest } from 'fastify';

export const apolloContext = async (request: FastifyRequest) => {
  const user = await authMiddleware(request);
  return { user };
};