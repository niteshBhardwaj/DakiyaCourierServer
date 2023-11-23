import { USER_TYPE } from '@/constants';
export interface DataStoredInToken {
  _id: string;
  _v: number;
  _t: USER_TYPE;
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