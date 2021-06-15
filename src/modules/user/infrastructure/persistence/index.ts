import { dbConnection } from '../../../../shared/persistence'
import { UserMongodbRepository } from './mongodb/user.mongodb.repository'

export const userRepository = new UserMongodbRepository(dbConnection)
