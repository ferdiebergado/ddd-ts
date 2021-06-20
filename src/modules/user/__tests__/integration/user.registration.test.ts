import {
  registerUser,
  register,
  dropTestUserStorage,
} from '../__setup__/user.setup';
import user from '../__fixtures__/user.fixtures';
import {
  mailer,
  assertResponseErrors,
} from '../../../../shared/__tests__/__setup__/setup';
import Messages from '../../../../messages';
import { User } from '../../domain/entities/user.entity';
import { RegisterUserDto } from '../../application/user.register.service';
import { randomString } from '../../../../shared/utils/helpers';
import { IServerResponsePayload } from '../../../../shared/web/http';
import { EntityIdField } from '../../../../shared/entity';

describe('User Registration #api #hot', () => {
  const newUser = user();

  afterAll(async () => {
    await dropTestUserStorage();
  });

  afterEach(async () => {
    // return new Promise<void>((resolve) =>
    //   setTimeout(async () => {
    const result = await mailer.latestTo(newUser.email);
    await mailer.deleteMessage(result.ID);
    //     resolve()
    //   }, 300)
    // )
  });

  describe(`POST ${register} #api`, () => {
    it('should return success and user id when input is valid', async () => {
      const { statusCode, body } = await registerUser(newUser);
      expect(statusCode).toEqual(201);
      expect(body).toEqual<IServerResponsePayload<EntityIdField>>({
        status: 'ok',
        message: Messages.REGISTRATION_SUCCESS,
        data: { _id: expect.any(String) },
      });
    });

    it.each(Object.keys(newUser))(
      'should return an error when %s is empty',
      async (key) => {
        const invalidUser = { ...newUser, [key]: null };
        const response = await registerUser(invalidUser);
        assertResponseErrors({
          response,
          message: Messages.INVALID_INPUT,
          field: key,
          error: `${key} is required`,
        });
      },
    );

    it.each(['lastName', 'firstName', 'password'])(
      'should return an error when %s is not alphanumeric',
      async (key) => {
        const nonAlpha = '<a href="javascript:void()"></a>';
        const invalidUser = { ...newUser, [key]: nonAlpha };
        if (key === 'password') invalidUser.passwordConfirmation = nonAlpha;
        const response = await registerUser(invalidUser);
        assertResponseErrors({
          response,
          message: Messages.INVALID_INPUT,
          field: key,
          error: `${key} should be alphanumeric only`,
        });
      },
    );

    it.each(['lastName', 'firstName'])(
      'should return an error when %s is too short',
      async (key) => {
        const invalidUser = { ...newUser, [key]: 'a' };
        const response = await registerUser(invalidUser);
        assertResponseErrors({
          response,
          message: Messages.INVALID_INPUT,
          field: key,
          error: `${key} should be at least ${User.minNameLength} characters long`,
        });
      },
    );

    // eslint-disable-next-line jest/expect-expect
    it('should return an error when email is too short', async () => {
      const field = 'email';
      const invalidUser = { ...newUser, [field]: 'a@b.c' };
      const response = await registerUser(invalidUser);
      assertResponseErrors({
        response,
        message: Messages.INVALID_INPUT,
        field,
        error: `${field} should be at least ${User.minEmailLength} characters long`,
      });
    });

    // eslint-disable-next-line jest/expect-expect
    it('should return an error when password is too short', async () => {
      const field = 'password';
      const short = 'short';
      const invalidUser: RegisterUserDto = {
        ...newUser,
        [field]: short,
        passwordConfirmation: short,
      };
      const response = await registerUser(invalidUser);
      assertResponseErrors({
        response,
        message: Messages.INVALID_INPUT,
        field,
        error: `${field} should be at least ${User.minPasswordLength} characters long`,
      });
    });

    it.each(['lastName', 'firstName'])(
      'should return an error when %s is too long',
      async (key) => {
        const invalidUser = { ...newUser, [key]: randomString(200) };
        const response = await registerUser(invalidUser);
        assertResponseErrors({
          response,
          message: Messages.INVALID_INPUT,
          field: key,
          error: `${key} should be at most ${User.maxStringLength} characters long`,
        });
      },
    );

    // eslint-disable-next-line jest/expect-expect
    it('should return an error when email is too long', async () => {
      const field = 'email';
      const long = `${randomString(200)}@yagoo.com`;
      const invalidUser: RegisterUserDto = {
        ...newUser,
        [field]: long,
      };
      const response = await registerUser(invalidUser);
      assertResponseErrors({
        response,
        message: Messages.INVALID_INPUT,
        field,
        error: `${field} should be at most ${User.maxStringLength} characters long`,
      });
    });

    // eslint-disable-next-line jest/expect-expect
    it('should return an error when password is too long', async () => {
      const field = 'password';
      const long = randomString(200);
      const invalidUser: RegisterUserDto = {
        ...newUser,
        [field]: long,
        passwordConfirmation: long,
      };
      const response = await registerUser(invalidUser);
      assertResponseErrors({
        response,
        message: Messages.INVALID_INPUT,
        field,
        error: `${field} should be at most ${User.maxStringLength} characters long`,
      });
    });

    // eslint-disable-next-line jest/expect-expect
    it('should return an error when email is a not valid email', async () => {
      const field = 'email';
      const invalidEmail = 'invalid';
      const invalidUser = { ...newUser, [field]: invalidEmail };
      const response = await registerUser(invalidUser);
      assertResponseErrors({
        response,
        message: Messages.INVALID_INPUT,
        field,
        error: Messages.EMAIL_INVALID,
      });
    });

    // eslint-disable-next-line jest/expect-expect
    it('should return an error when passwords do not match', async () => {
      const field = 'password';
      const passwordConfirmation = 'different';
      const invalidUser = { ...newUser, [field]: passwordConfirmation };
      const response = await registerUser(invalidUser);
      assertResponseErrors({
        response,
        message: Messages.INVALID_INPUT,
        field,
        error: Messages.PASSWORD_MISMATCH,
      });
    });

    // eslint-disable-next-line jest/expect-expect
    it('should return an error when email is already taken', async () => {
      await registerUser(newUser);
      const response = await registerUser(newUser);
      assertResponseErrors({
        response,
        message: Messages.EMAIL_TAKEN,
        field: 'email',
        error: Messages.EMAIL_TAKEN,
      });
    });

    it('sends a verification email when input is valid #email', async () => {
      expect.assertions(2);
      await registerUser(newUser);

      await new Promise<void>((resolve) =>
        setTimeout(async () => {
          const { subject, html } = await mailer.latestTo(newUser.email);
          expect(subject).toBe(Messages.USER_VERIFICATION);
          expect(html).toEqual(
            expect.stringContaining('Please verify your account'),
          );
          resolve();
        }, 300),
      );
    });
  });
});
