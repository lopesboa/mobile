import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {pipe, map, join, omitBy, isUndefined} from 'lodash/fp';

import version from './version';
import {
  __DEV__,
  __E2E__,
  __STORYBOOK__,
  __TEST__,
  __ADHOC__,
  __DISTRIBUTION__,
} from './environment';

export type BuildEnvironment = 'development' | 'test' | 'production';
export type BuildType = 'adhoc' | 'distribution';
export type BuildFlavor = 'e2e' | 'storybook';
export type Build = {
  environment: BuildEnvironment;
  type?: BuildType;
  flavor?: BuildFlavor;
};

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

export const getBuildExtension = (): string =>
  pipe(
    omitBy(isUndefined),
    map((value, ...args) => `${args[0]} ${value}`),
    join('; '),
  )({
    BuildEnvironment: getBuildEnvironment(),
    BuildType: getBuildType(),
    BuildFlavor: getBuildFlavor(),
  });

export const getUserAgent = async (): Promise<string> => {
  const deviceBrand = await DeviceInfo.getBrand();
  const deviceModel = await DeviceInfo.getModel();
  const deviceVersion = await DeviceInfo.getSystemVersion();
  const appVersion = `${version.tag}`.slice(1);
  const baseUserAgent = `Coorpacademy Mobile/${appVersion} CFNetwork/897.15`;
  const buildExtension = getBuildExtension();

  if (Platform.OS === 'android') {
    return `${baseUserAgent} Dalvik/2.1.0 (Linux; ${deviceBrand} ${deviceModel}; Android ${deviceVersion}; ${buildExtension})`;
  }

  return `${baseUserAgent} Darwin/17.5.0 (${deviceModel} iOS/${deviceVersion}; ${buildExtension})`;
};
