import {combineReducers} from 'redux';
import type {Reducer} from 'redux';
import type {Action as FinishCourseNotificationAction} from '../../actions/notifications/finish-course';
import finishCourseNotificationReducer from './finish-course';
import type {State as FinishCourseNotificationState} from './finish-course';

export type State = {
  finishCourse: FinishCourseNotificationState;
};

const reducers: Reducer<State, FinishCourseNotificationAction> = combineReducers({
  finishCourse: finishCourseNotificationReducer,
});
export default reducers;
