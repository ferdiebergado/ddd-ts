import {
  registerUser,
  register,
  dropTestUserStorage,
} from '../__setup__/user.setup'
import { user } from '../__fixtures__/user.fixtures'
import {
  mailer,
  assertResponseErrors,
} from '../../../../shared/__tests__/__setup__/setup'
import { Messages } from '../../../../messages'
import { User } from '../../domain/entities/user.entity'
import { RegisterUserDto } from '../../application/user.register.service'
import { randomString } from '../../../../shared/utils/helpers'

describe('User Registration', () => {
  afterAll(async () => {
    return await dropTestUserStorage()
  })

  afterEach(async () => {
    const result = await mailer.latestTo(user.email)
    return await mailer.deleteMessage(result.ID)
  })

  describe('POST ' + register, () => {
    it('should return success and user id', async () => {
      const { statusCode, body } = await registerUser(user)
      expect(statusCode).toEqual(201)
      expect(body).toEqual({
        status: 'ok',
        message: Messages.REGISTRATION_SUCCESS,
        data: { _id: expect.any(String) },
      })
    })

    it.each(Object.keys(user))(
      'should return an error when %s is empty',
      async (key) => {
        const invalidUser = { ...user, [key]: null }
        const response = await registerUser(invalidUser)
        assertResponseErrors({
          response,
          message: Messages.INVALID_INPUT,
          field: key,
          error: `${key} is required`,
        })
      }
    )

    it.each(['lastName', 'firstName', 'password'])(
      'should return an error when %s is not alphanumeric',
      async (key) => {
        const nonAlpha = '<a href="javascript:void()"></a>'
        const invalidUser = { ...user, [key]: nonAlpha }
        if (key === 'password') invalidUser.passwordConfirmation = nonAlpha
        const response = await registerUser(invalidUser)
        assertResponseErrors({
          response,
          message: Messages.INVALID_INPUT,
          field: key,
          error: `${key} should be alphanumeric only`,
        })
      }
    )

    it.each(['lastName', 'firstName'])(
      'should return an error when %s is too short',
      async (key) => {
        const invalidUser = { ...user, [key]: 'a' }
        const response = await registerUser(invalidUser)
        assertResponseErrors({
          response,
          message: Messages.INVALID_INPUT,
          field: key,
          error: `${key} should be at least ${User.minNameLength} characters long`,
        })
      }
    )

    // eslint-disable-next-line jest/expect-expect
    it('should return an error when email is too short', async () => {
      const field = 'email'
      const invalidUser = { ...user, [field]: 'a@b.c' }
      const response = await registerUser(invalidUser)
      assertResponseErrors({
        response,
        message: Messages.INVALID_INPUT,
        field: field,
        error: `${field} should be at least ${User.minEmailLength} characters long`,
      })
    })

    // eslint-disable-next-line jest/expect-expect
    it('should return an error when password is too short', async () => {
      const field = 'password'
      const short = 'short'
      const invalidUser: RegisterUserDto = {
        ...user,
        [field]: short,
        passwordConfirmation: short,
      }
      const response = await registerUser(invalidUser)
      assertResponseErrors({
        response,
        message: Messages.INVALID_INPUT,
        field: field,
        error: `${field} should be at least ${User.minPasswordLength} characters long`,
      })
    })

    it.each(['lastName', 'firstName'])(
      'should return an error when %s is too long',
      async (key) => {
        const invalidUser = { ...user, [key]: randomString(200) }
        const response = await registerUser(invalidUser)
        assertResponseErrors({
          response,
          message: Messages.INVALID_INPUT,
          field: key,
          error: `${key} should be at most ${User.maxStringLength} characters long`,
        })
      }
    )

    // eslint-disable-next-line jest/expect-expect
    it('should return an error when email is too long', async () => {
      const field = 'email'
      const long = randomString(200) + '@yagoo.com'
      const invalidUser: RegisterUserDto = {
        ...user,
        [field]: long,
      }
      const response = await registerUser(invalidUser)
      assertResponseErrors({
        response,
        message: Messages.INVALID_INPUT,
        field: field,
        error: `${field} should be at most ${User.maxStringLength} characters long`,
      })
    })

    // eslint-disable-next-line jest/expect-expect
    it('should return an error when password is too long', async () => {
      const field = 'password'
      const long = randomString(200)
      const invalidUser: RegisterUserDto = {
        ...user,
        [field]: long,
        passwordConfirmation: long,
      }
      const response = await registerUser(invalidUser)
      assertResponseErrors({
        response,
        message: Messages.INVALID_INPUT,
        field: field,
        error: `${field} should be at most ${User.maxStringLength} characters long`,
      })
    })

    // eslint-disable-next-line jest/expect-expect
    it('should return an error when email is a not valid email', async () => {
      const field = 'email'
      const invalidEmail = 'invalid'
      const invalidUser = { ...user, [field]: invalidEmail }
      const response = await registerUser(invalidUser)
      assertResponseErrors({
        response,
        message: Messages.INVALID_INPUT,
        field,
        error: Messages.EMAIL_INVALID,
      })
    })

    // eslint-disable-next-line jest/expect-expect
    it('should return an error when passwords do not match', async () => {
      const field = 'password'
      const passwordConfirmation = 'different'
      const invalidUser = { ...user, [field]: passwordConfirmation }
      const response = await registerUser(invalidUser)
      assertResponseErrors({
        response,
        message: Messages.INVALID_INPUT,
        field,
        error: Messages.PASSWORD_MISMATCH,
      })
    })

    // eslint-disable-next-line jest/expect-expect
    it('should return an error when email is already taken', async () => {
      await registerUser(user)
      const response = await registerUser(user)
      assertResponseErrors({
        response,
        message: Messages.EMAIL_TAKEN,
        field: 'email',
        error: Messages.EMAIL_TAKEN,
      })
    })

    it('sends a verification email', async () => {
      await registerUser(user)

      setTimeout(async () => {
        const { subject, html } = await mailer.latestTo(user.email)
        expect(subject).toBe(Messages.USER_VERIFICATION)
        expect(html).toEqual(
          expect.stringContaining('Please verify your account')
        )
      }, 500)
    })
  })
})
