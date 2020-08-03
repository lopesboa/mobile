import {
  SCHEDULE_NOTIFICATION,
  UNSCHEDULE_NOTIFICATION,
} from '../../actions/notifications/scheduled-notifications';
import type {Action} from '../../actions/notifications/scheduled-notifications';
import {ScheduledNotification} from '../../../types';
import {NOTIFICATION_TYPE} from '../../../const';

export type State = ScheduledNotification;

const initialState: State = {
  [NOTIFICATION_TYPE.FINISH_COURSE]: [],
};

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case SCHEDULE_NOTIFICATION: {
      const {type, id, courseID, createdAt} = action.payload;
      return {
        ...state,
        [type]: [
          ...state[type],
          {
            id,
            courseID,
            createdAt,
          },
        ],
      };
    }
    case UNSCHEDULE_NOTIFICATION: {
      const {type} = action.payload;
      return {
        ...state,
        [type]: [],
      };
    }
    default:
      return state;
  }
};

export default reducer;
