import { User } from '../entities/user.entity'

export class UserFactory {
  static create(): User {
    return new User()
  }
}
