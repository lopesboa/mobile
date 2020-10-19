import {createReducer, createAction} from '@reduxjs/toolkit';
import type {StoreAction} from '../_types';
import {ANALYTICS_EVENT_TYPE} from '../../const';
import {INITIAL_APP_ROUTE_NAME, INITIAL_ROUTE_NAME} from '../../navigator/navigation-options';

export type State = {
  currentNavigatorName: string;
  currentAppScreenName?: string;
  currentScreenName?: string;
  currentTabName?: string;
};

export type ActionPayload = {
  currentNavigatorName: string;
  currentAppScreenName: string;
  currentScreenName: string;
  currentTabName?: string;
};

export const ACTION_NAME = '@@navigation/SCREEN_CHANGE';
export const NAVIGATION_SCREEN_CHANGE = createAction<ActionPayload, typeof ACTION_NAME>(
  ACTION_NAME,
);

export type Action = {
  type: typeof ACTION_NAME;
  payload: ActionPayload;
};

const initialState: State = {
  currentNavigatorName: INITIAL_APP_ROUTE_NAME,
  currentAppScreenName: INITIAL_ROUTE_NAME,
  currentScreenName: INITIAL_ROUTE_NAME,
};

const navigationReducer = createReducer(initialState, {
  [NAVIGATION_SCREEN_CHANGE.type]: (state, action) => {
    state.currentNavigatorName = action.payload.currentNavigatorName;
    state.currentAppScreenName = action.payload.currentAppScreenName;
    state.currentScreenName = action.payload.currentScreenName;
    state.currentTabName = action.payload.currentTabName;
  },
});

export const changeScreen = (
  currentNavigatorName: string,
  currentAppScreenName: string,
  currentScreenName: string,
  currentTabName?: string,
): StoreAction<Action> => (dispatch, getState, {services}) => {
  services.Analytics.logEvent(ANALYTICS_EVENT_TYPE.NAVIGATE, {
    screenName: currentTabName || currentScreenName,
  });

  return dispatch({
    type: ACTION_NAME,
    payload: {
      currentNavigatorName,
      currentAppScreenName,
      currentScreenName,
      currentTabName,
    },
  });
};

export default navigationReducer;
