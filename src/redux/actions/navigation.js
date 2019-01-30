// @flow strict

/* eslint-disable import/prefer-default-export */

export const NAVIGATION_SCREEN_CHANGE = 'NAVIGATION_SCREEN_CHANGE';
export const NAVIGATION_SHOW = 'NAVIGATION_SHOW';
export const NAVIGATION_HIDE = 'NAVIGATION_HIDE';

type ChangeScreenNavigationPayload = {|
  currentNavigatorName: string,
  currentAppScreenName?: string,
  currentScreenName?: string,
  currentTabName?: string
|};

export type Action = {|
  type: 'NAVIGATION_SCREEN_CHANGE' | 'NAVIGATION_SHOW' | 'NAVIGATION_HIDE',
  payload?: ChangeScreenNavigationPayload
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

export const showNavigation = (): Action => ({
  type: NAVIGATION_SHOW
});

export const hideNavigation = (): Action => ({
  type: NAVIGATION_HIDE
});
