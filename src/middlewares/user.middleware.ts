import { authMiddleware } from "./auth.middleware";
import { HonoRequest } from 'hono';

export const apolloContext = async (request: HonoRequest) => {
  const user = await authMiddleware(request);
  return { user };
};