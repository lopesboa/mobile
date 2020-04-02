// @flow

import {serializeError} from 'serialize-error';

import {datadogToken} from '../../app';
import fetch from './fetch';
import {
  __DEV__,
  __E2E__,
  __STORYBOOK__,
  __TEST__,
  __ADHOC__,
  __DISTRIBUTION__
} from './environment';

const API_HOST = 'http-intake.logs.datadoghq.eu';
const ENDPOINT = `https://${API_HOST}/v1/input/${datadogToken}`;

export type BuildEnvironment = 'development' | 'test' | 'production';
export type BuildType = 'adhoc' | 'distribution';
export type BuildFlavor = 'e2e' | 'storybook';

export type LogData = {|
  apptype: string,
  err: {
    name?: string,
    message?: string,
    stack?: string,
    code?: string
  },
  level: string,
  build: {
    environment: BuildEnvironment,
    type?: BuildType,
    flavor?: BuildFlavor
  },
  platform?: string,
  brand?: string,
  userId?: string
|};

export const getBuildEnvironment = (): BuildEnvironment => {
  if (__TEST__) {
    return 'test';
  }

  if (__DEV__) {
    return 'development';
  }

  return 'production';
};

export const getBuildType = (): BuildType | void => {
  if (__ADHOC__) {
    return 'adhoc';
  }

  if (__DISTRIBUTION__) {
    return 'distribution';
  }
};

export const getBuildFlavor = (): BuildFlavor | void => {
  if (__STORYBOOK__) {
    return 'storybook';
  }

  if (__E2E__) {
    return 'e2e';
  }
};

export const getData = (
  error: Error,
  context: {platform?: string, brand?: string, userId?: string}
): LogData => ({
  ...context,
  apptype: 'mobile',
  level: 'error',
  err: serializeError(error),
  build: {
    type: getBuildType(),
    flavor: getBuildFlavor(),
    environment: getBuildEnvironment()
  }
});

export const log = (
  error: Error,
  context: {platform?: string, brand?: string, userId?: string}
) => {
  const data: LogData = getData(error, context);

  return fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
};
