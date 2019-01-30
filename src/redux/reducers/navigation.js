// @flow strict

import {NAVIGATION_SCREEN_CHANGE, NAVIGATION_SHOW, NAVIGATION_HIDE} from '../actions/navigation';
import type {Action} from '../actions/navigation';

export type State = {|
  currentNavigatorName: string,
  currentAppScreenName?: string,
  currentScreenName?: string,
  currentTabName?: string,
  isHidden: boolean
|};

const initialState: State = {
  currentNavigatorName: 'App',
  currentAppScreenName: 'Home',
  isHidden: false
};

const reducer = (state: State = initialState, {type, payload}: Action): State => {
  switch (type) {
    case NAVIGATION_SCREEN_CHANGE: {
      if (!payload) {
        return state;
      }
      return {
        ...state,
        currentNavigatorName: payload.currentNavigatorName,
        currentAppScreenName: payload.currentAppScreenName,
        currentScreenName: payload.currentScreenName,
        currentTabName: payload.currentTabName
      };
    }
    case NAVIGATION_SHOW: {
      return {
        ...state,
        isHidden: false
      };
    }
    case NAVIGATION_HIDE: {
      return {
        ...state,
        isHidden: true
      };
    }
    default:
      return state;
  }
};

export default reducer;
