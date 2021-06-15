import { CryptoHashProvider } from '../../../../domain/providers/hash.provider'

describe('CryptoHashProvider', () => {
  const hasher = new CryptoHashProvider()

  it('should return a hash of a string', () => {
    const text = 'test'
    const hash = hasher.hash(text)

    expect(hash).not.toEqual(text)
    expect(hash).toEqual(expect.stringContaining('$'))
    expect(hash.split('$')).toHaveLength(2)
  })

  it.each(['test', 'nūnū_5a-pūn5ū'])(
    'should return true when a %s matches the hash',
    (text) => {
      const hash = hasher.hash(text)
      const isMatch = hasher.compare(hash, text)

      expect(isMatch).toEqual(true)
    }
  )

  it('should return false when a string does not match the hash', () => {
    const text = 'testū'
    const hash = hasher.hash(text)
    const isMatch = hasher.compare(hash, 'testu')

    expect(isMatch).toEqual(false)
  })
})
