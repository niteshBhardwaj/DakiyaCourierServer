import { HTTP_CODE, AUTH_ERROR_KEYS } from '@/constants';
import { Container } from 'typedi';
import { AuthChecker } from 'type-graphql';
import { HttpException } from '@exceptions/HttpException';
import { AuthContext, ContextInvalidToken, UserContext } from '@interfaces/auth.interface';
import LoggerInstance from '@/plugins/logger';
import TokenService from '@/services/token.service';
import { FastifyRequest } from 'fastify';

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
  { context },
  roles,
) => {
  const { userId, userType } = context as UserContext;
  const { invalidToken } = context as ContextInvalidToken;
  // throw incase of invalid token
  if (invalidToken) throw new HttpException(HTTP_CODE[401], AUTH_ERROR_KEYS.WRONG_TOKEN);
  // throw error if token not found
  if (!userId) throw new HttpException(HTTP_CODE[401], AUTH_ERROR_KEYS.MISSING_TOKEN);
  if (roles && roles.length && !roles.includes(userType)) {
    throw new HttpException(HTTP_CODE[401], AUTH_ERROR_KEYS.INVALID_PERMISSION);
  }
  return true;
};
