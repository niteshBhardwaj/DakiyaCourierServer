import { CurrentStateType } from "@prisma/client";

export const ACCOUNT_HOLDER_NAME_VALIDATION = {
  description: 'The account holder name',
  message: 'Account holder name must be a non empty string',
};

export const ACCOUNT_NUMBER_VALIDATION = {
  description: 'The account number',
  message: 'Account number must be a non empty string',
};

export const BANK_NAME_VALIDATION = {
  description: 'The bank name',
  message: 'Bank name must be a non empty string',
};

export const IFSC_CODE_VALIDATION = {
  description: 'The IFSC code',
  message: 'IFSC code must be a non empty string',
};

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