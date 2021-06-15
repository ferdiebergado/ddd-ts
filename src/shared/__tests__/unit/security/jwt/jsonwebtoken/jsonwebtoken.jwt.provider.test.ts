import { JsonWebTokenJwtProvider } from '../../../../../security/jwt/jsonwebtoken/jsonwebtoken.jwt.provider'

describe('JsonWebTokenJwtProvider #cold', () => {
  const jwt = new JsonWebTokenJwtProvider()
  const payload = {
    sub: '123',
  }

  it('should sign a payload', () => {
    expect(jwt.sign(payload)).toEqual(expect.any(String))
  })

  it('should return a decoded payload', () => {
    const token = jwt.sign(payload)
    const decoded = jwt.verify(token)
    expect(decoded).toEqual(expect.objectContaining(payload))
  })
})
