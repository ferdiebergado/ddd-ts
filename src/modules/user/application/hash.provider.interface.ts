export interface IHashProvider {
  hash(plain: string, options?: any): Promise<string> | string
  compare(
    hash: string,
    plain: string,
    options?: any
  ): Promise<boolean> | boolean
}
