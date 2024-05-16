import { ValidatorConstraint, ValidatorConstraintInterface, isEmail, isMobilePhone } from 'class-validator';
import { GovernmentIdType } from '@prisma/client';
import { KycOfflineInput } from '~/graphql-type/args/users.input';

@ValidatorConstraint({ name: 'otpLength', async: false })
export class OtpLength implements ValidatorConstraintInterface {
  validate(value: number) {
    const otpValueLength = String(value).length;
    return otpValueLength === 6;
  }
}

@ValidatorConstraint({ name: 'emailOrPhone', async: false })
export class EmailOrPhone implements ValidatorConstraintInterface {
  validate(text: string) {
    return isEmail(text) || isMobilePhone(text)
  }

  defaultMessage() {
    return 'Enter a valid phone number or email address.';
  }
}

@ValidatorConstraint({ name: 'kycDocuments', async: false })
export class KycDocuments implements ValidatorConstraintInterface {
  validate(array: KycOfflineInput['documents']) {
    const { length } = array;
    if (length >= 2 && length <= 4) {
      const documentTypes = [...new Set(array.map(doc => doc.type as GovernmentIdType))].filter(type => GovernmentIdType[type]);
      return documentTypes.length === length;
    }
    return false;
  }

  defaultMessage() {
    return 'Invalid KYC documents request.';
  }
}