// @flow strict

/* eslint-disable import/prefer-default-export */

export const NAVIGATION_SCREEN_CHANGE = 'NAVIGATION_SCREEN_CHANGE';

type ChangeScreenNavigationPayload = {|
  currentNavigatorName: string,
  currentAppScreenName?: string,
  currentScreenName?: string,
  currentTabName?: string
|};

export type Action = {|
  type: 'NAVIGATION_SCREEN_CHANGE',
  payload: ChangeScreenNavigationPayload
|};

export const changeScreen = (
  currentNavigatorName: string,
  currentAppScreenName?: string,
  currentScreenName?: string,
  currentTabName?: string
): Action => {
  // @todo screen tracking
  return {
    type: NAVIGATION_SCREEN_CHANGE,
    payload: {
      currentNavigatorName,
      currentAppScreenName,
      currentScreenName,
      currentTabName
    }
  };
};
