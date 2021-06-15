import { Db, MongoClient } from 'mongodb'
import config from '../../../config'
import { IConnection } from '../connection.interface'

const { uri, dbName, options } = config.db.mongodb

export class MongodbConnection implements IConnection {
  connection: Readonly<MongoClient> = new MongoClient(uri, options)

  async connect(): Promise<MongoClient> {
    if (!this.connection.isConnected()) return await this.connection.connect()
    return this.connection
  }

  async testConnection(): Promise<any> {
    await this.connect()
    return await this.connection.db('admin').command({ ping: 1 })
  }

  async getDatabase(): Promise<Db> {
    await this.connect()
    return this.connection.db(dbName)
  }

  async dropDatabase(): Promise<any> {
    return await (await this.getDatabase()).dropDatabase()
  }

  async dropStorage(collection: string): Promise<any> {
    return await (await this.getDatabase()).collection(collection).drop()
  }

  async close(): Promise<void> {
    if (this.connection.isConnected()) return await this.connection.close()
  }
}
