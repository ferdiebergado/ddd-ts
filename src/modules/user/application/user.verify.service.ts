import { Result } from '../../../shared/result.interface'
import { IService } from '../../../shared/service.interface'
import { IUserRepository } from './user.repository.interface'
import { Messages } from '../../../messages'
import { EntityIdField } from '../../../shared/entity'
import { IJwtProvider } from '../../../shared/security/jwt/jwt.provider.interface'

export type VerifyUserResult = Result<EntityIdField>

export class VerifyUserService implements IService<string, VerifyUserResult> {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _jwtProvider: IJwtProvider
  ) {}

  handle = async (token: string): Promise<VerifyUserResult> => {
    const { sub } = this._jwtProvider.verify(token)
    const exists = await this._userRepository.findById(sub)
    const invalidUserResult = {
      success: false,
      message: Messages.INVALID_USER,
    }
    const userVerifiedResult = {
      success: true,
      message: Messages.USER_VERIFIED,
    }

    if (!exists) return invalidUserResult

    if (!exists.emailVerifiedAt) {
      await this._userRepository.updateById(sub, {
        emailVerifiedAt: new Date().toISOString(),
      })
    }

    return userVerifiedResult
  }
}
