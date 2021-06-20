import '../../../../../utils/env';
import config from '../../../../../../config';
import { cors } from '../../../../../web/http/middlewares';
import { IRequest, IServerResponse } from '../../../../../web/http';

describe('CORS Middleware #cold', () => {
  let mockRequest: Partial<IRequest>;
  let mockResponse: Partial<IServerResponse>;
  let mockNextFunction: () => any;
  let responseHeaders: any;

  const corsConfig = config.web.http.cors;
  const allowedMethods = corsConfig.methods.split(', ');

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      setHeader: jest.fn().mockImplementation((name, value) => {
        responseHeaders = { ...responseHeaders, [name]: value };
      }),
      end: jest.fn(),
    };
    responseHeaders = {};
    mockNextFunction = jest.fn();
  });

  it.each(allowedMethods)(
    'sets the Origin header on %s request',
    async (method) => {
      const expectedCorsOriginResponseHeader = {
        'Access-Control-Allow-Origin': corsConfig.origin,
      };

      mockRequest = { method };

      cors(
        mockRequest as IRequest,
        mockResponse as IServerResponse,
        mockNextFunction,
      );

      expect(responseHeaders).toEqual(
        expect.objectContaining(expectedCorsOriginResponseHeader),
      );
    },
  );

  it('sets Methods and Headers on preflight request', async () => {
    const expectedCorsResponseHeaders = {
      'Access-Control-Allow-Methods': corsConfig.methods,
      'Access-Control-Allow-Headers': corsConfig.headers,
    };

    mockRequest = { method: 'OPTIONS' };

    cors(
      mockRequest as IRequest,
      mockResponse as IServerResponse,
      mockNextFunction,
    );

    expect(mockResponse.statusCode).toBe(204);

    expect(responseHeaders).toEqual(
      expect.objectContaining(expectedCorsResponseHeaders),
    );
  });
});
