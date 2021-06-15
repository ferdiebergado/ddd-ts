import { Messages } from '../../../messages'
import { ValidationErrorBag } from '../../../shared/entity'
import { Result } from '../../../shared/result.interface'
import { IService } from '../../../shared/service.interface'
import { isEmail } from '../../../shared/utils/helpers'
import { IUser } from '../domain/entities/user.entity'
import { IHashProvider } from './hash.provider.interface'
import { IUserRepository } from './user.repository'

export type LoginUserDto = Pick<IUser, 'email' | 'password'>
export type UserLoginResult = Result<ValidationErrorBag>

export class UserLoginService
  implements IService<LoginUserDto, UserLoginResult>
{
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _hashProvider: IHashProvider
  ) {}

  async handle(creds: LoginUserDto): Promise<UserLoginResult> {
    const { email, password } = creds
    const validationErrors = []
    if (!email) {
      validationErrors.push({
        field: 'email',
        message: 'email is required',
      })
    } else {
      if (!isEmail(email))
        validationErrors.push({
          field: 'email',
          message: Messages.EMAIL_INVALID,
        })
    }

    if (!password)
      validationErrors.push({
        field: 'password',
        message: 'password is required',
      })

    if (validationErrors.length > 0)
      return {
        success: false,
        message: Messages.INVALID_INPUT,
        data: { errors: validationErrors },
      }

    const invalidUserResult: Result<ValidationErrorBag> = {
      success: false,
      message: Messages.INVALID_USER,
      data: {
        errors: [{ field: 'email', message: Messages.INVALID_USER }],
      },
    }

    const exist = await this._userRepository.findUserByEmail(creds.email)
    if (!exist) return invalidUserResult

    if (!exist.emailVerifiedAt)
      return {
        success: false,
        message: Messages.EMAIL_UNVERIFIED,
        data: {
          errors: [{ field: 'email', message: Messages.EMAIL_UNVERIFIED }],
        },
      }

    const passwordsMatch = this._hashProvider.compare(exist.password, password)
    if (!passwordsMatch) return invalidUserResult

    if (!exist.isActive)
      return {
        success: false,
        message: Messages.USER_DEACTIVATED,
        data: {
          errors: [{ field: 'email', message: Messages.USER_DEACTIVATED }],
        },
      }

    return {
      success: true,
      message: Messages.LOGGED_IN,
    }
  }
}
