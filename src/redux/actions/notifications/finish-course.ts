import {isFinishCourseNotificationActive} from '../../utils/state-extract';
import type {StoreAction} from '../../_types';

export const TOGGLE = '@@notifications/FINISH_COURSE_TOGGLE';

export type Action = {
  type: '@@notifications/FINISH_COURSE_TOGGLE';
  payload: boolean;
};

export const toggle = (value?: boolean): StoreAction<Action> => (
  dispatch: Dispatch,
  getState: GetState,
) => {
  const state = getState();

  return dispatch({
    type: TOGGLE,
    payload: value ?? !isFinishCourseNotificationActive(state),
  });
};
