import UserMongodbRepository from './mongodb/user.mongodb.repository';
import MongodbConnection from '../../../../shared/persistence';

export default () => new UserMongodbRepository(MongodbConnection);
