import type {Middleware, MiddlewareAPI, Dispatch} from 'redux';

import {scheduleNotifications} from '../actions/notifications/scheduled-notifications';
import type {Options} from '../_types';
import type {StoreState} from '../store';
import {NAVIGATION_SCREEN_CHANGE} from '../actions/navigation';
import type {Action as NavigationAction} from '../actions/navigation';
import {NOTIFICATION_TYPE} from '../../const';

type Action = NavigationAction | SelectAction;
type State = StoreState;

const createMiddleware = ({services}: Options): Middleware<State, Action, Dispatch<Action>> => ({
  dispatch,
  getState,
}: MiddlewareAPI<State, Action, Dispatch<Action>>) => (
  next: Dispatch<Action>,
): Dispatch<Action> => (action: Action) => {
  const oldScreenName = getState().navigation.currentScreenName;
  if (
    action.type === NAVIGATION_SCREEN_CHANGE &&
    oldScreenName === 'Slide' &&
    action.payload.currentScreenName === 'Home'
  ) {
    dispatch(scheduleNotifications(NOTIFICATION_TYPE.FINISH_COURSE));
  }

  return next(action);
};

export default createMiddleware;
