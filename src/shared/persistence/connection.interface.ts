export interface IConnection {
  connection: Readonly<any>
  connect(): Promise<any> | any
  testConnection(): Promise<any> | any
  getDatabase(): Promise<any> | any
  dropDatabase(db: string): Promise<any> | any
  dropStorage(name: string): Promise<any> | any
  close(): Promise<any> | any
}
