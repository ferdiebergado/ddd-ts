export interface IService<T, R> {
  handle(data?: T): Promise<R> | R
}
