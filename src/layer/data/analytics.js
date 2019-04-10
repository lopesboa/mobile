// @flow strict

import firebase from 'react-native-firebase';

import type {AnalyticsEventType, AnalyticsEventParams, AnalyticsUserProperty} from '../../types';

firebase.utils().errorOnMissingPlayServices = false;
firebase.utils().promptOnMissingPlayServices = false;

firebase.analytics().setAnalyticsCollectionEnabled(true);

export const logEvent = (event: AnalyticsEventType, params?: AnalyticsEventParams): void =>
  firebase.analytics().logEvent(event, params);

export const setCurrentScreen = (screenName: string): void =>
  firebase.analytics().setCurrentScreen(screenName);

export const setUserProperty = (name: AnalyticsUserProperty, value: string | null) =>
  firebase.analytics().setUserProperty(name, value);

export default {logEvent, setCurrentScreen, setUserProperty};
