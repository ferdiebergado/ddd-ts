import { IUser, User } from '../domain/entities/user.entity'
import { Result } from '../../../shared/result.interface'
import { IService } from '../../../shared/service.interface'
import { IUserRepository } from './user.repository'
import { EntityId, ValidationError } from '../../../shared/entity'
import { Messages } from '../../../messages'
import { IHashProvider } from './hash.provider.interface'
import eventEmitter from '../../../shared/events/emitter'
import dispatchListeners from '../domain/events/user.registered.event'

dispatchListeners()

export interface RegisterUserDto extends IUser {
  passwordConfirmation: string
}

export type UserRegistrationResult = Result<EntityId | ValidationError[]>

export class RegisterUserService
  implements IService<RegisterUserDto, UserRegistrationResult>
{
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _hashProvider: IHashProvider
  ) {}

  async handle(data: RegisterUserDto): Promise<UserRegistrationResult> {
    const { lastName, firstName, email, password, passwordConfirmation } = data
    const user = new User()
    user.lastName = lastName
    user.firstName = firstName
    user.email = email
    user.password = password

    const validationErrors = user.validate()

    if (password) {
      if (passwordConfirmation) {
        if (passwordConfirmation !== password)
          validationErrors.push({
            field: 'password',
            message: Messages.PASSWORD_MISMATCH,
          })
      } else {
        validationErrors.push({
          field: 'passwordConfirmation',
          message: 'passwordConfirmation is required',
        })
      }
    }

    if (validationErrors.length > 0)
      return {
        success: false,
        message: Messages.INVALID_INPUT,
        data: { errors: validationErrors },
      }

    const exists = await this._userRepository.findUserByEmail(user.email)
    if (exists)
      return {
        success: false,
        message: Messages.EMAIL_TAKEN,
        data: {
          errors: [{ field: 'email', message: Messages.EMAIL_TAKEN }],
        },
      }

    user.password = await this._hashProvider.hash(user.password)

    const id = await this._userRepository.create(user)

    eventEmitter.emit('user:registered', user)

    return {
      success: true,
      message: Messages.REGISTRATION_SUCCESS,
      data: { _id: id },
    }
  }
}
