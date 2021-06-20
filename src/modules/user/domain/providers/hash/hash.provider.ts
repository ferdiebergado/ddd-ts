import crypto from 'crypto';
import { IHashProvider } from '../../../application/hash.provider.interface';

export default abstract class HashProvider implements IHashProvider {
  abstract createHash(plain: string, salt: string): Promise<string> | string;

  async hash(plain: string): Promise<string> {
    const salt = crypto.randomBytes(32).toString('base64');
    const hash = await this.createHash(salt, plain);
    return `${salt}$${hash}`;
  }

  async compare(hashed: string, plain: string): Promise<boolean> {
    const hashes = hashed.split('$');
    const salt = hashes[0];
    const hash = await this.createHash(salt, plain);
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(hashes[1]));
  }
}
