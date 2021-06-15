import { IncomingMessage, ServerResponse } from 'http'
import config from '../../../../config'

const { cors } = config.web.http

export default (
  req: IncomingMessage,
  res: ServerResponse,
  cb: () => any
): void => {
  res.setHeader('Access-Control-Allow-Origin', cors.origin)
  if (req.method && req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', cors.methods)
    res.setHeader('Access-Control-Allow-Headers', cors.headers)
    res.statusCode = 204
    return res.end()
  }
  cb()
}
