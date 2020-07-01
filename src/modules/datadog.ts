import {serializeError} from 'serialize-error';

import {datadogToken} from '../../app';
import fetch from './fetch';
import {getUserAgent} from './build';

const API_HOST = 'http-intake.logs.datadoghq.eu';
const ENDPOINT = `https://${API_HOST}/v1/input/${datadogToken}`;

export type LogData = {
  apptype: string;
  err: {
    name?: string;
    message?: string;
    stack?: string;
    code?: string;
  };
  level: string;
  ua: string;
  platform?: string;
  brand?: string;
  userId?: string;
};

export const getData = async (
  error: Error,
  context: {platform?: string; brand?: string; userId?: string},
): Promise<LogData> => ({
  ...context,
  apptype: 'mobile',
  level: 'error',
  err: serializeError(error),
  ua: await getUserAgent(),
});

export const log = async (
  error: Error,
  context: {platform?: string; brand?: string; userId?: string},
) => {
  const data: LogData = await getData(error, context);

  return fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};
