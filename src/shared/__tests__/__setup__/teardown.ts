import DbConnection from '../../persistence';

export default async (): Promise<void> => {
  await DbConnection.close();
};
