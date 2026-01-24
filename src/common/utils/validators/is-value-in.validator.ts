import {
  isArray,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { compareTwoFlatArrays } from '../util/array.util';

@ValidatorConstraint({ name: 'isValueIn', async: false })
class IsValueInValidatorRule implements ValidatorConstraintInterface {
  allowedValues: string[];

  validate(searchValue: any | any[], args: ValidationArguments): boolean {
    this.allowedValues = args?.constraints?.[0] ?? [];
    return isValueIn(this.allowedValues, searchValue);
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args?.property} must be one of the following values: ${this.allowedValues.join(', ')}`;
  }
}

export function IsValueIn(
  allowedValues: any[],
  validationOptions?: ValidationOptions,
): any {
  const cns: any[] = [allowedValues];
  return function (object: object, propertyName: string): void {
    registerDecorator({
      name: 'IsValueIn',
      target: object.constructor,
      propertyName: propertyName,
      constraints: cns,
      options: validationOptions,
      validator: IsValueInValidatorRule,
    });
  };
}

// allow value always array, but search value can be single or array
export function isValueIn(
  allowedValues: any[],
  searchValues: any | any[],
): boolean {
  searchValues = isArray(searchValues) ? searchValues : [searchValues];
  const { isMatched } = compareTwoFlatArrays(allowedValues, searchValues);
  return isMatched;
}
