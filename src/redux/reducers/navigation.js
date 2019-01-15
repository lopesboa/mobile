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
  currentAppScreenName: 'Home'
};

const reducer = (state: State = initialState, {type, payload}: Action): State => {
  switch (type) {
    case NAVIGATION_SCREEN_CHANGE: {
      return {
        ...state,
        currentNavigatorName: payload.currentNavigatorName,
        currentAppScreenName: payload.currentAppScreenName,
        currentScreenName: payload.currentScreenName,
        currentTabName: payload.currentTabName
      };
    }
    default:
      return state;
  }
};

export default reducer;
