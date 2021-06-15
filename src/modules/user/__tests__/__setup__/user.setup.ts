import { Response } from 'supertest'
import {
  testApp,
  post,
  mailer,
} from '../../../../shared/__tests__/__setup__/setup'
import config from '../../../../config'
import { LoginUserDto } from '../../application/user.login.service'
import { RegisterUserDto } from '../../application/user.register.service'
import { user } from '../__fixtures__/user.fixtures'
import { parseLink } from '../../../../shared/utils/helpers'
import { dbConnection } from '../../../../shared/persistence'

const { baseUrl } = config.web.http
export const basePath = `${baseUrl}/v1/auth`
export const storage = 'users'

export const register = basePath + '/register'
export const login = basePath + '/login'
export const userVerificationEndpoint = basePath + '/verify'

export const registerUser = async (data: RegisterUserDto): Promise<Response> =>
  await post(register, undefined, data)

export const loginUser = async (data: LoginUserDto): Promise<Response> =>
  await post(login, undefined, data)

export const verifyUser = async (token: string): Promise<Response> =>
  await testApp.get(`${userVerificationEndpoint}/${token}`)

export const registerAndVerifyUser = async (): Promise<void> => {
  await registerUser(user)
  setTimeout(async () => {
    const { html } = await mailer.latestTo(user.email)
    const matches = parseLink(html)
    if (matches) return await testApp.get(matches[1])
  }, 200)
}

export const dropTestUserStorage = async (): Promise<any> => {
  return await dbConnection.dropStorage(storage)
}
