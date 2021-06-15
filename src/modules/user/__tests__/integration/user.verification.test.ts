import { testApp, mailer } from '../../../../shared/__tests__/__setup__/setup'
import {
  userVerificationEndpoint,
  registerUser,
  dropTestUserStorage,
} from '../__setup__/user.setup'
import { user } from '../__fixtures__/user.fixtures'
import { parseLink, randomString } from '../../../../shared/utils/helpers'
import { jwtProvider } from '../../../../shared/security/index'
import { IServerResponsePayload } from '../../../../shared/web/http'
import { userRepository } from '../../../../modules/user/infrastructure/persistence'

describe('User Verification', () => {
  describe('GET ' + userVerificationEndpoint, () => {
    let userId: string

    // assert user was not verified in the database
    const assertUserWasNotVerified = async () => {
      const registered = await userRepository.findUserByEmail(user.email)
      expect(registered?.emailVerifiedAt).toBeFalsy()
    }

    beforeAll(async () => {
      const response = await registerUser(user)
      userId = response.body.data._id
    })

    afterAll(async () => {
      return await dropTestUserStorage()
    })

    afterEach(async () => {
      const result = await mailer.latestTo(user.email)
      return await mailer.deleteMessage(result.ID)
    })

    it('should verify the user', async () => {
      // await registerUser(user)
      return await new Promise<void>((resolve) => {
        setTimeout(async () => {
          const { html } = await mailer.latestTo(user.email)
          const matches = parseLink(html)

          // expect(matches).toHaveLength(2)

          if (matches) {
            const response = await testApp.get(matches[1])
            // eslint-disable-next-line jest/no-conditional-expect
            expect(response.statusCode).toEqual(200)

            // assert emailverifiedat is updated
            const registered = await userRepository.findUserByEmail(user.email)
            // eslint-disable-next-line jest/no-conditional-expect
            expect(registered?.emailVerifiedAt).toEqual(expect.any(String))
          }
        }, 1000)
        resolve()
      })
    })

    it('should return an error when link is expired', async () => {
      expect.assertions(3)

      const token = jwtProvider.sign({
        sub: userId,
        iat: Math.floor(Date.now() / 1000) - 3000000,
      })
      const link = `${userVerificationEndpoint}/${token}`

      return await new Promise<void>((resolve) => {
        setTimeout(async () => {
          const response = await testApp.get(link)
          expect(response.statusCode).toEqual(404)
          expect(response.body).toEqual<IServerResponsePayload<void>>({
            status: 'failed',
            message: 'jwt expired',
          })
          const registered = await userRepository.findUserByEmail(user.email)
          expect(registered?.emailVerifiedAt).toBeFalsy()
          resolve()
        }, 100)
      })
      // assertUserWasNotVerified()
    })

    it('should return an error when link is invalid', async () => {
      const token = randomString(150)
      const link = `${userVerificationEndpoint}/${token}`
      const response = await testApp.get(link)
      expect(response.statusCode).toEqual(404)
      expect(response.body).toEqual<IServerResponsePayload<void>>({
        status: 'failed',
        message: 'jwt malformed',
      })
      // const registered = await userRepository.findUserByEmail(user.email)
      // expect(registered?.emailVerifiedAt).toBeFalsy()
      return await assertUserWasNotVerified()
    })
  })
})
