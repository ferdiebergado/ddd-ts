import {
  loginUser,
  login,
  registerAndVerifyUser,
  dropTestUserStorage,
} from '../__setup__/user.setup'
import { user } from '../__fixtures__/user.fixtures'
import { LoginUserDto } from '../../application/user.login.service'
import { Messages } from '../../../../messages'
import { IServerResponsePayload } from '../../../../shared/web/http'
import { ValidationErrorBag } from '../../../../shared/entity'
import { userRepository } from '../../../../modules/user/infrastructure/persistence'

describe('User Login', () => {
  beforeAll(async () => {
    return await registerAndVerifyUser()
  })

  afterAll(async () => {
    return await dropTestUserStorage()
  })

  describe('POST ' + login, () => {
    it('should login the user', async () => {
      const creds: LoginUserDto = {
        email: user.email,
        password: user.password,
      }

      setTimeout(async () => {
        const { statusCode, body } = await loginUser(creds)
        expect(statusCode).toBe(200)
        expect(body).toEqual<IServerResponsePayload<void>>({
          status: 'ok',
          message: Messages.LOGGED_IN,
        })
      }, 100)
    })

    it.each(['email', 'password'])(
      'should return an error when %s is empty',
      async (field) => {
        let creds: LoginUserDto = {
          email: user.email,
          password: user.password,
        }
        creds = { ...creds, [field]: null }

        setTimeout(async () => {
          const { statusCode, body } = await loginUser(creds)
          expect(statusCode).toBe(400)

          expect(body).toEqual<IServerResponsePayload<ValidationErrorBag>>({
            status: 'failed',
            message: Messages.INVALID_INPUT,
            data: {
              errors: [{ field, message: `${field} is required` }],
            },
          })
        }, 100)
      }
    )

    // eslint-disable-next-line jest/expect-expect
    it('should return an error when user email does not exist', async () => {
      const creds: LoginUserDto = {
        email: 'abc@example.com',
        password: user.password,
      }

      setTimeout(async () => {
        const { statusCode, body } = await loginUser(creds)

        expect(statusCode).toBe(401)
        expect(body).toEqual<IServerResponsePayload<ValidationErrorBag>>({
          status: 'failed',
          message: Messages.INVALID_USER,
          data: {
            errors: [{ field: 'email', message: Messages.INVALID_USER }],
          },
        })
      }, 100)
    })

    // eslint-disable-next-line jest/expect-expect
    it('should return an error when password is incorrect', async () => {
      const creds: LoginUserDto = {
        email: user.email,
        password: 'incorrect_password',
      }

      setTimeout(async () => {
        const { statusCode, body } = await loginUser(creds)

        expect(statusCode).toBe(401)
        expect(body).toEqual<IServerResponsePayload<ValidationErrorBag>>({
          status: 'failed',
          message: Messages.INVALID_USER,
          data: {
            errors: [{ field: 'email', message: Messages.INVALID_USER }],
          },
        })
      }, 100)
    })

    it('should return an error when email is not yet verified', async () => {
      await userRepository.update(
        { email: user.email },
        {
          emailVerifiedAt: '',
        }
      )

      const creds: LoginUserDto = {
        email: user.email,
        password: user.password,
      }

      setTimeout(async () => {
        const { statusCode, body } = await loginUser(creds)
        expect(statusCode).toBe(401)
        expect(body).toEqual<IServerResponsePayload<ValidationErrorBag>>({
          status: 'failed',
          message: Messages.EMAIL_UNVERIFIED,
          data: {
            errors: [{ field: 'email', message: Messages.EMAIL_UNVERIFIED }],
          },
        })
      }, 100)
    })

    it('should return an error when account is deactivated', async () => {
      await userRepository.update(
        { email: user.email },
        {
          isActive: false,
          emailVerifiedAt: new Date().toISOString(),
        }
      )

      const creds: LoginUserDto = {
        email: user.email,
        password: user.password,
      }

      setTimeout(async () => {
        const { statusCode, body } = await loginUser(creds)
        expect(statusCode).toBe(401)
        expect(body).toEqual<IServerResponsePayload<ValidationErrorBag>>({
          status: 'failed',
          message: Messages.USER_DEACTIVATED,
          data: {
            errors: [{ field: 'email', message: Messages.USER_DEACTIVATED }],
          },
        })
      }, 500)
    })
  })
})