import { EntityId } from '../entity'

export interface IRepository<T> {
  for: string

  create(attributes: Partial<T>): Promise<string> | string

  findById(id: EntityId, options?: any): Promise<T | null> | T | null

  find(filter: Partial<T>, options?: any): Promise<T[] | []> | T[] | []

  updateById(
    id: EntityId,
    updates: Partial<T>,
    options?: any
  ): Promise<boolean> | boolean

  update(
    filter: Partial<T>,
    updates: Partial<T>,
    options?: any
  ): Promise<number> | number

  destroyById(id: EntityId): Promise<boolean> | boolean

  destroy(filter: Partial<T>): Promise<number> | number
}
