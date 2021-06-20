/* eslint-disable class-methods-use-this */
import crypto from 'crypto';
import config from '../../../../../config';
import HashProvider from './hash.provider';

export default class CryptoHashProvider extends HashProvider {
  createHash(salt: string, plain: string) {
    return crypto
      .createHmac(config.security.hash.algorithm, salt.normalize())
      .update(plain.normalize())
      .digest('base64');
  }
}
