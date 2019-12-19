// @flow strict

import firebase from 'react-native-firebase';

import type {LoggerProperties} from '../../types';

export const logError = (error: Error) => {
  firebase.crashlytics().recordError(0, error.stack);
};

export const setProperties = (properties: LoggerProperties) => {
  const crashlytics = firebase.crashlytics();
  Object.keys(properties).forEach(property =>
    crashlytics.setStringValue(property, properties[property] || '')
  );
};

export default {logError, setProperties};
