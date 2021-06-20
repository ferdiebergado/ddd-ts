import faker from 'faker';
import { RegisterUserDto } from '../../application/user.register.service';

const password = faker.internet.password();

const user: RegisterUserDto = {
  lastName: faker.name.lastName(),
  firstName: faker.name.firstName(),
  email: faker.internet.email(),
  password,
  passwordConfirmation: password,
};

export default () => user;
