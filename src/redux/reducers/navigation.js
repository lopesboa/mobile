// @flow strict

import {NAVIGATION_SCREEN_CHANGE} from '../actions/navigation';
import type {Action} from '../actions/navigation';
import {INITIAL_ROUTE_NAME} from '../../navigator/navigation-options';

export type State = {|
  currentNavigatorName: string,
  currentAppScreenName?: string,
  currentScreenName?: string,
  currentTabName?: string
|};

const initialState: State = {
  currentNavigatorName: 'App',
  currentAppScreenName: INITIAL_ROUTE_NAME,
  currentScreenName: INITIAL_ROUTE_NAME
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
