import { IncomingMessage, ServerResponse } from 'http'
import '../../../../../../shared/utils/env'
import config from '../../../../../../config'
import { cors } from '../../../../../../shared/web/http/middlewares'

describe('Cors Middleware', () => {
  let mockRequest: Partial<IncomingMessage>
  let mockResponse: Partial<ServerResponse>
  let mockNextFunction: () => any
  const corsConfig = config.web.http.cors
  const allowedMethods = corsConfig.methods.split(', ')

  beforeEach(() => {
    mockResponse = { setHeader: jest.fn(), end: jest.fn() }
    mockNextFunction = jest.fn()
  })

  it.each(allowedMethods)(
    'sets the Origin header on %s request',
    async (method) => {
      mockRequest = { method }

      cors(
        mockRequest as IncomingMessage,
        mockResponse as ServerResponse,
        mockNextFunction
      )

      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Access-Control-Allow-Origin',
        corsConfig.origin
      )

      expect(mockNextFunction).toHaveBeenCalledTimes(1)
    }
  )

  it('sets Methods and Headers on preflight request', async () => {
    mockRequest = { method: 'OPTIONS' }

    cors(
      mockRequest as IncomingMessage,
      mockResponse as ServerResponse,
      mockNextFunction
    )

    expect(mockResponse.setHeader).toHaveBeenCalledWith(
      'Access-Control-Allow-Methods',
      corsConfig.methods
    )

    expect(mockResponse.setHeader).toHaveBeenCalledWith(
      'Access-Control-Allow-Headers',
      corsConfig.headers
    )

    expect(mockResponse.statusCode).toBe(204)
    expect(mockResponse.end).toHaveBeenCalledTimes(1)
    expect(mockNextFunction).toHaveBeenCalledTimes(0)
  })
})
