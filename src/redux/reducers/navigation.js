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
  currentAppScreenName: 'Splash',
  currentScreenName: 'Splash',
  isHidden: false
};

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case NAVIGATION_SCREEN_CHANGE: {
      return {
        ...state,
        currentNavigatorName: action.payload.currentNavigatorName,
        currentAppScreenName: action.payload.currentAppScreenName,
        currentScreenName: action.payload.currentScreenName,
        currentTabName: action.payload.currentTabName
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
