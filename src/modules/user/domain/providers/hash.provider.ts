/* eslint-disable class-methods-use-this */
import crypto from 'crypto';
import { IHashProvider } from '../../application/hash.provider.interface';
import config from '../../../../config';

export default class CryptoHashProvider implements IHashProvider {
  protected createHash(salt: string, plain: string) {
    return crypto
      .createHmac(config.security.hash.algorithm, salt.normalize())
      .update(plain.normalize())
      .digest('base64');
  }

  hash(plain: string): string {
    const salt = crypto.randomBytes(16).toString('base64');
    const hash = this.createHash(salt, plain);
    return `${salt}$${hash}`;
  }

  compare(hashed: string, plain: string): boolean {
    const hashes = hashed.split('$');
    const salt = hashes[0];
    const hash = this.createHash(salt, plain);
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(hashes[1]));
  }
}
