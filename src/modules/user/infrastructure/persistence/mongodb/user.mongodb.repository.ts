import { IUserRepository } from '../../../application/user.repository'
import { User, UserEntity } from '../../../domain/entities/user.entity'
import { MongodbRepository } from '../../../../../shared/persistence/mongodb/mongodb.repository'

export class UserMongodbRepository
  extends MongodbRepository<UserEntity>
  implements IUserRepository
{
  for = 'users'

  async findUserByEmail(email: string): Promise<User | null> {
    const collection = await this.getCollection()
    return await collection.findOne({ email })
  }
}
