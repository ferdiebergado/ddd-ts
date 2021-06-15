import { IRepository } from '../../../shared/persistence/repository.interface'
import { UserEntity } from '../domain/entities/user.entity'

export interface IUserRepository<T = UserEntity> extends IRepository<T> {
  findUserByEmail(email: string): Promise<T | null> | T | null
}
