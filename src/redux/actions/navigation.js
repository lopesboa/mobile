// @flow strict

export const NAVIGATION_SCREEN_CHANGE = '@@navigation/SCREEN_CHANGE';

export type Action = {|
  type: '@@navigation/SCREEN_CHANGE',
  payload: {|
    currentNavigatorName: string,
    currentAppScreenName?: string,
    currentScreenName?: string,
    currentTabName?: string
  |}
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
