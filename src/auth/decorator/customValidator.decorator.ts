// is-number-array.decorator.ts
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isNumberArray', async: false })
export class CustomValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return this.customValidator(value);
  }

  private customValidator(data: string): boolean {
    if (data.length >= 4 && data.length <= 20 && typeof data == 'string')
      return true;
    else return false;
  }

  defaultMessage(args: ValidationArguments) {
    return 'user name length range error';
  }
}
