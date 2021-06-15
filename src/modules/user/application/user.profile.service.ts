import { Messages } from '../../../messages'
import { EntityId } from '../../../shared/entity'
import { Result } from '../../../shared/result.interface'
import { IService } from '../../../shared/service.interface'
import { IUser } from '../domain/entities/user.entity'
import { IUserRepository } from './user.repository.interface'

export type UserProfile = Pick<IUser, 'firstName' | 'lastName' | 'email'>
export type UserProfileResult = Result<UserProfile>

export class UserProfileService
  implements IService<EntityId, UserProfileResult>
{
  constructor(private readonly _userRepository: IUserRepository) {}

  handle = async (id: EntityId): Promise<UserProfileResult> => {
    const exists = await this._userRepository.findById(id)

    if (!exists)
      return {
        success: false,
        message: Messages.INVALID_USER,
      }

    const profile: UserProfile = {
      firstName: exists.firstName,
      lastName: exists.lastName,
      email: exists.email,
    }

    return {
      success: true,
      message: Messages.USER_PROFILE_RETRIEVED,
      data: profile,
    }
  }
}
