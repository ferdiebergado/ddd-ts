import { ServerResponse } from 'http';
import { ValidationErrorBag } from '../entity';
import { IServerResponsePayload } from '../web/http';
import AppError from './app.error';

export default class ErrorHandler {
  constructor(private readonly error: AppError) {
    this.report();
  }

  private report() {
    console.error('[ERROR]', this.error);
  }

  toHttpResponse(res: ServerResponse): void {
    const response: IServerResponsePayload<void | ValidationErrorBag> = {
      status: 'failed',
      message: this.error.description,
    };

    if (this.error.errors) {
      response.data = { errors: this.error.errors };
    }

    res.statusCode = this.error.httpCode || 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response));
  }
}
