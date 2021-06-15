import { testApp } from '../../../../shared/__tests__/__setup__/setup'
import { dropTestUserStorage, registerUser } from '../__setup__/user.setup'
import { user } from '../__fixtures__/user.fixtures'
import { IServerResponsePayload } from '../../../../shared/web/http'
import { Messages } from '../../../../messages'
import { UserProfile } from '../../application/user.profile.service'

describe('User Profile', () => {
  afterAll(async () => {
    return await dropTestUserStorage()
  })

  it('retrieves the user profile', async () => {
    const response = await registerUser(user)
    const id = response.body.data._id
    const uri = '/api/v1/users/' + id
    const { statusCode, body } = await testApp.get(uri)

    expect(statusCode).toBe(200)
    expect(body).toEqual<IServerResponsePayload<UserProfile>>({
      status: 'ok',
      message: Messages.USER_PROFILE_RETRIEVED,
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    })
  })
})
