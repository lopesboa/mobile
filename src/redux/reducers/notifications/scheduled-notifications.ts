// import {NotificationType} from '../../../types';
import {
  SCHEDULE_NOTIFICATION,
  UNSCHEDULE_ALL_NOTIFICATION,
  //   UNSCHEDULE_NOTIFICATION,
} from '../../actions/notifications/scheduled-notifications';
import type {Action} from '../../actions/notifications/scheduled-notifications';
import {ScheduledNotification} from '../../../types';

export type State = ScheduledNotification;

const initialState: State = {
  'finish-course': [],
};

/* scheduledNotifications: {
    finish-course: [
        {
            id: string
            createdAt: string
        }
    ]
} */

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case SCHEDULE_NOTIFICATION: {
      const {type, id, createdAt} = action.payload;
      return {
        ...state,
        [type]: [
          ...state[type],
          {
            id,
            createdAt,
          },
        ],
      };
    }
    case UNSCHEDULE_ALL_NOTIFICATION: {
      const {type} = action.payload;
      return {
        ...state,
        [type]: [],
      };
    }
    // case UNSCHEDULE_NOTIFICATION: {
    //   const {type, id, createdAt} = action.payload;
    // }
    default:
      return state;
  }
};

export default reducer;
