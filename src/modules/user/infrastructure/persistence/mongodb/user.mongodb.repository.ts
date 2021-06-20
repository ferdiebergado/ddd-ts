import { IUserRepository } from '../../../application/user.repository.interface';
import { UserEntity } from '../../../domain/entities/user.entity';
import MongodbRepository from '../../../../../shared/persistence/mongodb/mongodb.repository';

export default class UserMongodbRepository
  extends MongodbRepository<UserEntity>
  implements IUserRepository
{
  for = 'users';

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    const collection = await this.getCollection();
    return collection.findOne({ email });
  }
}
