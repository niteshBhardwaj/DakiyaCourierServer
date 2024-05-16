import { USER_TYPE } from '~/constants';
export interface DataStoredInToken {
  id: string;
  v: number;
  t: USER_TYPE;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export type UserContext = {
  userId: string;
  verified: boolean;
  userType: USER_TYPE;
}
export type ContextInvalidToken =  {
  invalidToken: boolean;
}

export type AuthContext = Partial<UserContext> & Partial<ContextInvalidToken>;