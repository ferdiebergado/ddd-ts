import {JsonWebTokenJwtProvider} from '../../../../../security/jwt/jsonwebtoken/jsonwebtoken'

describe('JsonWebTokenJwtProvider', () => {
  let jwt: JsonWebTokenJwtProvider
  const payload = {
    sub: '123',
  }

  beforeEach(() => {
    jwt = new JsonWebTokenJwtProvider()
  })

  it('should sign a payload', () => {
    expect(jwt.sign(payload)).toBeDefined()
  })

  it('should return a decoded payload', () => {
    const token = jwt.sign(payload)
    const decoded = jwt.verify(token)
    expect(decoded).toEqual(expect.objectContaining(payload))
  })
})
