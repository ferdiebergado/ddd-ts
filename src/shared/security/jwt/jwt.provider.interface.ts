export interface IJwtPayload {
  sub: string | number | Record<string, unknown>
  iss?: string
  aud?: string
  jti?: string
  iat?: number
  exp?: number
  [key: string]: any
}

export interface IJwtProvider {
  sign(payload: IJwtPayload, options?: any): Promise<string> | string
  verify(token: string, options?: any): Promise<any> | any
}
