import faker from 'faker';
import {
  loginUser,
  login,
  dropTestUserStorage,
  createUser,
} from '../__setup__/user.setup';
import user from '../__fixtures__/user.fixtures';
import { LoginUserDto } from '../../application/user.login.service';
import Messages from '../../../../messages';
import { IServerResponsePayload } from '../../../../shared/web/http';
import { ValidationErrorBag } from '../../../../shared/entity';
import userRepository from '../../infrastructure/persistence';
import { RegisterUserDto } from '../../application/user.register.service';

describe('User Login #api #hot', () => {
  let newUser: RegisterUserDto;
  let userId: string;

  beforeEach(async () => {
    newUser = user();
    userId = await createUser(newUser);
  });

  afterAll(async () => {
    await dropTestUserStorage();
  });

  describe(`POST ${login} #hot #login`, () => {
    it('should login the user when input is valid', async () => {
      await new Promise<void>((resolve) =>
        setTimeout(async () => {
          const creds: LoginUserDto = {
            email: newUser.email,
            password: newUser.password,
          };
          const { statusCode, body } = await loginUser(creds);
          expect(statusCode).toBe(200);
          expect(body).toEqual<IServerResponsePayload<void>>({
            status: 'ok',
            message: Messages.LOGGED_IN,
          });
          resolve();
        }, 300),
      );
    });

    it.each(['email', 'password'])(
      'should return an error when %s is empty',
      async (field) => {
        await new Promise<void>((resolve) =>
          setTimeout(async () => {
            let creds: LoginUserDto = {
              email: newUser.email,
              password: newUser.password,
            };
            creds = { ...creds, [field]: null };
            const { statusCode, body } = await loginUser(creds);
            expect(statusCode).toBe(400);

            expect(body).toEqual<IServerResponsePayload<ValidationErrorBag>>({
              status: 'failed',
              message: Messages.INVALID_INPUT,
              data: {
                errors: [{ field, message: `${field} is required` }],
              },
            });
            resolve();
          }, 100),
        );
      },
    );

    // eslint-disable-next-line jest/expect-expect
    it('should return an error when user email does not exist', async () => {
      await new Promise<void>((resolve) =>
        setTimeout(async () => {
          const creds: LoginUserDto = {
            email: faker.internet.email(),
            password: newUser.password,
          };
          const { statusCode, body } = await loginUser(creds);

          expect(statusCode).toBe(401);
          expect(body).toEqual<IServerResponsePayload<ValidationErrorBag>>({
            status: 'failed',
            message: Messages.INVALID_USER,
            data: {
              errors: [{ field: 'email', message: Messages.INVALID_USER }],
            },
          });
          resolve();
        }, 100),
      );
    });

    // eslint-disable-next-line jest/expect-expect
    it('should return an error when password is incorrect', async () => {
      await new Promise<void>((resolve) =>
        setTimeout(async () => {
          const creds: LoginUserDto = {
            email: newUser.email,
            password: faker.random.alphaNumeric(),
          };
          const { statusCode, body } = await loginUser(creds);

          expect(statusCode).toBe(401);
          expect(body).toEqual<IServerResponsePayload<ValidationErrorBag>>({
            status: 'failed',
            message: Messages.INVALID_USER,
            data: {
              errors: [{ field: 'email', message: Messages.INVALID_USER }],
            },
          });
          resolve();
        }, 100),
      );
    });

    it('should return an error when email is not yet verified', async () => {
      await userRepository().updateById(userId, { emailVerifiedAt: '' });

      await new Promise<void>((resolve) =>
        setTimeout(async () => {
          const creds: LoginUserDto = {
            email: newUser.email,
            password: newUser.password,
          };
          const { statusCode, body } = await loginUser(creds);
          expect(statusCode).toBe(401);
          expect(body).toEqual<IServerResponsePayload<ValidationErrorBag>>({
            status: 'failed',
            message: Messages.EMAIL_UNVERIFIED,
            data: {
              errors: [{ field: 'email', message: Messages.EMAIL_UNVERIFIED }],
            },
          });
          resolve();
        }, 100),
      );
    });

    it('should return an error when account is deactivated', async () => {
      await userRepository().updateById(userId, {
        isActive: false,
      });

      await new Promise<void>((resolve) =>
        setTimeout(async () => {
          const creds: LoginUserDto = {
            email: newUser.email,
            password: newUser.password,
          };
          const { statusCode, body } = await loginUser(creds);
          expect(statusCode).toBe(401);
          expect(body).toEqual<IServerResponsePayload<ValidationErrorBag>>({
            status: 'failed',
            message: Messages.USER_DEACTIVATED,
            data: {
              errors: [{ field: 'email', message: Messages.USER_DEACTIVATED }],
            },
          });
          resolve();
        }, 100),
      );
    });
  });
});
