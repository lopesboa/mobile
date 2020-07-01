import type {StoreAction} from '../_types';
import {ANALYTICS_EVENT_TYPE} from '../../const';

export const NAVIGATION_SCREEN_CHANGE = '@@navigation/SCREEN_CHANGE';

export type Action = {
  type: '@@navigation/SCREEN_CHANGE';
  payload: {
    currentNavigatorName: string;
    currentAppScreenName: string;
    currentScreenName: string;
    currentTabName?: string;
  };
};

export const changeScreen = (
  currentNavigatorName: string,
  currentAppScreenName: string,
  currentScreenName: string,
  currentTabName?: string,
): StoreAction<Action> => (dispatch, getState, {services}) => {
  services.Analytics.logEvent(ANALYTICS_EVENT_TYPE.NAVIGATE, {
    screenName: currentTabName || currentScreenName,
  });

  return dispatch({
    type: NAVIGATION_SCREEN_CHANGE,
    payload: {
      currentNavigatorName,
      currentAppScreenName,
      currentScreenName,
      currentTabName,
    },
  });
};
