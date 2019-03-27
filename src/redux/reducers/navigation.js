// @flow strict

import {NAVIGATION_SCREEN_CHANGE} from '../actions/navigation';
import type {Action} from '../actions/navigation';

export type State = {|
  currentNavigatorName: string,
  currentAppScreenName?: string,
  currentScreenName?: string,
  currentTabName?: string
|};

const initialState: State = {
  currentNavigatorName: 'App',
  currentAppScreenName: 'Splash',
  currentScreenName: 'Splash'
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
    default:
      return state;
  }
};

export default reducer;
