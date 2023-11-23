import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

// Validates a otplength against a validator constraint.
@ValidatorConstraint({ name: 'code', async: false })
export class OtpLength implements ValidatorConstraintInterface {
  validate(value: number, _: ValidationArguments) {
    return String(value).length === 6;
  }
}