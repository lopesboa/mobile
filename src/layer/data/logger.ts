import crashlytics from '@react-native-firebase/crashlytics';
import decode from 'jwt-decode';

import {get as getToken} from '../../utils/local-token';
import {get as getBrand} from '../../utils/local-brand';
import {log as logDatadogError} from '../../modules/datadog';
import type {LoggerProperties} from '../../types';

export const logError = async (error: Error) => {
  const _token = await getToken();
  const _brand = await getBrand();

  const {user: userId} = _token ? decode(_token) : {};
  const {env: platform, name: brand} = _brand || {};

  await logDatadogError(error, {platform, brand, userId});
  await crashlytics().recordError(error);
};

export const setProperties = (properties: LoggerProperties) => {
  Object.keys(properties).forEach((property) =>
    crashlytics().setAttribute(property, properties[property] || ''),
  );
};

export default {logError, setProperties};
