import {
  Collection,
  DeleteWriteOpResultObject,
  InsertOneWriteOpResult,
  ObjectId,
  UpdateManyOptions,
  UpdateOneOptions,
  UpdateWriteOpResult,
} from 'mongodb'
import { IRepository } from '../repository.interface'
import { Entity, EntityId } from '../../entity'
import { IConnection } from '../connection.interface'

export class MongodbRepository<T extends Entity> implements IRepository<T> {
  for = ''

  constructor(protected readonly connection: IConnection) {}

  protected async getCollection(): Promise<Collection> {
    const db = await this.connection.getDatabase()
    return db.collection(this.for)
  }

  async create(attributes: Partial<T>): Promise<string> {
    const collection = await this.getCollection()
    const result: InsertOneWriteOpResult<Entity> = await collection.insertOne(
      attributes
    )
    return result.insertedId
  }

  async findById(id: EntityId, options: any = {}): Promise<T | null> {
    const collection = await this.getCollection()
    return (await collection.findOne<T>(
      { _id: new ObjectId(id) },
      options
    )) as T | null
  }

  async find(filter: Partial<T>, options: any = {}): Promise<T[] | []> {
    const collection = await this.getCollection()
    return (await collection.find<T>(filter, options).toArray()) as T[] | []
  }

  async updateById(
    id: EntityId,
    updates: Partial<T>,
    options: UpdateOneOptions = {}
  ): Promise<boolean> {
    const collection = await this.getCollection()
    const result: UpdateWriteOpResult = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates },
      options
    )
    return result.modifiedCount === 1
  }

  async update(
    filter: Partial<T>,
    updates: Partial<T>,
    options: UpdateManyOptions = {}
  ): Promise<number> {
    const collection = await this.getCollection()
    const result: UpdateWriteOpResult = await collection.updateMany(
      filter,
      {
        $set: updates,
      },
      options
    )
    return result.modifiedCount
  }

  async destroyById(id: EntityId): Promise<boolean> {
    const collection = await this.getCollection()
    const result: DeleteWriteOpResultObject = await collection.deleteOne({
      _id: new ObjectId(id),
    })
    return result.deletedCount === 1
  }

  async destroy(filter: Partial<T>): Promise<number> {
    const collection = await this.getCollection()
    const result: DeleteWriteOpResultObject = await collection.deleteMany(
      filter
    )
    const { deletedCount } = result
    return deletedCount ? deletedCount : 0
  }
}
