import { HTTP_CODE, AUTH_ERROR_KEYS } from '@constants';
import { Container } from 'typedi';
import { AuthChecker } from 'type-graphql';
import TokenService from 'services/token.service';
import { HttpException, httpException } from 'utils/exceptions.util';

// Verify a user's token.
export const authMiddleware = async (req: Request) => {
  try {
    const authorization = req.headers.get("authorization");
    const token = authorization?.split("Bearer ")[1] as string;
    console.log(authorization);
    if (authorization) {
      const tokenService = Container.get(TokenService);
      const { _id, _v, _t } = await tokenService.verifyToken(token);
      return { userId: _id, verified: !!_v, userType: _t };
    }
    return null;
  } catch (error) {
    return { invalidToken: true };
  }
};


// Checks if a user is authenticated.
export const authChecker: AuthChecker<any> = ({ userId, invalidToken, userType }, roles) => {
  // throw incase of invalid token
  if(invalidToken) throw httpException(HTTP_CODE[401], AUTH_ERROR_KEYS.WRONG_TOKEN);
  // throw error if token not found
  if (!userId) throw httpException(HTTP_CODE[401], AUTH_ERROR_KEYS.MISSING_TOKEN);
  if(roles && roles.length && !roles.includes(userType)) {
    throw httpException(HTTP_CODE[401], AUTH_ERROR_KEYS.INVALID_PERMISSION);
  }
  return true;
};
