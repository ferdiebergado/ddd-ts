import { MongodbConnection } from './mongodb/mongodb.connection'
import { MongodbRepository } from './mongodb/mongodb.repository'

export const dbConnection = new MongodbConnection()
export const database = new MongodbRepository(dbConnection)
