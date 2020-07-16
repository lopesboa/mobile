/* eslint-disable import/max-dependencies*/

import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import {middlewares, reducers as storeReducers} from '@coorpacademy/player-store';
import AsyncStorage from '@react-native-community/async-storage';
import {reducer as network} from 'react-native-offline';
import type {ReduxState} from '../types/coorpacademy/player-store';
import type {NetworkState} from '../types';

import type {State as NavigationState} from './reducers/navigation';
import navigation from './reducers/navigation';
import type {State as CatalogState} from './reducers/catalog';
import resetOnLogout from './utils/reset-on-logout';
import type {State as PermissionsState} from './reducers/permissions';
import type {State as NotificationsState} from './reducers/notifications';
import type {State as AuthenticationState} from './reducers/authentication';
import type {State as VideoState} from './reducers/video';
import type {State as GodModeState} from './reducers/god-mode';
import type {State as AppSessionState} from './reducers/app-session';
import type {State as FastSlideState} from './reducers/fast-slide';
import type {State as ErrorsState} from './reducers/ui/errors';
import type {State as SelectState} from './reducers/ui/select';
import type {State as AnswersState} from './reducers/ui/answers';
import type {State as SearchState} from './reducers/ui/search';
import type {State as ProgressionsState} from './reducers/progressions/synchronize';
import catalog from './reducers/catalog';
import authentication from './reducers/authentication';
import permissions from './reducers/permissions';
import notifications from './reducers/notifications';
import progressions from './reducers/progressions/synchronize';
import video from './reducers/video';
import godMode from './reducers/god-mode';
import appSession from './reducers/app-session';
import fastSlide from './reducers/fast-slide';
import errors from './reducers/ui/errors';
import select from './reducers/ui/select';
import isValidating from './reducers/ui/answers';
import search from './reducers/ui/search';
import ResetDisplayedProgression from './middlewares/reset-displayed-progression';
import ProgressionsSynchronization from './middlewares/progressions-synchronization';
import UpdateCardOnProgressionUpdate from './middlewares/update-card-on-progression-update';
import ScheduleNotificationOnCourseLeave from './middlewares/schedule-notification';
import ErrorHandler from './middlewares/error-handler';
import type {Options, ReduxDevTools} from './_types';

export type UiState = Pick<ReduxState, 'ui'>;
export type DataState = Pick<ReduxState, 'data'>;
export type StoreState = ReduxState & {
  navigation: NavigationState;
  catalog: CatalogState;
  authentication: AuthenticationState;
  permissions: PermissionsState;
  progressions: ProgressionsState;
  video: VideoState;
  errors: ErrorsState<void>;
  select: SelectState;
  isValidating: AnswersState;
  search: SearchState;
  godMode: GodModeState;
  fastSlide: FastSlideState;
  appSession: AppSessionState;
  notifications: NotificationsState;
  network: NetworkState;
};

const {ErrorLogger, ReduxThunkMemoized} = middlewares;
const {data, ui} = storeReducers;

const reducers = combineReducers({
  data: resetOnLogout(data),
  ui: resetOnLogout(ui),
  errors,
  select,
  isValidating,
  search,
  navigation,
  catalog: resetOnLogout(catalog),
  authentication: resetOnLogout(authentication),
  permissions,
  progressions,
  video,
  godMode,
  fastSlide,
  appSession,
  notifications,
  network,
});

const createMiddlewares = (options: Options, reduxDevTools?: ReduxDevTools) => {
  return compose(
    // @ts-ignore error applying middlewares with multiple types
    applyMiddleware(
      ReduxThunkMemoized(options),
      ErrorLogger(options),
      ResetDisplayedProgression(options),
      ProgressionsSynchronization(options),
      UpdateCardOnProgressionUpdate(options),
      ScheduleNotificationOnCourseLeave(options),
      ErrorHandler(),
    ),
    // @ts-ignore
    reduxDevTools || ((f) => f),
  );
};

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whiteList: ['appSession', 'permissions', 'notifications'],
};

const persistedReducer = persistReducer(persistConfig, reducers);
const create = (options: Options, reduxDevTools?: ReduxDevTools) => {
  // @ts-ignore
  const store = createStore(persistedReducer, {}, createMiddlewares(options, reduxDevTools));
  const persistor = persistStore(store);
  return {store, persistor};
};

export default create;
