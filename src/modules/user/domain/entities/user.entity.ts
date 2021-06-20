import { Entity, ValidationError } from '../../../../shared/entity';
import Messages from '../../../../messages';
import { isAlphaNum, isEmail } from '../../../../shared/utils/helpers';

export interface IUser {
  lastName: string;
  firstName: string;
  email: string;
  password: string;
  emailVerifiedAt?: string;
  isActive?: boolean;
}

export interface UserEntity extends IUser, Entity {}

export class User extends Entity implements IUser {
  static readonly minNameLength = 2;

  static readonly maxStringLength = 150;

  static readonly minEmailLength = 6;

  static readonly minPasswordLength = 8;

  lastName = '';

  firstName = '';

  email = '';

  password = '';

  emailVerifiedAt = '';

  isActive = true;

  validate(): ValidationError[] {
    const validationErrors: ValidationError[] = [];

    let field = 'lastName';

    if (!this[field]) {
      validationErrors.push({
        field,
        message: `${field} is required`,
      });
    } else if (!isAlphaNum(this[field])) {
      validationErrors.push({
        field,
        message: `${field} should be alphanumeric only`,
      });
    } else {
      if (this[field].length < User.minNameLength) {
        validationErrors.push({
          field,
          message: `${field} should be at least ${User.minNameLength} characters long`,
        });
      }
      if (this[field].length > User.maxStringLength) {
        validationErrors.push({
          field,
          message: `${field} should be at most ${User.maxStringLength} characters long`,
        });
      }
    }

    field = 'firstName';

    if (!this[field]) {
      validationErrors.push({
        field,
        message: `${field} is required`,
      });
    } else if (!isAlphaNum(this[field])) {
      validationErrors.push({
        field,
        message: `${field} should be alphanumeric only`,
      });
    } else {
      if (this[field].length < User.minNameLength) {
        validationErrors.push({
          field,
          message: `${field} should be at least ${User.minNameLength} characters long`,
        });
      }
      if (this[field].length > User.maxStringLength) {
        validationErrors.push({
          field,
          message: `${field} should be at most ${User.maxStringLength} characters long`,
        });
      }
    }

    field = 'email';

    if (!this[field]) {
      validationErrors.push({
        field,
        message: `${field} is required`,
      });
    } else if (!isEmail(this[field])) {
      validationErrors.push({
        field,
        message: Messages.EMAIL_INVALID,
      });
    } else {
      if (this[field].length < User.minEmailLength) {
        validationErrors.push({
          field,
          message: `${field} should be at least ${User.minEmailLength} characters long`,
        });
      }
      if (this[field].length > User.maxStringLength) {
        validationErrors.push({
          field,
          message: `${field} should be at most ${User.maxStringLength} characters long`,
        });
      }
    }

    field = 'password';

    if (!this[field]) {
      validationErrors.push({
        field,
        message: `${field} is required`,
      });
    } else if (!isAlphaNum(this[field], true)) {
      validationErrors.push({
        field,
        message: `${field} should be alphanumeric only`,
      });
    } else {
      if (this[field].length < User.minPasswordLength) {
        validationErrors.push({
          field,
          message: `${field} should be at least ${User.minPasswordLength} characters long`,
        });
      }
      if (this[field].length > User.maxStringLength) {
        validationErrors.push({
          field,
          message: `${field} should be at most ${User.maxStringLength} characters long`,
        });
      }
    }

    return validationErrors;
  }
}
