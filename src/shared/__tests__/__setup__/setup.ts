import request, { Response } from 'supertest';
import mailhog from 'mailhog';
import Application from '../../../app';
import expressApplication from '../../web/http/express/express.application';
import routes from '../../../routes';

const app = new Application(expressApplication, routes);
export const testApp = request(app.getRequestListener());
export const mailer = mailhog({});

export const post = async (
  endpoint: string,
  type = 'application/json',
  data: any,
): Promise<Response> => testApp.post(endpoint).type(type).send(data);

export const assertResponseErrors = ({
  response,
  message,
  field,
  error,
}: {
  response: Response;
  message: string;
  field: string;
  error: string;
}): void => {
  const { statusCode, body } = response;
  expect(statusCode).toEqual(400);
  expect(body).toEqual({
    status: 'failed',
    message,
    data: {
      errors: [{ field, message: error }],
    },
  });
};
