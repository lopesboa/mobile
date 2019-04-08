// @flow strict

import type {StoreAction} from '../_types';

export const NAVIGATION_SCREEN_CHANGE = '@@navigation/SCREEN_CHANGE';

export type Action = {|
  type: '@@navigation/SCREEN_CHANGE',
  payload: {|
    currentNavigatorName: string,
    currentAppScreenName: string,
    currentScreenName: string,
    currentTabName?: string
  |}
|};

export const changeScreen = (
  currentNavigatorName: string,
  currentAppScreenName: string,
  currentScreenName: string,
  currentTabName?: string
): StoreAction<Action> => (dispatch, getState, {services}) => {
  services.Analytics.setCurrentScreen(currentTabName || currentScreenName);

  return dispatch({
    type: NAVIGATION_SCREEN_CHANGE,
    payload: {
      currentNavigatorName,
      currentAppScreenName,
      currentScreenName,
      currentTabName
    }
  });
};
