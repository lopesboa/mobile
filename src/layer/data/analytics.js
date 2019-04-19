// @flow strict

import firebase from 'react-native-firebase';

import type {AnalyticsEventType, AnalyticsEventParams} from '../../types';
import {ANALYTICS_EVENT_TYPE} from '../../const';

firebase.utils().errorOnMissingPlayServices = false;
firebase.utils().promptOnMissingPlayServices = false;

firebase.analytics().setAnalyticsCollectionEnabled(true);

export const logEvent = (event: AnalyticsEventType, params?: AnalyticsEventParams = {}) => {
  if (event === ANALYTICS_EVENT_TYPE.NAVIGATE && params.screenName) {
    const {screenName} = params;
    if (typeof screenName === 'string') {
      return firebase.analytics().setCurrentScreen(screenName);
    }
  }

  if (event === ANALYTICS_EVENT_TYPE.SIGN_IN) {
    const {userId, brand} = params;
    firebase.analytics().setUserProperties({
      userId,
      brand
    });
  }

  if (event === ANALYTICS_EVENT_TYPE.SIGN_OUT) {
    // To clean the session (unset user properties)
    firebase.analytics().setUserProperties({
      userId: null,
      brand: null
    });
  }

  return firebase.analytics().logEvent(event, params);
};

export default {logEvent};
