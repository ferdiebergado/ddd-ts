import jwt from 'jsonwebtoken';
import { IJwtPayload, IJwtProvider } from '../jwt.provider.interface';
import config from '../../../../config';

const {
  key,
  jwt: { options },
} = config.security;

export default class JsonWebTokenJwtProvider implements IJwtProvider {
  // eslint-disable-next-line class-methods-use-this
  sign(payload: IJwtPayload, opts: any = {}): string {
    return jwt.sign(payload, key, { ...options, ...opts });
  }

  // eslint-disable-next-line class-methods-use-this
  verify(token: string, opts: any = {}): any {
    return jwt.verify(token, key, { ...options, ...opts });
  }
}
