import { randomString } from '../../../../../../shared/utils/helpers';
import { IUser, User } from '../../../../domain/entities/user.entity';

const data: IUser = {
  lastName: 'sapsap',
  firstName: 'boy',
  email: 'boy@sapsap.com',
  password: 'amuy_singit',
};

describe('User Entity', () => {
  let user: any;

  beforeEach(() => {
    user = new User();
    user.lastName = data.lastName;
    user.firstName = data.firstName;
    user.email = data.email;
    user.password = data.password;
  });

  it('can be instantiated', () => {
    expect(user).toBeDefined();
    expect(user).toBeInstanceOf(User);
  });

  it('properties can be set', () => {
    const validationErrors = user.validate();
    expect(user.lastName).toBe(data.lastName);
    expect(user.firstName).toBe(data.firstName);
    expect(user.email).toBe(data.email);
    expect(user.password).toBe(data.password);
    expect(validationErrors).toHaveLength(0);
  });

  it.each(Object.keys(data))(
    'should contain an error when %s is empty',
    (key) => {
      user[key] = '';
      const validationErrors = user.validate();
      expect(validationErrors).toHaveLength(1);
      expect(validationErrors[0].field).toEqual(key);
      expect(validationErrors[0].message).toEqual(`${key} is required`);
    },
  );

  it.each(['lastName', 'firstName'])(
    'should contain an error when %s is not alphanumeric',
    (field) => {
      user[field] = '!?@#gshglhgl12.*%';
      const validationErrors = user.validate();
      expect(validationErrors).toHaveLength(1);
      expect(validationErrors[0]).toEqual({
        field,
        message: `${field} should be alphanumeric only`,
      });
    },
  );

  it.each(['lastName', 'firstName'])(
    'should contain an error when %s is too short',
    (field) => {
      const a = 'a';
      user[field] = a;
      const validationErrors = user.validate();
      expect(validationErrors).toHaveLength(1);
      expect(validationErrors[0]).toEqual({
        field,
        message: `${field} should be at least ${User.minNameLength} characters long`,
      });
    },
  );

  it('should contain an error when password is too short', () => {
    const field = 'password';
    const a = 'a';
    user.password = a;
    user.passwordConfirmation = a;
    const validationErrors = user.validate();
    expect(validationErrors).toHaveLength(1);
    expect(validationErrors[0]).toEqual({
      field,
      message: `${field} should be at least ${User.minPasswordLength} characters long`,
    });
  });

  it.each(['lastName', 'firstName', 'email', 'password'])(
    'should contain an error when %s is too long',
    (key) => {
      const long = randomString(200);
      user[key] = long;
      if (key === 'email') user.email = `${randomString(160)}@yagoo.com`;
      if (key === 'password') user.passwordConfirmation = long;
      const validationErrors = user.validate();
      expect(validationErrors).toHaveLength(1);
      expect(validationErrors[0]).toEqual({
        field: key,
        message: `${key} should be at most ${User.maxStringLength} characters long`,
      });
    },
  );

  it('updatedAt property can be updated', async () => {
    await new Promise<void>((resolve) =>
      setTimeout(() => {
        user.touch();
        expect(new Date(user.updatedAt).getTime()).toBeGreaterThan(
          new Date(user.createdAt).getTime(),
        );
        resolve();
      }, 1),
    );
  });
});
