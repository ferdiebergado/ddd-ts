import { IHashProvider } from '../../../../application/hash.provider.interface';
import hashProvider from '../../../../domain/providers/hash';

describe('HashProvider', () => {
  let hasher: IHashProvider;

  beforeEach(() => {
    hasher = hashProvider();
  });

  it('should return a hash of a string', async () => {
    const text = 'test';
    const hash = await hasher.hash(text);

    expect(hash).not.toEqual(text);
    expect(hash).toEqual(expect.stringContaining('$'));
    expect(hash.split('$')).toHaveLength(2);
  });

  it.each(['test', 'nūnū_5a-pūn5ū'])(
    'should return true when a %s matches the hash',
    async (text) => {
      const hash = await hasher.hash(text);
      const isMatch = await hasher.compare(hash, text);

      expect(isMatch).toEqual(true);
    },
  );

  it('should return false when a string does not match the hash', async () => {
    const text = 'testū';
    const hash = await hasher.hash(text);
    const isMatch = await hasher.compare(hash, 'testu');

    expect(isMatch).toEqual(false);
  });
});
