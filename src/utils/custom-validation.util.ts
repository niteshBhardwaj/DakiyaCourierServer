import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, isEmail, isMobilePhone } from 'class-validator';

// Validates a otplength against a validator constraint.
@ValidatorConstraint({ name: 'code', async: false })
export class OtpLength implements ValidatorConstraintInterface {
  validate(value: number) {
    return String(value).length === 6;
  }
}

@ValidatorConstraint({ name: 'emailOrPhone', async: false })
export class EmailOrPhone implements ValidatorConstraintInterface {
  validate(text: string) {
    return isEmail(text) || isMobilePhone(text)
  }

  defaultMessage() {
    // here you can provide default error message if validation failed
    return 'Enter valid phone or email no.';
  }
}