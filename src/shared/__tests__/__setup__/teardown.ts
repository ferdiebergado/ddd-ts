import { dbConnection } from '../../persistence'

export default async (): Promise<void> => {
  return await dbConnection.close()
}
