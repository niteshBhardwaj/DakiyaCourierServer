import { HTTP_CODE, AUTH_ERROR_KEYS, ERROR_CODE } from '@/constants';
import { Container } from 'typedi';
import { type AuthChecker } from 'type-graphql';
import { AuthContext, ContextInvalidToken, UserContext } from '@/interfaces/auth.interface';
import LoggerInstance from '@/plugins/logger';
import TokenService from '@/services/token.service';
import { FastifyRequest } from 'fastify';
import { badRequestException } from '@/utils/exceptions.util';

// Verify a user's token.
export const authMiddleware = async (req: FastifyRequest) => {
  try {
    const Authorization = req?.headers?.authorization?.split('Bearer ')[1];
    if (Authorization) {
      const tokenService = Container.get(TokenService);
      const {_id, _v, _t} = await tokenService.verifyToken(Authorization)
      return { userId: _id, verified: !!_v, userType: _t }
    }
    return {};
  } catch (error) {
    LoggerInstance.error(error);
    return { invalidToken: true };
  }
};


// Checks if a user is authenticated.
export const authChecker: AuthChecker<AuthContext> = async (
  { context: user },
  roles,
) => {
  const { userId, userType } = user as UserContext;
  const { invalidToken } = user as ContextInvalidToken;
  // throw incase of invalid token
  if (invalidToken) throw badRequestException(AUTH_ERROR_KEYS.WRONG_TOKEN, ERROR_CODE.UNAUTHENTICATED);
  // throw error if token not found
  if (!userId) throw badRequestException(AUTH_ERROR_KEYS.MISSING_TOKEN, ERROR_CODE.UNAUTHENTICATED);
  if (roles && roles.length && !roles.includes(userType)) {
    throw badRequestException(AUTH_ERROR_KEYS.INVALID_PERMISSION, ERROR_CODE.UNAUTHENTICATED);
  }
  return true;
};
