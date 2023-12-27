import { CurrentStateType } from "@prisma/client";

export enum USER_TYPE {
  ADMIN = 'ADMIN',
  BASIC = 'BASIC'
}

export const CURRENT_STATE_CONFIG = {
  [CurrentStateType.PHONE]: {
    isRequired: true,
    state: CurrentStateType.PHONE,
  },
  [CurrentStateType.EMAIL]: {
    isRequired: true,
    state: CurrentStateType.EMAIL,
  },
  [CurrentStateType.KYC]: {
    isRequired: false,
    state: CurrentStateType.KYC,
  },
  [CurrentStateType.ACCOUNT_DETAILS]: {
    isRequired: false,
    state: CurrentStateType.ACCOUNT_DETAILS,
  },
};

export const USER_ACCOUNT_STEPS = [
  CurrentStateType.PHONE,
  CurrentStateType.EMAIL,
  CurrentStateType.KYC,
  CurrentStateType.ACCOUNT_DETAILS
];