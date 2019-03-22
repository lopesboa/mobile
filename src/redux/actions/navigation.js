// @flow strict

export const NAVIGATION_SCREEN_CHANGE = 'NAVIGATION_SCREEN_CHANGE';
export const NAVIGATION_SHOW = 'NAVIGATION_SHOW';
export const NAVIGATION_HIDE = 'NAVIGATION_HIDE';

export type Action =
  | {|
      type: 'NAVIGATION_SCREEN_CHANGE',
      payload: {|
        currentNavigatorName: string,
        currentAppScreenName?: string,
        currentScreenName?: string,
        currentTabName?: string
      |}
    |}
  | {|type: 'NAVIGATION_SHOW'|}
  | {|type: 'NAVIGATION_HIDE'|};

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
