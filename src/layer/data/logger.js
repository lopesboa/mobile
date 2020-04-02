// @flow strict

import firebase from 'react-native-firebase';
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
  await firebase.crashlytics().recordError(0, error.stack || error.message);
};

export const setProperties = (properties: LoggerProperties) => {
  const crashlytics = firebase.crashlytics();
  Object.keys(properties).forEach(property =>
    crashlytics.setStringValue(property, properties[property] || '')
  );
};

export default {logError, setProperties};
