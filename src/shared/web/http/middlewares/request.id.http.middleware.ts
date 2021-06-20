import { AsyncLocalStorage } from 'async_hooks';
import { IncomingMessage, ServerResponse } from 'http';
import crypto from 'crypto';

export const asyncLocalStorage = new AsyncLocalStorage<Map<string, string>>();

export default (
  req: IncomingMessage,
  _res: ServerResponse,
  cb: (...args: any[]) => any,
): void => {
  asyncLocalStorage.run(new Map<string, string>(), () => {
    const requestId = (req.headers.requestId as string) || crypto.randomUUID();
    asyncLocalStorage.getStore()?.set('requestId', requestId);
    cb();
  });
};
