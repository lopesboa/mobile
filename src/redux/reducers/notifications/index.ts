import {combineReducers} from 'redux';
import type {Reducer} from 'redux';
import type {Action as FinishCourseNotificationAction} from '../../actions/notifications/finish-course';
import finishCourseNotificationReducer from './finish-course';
import type {State as FinishCourseNotificationState} from './finish-course';
import scheduledNotificationReducer from './scheduled-notifications';
import type {State as ScheduledNotificationState} from './scheduled-notifications';

export type State = {
  finishCourse: FinishCourseNotificationState;
  scheduledNotifications: ScheduledNotificationState;
};

const reducers: Reducer<State, FinishCourseNotificationAction> = combineReducers({
  finishCourse: finishCourseNotificationReducer,
  scheduledNotifications: scheduledNotificationReducer,
});
export default reducers;
