import {createReducer, createAction} from '@reduxjs/toolkit';

export type State = {
  isFullScreen: boolean;
};
export type ActionPayload = boolean;

export const ACTION_NAME = '@@video/TOGGLE_FULLSCREEN';
export const TOGGLE_FULLSCREEN = createAction<ActionPayload, typeof ACTION_NAME>(ACTION_NAME);

export type Action = {
  type: typeof ACTION_NAME;
  payload: ActionPayload;
};

const initialState: State = {
  isFullScreen: false,
};

const videoReducer = createReducer(initialState, {
  [TOGGLE_FULLSCREEN.type]: (state, action) => {
    state.isFullScreen = action.payload;
  },
});

export const toggleFullscreen = (payload: boolean) => TOGGLE_FULLSCREEN(payload);

export default videoReducer;
