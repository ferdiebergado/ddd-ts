import { IRequest, IServerResponse } from '..';
import {
  getDurationInMilliseconds,
  microToMilliSeconds,
} from '../../../utils/helpers';

export default (req: IRequest, res: IServerResponse): void => {
  const start = process.hrtime();
  const idleMem = process.resourceUsage().maxRSS;

  res.on('finish', () => {
    const { method, url, socket, headers } = req;
    const { statusCode } = res;
    const timing = getDurationInMilliseconds(start);
    const length = res.getHeader('Content-Length') || 0;
    // ;('')
    const { userCPUTime, systemCPUTime, maxRSS } = process.resourceUsage();
    const memDiff = maxRSS - idleMem;

    const requestLog = `[INFO] ${new Date().toISOString()} ${method} ${url} ${statusCode} ${
      socket.remoteAddress
    } - ${length} bytes ${timing.toLocaleString()}ms`;

    const systemLog = `CPU: {user: ${microToMilliSeconds(
      userCPUTime,
    )} ms, sys: ${microToMilliSeconds(
      systemCPUTime,
    )} ms} MEM: {idle: ${idleMem} kb, after: ${maxRSS} kb, used: ${memDiff} kb}`;

    const requestHeadersLog = `REQUEST HEADERS: ${JSON.stringify(headers)}`;
    // const requestBodyLog = `REQUEST BODY: ${JSON.stringify(body)}`
    // const responseHeadersLog = `RESPONSE HEADERS: ${JSON.stringify(
    //   res.getHeaders()
    // )}`

    console.log(requestLog);
    console.log(requestHeadersLog);
    // console.log(requestBodyLog)
    // console.log(responseHeadersLog)
    console.log(systemLog);
  });
};
