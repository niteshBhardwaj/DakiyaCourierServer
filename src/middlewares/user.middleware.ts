import { AuthContext } from '@/interfaces/auth.interface';
import { authMiddleware } from "./auth.middleware";
import { ApolloFastifyContextFunction } from "@as-integrations/fastify";

export const apolloContext: ApolloFastifyContextFunction<AuthContext> = async (request) => {
  const user = await authMiddleware(request);
  return { user };
};