import jwt from 'jsonwebtoken'
import { IJwtPayload, IJwtProvider } from '../jwt.provider.interface'
import config from '../../../../config'

const { key, options } = config.security.jwt

export class JsonWebTokenJwtProvider implements IJwtProvider {
  sign(payload: IJwtPayload, opts: any = {}): string {
    return jwt.sign(payload, key, { ...options, ...opts })
  }

  verify(token: string, opts: any = {}): any {
    return jwt.verify(token, key, { ...options, ...opts })
  }
}
