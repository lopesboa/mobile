import {createReducer} from '@reduxjs/toolkit';
import {ScheduledNotification} from '../../../../types';

import {NOTIFICATION_TYPE} from '../../../../const';
import {
  SCHEDULE_NOTIFICATION,
  UNSCHEDULE_NOTIFICATION,
  ScheduleActionPayload,
  SCHEDULE_NOTIFICATION_ACTION_NAME,
  UnscheduleActionPayload,
  UNSCHEDULE_NOTIFICATION_ACTION_NAME,
  Action,
} from '../actions';

export type State = ScheduledNotification;

export const initialState: State = {
  [NOTIFICATION_TYPE.FINISH_COURSE]: [],
  [NOTIFICATION_TYPE.SUGGESTION]: [],
};

const scheduleNotificationsReducer = createReducer(initialState, {
  [SCHEDULE_NOTIFICATION.type]: (
    state,
    action: Action<typeof SCHEDULE_NOTIFICATION_ACTION_NAME, ScheduleActionPayload>,
  ) => {
    const {type, id, courseID, createdAt} = action.payload;
    state[type] = [
      ...state[type],
      {
        id,
        courseID,
        createdAt,
      },
    ];
    return state;
  },

  [UNSCHEDULE_NOTIFICATION.type]: (
    state,
    action: Action<typeof UNSCHEDULE_NOTIFICATION_ACTION_NAME, UnscheduleActionPayload>,
  ) => {
    const {type} = action.payload;
    state[type] = [];
    return state;
  },
});

export default scheduleNotificationsReducer;
