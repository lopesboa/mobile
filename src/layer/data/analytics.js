// @flow strict

import firebase from 'react-native-firebase';

firebase.utils().errorOnMissingPlayServices = false;
firebase.utils().promptOnMissingPlayServices = false;

firebase.analytics().setAnalyticsCollectionEnabled(true);

type EventParams = {
  [key: string]: string | number
};

type UserProperties = {
  [key: string]: string
};

export const logEvent = (event: string, params?: EventParams): void =>
  firebase.analytics().logEvent(event, params);

export const setCurrentScreen = (screenName: string): void =>
  firebase.analytics().setCurrentScreen(screenName);

export const setUserProperties = (properties: UserProperties) =>
  firebase.analytics().setUserProperties(properties);

export const setUserProperty = (name: string, value: string) =>
  firebase.analytics().setUserProperty(name, value);

export default {logEvent, setCurrentScreen, setUserProperty, setUserProperties};
