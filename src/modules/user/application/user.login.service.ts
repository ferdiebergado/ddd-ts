import Messages from '../../../messages';
import { ValidationErrorBag } from '../../../shared/entity';
import { Result } from '../../../shared/result.interface';
import { IService } from '../../../shared/service.interface';
import { isEmail } from '../../../shared/utils/helpers';
import { IUser } from '../domain/entities/user.entity';
import { IHashProvider } from './hash.provider.interface';
import { IUserRepository } from './user.repository.interface';

export type LoginUserDto = Pick<IUser, 'email' | 'password'>;
export type UserLoginResult = Result<ValidationErrorBag>;

export default class UserLoginService
  implements IService<LoginUserDto, UserLoginResult>
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashProvider: IHashProvider,
  ) {}

  async handle(creds: LoginUserDto): Promise<UserLoginResult> {
    const { email, password } = creds;

    const validationErrors = [];
    if (!email) {
      validationErrors.push({
        field: 'email',
        message: 'email is required',
      });
    } else if (!isEmail(email))
      validationErrors.push({
        field: 'email',
        message: Messages.EMAIL_INVALID,
      });

    if (!password)
      validationErrors.push({
        field: 'password',
        message: 'password is required',
      });

    if (validationErrors.length > 0)
      return {
        success: false,
        message: Messages.INVALID_INPUT,
        data: { errors: validationErrors },
      };

    const invalidUserResult: Result<ValidationErrorBag> = {
      success: false,
      message: Messages.INVALID_USER,
      data: {
        errors: [{ field: 'email', message: Messages.INVALID_USER }],
      },
    };

    const exists = await this.userRepository.findUserByEmail(email);
    if (!exists) return invalidUserResult;

    if (!exists.emailVerifiedAt)
      return {
        success: false,
        message: Messages.EMAIL_UNVERIFIED,
        data: {
          errors: [{ field: 'email', message: Messages.EMAIL_UNVERIFIED }],
        },
      };

    const passwordsMatch = this.hashProvider.compare(exists.password, password);
    if (!passwordsMatch) return invalidUserResult;

    if (!exists.isActive)
      return {
        success: false,
        message: Messages.USER_DEACTIVATED,
        data: {
          errors: [{ field: 'email', message: Messages.USER_DEACTIVATED }],
        },
      };

    return {
      success: true,
      message: Messages.LOGGED_IN,
    };
  }
}
