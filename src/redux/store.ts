/* eslint-disable import/max-dependencies*/

import {combineReducers} from 'redux';
import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer, createMigrate} from 'redux-persist';
import {middlewares, reducers as storeReducers} from '@coorpacademy/player-store';
import AsyncStorage from '@react-native-community/async-storage';
import {reducer as network} from 'react-native-offline';
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1';
import type {ReduxState} from '../types/coorpacademy/player-store';
import type {NetworkState} from '../types';
import createMigration from './migrate';

import type {State as NavigationState} from './navigation';
import navigation from './navigation';
import type {State as CatalogState} from './reducers/catalog';
import resetOnLogout from './utils/reset-on-logout';
import type {State as PermissionsState} from './reducers/permissions';
import type {State as NotificationsState} from './notifications';
import type {State as AuthenticationState} from './reducers/authentication';
import type {State as VideoState} from './video';
import type {State as GodModeState} from './god-mode';
import type {State as AppSessionState} from './app-session';
import type {State as FastSlideState} from './fast-slide';
import type {State as ErrorsState} from './reducers/ui/errors';
import type {State as SelectState} from './reducers/ui/select';
import type {State as AnswersState} from './reducers/ui/answers';
import type {State as SearchState} from './reducers/ui/search';
import type {State as ProgressionsState} from './reducers/progressions/synchronize';
import catalog from './reducers/catalog';
import authentication from './reducers/authentication';
import permissions from './reducers/permissions';
import notifications from './notifications';
import progressions from './reducers/progressions/synchronize';
import video from './video';
import godMode from './god-mode';
import appSession from './app-session';
import fastSlide from './fast-slide';
import errors from './reducers/ui/errors';
import select from './reducers/ui/select';
import isValidating from './reducers/ui/answers';
import search from './reducers/ui/search';
import ResetDisplayedProgression from './middlewares/reset-displayed-progression';
import ProgressionsSynchronization from './middlewares/progressions-synchronization';
import UpdateCardOnProgressionUpdate from './middlewares/update-card-on-progression-update';
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
  isValidating: resetOnLogout(isValidating),
  search,
  navigation,
  catalog: resetOnLogout(catalog),
  authentication: resetOnLogout(authentication),
  permissions,
  progressions,
  video,
  godMode: resetOnLogout(godMode),
  fastSlide: resetOnLogout(fastSlide),
  appSession,
  notifications,
  network,
});

const createMiddlewares = (options: Options, reduxDevTools?: ReduxDevTools) => {
  return [
    ReduxThunkMemoized(options),
    ErrorLogger(options),
    ResetDisplayedProgression(options),
    ProgressionsSynchronization(options),
    UpdateCardOnProgressionUpdate(options),
    ErrorHandler(),
  ];
};

const reduxPersistedStoreMigration = createMigration<StoreState>();
const persistConfig = {
  version: 2,
  key: 'root',
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel1,
  whitelist: ['appSession', 'permissions', 'notifications'],
  migrate: createMigrate(reduxPersistedStoreMigration),
};

const persistedReducer = persistReducer(persistConfig, reducers);
const create = (options: Options, reduxDevTools?: ReduxDevTools) => {
  // @ts-ignore
  const store = configureStore({
    reducer: persistedReducer,
    middleware: [...createMiddlewares(options)],
    devTools: true,
  });
  const persistor = persistStore(store);
  return {store, persistor};
};

export default create;
