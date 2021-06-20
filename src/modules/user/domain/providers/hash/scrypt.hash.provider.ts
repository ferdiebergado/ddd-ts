/* eslint-disable class-methods-use-this */
import crypto from 'crypto';
import HashProvider from './hash.provider';

export default class ScryptHashProvider extends HashProvider {
  async createHash(salt: string, plain: string): Promise<string> {
    return new Promise((resolve, reject) =>
      crypto.scrypt(
        plain.normalize(),
        salt.normalize(),
        128,
        (err, derivedKey) => {
          if (err) reject(err);
          resolve(derivedKey.toString('base64'));
        },
      ),
    );
  }
}
